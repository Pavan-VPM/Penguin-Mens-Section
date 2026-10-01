import express from 'express';
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getAllOrders);
router.post('/', createOrder);
router.put('/:id', updateOrderStatus);

export default router;
