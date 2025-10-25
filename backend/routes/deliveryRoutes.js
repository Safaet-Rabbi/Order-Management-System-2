const express = require('express');
const { getDeliveries, updateDeliveryStatus } = require('../controllers/deliveryController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getDeliveries);
router.route('/:id/status').put(protect, admin, updateDeliveryStatus);

module.exports = router;