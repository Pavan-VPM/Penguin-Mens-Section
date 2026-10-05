import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
  bulkDeleteProducts,
  bulkUpdateProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/bulk-delete', bulkDeleteProducts);
router.post('/bulk-update', bulkUpdateProducts);
router.post('/seed/initial', seedProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
