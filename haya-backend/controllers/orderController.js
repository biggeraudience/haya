// controllers/orderController.js 
const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const { broadcastSalesEvent } = require("../websockets/realtimeSales");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount, paymentStatus, orderStatus, tracking } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  // Create order using the authenticated user's ID (set by the protect middleware)
  const order = new Order({
    userId: req.user.id,
    items,
    totalAmount,
    paymentStatus: paymentStatus || "Unpaid",
    orderStatus: orderStatus || "PROCESSING",
    tracking,
  });

  const createdOrder = await order.save();

  // Broadcast real-time sales event
  const revenue = createdOrder.totalAmount;
  const cost = revenue * 0.6;
  const revenueChange = Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5;
  const costChange = Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 5;
  broadcastSalesEvent({ revenue, cost, revenueChange, costChange });

  // Populate userId with the desired fields before sending the response
  const populatedOrder = await Order.findById(createdOrder._id)
    .populate("userId", "name email profileImage");
  res.status(201).json(populatedOrder);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders/all
// @access  Private (admin)
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .populate("userId", "name email profileImage"); // <-- populate user details
  res.json(orders);
});

// @desc    Get orders for the current user
// @route   GET /api/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .populate("userId", "name email profileImage");
  res.json(orders);
});

// @desc    Update an order's status
// @route   PUT /api/orders/:id
// @access  Private (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;
  // Find order by orderId (as used in the frontend)
  const order = await Order.findOne({ orderId: req.params.id });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.orderStatus = orderStatus;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

module.exports = { createOrder, getUserOrders, getAllOrders, updateOrderStatus };
