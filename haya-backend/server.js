require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");

// Import route modules
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adRoutes = require("./routes/adRoutes");
const inviteCodeRoutes = require("./routes/inviteCodeRoutes");
const adminLogsRoutes = require("./routes/adminLogsRoutes");
const superadminUserRoutes = require("./routes/superadminUserRoutes");
const superadminOrderRoutes = require("./routes/superadminOrderRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const predictionRoutes = require('./routes/predictionRoutes');
const reportRoutes = require("./routes/reportRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const measurementConfigRoute = require('./routes/measurementConfigRoute');
const bespokeOrderRoutes = require("./routes/bespokeOrderRoutes");

// Note: WebSockets and background jobs run only in dev
// Optionally require aggregation job
if (process.env.NODE_ENV !== 'production') {
  require("./jobs/aggregationJob");
}

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// API Routes
app.use("/api/ads", adRoutes);
app.use("/api/invitecodes", inviteCodeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", profileRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin/logs", adminLogsRoutes);
app.use("/api/superadmin/users", superadminUserRoutes);
app.use("/api/superadmin/orders", superadminOrderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api", feedbackRoutes);
app.use('/api/bespoke-orders', bespokeOrderRoutes);
app.use('/api/measurementConfig', measurementConfigRoute);

// 404 Handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Export app for serverless wrapper
module.exports = app;

// Only run server, WebSockets, and background services in dev
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  const server = http.createServer(app);

  // Setup WebSocket servers
  const { setupWebSocketServer } = require("./services/realtimeService");
  const { setupSalesWebSocketServer } = require("./websockets/realtimeSales");
  const { setupAlertsWebSocketServer } = require("./services/alertsWebSocketService");
  setupWebSocketServer(server);
  setupSalesWebSocketServer(server);
  setupAlertsWebSocketServer(server);

  // Initialize RabbitMQ and Kafka in dev only
  const { initRabbitMQ } = require("./services/rabbitmqService");
  const { pushEventToKafka } = require("./services/kafkaService");
  initRabbitMQ();
  // pushEventToKafka can be called within routes or jobs

  // MongoDB Connection and start server
  mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce-analytics", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => console.log(`🚀 Dev server running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
}
