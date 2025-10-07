import { Log, ILog } from '@/lib/models/Log';
import connectToDatabase from '@/lib/mongodb';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogCategory = 'auth' | 'api' | 'database' | 'security' | 'user' | 'system' | 'performance' | 'business';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  metadata?: Record<string, any>;
  stack?: string;
  tags?: string[];
  context?: LogContext;
}

export interface LogOptions {
  category: LogCategory;
  service?: string;
  environment?: string;
  version?: string;
  context?: LogContext;
  requestId?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private service: string;
  private environment: string;
  private version: string;
  private isDevelopment: boolean;

  constructor() {
    this.service = process.env.SERVICE_NAME || 'nextjs-app';
    this.environment = process.env.NODE_ENV || 'development';
    this.version = process.env.APP_VERSION || '1.0.0';
    this.isDevelopment = this.environment === 'development';
  }

  private getSeverity(level: LogLevel): number {
    const severityMap = {
      debug: 1,
      info: 2,
      warn: 3,
      error: 4,
      fatal: 5
    };
    return severityMap[level];
  }

  private async saveToDatabase(logData: Partial<ILog>): Promise<void> {
    try {
      await connectToDatabase();
      const log = new Log(logData);
      await log.save();
    } catch (error) {
      // Fallback to console if database fails
      console.error('Failed to save log to database:', error);
      console.log('Log data:', logData);
    }
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${JSON.stringify(context)}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  private async log(level: LogLevel, message: string, options: LogOptions): Promise<void> {
    const severity = this.getSeverity(level);
    const logData: Partial<ILog> = {
      level,
      message,
      category: options.category,
      service: options.service || this.service,
      environment: options.environment || this.environment,
      version: options.version || this.version,
      severity,
      timestamp: new Date(),
      ...options.context
    };

    // Always log to console in development
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(level, message, options.context);
      switch (level) {
        case 'debug':
          console.debug(formattedMessage);
          break;
        case 'info':
          console.info(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'error':
        case 'fatal':
          console.error(formattedMessage);
          break;
      }
    }

    // Save to database (async, don't wait)
    this.saveToDatabase(logData).catch(() => {
      // Silent fail for database errors
    });
  }

  // Public logging methods
  async debug(message: string, options: LogOptions): Promise<void> {
    return this.log('debug', message, options);
  }

  async info(message: string, options: LogOptions): Promise<void> {
    return this.log('info', message, options);
  }

  async warn(message: string, options: LogOptions): Promise<void> {
    return this.log('warn', message, options);
  }

  async error(message: string, options: LogOptions): Promise<void> {
    return this.log('error', message, options);
  }

  async fatal(message: string, options: LogOptions): Promise<void> {
    return this.log('fatal', message, options);
  }

  // Convenience methods for common scenarios
  async authLog(message: string, context?: LogContext): Promise<void> {
    return this.info(message, { category: 'auth', context });
  }

  async apiLog(message: string, context?: LogContext): Promise<void> {
    return this.info(message, { category: 'api', context });
  }

  async securityLog(message: string, context?: LogContext): Promise<void> {
    return this.warn(message, { category: 'security', context });
  }

  async userLog(message: string, context?: LogContext): Promise<void> {
    return this.info(message, { category: 'user', context });
  }

  async systemLog(message: string, context?: LogContext): Promise<void> {
    return this.info(message, { category: 'system', context });
  }

  async performanceLog(message: string, context?: LogContext): Promise<void> {
    return this.info(message, { category: 'performance', context });
  }

  async businessLog(message: string, context?: LogContext): Promise<void> {
    return this.info(message, { category: 'business', context });
  }

  // Error logging with stack trace
  async logError(error: Error, message: string, options: LogOptions): Promise<void> {
    const context: LogContext = {
      ...options.context,
      stack: error.stack,
      metadata: {
        ...options.context?.metadata,
        errorName: error.name,
        errorMessage: error.message
      }
    };

    return this.error(message, { ...options, context });
  }

  // Request logging
  async logRequest(method: string, url: string, statusCode: number, responseTime: number, context?: LogContext): Promise<void> {
    const level = statusCode >= 400 ? 'warn' : 'info';
    const requestContext: LogContext = {
      ...context,
      method,
      url,
      statusCode,
      responseTime
    };

    return this.log(level, `${method} ${url} - ${statusCode} (${responseTime}ms)`, {
      category: 'api',
      context: requestContext
    });
  }

  // Database operation logging
  async logDatabase(operation: string, collection: string, duration?: number, context?: LogContext): Promise<void> {
    const dbContext: LogContext = {
      ...context,
      metadata: {
        ...context?.metadata,
        operation,
        collection,
        duration
      }
    };

    return this.info(`Database ${operation} on ${collection}`, {
      category: 'database',
      context: dbContext
    });
  }

  // Security event logging
  async logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext): Promise<void> {
    const level = severity === 'critical' ? 'fatal' : severity === 'high' ? 'error' : 'warn';
    const securityContext: LogContext = {
      ...context,
      metadata: {
        ...context?.metadata,
        securityEvent: event,
        severity
      }
    };

    return this.log(level, `Security event: ${event}`, {
      category: 'security',
      context: securityContext
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, options: LogOptions) => logger.debug(message, options);
export const logInfo = (message: string, options: LogOptions) => logger.info(message, options);
export const logWarn = (message: string, options: LogOptions) => logger.warn(message, options);
export const logError = (message: string, options: LogOptions) => logger.error(message, options);
export const logFatal = (message: string, options: LogOptions) => logger.fatal(message, options);

export const logAuth = (message: string, context?: LogContext) => logger.authLog(message, context);
export const logApi = (message: string, context?: LogContext) => logger.apiLog(message, context);
export const logSecurity = (message: string, context?: LogContext) => logger.securityLog(message, context);
export const logUser = (message: string, context?: LogContext) => logger.userLog(message, context);
export const logSystem = (message: string, context?: LogContext) => logger.systemLog(message, context);
export const logPerformance = (message: string, context?: LogContext) => logger.performanceLog(message, context);
export const logBusiness = (message: string, context?: LogContext) => logger.businessLog(message, context);
