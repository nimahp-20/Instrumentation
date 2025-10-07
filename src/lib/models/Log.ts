import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  category: 'auth' | 'api' | 'database' | 'security' | 'user' | 'system' | 'performance' | 'business';
  service: string;
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
  severity: number;
  environment: string;
  version: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LogSchema: Schema = new Schema({
  level: {
    type: String,
    required: true,
    enum: ['debug', 'info', 'warn', 'error', 'fatal'],
    index: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true,
    enum: ['auth', 'api', 'database', 'security', 'user', 'system', 'performance', 'business'],
    index: true
  },
  service: {
    type: String,
    required: true,
    default: 'nextjs-app'
  },
  userId: {
    type: String,
    index: true,
    sparse: true
  },
  sessionId: {
    type: String,
    index: true,
    sparse: true
  },
  requestId: {
    type: String,
    index: true,
    sparse: true
  },
  ip: {
    type: String,
    index: true
  },
  userAgent: {
    type: String,
    maxlength: 500
  },
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
  },
  url: {
    type: String,
    maxlength: 1000
  },
  statusCode: {
    type: Number,
    min: 100,
    max: 599
  },
  responseTime: {
    type: Number,
    min: 0
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  stack: {
    type: String,
    maxlength: 5000
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  severity: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  environment: {
    type: String,
    required: true,
    default: 'development',
    index: true
  },
  version: {
    type: String,
    required: true,
    default: '1.0.0'
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.__v;
      return ret;
    }
  }
});

// Compound indexes for better query performance
LogSchema.index({ level: 1, category: 1, timestamp: -1 });
LogSchema.index({ userId: 1, timestamp: -1 });
LogSchema.index({ service: 1, timestamp: -1 });
LogSchema.index({ severity: 1, timestamp: -1 });
LogSchema.index({ environment: 1, timestamp: -1 });

// TTL index for automatic log cleanup (30 days)
LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const Log = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);
