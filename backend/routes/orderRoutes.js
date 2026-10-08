import express from 'express';
import { attachCustomerIfPresent } from '../middleware/customerAuth.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/track/:query', trackOrder);
router.get('/:id', getOrderById);
router.post('/', attachCustomerIfPresent, createOrder);
router.put('/:id', updateOrderStatus);
router.put('/:id/status', updateOrderStatus);

export default router;
