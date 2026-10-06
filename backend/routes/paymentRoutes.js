import express from 'express';
import { attachCustomerIfPresent } from '../middleware/customerAuth.js';
import {
  createOrderAndInitiatePayment,
  phonepeCallback,
  checkOrderStatus,
} from '../controllers/paymentController.js';

const router = express.Router();

// Customer checkout route (attaches customer if logged in)
router.post('/checkout', attachCustomerIfPresent, createOrderAndInitiatePayment);

// PhonePe S2S Webhook (no customer auth; checksum-verified)
router.post('/phonepe/callback', phonepeCallback);

// Order status check route (used by frontend on redirect)
router.get('/status/:merchantTxnId', checkOrderStatus);

export default router;
