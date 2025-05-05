// controllers/predictionController.js
const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Event = require("../models/eventModel");

const getSalesPredictionData = asyncHandler(async (req, res) => {
  // Use data from the last 90 days
  const days = 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Retrieve orders from the last 90 days
  const orders = await Order.find({ createdAt: { $gte: startDate } });

  // Aggregate daily sales data: group orders by day
  const dailyAggregation = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalRevenue: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Calculate overall metrics
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0;

  // Compute conversion rate: ratio of PURCHASE_COMPLETED to PAGE_VIEW events
  const purchaseCount = await Event.countDocuments({
    eventType: "PURCHASE_COMPLETED",
    timestamp: { $gte: startDate },
  });
  const pageViewCount = await Event.countDocuments({
    eventType: "PAGE_VIEW",
    timestamp: { $gte: startDate },
  });
  const conversionRate = pageViewCount ? ((purchaseCount / pageViewCount) * 100).toFixed(2) : 0;

  // Return the robust dataset needed for sales prediction
  res.json({
    dailyAggregation,    // Array of { _id: "YYYY-MM-DD", totalRevenue, orderCount }
    totalRevenue,        // Overall revenue in the period
    totalOrders,         // Overall number of orders
    averageOrderValue,   // Average revenue per order
    conversionRate,      // Percentage conversion from page views to purchases
  });
});

module.exports = { getSalesPredictionData };
