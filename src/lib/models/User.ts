import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  emailVerified: boolean;
  tokenVersion: number;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  toJSON(): Partial<IUser>;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'ایمیل الزامی است'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'لطفاً یک ایمیل معتبر وارد کنید']
  },
  password: {
    type: String,
    required: [true, 'رمز عبور الزامی است'],
    minlength: [6, 'رمز عبور باید حداقل ۶ کاراکتر باشد']
  },
  firstName: {
    type: String,
    required: [true, 'نام الزامی است'],
    trim: true,
    maxlength: [50, 'نام نمی‌تواند بیش از ۵۰ کاراکتر باشد']
  },
  lastName: {
    type: String,
    required: [true, 'نام خانوادگی الزامی است'],
    trim: true,
    maxlength: [50, 'نام خانوادگی نمی‌تواند بیش از ۵۰ کاراکتر باشد']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^(\+98|0)?9\d{9}$/, 'لطفاً شماره موبایل معتبر وارد کنید']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  tokenVersion: {
    type: Number,
    default: 1
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      delete ret.password;
      delete ret.tokenVersion;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('خطا در مقایسه رمز عبور');
  }
};

// Method to increment token version (for logout all devices)
UserSchema.methods.incrementTokenVersion = function() {
  this.tokenVersion += 1;
  return this.save();
};

// Static method to find user by email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
UserSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true });
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
