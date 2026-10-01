import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Import Routes
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middlewares
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Database Connection with graceful fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/penguin_mens_store';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('🍃 MongoDB connected successfully!'))
  .catch((err) => {
    console.warn('⚠️ MongoDB connection error (using in-memory fallback if needed):', err.message);
  });

// API Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    uptime: process.uptime(),
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected/mock',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "Penguin Men's Section REST API",
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      config: '/api/config',
      auth: '/api/auth/admin/login',
      upload: '/api/upload',
    },
  });
});

// Register API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Penguin Menswear Backend Server active on http://localhost:${PORT}`);
  console.log(`🛍 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📦 Orders API:   http://localhost:${PORT}/api/orders`);
  console.log(`⚙️ Config API:   http://localhost:${PORT}/api/config`);
});
