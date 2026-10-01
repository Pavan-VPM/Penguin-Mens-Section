import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, default: 'Mumbai' },
      postalCode: { type: String, default: '400001' },
      country: { type: String, default: 'India' },
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: { type: String, required: true },
        color: { type: String, default: 'Nocturne Black' },
        size: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
        image: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'cod'],
      default: 'upi',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    courier: {
      type: String,
      default: 'DHL Express',
    },
    trackingNumber: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
