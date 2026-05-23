import mongoose, { Schema, Document } from 'mongoose';

export interface INewsletterUser extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  subscribedAt: Date;
  isActive: boolean;
  source?: string;
  ip?: string;
  userAgent?: string;
  unsubscribedAt?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NewsletterUserSchema = new Schema<INewsletterUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: { type: String, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },
    subscribedAt: { type: Date, default: Date.now, index: true },
    isActive: { type: Boolean, default: true, index: true },
    source: { type: String, trim: true, maxlength: 100 },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    unsubscribedAt: { type: Date },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export const NewsletterUser =
  mongoose.models.NewsletterUser ||
  mongoose.model<INewsletterUser>('NewsletterUser', NewsletterUserSchema);
