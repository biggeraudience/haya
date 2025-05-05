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
const reportRoutes = require('./routes/reportRoutes');
const chatbotRoutes = require("./routes/chatbotRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const measurementConfigRoute = require('./routes/measurementConfigRoute');
const bespokeOrderRoutes = require('./routes/bespokeOrderRoutes');
// Import WebSocket setups
const { setupWebSocketServer } = require("./services/realtimeService");
const { setupSalesWebSocketServer } = require("./websockets/realtimeSales");
const { setupAlertsWebSocketServer } = require("./services/alertsWebSocketService");
// Import messaging services
const { initRabbitMQ } = require("./services/rabbitmqService");
const { pushEventToKafka } = require("./services/kafkaService");

// Optionally, require the aggregation job so it starts automatically
require("./jobs/aggregationJob");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

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
// Instead of app.use('/api', predictionRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/reports', reportRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api", feedbackRoutes);
app.use('/api/bespoke-orders', bespokeOrderRoutes);
app.use('/api/measurementConfig', measurementConfigRoute);
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

const server = http.createServer(app);

// Setup WebSocket servers
setupWebSocketServer(server);
setupSalesWebSocketServer(server);
setupAlertsWebSocketServer(server);
// Initialize RabbitMQ connection
initRabbitMQ();

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce-analytics", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
