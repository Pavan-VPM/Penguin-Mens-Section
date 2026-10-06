import express from 'express';
import rateLimit from 'express-rate-limit';
import { protectCustomer } from '../middleware/customerAuth.js';
import { protectAdmin } from '../middleware/auth.js';
import {
  signup,
  login,
  logout,
  getProfile,
  verifyEmail,
  resendVerification,
  requestPasswordReset,
  resetPassword,
  getCustomerOrders,
  saveAddress,
  deleteAddress,
  listCustomers,
} from '../controllers/customerAuthController.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts, please try again after 15 minutes.' },
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', authLimiter, resendVerification);
router.post('/forgot-password', authLimiter, requestPasswordReset);
router.post('/reset-password', authLimiter, resetPassword);
router.get('/me', protectCustomer, getProfile);
router.get('/orders', protectCustomer, getCustomerOrders);
router.post('/address', protectCustomer, saveAddress);
router.delete('/address/:id', protectCustomer, deleteAddress);

// Admin customer tracking & directory route
router.get('/admin/list', protectAdmin, listCustomers);

export default router;
