import { NextRequest, NextResponse } from 'next/server';
import { Log } from '@/lib/models/Log';
import connectToDatabase from '@/lib/mongodb';
import { withApiLogging } from '@/lib/middleware/logging';
import { addSecurityHeaders } from '@/lib/security-middleware';

async function getLogAnalytics(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const groupBy = searchParams.get('groupBy') || 'hour'; // hour, day, week, month
    const environment = searchParams.get('environment');

    // Build base query
    const baseQuery: any = {};
    if (startDate || endDate) {
      baseQuery.timestamp = {};
      if (startDate) baseQuery.timestamp.$gte = new Date(startDate);
      if (endDate) baseQuery.timestamp.$lte = new Date(endDate);
    }
    if (environment) {
      baseQuery.environment = environment;
    }

    // Define time grouping
    let timeGroupFormat: any;
    switch (groupBy) {
      case 'hour':
        timeGroupFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: { $hour: '$timestamp' }
        };
        break;
      case 'day':
        timeGroupFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' }
        };
        break;
      case 'week':
        timeGroupFormat = {
          year: { $year: '$timestamp' },
          week: { $week: '$timestamp' }
        };
        break;
      case 'month':
        timeGroupFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' }
        };
        break;
      default:
        timeGroupFormat = {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: { $hour: '$timestamp' }
        };
    }

    // Get time series data
    const timeSeriesData = await Log.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: timeGroupFormat,
          count: { $sum: 1 },
          errorCount: {
            $sum: {
              $cond: [{ $in: ['$level', ['error', 'fatal']] }, 1, 0]
            }
          },
          avgResponseTime: {
            $avg: {
              $cond: [
                { $ne: ['$responseTime', null] },
                '$responseTime',
                null
              ]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
    ]);

    // Get top errors
    const topErrors = await Log.aggregate([
      { $match: { ...baseQuery, level: { $in: ['error', 'fatal'] } } },
      {
        $group: {
          _id: '$message',
          count: { $sum: 1 },
          lastOccurrence: { $max: '$timestamp' },
          category: { $first: '$category' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get user activity
    const userActivity = await Log.aggregate([
      { $match: { ...baseQuery, userId: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$userId',
          activityCount: { $sum: 1 },
          lastActivity: { $max: '$timestamp' },
          categories: { $addToSet: '$category' }
        }
      },
      { $sort: { activityCount: -1 } },
      { $limit: 20 }
    ]);

    // Get API performance metrics
    const apiMetrics = await Log.aggregate([
      { $match: { ...baseQuery, category: 'api', responseTime: { $exists: true } } },
      {
        $group: {
          _id: '$url',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' },
          maxResponseTime: { $max: '$responseTime' },
          minResponseTime: { $min: '$responseTime' },
          errorCount: {
            $sum: {
              $cond: [{ $gte: ['$statusCode', 400] }, 1, 0]
            }
          }
        }
      },
      { $sort: { avgResponseTime: -1 } },
      { $limit: 15 }
    ]);

    // Get security events
    const securityEvents = await Log.aggregate([
      { $match: { ...baseQuery, category: 'security' } },
      {
        $group: {
          _id: '$message',
          count: { $sum: 1 },
          severity: { $first: '$severity' },
          lastOccurrence: { $max: '$timestamp' },
          uniqueIPs: { $addToSet: '$ip' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get overall statistics
    const overallStats = await Log.aggregate([
      { $match: baseQuery },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          errorLogs: {
            $sum: {
              $cond: [{ $in: ['$level', ['error', 'fatal']] }, 1, 0]
            }
          },
          warningLogs: {
            $sum: {
              $cond: [{ $eq: ['$level', 'warn'] }, 1, 0]
            }
          },
          avgSeverity: { $avg: '$severity' },
          uniqueUsers: { $addToSet: '$userId' },
          uniqueIPs: { $addToSet: '$ip' }
        }
      }
    ]);

    const stats = overallStats[0] || {
      totalLogs: 0,
      errorLogs: 0,
      warningLogs: 0,
      avgSeverity: 0,
      uniqueUsers: [],
      uniqueIPs: []
    };

    const response = NextResponse.json({
      success: true,
      data: {
        timeSeries: timeSeriesData,
        topErrors,
        userActivity: userActivity.map(user => ({
          ...user,
          uniqueUsers: user.uniqueUsers?.length || 0,
          uniqueIPs: user.uniqueIPs?.length || 0
        })),
        apiMetrics,
        securityEvents: securityEvents.map(event => ({
          ...event,
          uniqueIPCount: event.uniqueIPs?.length || 0
        })),
        overallStats: {
          ...stats,
          uniqueUserCount: stats.uniqueUsers?.length || 0,
          uniqueIPCount: stats.uniqueIPs?.length || 0,
          errorRate: stats.totalLogs > 0 ? (stats.errorLogs / stats.totalLogs) * 100 : 0
        },
        period: {
          startDate,
          endDate,
          groupBy,
          environment
        }
      }
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching log analytics:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'خطا در دریافت آمار لاگ‌ها'
      },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

export const GET = withApiLogging(getLogAnalytics);
