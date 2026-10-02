import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Jackets', 'Shirts', 'Tees', 'Tailoring', 'Jeans', 'Footwear', 'Knitwear', 'Accessories', 'Outerwear', 'Formals'],
      default: 'Shirts',
    },
    color: {
      type: String,
      default: 'Nocturne Black',
      trim: true,
    },
    colorVariants: [
      {
        name: { type: String },
        hex: { type: String, default: '#111111' },
      },
    ],
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    badgeColor: {
      type: String,
      default: 'var(--primary)',
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Product must have at least one image',
      },
    },
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, default: 10 },
        isSoldOut: { type: Boolean, default: false },
      },
    ],
    isWinterDrop: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stockStatus: {
      type: String,
      default: 'In Stock',
    },
    fabricDetails: {
      type: String,
      default: '100% Japanese High-Density Organic Cotton Poplin (180 GSM). Double-stitched seams with matte black hardware.',
    },
    careInstructions: {
      type: String,
      default: 'Dry clean only or delicate machine wash at 30°C inside-out. Do not tumble dry. Cool iron on reverse.',
    },
    description: {
      type: String,
      default: 'Minimalist silhouette engineered for modern architectural movement. Precision tailored with structured proportions and refined minimalist details.',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug before saving if not supplied
productSchema.pre('save', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
