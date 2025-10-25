const express = require('express');
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  getDashboardMetrics,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getOrders).post(protect, createOrder);
router.route('/dashboard-metrics').get(protect, getDashboardMetrics);
router
  .route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrderStatus) // Use updateOrderStatus for PUT
  .delete(protect, admin, deleteOrder);

module.exports = router;