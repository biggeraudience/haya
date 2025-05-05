const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel");
const Order = require("../models/orderModel"); // Ensure this is defined in your project
const { broadcastAnalyticsEvent } = require("../services/realtimeService");
const kafkaService = require("../services/kafkaService");
const { v4: uuidv4 } = require("uuid");

// Record an event with enhanced metadata
const recordEvent = asyncHandler(async (req, res) => {
  const { eventType, details } = req.body;
  if (!eventType) {
    res.status(400);
    throw new Error("Event type is required");
  }

  // Extract additional metadata from request headers and cookies
  const ip = req.headers["x-forwarded-for"] || req.ip;
  const userAgent = req.headers["user-agent"];
  const referrer = req.headers["referer"] || req.headers["referrer"] || "";
  const sessionId = req.cookies && req.cookies.sessionId ? req.cookies.sessionId : uuidv4();
  const userId = req.user ? req.user.id : null;

  const eventData = { eventType, details, userId, ip, userAgent, sessionId, referrer };

  // Save the enriched event to MongoDB
  const event = await Event.create(eventData);

  // Broadcast real-time update if coordinates are present
  if (details && details.coordinates && Array.isArray(details.coordinates)) {
    const eventDataBroadcast = {
      coordinates: details.coordinates, // expecting [lng, lat]
      activity: details.activity || Math.floor(Math.random() * 101),
      label: details.label || `Visit @ ${new Date().toLocaleTimeString()}`,
    };
    broadcastAnalyticsEvent(eventDataBroadcast);
  }

 // Attempt to push the event to Kafka.
 try {
  kafkaService.pushEventToKafka(eventData);
} catch (err) {
  console.error("Kafka push error (non-critical):", err);
  // Continue without failing the request
}

res.status(201).json(event);
});

// Get aggregated analytics data
const getAnalytics = asyncHandler(async (req, res) => {
  // Traffic & Visitor Analytics
  const totalPageViews = await Event.countDocuments({ eventType: "PAGE_VIEW" });
  const uniqueVisitorsAgg = await Event.aggregate([
    { $match: { eventType: "PAGE_VIEW", userId: { $ne: null } } },
    { $group: { _id: "$userId" } },
    { $count: "uniqueVisitors" },
  ]);
  const uniqueVisitors = uniqueVisitorsAgg.length > 0 ? uniqueVisitorsAgg[0].uniqueVisitors : 0;
  const sessionDuration = "3m 45s"; // Placeholder
  const bounceRate = "42%";         // Placeholder

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

  const conversionFunnel = { 
    cartAbandonment: "55%", 
    checkoutCompletion: "85%" 
  };

  // Revenue & Financial Metrics
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
    customerLifetimeValue: 1200, // Placeholder
    refundReturnRates: "3%",
  };

  // Other metrics (placeholders for now)
  const productPerformance = {
    topSellers: "Product A, Product B",
    underperformers: "Product C, Product D",
    inventoryTurnover: "5x per month",
    productEngagement: "1,234 views",
  };

  const customerAnalytics = {
    newVsReturning: "New: 60% / Returning: 40%",
    churnRate: "10%",
  };

  const marketingPerformance = {
    campaignROI: "150%",
    costPerAcquisition: "$45",
    attributionAnalysis: "[Chart Placeholder]",
  };

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

// Return paginated events (for dashboard display)
const getPaginatedEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;
  const totalCount = await Event.countDocuments();
  const events = await Event.find()
    .sort({ timestamp: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  res.json({
    page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    events,
  });
});
const getTimeseriesData = asyncHandler(async (req, res) => {
  // Aggregate revenue data for the past 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenueTimeseries = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalRevenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ revenueTimeseries });
});


module.exports = { recordEvent, getAnalytics, getPaginatedEvents,getTimeseriesData, };
