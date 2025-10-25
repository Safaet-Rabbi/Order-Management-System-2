const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Update delivery status of an order
// @route   PUT /api/deliveries/:id/status
// @access  Private/Admin
const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { deliveryStatus, deliveryDate } = req.body;

  const order = await Order.findById(req.params.id);

  if (order) {
    order.deliveryStatus = deliveryStatus || order.deliveryStatus;
    if (deliveryStatus === 'Delivered' && !order.deliveryDate) {
      order.deliveryDate = deliveryDate ? new Date(deliveryDate) : new Date();
    } else if (deliveryStatus !== 'Delivered') {
      order.deliveryDate = undefined; // Clear delivery date if not delivered
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders for delivery tracking
// @route   GET /api/deliveries
// @access  Private
const getDeliveries = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('customer', 'name')
    .select('customer orderDate status shippingMethod deliveryStatus deliveryDate');
  res.json(orders);
});

module.exports = {
  updateDeliveryStatus,
  getDeliveries,
};