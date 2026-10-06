import express from 'express';
import { attachCustomerIfPresent } from '../middleware/customerAuth.js';
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getAllOrders);
router.post('/', attachCustomerIfPresent, createOrder);
router.put('/:id', updateOrderStatus);

export default router;
