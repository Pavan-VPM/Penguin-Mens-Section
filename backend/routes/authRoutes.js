import express from 'express';
import rateLimit from 'express-rate-limit';
import { protectAdmin, requireSuperAdmin } from '../middleware/auth.js';
import {
  adminLogin,
  adminChangeTempPassword,
  adminMfaSetup,
  adminMfaVerifySetup,
  adminLoginVerifyMfa,
  adminLogout,
  getAdminProfile,
  createAdminUser,
  listAdminUsers,
  updateAdminUser,
  resetAdminMfa,
  resetAdminPassword,
  deleteAdminUser,
} from '../controllers/authController.js';

const router = express.Router();

// Tight rate limit on anything that checks a password or a code
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
});

// ── Public auth flow (no protectAdmin — these ARE the login process) ──
router.post('/admin/login', authLimiter, adminLogin);
router.post('/admin/change-temp-password', authLimiter, adminChangeTempPassword);
router.post('/admin/mfa/setup', authLimiter, adminMfaSetup);
router.post('/admin/mfa/verify-setup', authLimiter, adminMfaVerifySetup);
router.post('/admin/mfa/verify-code', authLimiter, adminLoginVerifyMfa);
router.post('/admin/logout', adminLogout);

// ── Requires an authenticated session ──
router.get('/admin/me', protectAdmin, getAdminProfile);

// ── Superadmin-only staff management ──
router.get('/superadmin/users', protectAdmin, requireSuperAdmin, listAdminUsers);
router.post('/superadmin/users', protectAdmin, requireSuperAdmin, createAdminUser);
router.put('/superadmin/users/:id', protectAdmin, requireSuperAdmin, updateAdminUser);
router.delete('/superadmin/users/:id', protectAdmin, requireSuperAdmin, deleteAdminUser);
router.post('/superadmin/users/:id/reset-mfa', protectAdmin, requireSuperAdmin, resetAdminMfa);
router.post('/superadmin/users/:id/reset-password', protectAdmin, requireSuperAdmin, resetAdminPassword);

export default router;
