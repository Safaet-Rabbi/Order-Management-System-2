const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('customer', 'name email')
    .populate('items.product', 'name price');
  res.json(orders);
});

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name email')
    .populate('items.product', 'name price');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { customer, items, shippingMethod } = req.body;

  if (items && items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const customerExists = await Customer.findById(customer);
    if (!customerExists) {
      res.status(400);
      throw new Error('Customer not found');
    }

    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.countInStock < item.quantity) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}`);
      }
      total += product.price * item.quantity;
      orderItems.push({ product: product._id, quantity: item.quantity });

      // Decrease product stock
      product.countInStock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      customer,
      items: orderItems,
      total,
      shippingMethod,
      deliveryStatus: 'Pending', // Default
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    order.deliveryStatus = req.body.deliveryStatus || order.deliveryStatus;
    if (req.body.deliveryStatus === 'Delivered' && !order.deliveryDate) {
      order.deliveryDate = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await Order.deleteOne({ _id: order._id });
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get dashboard metrics (total orders, revenue, customers, products)
// @route   GET /api/dashboard/metrics
// @access  Private
const getDashboardMetrics = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments({});
  const totalRevenue = await Order.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: '$total' },
      },
    },
  ]);
  const totalCustomers = await Customer.countDocuments({});
  const totalProducts = await Product.countDocuments({});

  const recentActivity = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('customer', 'name');

  const lowStockProducts = await Product.find({ countInStock: { $lt: 26 } }).limit(5);

  res.json({
    totalOrders,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    totalCustomers,
    totalProducts,
    recentActivity,
    lowStockProducts,
  });
});


module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getDashboardMetrics,
};