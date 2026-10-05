import express from 'express';
import {
  getPublicCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public: Fetch active categories for Header, navigation & PLP
router.get('/', getPublicCategories);

// Admin: Categories Management
router.get('/admin/list', protectAdmin, getAdminCategories);
router.post('/admin', protectAdmin, createCategory);
router.put('/admin/:id', protectAdmin, updateCategory);
router.delete('/admin/:id', protectAdmin, deleteCategory);

export default router;
