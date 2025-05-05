// backend/analyticsUnified.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

// Import your Order model and authentication middlewares
const Order = require("../models/eventModel");
const { protect, superadminOnly } = require("../middlewares/authMiddleware");

// Import WebSocket broadcast function for realtime analytics (if used)
const { broadcastAnalyticsEvent } = require("../websockets/realtimeAnalytics");

// ====================
// Define the Event Model
// ====================
const EventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  details: { type: Object, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },             // New: Client IP address
  userAgent: { type: String },        // New: Browser/device info
  sessionId: { type: String },        // New: Unique session identifier
  referrer: { type: String }          // New: Referrer URL
});

  
  // Prevent OverwriteModelError by reusing the existing model if available
  const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
  
// ====================
// Controller: Record an Event
// ====================
const recordEvent = asyncHandler(async (req, res) => {
  const { eventType, details } = req.body;

  if (!eventType) {
    return res.status(400).json({ error: "Event type is required" });
  }

  // Attach authenticated user ID if available
  const userId = req.user ? req.user.id : null;
  const event = await Event.create({ eventType, details, userId });

  // If details include coordinates, broadcast for realtime updates
  if (details && details.coordinates && Array.isArray(details.coordinates)) {
    const eventData = {
      coordinates: details.coordinates, // expecting [lng, lat]
      activity: details.activity || Math.floor(Math.random() * 101),
      label: details.label || `Visit @ ${new Date().toLocaleTimeString()}`,
    };
    broadcastAnalyticsEvent(eventData);
  }

  res.status(201).json(event);
});

// ====================
// Controller: Get Aggregated Analytics
// ====================
const getAnalytics = asyncHandler(async (req, res) => {
  // ----- Traffic & Visitor Analytics -----
  const totalPageViews = await Event.countDocuments({ eventType: "PAGE_VIEW" });
  const uniqueVisitorsAgg = await Event.aggregate([
    { $match: { eventType: "PAGE_VIEW", userId: { $ne: null } } },
    { $group: { _id: "$userId" } },
    { $count: "uniqueVisitors" },
  ]);
  const uniqueVisitors =
    uniqueVisitorsAgg.length > 0 ? uniqueVisitorsAgg[0].uniqueVisitors : 0;

  // Simulated session duration & bounce rate (replace with real logic if available)
  const sessionDuration = "3m 45s";
  const bounceRate = "42%";

  const trafficAnalytics = {
    totalVisitors: uniqueVisitors,
    uniqueVisitors,
    pageViews: totalPageViews,
    sessionDuration,
    bounceRate,
    trafficSources: {
      organic: "40%",
      paid: "25%",
      referral: "15%",
      social: "10%",
      direct: "10%",
    },
  };

  // ----- Conversion Funnel Analysis -----
  const conversionFunnel = { 
    cartAbandonment: "55%", 
    checkoutCompletion: "85%" 
  };

  // ----- Revenue & Financial Metrics -----
  const orders = await Order.find({});
  let totalRevenue = 0;
  orders.forEach((order) => {
    totalRevenue += order.totalAmount;
  });
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0;
  const revenueMetrics = {
    totalRevenue,
    averageOrderValue,
    customerLifetimeValue: 1200,
    refundReturnRates: "3%",
  };

  // ----- Product Performance Metrics -----
  const productPerformance = {
    topSellers: "Product A, Product B",
    underperformers: "Product C, Product D",
    inventoryTurnover: "5x per month",
    productEngagement: "1,234 views",
  };

  // ----- Customer Analytics -----
  const customerAnalytics = {
    newVsReturning: "New: 60% / Returning: 40%",
    churnRate: "10%",
  };

  // ----- Marketing & Campaign Performance -----
  const marketingPerformance = {
    campaignROI: "150%",
    costPerAcquisition: "$45",
    attributionAnalysis: "[Chart Placeholder]",
  };

  // ----- Operational Analytics -----
  const operationalAnalytics = {
    orderProcessingTime: "2 hours",
    shippingDelays: "1.5 days avg.",
    deliveryPerformance: "95% on-time",
    customerService: "Satisfaction: 4.5/5",
  };

  res.json({
    trafficAnalytics,
    conversionFunnel,
    revenueMetrics,
    productPerformance,
    customerAnalytics,
    marketingPerformance,
    operationalAnalytics,
  });
});

// ====================
// Set Up the Express Router
// ====================
const router = express.Router();

// Use this endpoint to record events from the frontend hook
router.post("/events", protect, recordEvent);

// Use this endpoint to get aggregated analytics (restricted to superadmins)
router.get("/", protect, superadminOnly, getAnalytics);

module.exports = router;
