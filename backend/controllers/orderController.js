import prisma from '../config/prisma.js';

/**
 * @desc Create new customer order
 * @route POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const { customer, items, subtotal, discount, shippingFee, totalAmount, total, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    const orderNumber = `PGN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const calcSubtotal = subtotal || items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const finalTotal = total || totalAmount || calcSubtotal;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customer?.name || 'Guest Client',
        email: customer?.email || 'client@penguin.com',
        phone: customer?.phone || '',
        shippingAddress: customer || {},
        items: items || [],
        subtotal: Number(calcSubtotal) || 0,
        shippingFee: Number(shippingFee) || 0,
        discount: Number(discount) || 0,
        total: Number(finalTotal) || 0,
        paymentMethod: paymentMethod || 'cod',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'Processing',
        trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
    });

    const formatted = { ...order, _id: order.id, customer: order.shippingAddress, totalAmount: order.total };
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: formatted,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all orders (Admin)
 * @route GET /api/orders
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = orders.map(o => ({
      ...o,
      _id: o.id,
      customer: o.shippingAddress,
      totalAmount: o.total,
    }));

    return res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllOrders = getOrders;

/**
 * @desc Get order by ID or order number
 * @route GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const formatted = {
      ...order,
      _id: order.id,
      customer: order.shippingAddress,
      totalAmount: order.total,
    };

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update order status (Admin)
 * @route PUT /api/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, paymentStatus } = req.body;

    const existing = await prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: {
        orderStatus: orderStatus || existing.orderStatus,
        trackingNumber: trackingNumber !== undefined ? trackingNumber : existing.trackingNumber,
        paymentStatus: paymentStatus || existing.paymentStatus,
      },
    });

    const formatted = {
      ...updated,
      _id: updated.id,
      customer: updated.shippingAddress,
      totalAmount: updated.total,
    };

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: formatted,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
