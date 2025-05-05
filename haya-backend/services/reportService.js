// backend/services/reportService.js
const Order = require("../models/orderModel");
const Event = require("../models/eventModel");

const generateDailyReport = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sales summary
  const orders = await Order.find({ createdAt: { $gte: today } });
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;

  // Traffic summary
  const pageViews = await Event.countDocuments({
    eventType: "PAGE_VIEW",
    timestamp: { $gte: today },
  });

  // Additional metrics: e.g., customer analytics (dummy data for now)
  const customerAnalytics = {
    newVsReturning: "New: 60% / Returning: 40%",
    churnRate: "10%",
  };

  return {
    date: today.toISOString().split("T")[0],
    totalRevenue,
    totalOrders,
    pageViews,
    averageOrderValue: totalOrders ? (totalRevenue / totalOrders).toFixed(2) : 0,
    customerAnalytics,
  };
};

module.exports = { generateDailyReport };
