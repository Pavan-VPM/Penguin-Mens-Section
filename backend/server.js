import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';

// Prisma PostgreSQL Client
import prisma from './config/prisma.js';

// Import Routes
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import configRoutes from './routes/configRoutes.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

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
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Test PostgreSQL connection
prisma.$connect()
  .then(() => console.log('🐘 PostgreSQL connected successfully via Prisma!'))
  .catch((err) => console.error('⚠️ PostgreSQL connection error:', err.message));

// API Health Check
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected (PostgreSQL)';
  } catch (_) {}

  res.json({
    status: 'online',
    uptime: process.uptime(),
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "Penguin Men's Section REST API (PostgreSQL + Prisma)",
    version: '2.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      config: '/api/config',
      auth: '/api/auth/admin/login',
      upload: '/api/upload',
      categories: '/api/categories',
    },
  });
});

// Register API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Penguin Menswear Backend active on http://localhost:${PORT}`);
  console.log(`🛍 Products API: http://localhost:${PORT}/api/products`);
  console.log(`📦 Orders API:   http://localhost:${PORT}/api/orders`);
  console.log(`⚙️ Config API:   http://localhost:${PORT}/api/config`);
});
