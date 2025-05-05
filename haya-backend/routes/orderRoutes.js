// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { protect, autoGenerateToken } = require("../middlewares/authMiddleware");

// Create a new order
router.post("/", protect, autoGenerateToken, createOrder);

// Get orders for the current user
router.get("/", protect, autoGenerateToken, getUserOrders);

// Admin route to get all orders
router.get("/all", protect, autoGenerateToken, getAllOrders);

// Admin route to update order status
router.put("/:id", protect, autoGenerateToken, updateOrderStatus);

module.exports = router;
