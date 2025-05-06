// ~/haya-backend/server.js

// Pure Express app factory for Cloudflare Workers
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Import your middleware factories
import configureProfileMulter from './middlewares/profileMulter.js';
import configureMulter from './middlewares/multer.js';
import configureUpload from './middlewares/upload.js';

// Import routes (refactor to factories if they need multer)
import createProfileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adRoutes from "./routes/adRoutes.js";
import inviteCodeRoutes from "./routes/inviteCodeRoutes.js";
import adminLogsRoutes from "./routes/adminLogsRoutes.js";
import superadminUserRoutes from "./routes/superadminUserRoutes.js";
import superadminOrderRoutes from "./routes/superadminOrderRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import predictionRoutes from './routes/predictionRoutes.js';
import reportRoutes from "./routes/reportRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import measurementConfigRoute from './routes/measurementConfigRoute.js';
import bespokeOrderRoutes from "./routes/bespokeOrderRoutes.js";

// Export a factory that receives env and returns an Express app
export default function createApp(env) {
  // Connect to MongoDB
  mongoose.connect(env.MONGODB_URI, {
    // any options as needed
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  });

  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }));

  // Instantiate Multer-based middleware with env
  const { uploadPhoto } = configureProfileMulter(env);
  const uploadProduct = configureMulter(env);
  const uploadAds = configureUpload(env);

  // Mount routes
  app.use("/api/profile", createProfileRoutes(uploadPhoto));
  app.use("/api/ads", adRoutes);
  app.use("/api/invitecodes", inviteCodeRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/messages", messageRoutes);

  app.use("/api/admin", adminRoutes);
  app.use("/api/admin/logs", adminLogsRoutes);
  app.use("/api/superadmin", superAdminRoutes);
  app.use("/api/superadmin/users", superadminUserRoutes);
  app.use("/api/superadmin/orders", superadminOrderRoutes);

  app.use("/api/analytics", analyticsRoutes);
  app.use('/api/predictions', predictionRoutes);
  app.use('/api/reports', reportRoutes);
  app.use("/api/chatbot", chatbotRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use('/api/bespoke-orders', bespokeOrderRoutes);
  app.use('/api/measurementConfig', measurementConfigRoute);

  // 404
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));

  // Error handler
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  return app;
}
