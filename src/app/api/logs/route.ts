import { NextRequest, NextResponse } from 'next/server';
import { Log } from '@/lib/models/Log';
import connectToDatabase from '@/lib/mongodb';
import { withApiLogging } from '@/lib/middleware/logging';
import { addSecurityHeaders } from '@/lib/security-middleware';

export interface LogQueryParams {
  level?: string;
  category?: string;
  service?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
  search?: string;
  severity?: number;
  environment?: string;
}

async function getLogs(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const severityParam = searchParams.get('severity');
    
    const params: LogQueryParams = {
      level: searchParams.get('level') || undefined,
      category: searchParams.get('category') || undefined,
      service: searchParams.get('service') || undefined,
      userId: searchParams.get('userId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: limitParam ? parseInt(limitParam) : 50,
      offset: offsetParam ? parseInt(offsetParam) : 0,
      search: searchParams.get('search') || undefined,
      severity: severityParam ? parseInt(severityParam) : undefined,
      environment: searchParams.get('environment') || undefined
    };

    // Build query
    const query: any = {};

    if (params.level) {
      query.level = params.level;
    }

    if (params.category) {
      query.category = params.category;
    }

    if (params.service) {
      query.service = params.service;
    }

    if (params.userId) {
      query.userId = params.userId;
    }

    if (params.severity) {
      query.severity = params.severity;
    }

    if (params.environment) {
      query.environment = params.environment;
    }

    if (params.startDate || params.endDate) {
      query.timestamp = {};
      if (params.startDate) {
        query.timestamp.$gte = new Date(params.startDate);
      }
      if (params.endDate) {
        query.timestamp.$lte = new Date(params.endDate);
      }
    }

    if (params.search) {
      query.$or = [
        { message: { $regex: params.search, $options: 'i' } },
        { tags: { $in: [new RegExp(params.search, 'i')] } }
      ];
    }

    // Execute query
    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .limit(params.limit || 50)
      .skip(params.offset || 0)
      .lean();

    // Get total count for pagination
    const totalCount = await Log.countDocuments(query);

    const response = NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          total: totalCount,
          limit: params.limit || 50,
          offset: params.offset || 0,
          hasMore: (params.offset || 0) + (params.limit || 50) < totalCount
        },
        filters: params
      }
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching logs:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'خطا در دریافت لاگ‌ها'
      },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

async function getLogStats(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
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

    // Get statistics
    const [
      totalLogs,
      logsByLevel,
      logsByCategory,
      logsByService,
      errorLogs,
      recentLogs
    ] = await Promise.all([
      Log.countDocuments(baseQuery),
      Log.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Log.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Log.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$service', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Log.countDocuments({ ...baseQuery, level: { $in: ['error', 'fatal'] } }),
      Log.find(baseQuery)
        .sort({ timestamp: -1 })
        .limit(10)
        .select('level message category timestamp')
        .lean()
    ]);

    const response = NextResponse.json({
      success: true,
      data: {
        totalLogs,
        errorLogs,
        logsByLevel,
        logsByCategory,
        logsByService,
        recentLogs,
        period: {
          startDate,
          endDate,
          environment
        }
      }
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error fetching log stats:', error);
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

async function deleteLogs(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const olderThan = searchParams.get('olderThan');
    const level = searchParams.get('level');
    const category = searchParams.get('category');

    if (!olderThan) {
      const response = NextResponse.json(
        {
          success: false,
          message: 'پارامتر olderThan الزامی است'
        },
        { status: 400 }
      );
      return addSecurityHeaders(response);
    }

    // Build deletion query
    const deleteQuery: any = {
      timestamp: { $lt: new Date(olderThan) }
    };

    if (level) {
      deleteQuery.level = level;
    }

    if (category) {
      deleteQuery.category = category;
    }

    const result = await Log.deleteMany(deleteQuery);

    const response = NextResponse.json({
      success: true,
      message: `${result.deletedCount} لاگ حذف شد`,
      data: {
        deletedCount: result.deletedCount
      }
    });

    return addSecurityHeaders(response);

  } catch (error) {
    console.error('Error deleting logs:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'خطا در حذف لاگ‌ها'
      },
      { status: 500 }
    );
    return addSecurityHeaders(response);
  }
}

// Export handlers with logging middleware
export const GET = withApiLogging(getLogs);
export const DELETE = withApiLogging(deleteLogs);

// Stats endpoint
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'stats') {
    return withApiLogging(getLogStats)(request);
  }

  const response = NextResponse.json(
    {
      success: false,
      message: 'عملیات نامعتبر'
    },
    { status: 400 }
  );
  return addSecurityHeaders(response);
}
