import Order from '../models/Order.js';

// Sample initial orders for fresh setups
const INITIAL_ORDERS = [
  {
    orderNumber: 'PGN-FW25-8842',
    customer: {
      name: 'Alexandre Mercer',
      email: 'alex.mercer@atelier.com',
      phone: '+91 98201 92834',
      address: 'Penthouse 4B, Cuffe Parade',
      city: 'Mumbai',
      postalCode: '400005',
      country: 'India',
    },
    items: [
      {
        name: 'Structured Poplin Overshirt',
        color: 'Nocturne Black',
        size: 'M',
        price: 11900,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida/AEtjO1XIRlz0loYTFXvsLu1SXx_toDOydf4xCJ3g_vbEDs13LI3EDSuRo2Vy7NxI2NXKK_8Eld9kEZWD9aoH060racr_BNXnYOMoWi5IruZufRjWVVK1Fe4L_H4D1lDtl07zj53g2KseOGsG7aGk39u0pcY97ob0b6VJ1oOdt-JCAp1yZQM-Pq_y79ojnK-Kg07w_7KgAWxkVoK_Cu6ua8tTqJYq96yNQaTzdU0WJWPXCVJbe2zEjh2HnKGOLdY',
      },
      {
        name: 'Monolith Lug Derby',
        color: 'Matte Black',
        size: '42 EU',
        price: 21500,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGCcnQ_lQZYjZwKw_4fdayJ8Vg2b_LBOV3aku10uRPEJDfpurL0Soont9haqftelg8LfVX1jcH4SeuOFi5cw1KMoAzCnvrjhcbjqqks_DLXzjVZXpIi2MHCloBp75Sf7kbNQ0HSWzT40quJiPtMaJ6zMg7iYkvFUkMdDdixjc6MB_cAN5q5EznxDmmyjt6Ds7kVMaPomWX8ttdcmOy5UQrWMHfq9OFSg5nuaMLrzlaTBjMOmypfdm',
      },
    ],
    subtotal: 33400,
    discount: 0,
    tax: 4008,
    totalAmount: 37408,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'In Transit',
    courier: 'DHL Express',
    trackingNumber: 'DHL-8492019482',
  },
  {
    orderNumber: 'PGN-FW24-3109',
    customer: {
      name: 'Rohan Deshmukh',
      email: 'rohan.deshmukh@gmail.com',
      phone: '+91 99304 88123',
      address: '12 Alipore Road',
      city: 'Kolkata',
      postalCode: '700027',
      country: 'India',
    },
    items: [
      {
        name: 'Technical Bomber Jacket',
        color: 'Washed Black',
        size: 'L',
        price: 18900,
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARmvTH6u7FeyWdAlKcRV2iSmOWqimIqVK7TvNs7EsEoF96C0uWUfh6WiwjB23tpGgO_eF2vd6faEeOMv35RikH2miws8kOYSQqvdn1CUSGc-BkNKUw9yVhaxkdllB88qCYUiqqE-QLSWjjVw11EDpSPnLTNPeVKR1KKd0auAsHs3ml1SIln3dM9p6_hl8kDW4qANNQtbNXyDdqS_GW_a90i6X9O0vlX7i6w-mFQrs-LrMrgatzn4uF',
      },
    ],
    subtotal: 18900,
    discount: 0,
    tax: 2268,
    totalAmount: 21168,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'Delivered',
    courier: 'DHL Express',
    trackingNumber: 'DHL-1982739103',
  },
];

import mongoose from 'mongoose';

// In-Memory store fallback for orders
let inMemoryOrders = INITIAL_ORDERS.map((ord, idx) => ({
  ...ord,
  _id: `mock_order_${idx + 1}`,
  createdAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

/**
 * @desc Create new customer order
 * @route POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const { customer, items, subtotal, discount, tax, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    const orderNumber = `PGN-FW25-${Math.floor(1000 + Math.random() * 9000)}`;

    if (mongoose.connection.readyState === 1) {
      const order = new Order({
        orderNumber,
        customer: customer || {
          name: 'Guest Client',
          email: 'client@atelier.com',
          phone: '+91 98765 43210',
          address: 'Bespoke Delivery Address',
          city: 'Mumbai',
          postalCode: '400001',
          country: 'India',
        },
        items,
        subtotal: subtotal || items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
        discount: discount || 0,
        tax: tax || 0,
        totalAmount: totalAmount || subtotal,
        paymentMethod: paymentMethod || 'upi',
        paymentStatus: 'paid',
        orderStatus: 'Processing',
        courier: 'DHL Express',
        trackingNumber: `DHL-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      });

      const savedOrder = await order.save();
      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: savedOrder,
      });
    }

    // In-memory fallback
    const mockOrder = {
      _id: `mock_order_${Date.now()}`,
      orderNumber,
      customer: customer || {
        name: 'Guest Client',
        email: 'client@atelier.com',
        phone: '+91 98765 43210',
        address: 'Bespoke Delivery Address',
        city: 'Mumbai',
        postalCode: '400001',
        country: 'India',
      },
      items,
      subtotal: subtotal || items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0),
      discount: discount || 0,
      tax: tax || 0,
      totalAmount: totalAmount || subtotal,
      paymentMethod: paymentMethod || 'upi',
      paymentStatus: 'paid',
      orderStatus: 'Processing',
      courier: 'DHL Express',
      trackingNumber: `DHL-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryOrders.unshift(mockOrder);

    return res.status(201).json({
      success: true,
      message: 'Order created successfully (In-Memory)',
      data: mockOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all orders (Admin or list)
 * @route GET /api/orders
 */
export const getAllOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let orders = await Order.find().sort({ createdAt: -1 });
      if (orders.length === 0) {
        await Order.insertMany(INITIAL_ORDERS);
        orders = await Order.find().sort({ createdAt: -1 });
      }
      return res.status(200).json({
        success: true,
        count: orders.length,
        data: orders,
      });
    }

    return res.status(200).json({
      success: true,
      count: inMemoryOrders.length,
      data: inMemoryOrders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update order status & courier tracking (Admin)
 * @route PUT /api/orders/:id
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, courier, paymentStatus } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findByIdAndUpdate(
        id,
        { orderStatus, trackingNumber, courier, paymentStatus },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      return res.status(200).json({
        success: true,
        message: 'Order updated successfully',
        data: order,
      });
    }

    const orderIdx = inMemoryOrders.findIndex(o => o._id === id || o.orderNumber === id);
    if (orderIdx === -1) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    inMemoryOrders[orderIdx] = {
      ...inMemoryOrders[orderIdx],
      ...(orderStatus && { orderStatus }),
      ...(trackingNumber && { trackingNumber }),
      ...(courier && { courier }),
      ...(paymentStatus && { paymentStatus }),
      updatedAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully (In-Memory)',
      data: inMemoryOrders[orderIdx],
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};
