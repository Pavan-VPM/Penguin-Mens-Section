import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'penguin_atelier_jwt_secret_dev_key_2026';

export const protectCustomer = async (req, res, next) => {
  const token = req.cookies?.customer_session || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Please log in to continue.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Invalid customer token.' });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        lockedUntil: true,
        createdAt: true,
      },
    });

    if (!customer) {
      return res.status(401).json({ success: false, message: 'Account not found.' });
    }

    if (customer.lockedUntil && customer.lockedUntil > new Date()) {
      return res.status(423).json({ success: false, message: 'Account temporarily locked. Try again later.' });
    }

    req.customer = customer;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
};

export const attachCustomerIfPresent = async (req, res, next) => {
  const token = req.cookies?.customer_session || req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role === 'customer') {
      const customer = await prisma.customer.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          emailVerified: true,
        },
      });
      if (customer) {
        req.customer = customer;
      }
    }
  } catch (_) {
    // Ignore invalid tokens for optional guest requests
  }
  next();
};
