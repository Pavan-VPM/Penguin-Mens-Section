import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';

const JWT_SECRET = process.env.JWT_SECRET || 'penguin_atelier_jwt_secret_dev_key_2026';
const isProd = process.env.NODE_ENV === 'production';

const CUSTOMER_COOKIE_OPTS = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax', // Lax or None with secure in cross-origin environments
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

/**
 * Customer Signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and a password of at least 8 characters are required.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await prisma.customer.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: phone?.trim() || null,
        password: hashedPassword,
        emailVerified: false,
        emailVerifyToken,
        emailVerifyExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    });

    // Send verification email asynchronously
    sendVerificationEmail(customer.email, emailVerifyToken).catch((err) =>
      console.error('Failed to trigger verification email:', err)
    );

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      message: 'Account created successfully! Please verify your email before logging in.',
      email: customer.email,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Could not create account. Please try again.' });
  }
};

/**
 * Resend Email Verification Link
 */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const customer = await prisma.customer.findUnique({ where: { email: cleanEmail } });
    if (!customer) {
      return res.status(200).json({
        success: true,
        message: 'If an account is associated with this email, a verification link has been dispatched.',
      });
    }

    if (customer.emailVerified) {
      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        message: 'Your email is already verified. You can log in directly.',
      });
    }

    const emailVerifyToken = crypto.randomBytes(32).toString('hex');
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        emailVerifyToken,
        emailVerifyExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    await sendVerificationEmail(customer.email, emailVerifyToken);

    return res.status(200).json({
      success: true,
      message: `Verification link sent to ${customer.email}. Please check your inbox.`,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ success: false, message: 'Failed to resend verification link.' });
  }
};

/**
 * Verify Email Link
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const customer = await prisma.customer.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpiry: { gt: new Date() },
      },
    });

    if (!customer) {
      return res.status(400).json({ success: false, message: 'Verification link is invalid or has expired.' });
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpiry: null },
    });

    return res.status(200).json({ success: true, message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ success: false, message: 'Verification failed.' });
  }
};

/**
 * Customer Login (blocks unverified emails)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const customer = await prisma.customer.findUnique({ where: { email: cleanEmail } });
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (customer.lockedUntil && customer.lockedUntil > new Date()) {
      const mins = Math.ceil((customer.lockedUntil.getTime() - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Too many attempts. Try again in ${mins} minute(s).`,
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      const attempts = customer.failedLoginAttempts + 1;
      const lockedUntil = attempts >= 7 ? new Date(Date.now() + 15 * 60 * 1000) : null;
      await prisma.customer.update({
        where: { id: customer.id },
        data: { failedLoginAttempts: attempts, lockedUntil },
      });
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // MANDATORY EMAIL VERIFICATION GATE
    if (!customer.emailVerified) {
      return res.status(403).json({
        success: false,
        unverified: true,
        email: customer.email,
        message: 'Your email address is not verified yet. Please verify your email before logging in.',
      });
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });

    const token = jwt.sign({ id: customer.id, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });
    res.cookie('customer_session', token, CUSTOMER_COOKIE_OPTS);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        emailVerified: customer.emailVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

/**
 * Request Password Reset Token
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    if (!cleanEmail) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const customer = await prisma.customer.findUnique({ where: { email: cleanEmail } });

    // Return success without revealing email existence
    if (customer) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          resetToken,
          resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });
      sendPasswordResetEmail(customer.email, resetToken).catch((err) =>
        console.error('Failed to trigger reset email:', err)
      );
    }

    return res.status(200).json({
      success: true,
      message: 'If that email is registered, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

/**
 * Reset Password with Token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!customer) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    return res.status(200).json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong.' });
  }
};

/**
 * Customer Logout
 */
export const logout = async (req, res) => {
  res.clearCookie('customer_session', {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
  });
  return res.status(200).json({ success: true, message: 'Logged out.' });
};

/**
 * Get current customer profile
 */
export const getProfile = async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.customer.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        addresses: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return res.status(200).json({ success: true, user: customer });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

/**
 * Get customer orders
 */
export const getCustomerOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.customer.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = orders.map((o) => ({
      id: o.orderNumber || o.id,
      orderId: o.id,
      date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: o.orderStatus || o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod || o.paymentProvider,
      total: `₹${Math.round(o.total).toLocaleString('en-IN')}`,
      totalRaw: o.total,
      shippingAddress: o.shippingAddress,
      tracking: o.trackingNumber || 'EXP-98234710',
      items: o.items.map((i) => ({
        name: i.name,
        size: i.size || 'M',
        qty: i.quantity,
        price: `₹${Math.round(i.price).toLocaleString('en-IN')}`,
      })),
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error('Get customer orders error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch customer orders' });
  }
};

/**
 * Add / Update Address
 */
export const saveAddress = async (req, res) => {
  try {
    const { id, label, fullName, phone, line1, line2, city, state, pincode, isDefault } = req.body;
    const customerId = req.customer.id;

    if (!fullName || !phone || !line1 || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone, street address, city, and pincode are required.',
      });
    }

    const stateValue = state?.trim() || 'Karnataka';

    const existingCount = await prisma.address.count({ where: { customerId } });
    const shouldBeDefault = Boolean(isDefault || existingCount === 0);

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { customerId },
        data: { isDefault: false },
      });
    }

    let address;
    if (id) {
      address = await prisma.address.update({
        where: { id, customerId },
        data: {
          label: label?.trim() || 'Home',
          fullName: fullName.trim(),
          phone: phone.trim(),
          line1: line1.trim(),
          line2: line2?.trim() || null,
          city: city.trim(),
          state: stateValue,
          pincode: pincode.trim(),
          isDefault: shouldBeDefault,
        },
      });
    } else {
      address = await prisma.address.create({
        data: {
          customerId,
          label: label?.trim() || 'Home',
          fullName: fullName.trim(),
          phone: phone.trim(),
          line1: line1.trim(),
          line2: line2?.trim() || null,
          city: city.trim(),
          state: stateValue,
          pincode: pincode.trim(),
          isDefault: shouldBeDefault,
        },
      });
    }

    return res.status(201).json({ success: true, address, message: 'Address saved successfully.' });
  } catch (error) {
    console.error('Save address error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save address' });
  }
};

/**
 * Delete Customer Address
 */
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.customer.id;

    await prisma.address.deleteMany({
      where: { id, customerId },
    });

    return res.status(200).json({ success: true, message: 'Address removed.' });
  } catch (error) {
    console.error('Delete address error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete address' });
  }
};

/**
 * Admin: List & Track All Registered Customers
 */
export const listCustomers = async (req, res) => {
  try {
    const { search, status } = req.query;

    const where = {};
    if (search) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (status === 'verified') {
      where.emailVerified = true;
    } else if (status === 'unverified') {
      where.emailVerified = false;
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
        addresses: {
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = customers.map((c) => {
      const totalSpend = c.orders
        .filter((o) => o.paymentStatus === 'success' || o.paymentStatus === 'paid' || o.status === 'paid' || o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0);

      const lastOrder = c.orders.length > 0 ? c.orders[c.orders.length - 1].createdAt : null;

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || 'N/A',
        emailVerified: c.emailVerified,
        createdAt: c.createdAt,
        totalOrders: c.orders.length,
        totalSpend: Math.round(totalSpend),
        lastOrderDate: lastOrder,
        addresses: c.addresses,
      };
    });

    const totalCount = await prisma.customer.count();
    const verifiedCount = await prisma.customer.count({ where: { emailVerified: true } });
    const unverifiedCount = totalCount - verifiedCount;

    return res.status(200).json({
      success: true,
      data: formatted,
      stats: {
        totalCustomers: totalCount,
        verifiedCustomers: verifiedCount,
        unverifiedCustomers: unverifiedCount,
      },
    });
  } catch (error) {
    console.error('List customers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch customer directory.' });
  }
};
