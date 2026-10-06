import crypto from 'crypto';
import prisma from '../config/prisma.js';
import { initiatePayment, checkPaymentStatus, verifyCallbackChecksum } from '../services/phonepe.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const API_URL = process.env.API_URL || 'http://localhost:5001';

/**
 * Shared order finalization helper
 * Checks status directly from PhonePe and performs atomic inventory deduction
 */
async function finalizeOrderFromStatus(merchantTxnId) {
  const order = await prisma.order.findUnique({
    where: { merchantTxnId },
    include: { items: true },
  });

  if (!order) return null;
  if (order.paymentStatus === 'success') return order; // Already finalized

  try {
    const statusResponse = await checkPaymentStatus(merchantTxnId);

    if (statusResponse.code === 'PAYMENT_SUCCESS') {
      // Atomic stock decrement per item
      for (const item of order.items) {
        if (item.productId) {
          const updated = await prisma.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.quantity },
            },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          if (updated.count === 0) {
            // Stock ran out between checkout & payment confirmation
            await prisma.order.update({
              where: { id: order.id },
              data: { status: 'failed', paymentStatus: 'success' },
            });
            console.error(`🚨 CRITICAL: Order ${order.id} paid but productId ${item.productId} (${item.name}) ran out of stock. Manual resolution required.`);
            return order;
          }
        }
      }

      return await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'paid',
          orderStatus: 'Processing',
          paymentStatus: 'success',
          phonepeTxnId: statusResponse.data?.transactionId || statusResponse.data?.providerReferenceId,
        },
        include: { items: true },
      });
    } else if (
      statusResponse.code === 'PAYMENT_ERROR' ||
      statusResponse.code === 'PAYMENT_DECLINED' ||
      statusResponse.code === 'TIMED_OUT'
    ) {
      return await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'cancelled',
          paymentStatus: 'failed',
        },
        include: { items: true },
      });
    }
  } catch (err) {
    console.error(`Error querying PhonePe status for ${merchantTxnId}:`, err.message);
  }

  return order;
}

/**
 * Create Order & Initiate PhonePe Payment
 */
export const createOrderAndInitiatePayment = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = 'phonepe' } = req.body;
    const customerId = req.customer?.id || null;

    if (!items?.length || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Cart items and shipping address are required.',
      });
    }

    // Recalculate price server-side from PostgreSQL Product table
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      let product = null;
      if (item.productId) {
        product = await prisma.product.findUnique({ where: { id: item.productId } });
      }

      const price = product ? product.price : (Number(item.price) || 0);
      const name = product ? product.name : (item.name || 'Atelier Item');

      if (product && product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock.`,
        });
      }

      const itemQty = Math.max(1, Number(item.quantity || item.qty) || 1);
      subtotal += price * itemQty;

      orderItemsData.push({
        productId: product ? product.id : (item.productId || `prod_${Date.now()}`),
        name,
        price,
        size: item.size || 'M',
        color: item.color || 'Default',
        quantity: itemQty,
      });
    }

    const shippingFee = subtotal >= 1999 ? 0 : 99;
    const total = subtotal + shippingFee;
    const merchantTxnId = `PGN_${Date.now()}_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const orderNumber = `PGN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        customerName: shippingAddress.name || req.customer?.name || 'Guest Client',
        email: shippingAddress.email || req.customer?.email || 'client@penguin.com',
        phone: shippingAddress.phone || req.customer?.phone || null,
        subtotal,
        shippingFee,
        total,
        status: 'pending',
        orderStatus: 'Processing',
        shippingAddress,
        paymentProvider: paymentMethod === 'cod' ? 'cod' : 'phonepe',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'initiated',
        merchantTxnId: paymentMethod === 'cod' ? null : merchantTxnId,
        trackingNumber: `EXP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // If COD, return order right away
    if (paymentMethod === 'cod') {
      return res.status(201).json({
        success: true,
        isCod: true,
        orderNumber: order.orderNumber,
        orderId: order.id,
        total: order.total,
        message: 'Order placed successfully with Cash on Delivery.',
      });
    }

    // Initiate PhonePe Payment
    const redirectUrl = process.env.PHONEPE_REDIRECT_URL || `${CLIENT_URL}/order/status?txn=${merchantTxnId}`;
    const callbackUrl = process.env.PHONEPE_CALLBACK_URL || `${API_URL}/api/payments/phonepe/callback`;

    try {
      const phonepeResponse = await initiatePayment({
        merchantTxnId,
        amountInPaise: Math.round(total * 100),
        customerId: customerId || `GUEST_${merchantTxnId}`,
        redirectUrl,
        callbackUrl,
        mobileNumber: shippingAddress.phone,
      });

      if (!phonepeResponse.success) {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'failed', status: 'cancelled' },
        });
        return res.status(502).json({
          success: false,
          message: phonepeResponse.message || 'Could not initiate PhonePe payment.',
        });
      }

      const paymentRedirectUrl = phonepeResponse.data?.instrumentResponse?.redirectInfo?.url;
      return res.status(200).json({
        success: true,
        redirectUrl: paymentRedirectUrl,
        merchantTxnId,
        orderId: order.id,
        orderNumber: order.orderNumber,
      });
    } catch (pgError) {
      console.error('PhonePe API initiation failed:', pgError.response?.data || pgError.message);
      
      // If PhonePe Sandbox test mode credentials fail or mock environment, gracefully return redirect simulation
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔄 Dev mode: Providing local mock redirect link');
        return res.status(200).json({
          success: true,
          redirectUrl: `${CLIENT_URL}/order/status?txn=${merchantTxnId}`,
          merchantTxnId,
          orderId: order.id,
          orderNumber: order.orderNumber,
          devNotice: 'Sandbox simulation redirect',
        });
      }

      return res.status(502).json({
        success: false,
        message: 'Payment gateway is currently unreachable. Please try COD or try again shortly.',
      });
    }
  } catch (error) {
    console.error('Order/payment initiation error:', error);
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
  }
};

/**
 * PhonePe Server-to-Server Webhook Callback
 */
export const phonepeCallback = async (req, res) => {
  try {
    const xVerify = req.headers['x-verify'];
    const { response } = req.body;

    if (!verifyCallbackChecksum(xVerify, response)) {
      console.warn('⚠️ PhonePe callback checksum mismatch — potential tampering attempt');
      return res.status(400).json({ success: false, message: 'Invalid checksum.' });
    }

    const decoded = JSON.parse(Buffer.from(response, 'base64').toString());
    const merchantTxnId = decoded.data?.merchantTransactionId;

    if (merchantTxnId) {
      console.log(`📥 PhonePe S2S Callback received for txn: ${merchantTxnId}`);
      await finalizeOrderFromStatus(merchantTxnId);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('PhonePe callback error:', error);
    return res.status(500).json({ success: false });
  }
};

/**
 * Customer status check upon return redirect
 */
export const checkOrderStatus = async (req, res) => {
  try {
    const { merchantTxnId } = req.params;
    let order = await finalizeOrderFromStatus(merchantTxnId);

    // Fallback if not found by merchantTxnId, check by order id or orderNumber
    if (!order) {
      order = await prisma.order.findFirst({
        where: {
          OR: [{ id: merchantTxnId }, { orderNumber: merchantTxnId }],
        },
        include: { items: true },
      });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(200).json({
      success: true,
      order: {
        id: order.orderNumber || order.id,
        rawId: order.id,
        status: order.status,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        total: order.total,
        trackingNumber: order.trackingNumber,
        items: order.items,
        shippingAddress: order.shippingAddress,
      },
    });
  } catch (error) {
    console.error('Order status check error:', error);
    return res.status(500).json({ success: false, message: 'Could not check order status.' });
  }
};
