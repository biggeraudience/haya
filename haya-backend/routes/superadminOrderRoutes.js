// routes/superadminOrderRoutes.js
const express = require('express');
const router = express.Router();
const { getAllOrders } = require('../controllers/orderController');
const { protect, superadminOnly } = require('../middlewares/authMiddleware');

// GET /api/superadmin/orders - Returns all orders for superadmin
router.get('/', protect, superadminOnly, getAllOrders);

module.exports = router;
