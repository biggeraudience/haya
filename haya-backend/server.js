// ../haya-backend/server.js

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import configureProfileMulter from "./middlewares/profileMulter.js";
import configureMulter        from "./middlewares/multer.js";
import configureUpload        from "./middlewares/upload.js"; // Assuming this is the middleware needed for bespoke orders

import createProfileRoutes      from "./routes/profileRoutes.js";
import adminRoutes              from "./routes/adminRoutes.js";
import superAdminRoutes         from "./routes/superAdminRoutes.js";
import productRoutesFactory      from "./routes/productRoutes.js"; // Renamed import to productRoutesFactory for clarity
import orderRoutes              from "./routes/orderRoutes.js";
import messageRoutes            from "./routes/messageRoutes.js";
import adRoutes                 from "./routes/adRoutes.js"; // Check if adRoutes needs refactoring
import inviteCodeRoutes         from "./routes/inviteCodeRoutes.js";
import adminLogsRoutes          from "./routes/adminLogsRoutes.js";
import superadminUserRoutes     from "./routes/superadminUserRoutes.js";
import superadminOrderRoutes    from "./routes/superadminOrderRoutes.js";
import analyticsRoutes          from "./routes/analyticsRoutes.js";
import predictionRoutes         from "./routes/predictionRoutes.js";
import reportRoutes             from "./routes/reportRoutes.js";
import chatbotRoutes            from "./routes/chatbotRoutes.js";
import feedbackRoutes           from "./routes/feedbackRoutes.js";
import measurementConfigRoute   from "./routes/measurementConfigRoute.js";
import createBespokeOrderRoutes  from "./routes/bespokeOrderRoutes.js"; // Import the refactored route factory


// Export an async factory
export default async function createApp(env) {
  // Connect to MongoDB once
  try {
    await mongoose.connect(env.MONGODB_URI, {});
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    // Consider exiting or handling this critical error appropriately
    // For a Worker, this might throw an unhandled exception if not caught later.
    // Adding a re-throw might be useful for debugging Pages build logs.
    throw error;
  }


  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

  // Instantiate Multer middleware with runtime env
  const { uploadPhoto } = configureProfileMulter(env);
  const uploadProduct   = configureMulter(env);
  const uploadAds       = configureUpload(env); // Assuming this is the middleware needed for bespoke orders


  // Mount routes, calling route factories for Multer-using routes
  app.use("/api/profile", createProfileRoutes(uploadPhoto));
  app.use("/api/ads", adRoutes); // Check if adRoutes needs refactoring
  app.use("/api/invitecodes", inviteCodeRoutes);
  app.use("/api/products", productRoutesFactory(uploadProduct)); // <-- CORRECTED: CALL THE FACTORY
  app.use("/api/orders", orderRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/admin/logs", adminLogsRoutes);
  app.use("/api/superadmin", superAdminRoutes);
  app.use("/api/superadmin/users", superadminUserRoutes);
  app.use("/api/superadmin/orders", superadminOrderRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/predictions", predictionRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/chatbot", chatbotRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/bespoke-orders", createBespokeOrderRoutes(uploadAds)); // Call the bespoke route factory, passing the middleware
  app.use("/api/measurementConfig", measurementConfigRoute);


  // 404 handler
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));

  // Global error handler
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    // Check if headers have already been sent before trying to send a response
    if (res.headersSent) {
        return next(err); // Delegate to default error handler if headers sent
    }
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
  });

  return app;
                  }
