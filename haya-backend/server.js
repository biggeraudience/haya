// ../haya-backend/server.js

// Remove require("dotenv").config(); - Worker handles env
const express = require("express"); // Keep require for Express itself
const cors = require("cors"); // Keep require
const mongoose = require("mongoose"); // Keep require
const cookieParser = require("cookie-parser"); // Keep require
// Remove http = require("http"); - Not used in Worker

// Import middleware factory functions using import
import configureProfileMulter from './middlewares/profileMulter.js';
import configureProductMulter from './middlewares/productMulter.js';
import configureAdsMulter from './middlewares/adsMulter.js'; // Import the ads middleware factory

// Import route modules. Refactored ones will be factory functions.
import createProfileRoutes from "./routes/profileRoutes.js"; // Import profileRoutes as a factory
// Assuming other route files still use require/module.exports for now
const adminRoutes = require("./routes/adminRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const productRoutes = require("./routes/productRoutes"); // *** This likely needs refactoring too ***
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const adRoutes = require("./routes/adRoutes"); // *** This likely needs refactoring too ***
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

// Remove WebSocket, background job, RabbitMQ, Kafka, and server listening code
// as they are not part of the Worker environment.

// Export a function that takes the env object and returns the configured app
export default (env) => {
  // Connect to MongoDB inside the factory function where env is available
   mongoose.connect(env.MONGODB_URI || "mongodb://localhost:27017/ecommerce-analytics", {
     // Options like useNewUrlParser, useUnifiedTopology might not be needed/supported in latest Mongoose/Workers
   })
   .then(() => {
     console.log("✅ Connected to MongoDB"); // This log will appear during Worker initialization
   })
   .catch(err => {
     console.error("❌ MongoDB connection error:", err.message);
     // In a Worker, throwing here will stop the Worker from starting.
     // You might need better error handling for failed DB connections.
     throw new Error("MongoDB connection failed");
   });


  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: env.CLIENT_URL || "http://localhost:5173", // Use env.CLIENT_URL
    credentials: true,
  }));

  // Configure and get the middleware instances using the factory functions and the 'env' object
  const { uploadPhoto } = configureProfileMulter(env); // Call profileMulter factory with env
  const uploadProduct = configureProductMulter(env); // Call productMulter factory with env
  const uploadAds = configureAdsMulter(env); // Call adsMulter factory with env


  // API Routes
  // Mount refactored profile routes, passing the configured uploadPhoto middleware
  app.use("/api", createProfileRoutes(uploadPhoto)); // Call profileRoutes factory, passing uploadPhoto


  // Mount other routes. If they use Multer middleware, they will also need refactoring
  // similar to profileRoutes.js to accept the middleware as an argument.
  app.use("/api/ads", adRoutes); // *** If adRoutes uses uploadAds, refactor and pass uploadAds here ***
  app.use("/api/invitecodes", inviteCodeRoutes);
  app.use("/api/products", productRoutes); // *** If productRoutes uses uploadProduct, refactor and pass uploadProduct here ***
  app.use("/api/orders", orderRoutes);
  app.use("/api/messages", messageRoutes);

  app.use("/api/superadmin", superAdminRoutes);
  app.use("/api/admin/logs", adminLogsRoutes);
  app.use("/api/superadmin/users", superadminUserRoutes);
  app.use("/api/superadmin/orders", superadminOrderRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use('/api/predictions', predictionRoutes);
  app.use('/api/reports', reportRoutes);
  app.use("/api/chatbot", chatbotRoutes);
  app.use("/api", feedbackRoutes);
  app.use('/api/bespoke-orders', bespokeOrderRoutes);
  app.use('/api/measurementConfig', measurementConfigRoute);
  app.use("/api/admin", adminRoutes);


  // 404 Handler
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));

  // Error Handler
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app; // Export the configured app instance
};

// Remove the old CommonJS export:
// module.exports = app;

// Remove the dev server/websocket/etc. startup code
// if (process.env.NODE_ENV !== 'production') { ... }
