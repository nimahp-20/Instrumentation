import mongoose, { Schema, Document } from 'mongoose';

// Category Interface
export interface ICategory extends Document {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  image: string;
  icon?: string;
  parentCategory?: mongoose.Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Interface
export interface IProduct extends Document {
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  category: mongoose.Types.ObjectId;
  subcategory?: mongoose.Types.ObjectId;
  brand?: string;
  sku: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  stock: number;
  minStock: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  specifications: {
    [key: string]: string;
  };
  features: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isNewProduct: boolean;
  isOnSale: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Category Schema
const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameEn: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  icon: {
    type: String
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  productCount: {
    type: Number,
    default: 0
  },
  seoTitle: {
    type: String
  },
  seoDescription: {
    type: String
  }
}, {
  timestamps: true
});

// Product Schema
const productSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameEn: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  descriptionEn: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  shortDescriptionEn: {
    type: String,
    required: true,
    maxlength: 200
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100
  },
  images: [{
    type: String,
    required: true
  }],
  thumbnail: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  minStock: {
    type: Number,
    default: 5,
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  specifications: {
    type: Map,
    of: String
  },
  features: [{
    type: String
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewProduct: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  seoTitle: {
    type: String
  },
  seoDescription: {
    type: String
  },
  metaKeywords: [{
    type: String,
    lowercase: true,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better performance
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1, sortOrder: 1 });
categorySchema.index({ parentCategory: 1 });

productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ tags: 1 });

// Virtual for discount calculation
productSchema.virtual('calculatedDiscount').get(function(this: IProduct) {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return this.discount || 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function(this: IProduct) {
  if (this.stock === 0) return 'out-of-stock';
  if (this.stock <= this.minStock) return 'low-stock';
  return 'in-stock';
});

// Pre-save middleware to update product count in category
productSchema.pre('save', async function(this: IProduct, next: any) {
  if (this.isNew || this.isModified('category')) {
    const Category = mongoose.model('Category');
    await Category.findByIdAndUpdate(this.category, {
      $inc: { productCount: 1 }
    });
  }
  next();
});

// Pre-delete middleware to update product count in category
productSchema.pre('deleteOne', async function(this: IProduct, next: any) {
  const Category = mongoose.model('Category');
  await Category.findByIdAndUpdate(this.category, {
    $inc: { productCount: -1 }
  });
  next();
});

// Create models
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);
export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);