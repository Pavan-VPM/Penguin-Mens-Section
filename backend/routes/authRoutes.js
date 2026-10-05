import express from 'express';
import {
  adminLogin,
  adminMfaSetup,
  adminMfaVerifySetup,
  adminLoginVerifyMfa,
  adminLogout,
  createAdminUser,
  listAdminUsers,
  updateAdminUser,
  resetAdminMfa,
  resetAdminPassword,
  deleteAdminUser,
} from '../controllers/authController.js';
import { protectAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── Authentication & MFA Lifecycle Endpoints ──
router.post('/admin/login', adminLogin);
router.post('/admin/mfa/setup', adminMfaSetup);
router.post('/admin/mfa/verify-setup', adminMfaVerifySetup);
router.post('/admin/login/verify-mfa', adminLoginVerifyMfa);
router.post('/admin/logout', adminLogout);

// ── Superadmin Role-Gated Admin & Identity Control ──
router.post('/admin/users/create', protectAdmin, requireSuperAdmin, createAdminUser);
router.get('/admin/users', protectAdmin, requireSuperAdmin, listAdminUsers);
router.put('/admin/users/:id', protectAdmin, requireSuperAdmin, updateAdminUser);
router.post('/admin/users/:id/reset-mfa', protectAdmin, requireSuperAdmin, resetAdminMfa);
router.post('/admin/users/:id/reset-password', protectAdmin, requireSuperAdmin, resetAdminPassword);
router.delete('/admin/users/:id', protectAdmin, requireSuperAdmin, deleteAdminUser);

export default router;


