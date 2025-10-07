import { Log } from '@/lib/models/Log';
import connectToDatabase from '@/lib/mongodb';
import { logger } from '@/lib/logger';

export interface LogCleanupOptions {
  olderThanDays?: number;
  keepErrorLogs?: boolean;
  keepSecurityLogs?: boolean;
  dryRun?: boolean;
  batchSize?: number;
}

export class LogCleanupService {
  private defaultOptions: LogCleanupOptions = {
    olderThanDays: 30,
    keepErrorLogs: true,
    keepSecurityLogs: true,
    dryRun: false,
    batchSize: 1000
  };

  async cleanupLogs(options: LogCleanupOptions = {}): Promise<{
    deletedCount: number;
    keptCount: number;
    errors: number;
  }> {
    const opts = { ...this.defaultOptions, ...options };
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - opts.olderThanDays!);

    await connectToDatabase();

    let deletedCount = 0;
    let keptCount = 0;
    let errors = 0;

    try {
      await logger.systemLog('Starting log cleanup process', {
        context: {
          metadata: {
            cutoffDate: cutoffDate.toISOString(),
            options: opts
          }
        }
      });

      // Build deletion query
      const deleteQuery: any = {
        timestamp: { $lt: cutoffDate }
      };

      // Exclude error logs if keepErrorLogs is true
      if (opts.keepErrorLogs) {
        deleteQuery.level = { $nin: ['error', 'fatal'] };
      }

      // Exclude security logs if keepSecurityLogs is true
      if (opts.keepSecurityLogs) {
        deleteQuery.category = { $ne: 'security' };
      }

      if (opts.dryRun) {
        // Count what would be deleted
        const count = await Log.countDocuments(deleteQuery);
        await logger.systemLog(`Dry run: Would delete ${count} logs`, {
          context: {
            metadata: { deleteQuery }
          }
        });
        return { deletedCount: count, keptCount: 0, errors: 0 };
      }

      // Delete in batches to avoid memory issues
      let hasMore = true;
      while (hasMore) {
        const logsToDelete = await Log.find(deleteQuery)
          .limit(opts.batchSize!)
          .select('_id');

        if (logsToDelete.length === 0) {
          hasMore = false;
          break;
        }

        const idsToDelete = logsToDelete.map(log => log._id);
        const result = await Log.deleteMany({ _id: { $in: idsToDelete } });
        
        deletedCount += result.deletedCount;
        keptCount += logsToDelete.length - result.deletedCount;

        await logger.debug(`Deleted batch of ${result.deletedCount} logs`, {
          category: 'system',
          context: {
            metadata: {
              batchSize: logsToDelete.length,
              deletedInBatch: result.deletedCount
            }
          }
        });
      }

      await logger.systemLog('Log cleanup completed', {
        context: {
          metadata: {
            totalDeleted: deletedCount,
            totalKept: keptCount,
            errors: errors
          }
        }
      });

    } catch (error) {
      errors++;
      await logger.logError(error as Error, 'Log cleanup failed', {
        category: 'system',
        context: {
          metadata: {
            deletedCount,
            keptCount,
            options: opts
          }
        }
      });
    }

    return { deletedCount, keptCount, errors };
  }

  async getLogStats(): Promise<{
    totalLogs: number;
    logsByLevel: Array<{ level: string; count: number }>;
    logsByCategory: Array<{ category: string; count: number }>;
    oldestLog: Date | null;
    newestLog: Date | null;
    sizeEstimate: string;
  }> {
    await connectToDatabase();

    const [
      totalLogs,
      logsByLevel,
      logsByCategory,
      oldestLog,
      newestLog
    ] = await Promise.all([
      Log.countDocuments(),
      Log.aggregate([
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Log.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Log.findOne().sort({ timestamp: 1 }).select('timestamp'),
      Log.findOne().sort({ timestamp: -1 }).select('timestamp')
    ]);

    // Estimate collection size (rough calculation)
    const avgLogSize = 500; // bytes per log entry
    const sizeEstimate = `${Math.round((totalLogs * avgLogSize) / 1024 / 1024)} MB`;

    return {
      totalLogs,
      logsByLevel: logsByLevel.map(item => ({ level: item._id, count: item.count })),
      logsByCategory: logsByCategory.map(item => ({ category: item._id, count: item.count })),
      oldestLog: oldestLog?.timestamp || null,
      newestLog: newestLog?.timestamp || null,
      sizeEstimate
    };
  }

  async archiveOldLogs(olderThanDays: number = 90): Promise<{
    archivedCount: number;
    errors: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    await connectToDatabase();

    let archivedCount = 0;
    let errors = 0;

    try {
      await logger.systemLog('Starting log archiving process', {
        context: {
          metadata: {
            cutoffDate: cutoffDate.toISOString(),
            olderThanDays
          }
        }
      });

      // For now, we'll just delete very old logs
      // In a production system, you might want to move them to a separate collection
      // or export them to a file before deletion
      const result = await Log.deleteMany({
        timestamp: { $lt: cutoffDate },
        level: { $nin: ['error', 'fatal'] }, // Keep error logs
        category: { $ne: 'security' } // Keep security logs
      });

      archivedCount = result.deletedCount;

      await logger.systemLog('Log archiving completed', {
        context: {
          metadata: {
            archivedCount,
            cutoffDate: cutoffDate.toISOString()
          }
        }
      });

    } catch (error) {
      errors++;
      await logger.logError(error as Error, 'Log archiving failed', {
        category: 'system',
        context: {
          metadata: {
            archivedCount,
            olderThanDays
          }
        }
      });
    }

    return { archivedCount, errors };
  }
}

// Export singleton instance
export const logCleanupService = new LogCleanupService();

// CLI script for manual cleanup
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: LogCleanupOptions = {
    dryRun: args.includes('--dry-run'),
    olderThanDays: parseInt(args.find(arg => arg.startsWith('--days='))?.split('=')[1] || '30'),
    keepErrorLogs: !args.includes('--delete-errors'),
    keepSecurityLogs: !args.includes('--delete-security')
  };

  logCleanupService.cleanupLogs(options)
    .then(result => {
      console.log('Cleanup completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Cleanup failed:', error);
      process.exit(1);
    });
}
