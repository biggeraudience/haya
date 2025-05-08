// ~/haya-backend/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import configureProfileMulter from "./middlewares/profileMulter.js";
import configureMulter        from "./middlewares/multer.js";
import configureUpload        from "./middlewares/upload.js";

import createProfileRoutes      from "./routes/profileRoutes.js";
import adminRoutes              from "./routes/adminRoutes.js";
import superAdminRoutes         from "./routes/superAdminRoutes.js";
import productRoutesFactory     from "./routes/productRoutes.js";
import orderRoutes              from "./routes/orderRoutes.js";
import messageRoutes            from "./routes/messageRoutes.js";
import adRoutes                 from "./routes/adRoutes.js";
import inviteCodeRoutes         from "./routes/inviteCodeRoutes.js";
import adminLogsRoutes          from "./routes/adminLogsRoutes.js";
import superadminUserRoutes     from "./routes/superadminUserRoutes.js";
import superadminOrderRoutes    from "./routes/superadminOrderRoutes.js";
import analyticsRoutes          from "./routes/analyticsRoutes.js";
import predictionRoutes         from "./routes/predictionRoutes.js";
import reportRoutes             from "./routes/reportRoutes.js";
import chatbotRoutes            from "./routes/chatbotRoutes.js";
import feedbackRoutes           from "./routes/feedbackRoutes.js";
import measurementConfigRoute   from "./routes/measurementConfigRoute.js";
import createBespokeOrderRoutes from "./routes/bespokeOrderRoutes.js";

export default function createApp(env) {
  const app = express();

  // 1) Core middleware
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

  // 2) Tiny Atlas Data API client on every req
  app.use((req, res, next) => {
    const {
      MONGODB_DATA_API_URL,
      MONGODB_DATA_API_KEY,
      MONGODB_DB_NAME,
      MONGODB_DATA_SOURCE,
    } = env;

    req.db = {
      call: async (action, body = {}) => {
        const resp = await fetch(
          `${MONGODB_DATA_API_URL}/action/${action}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "api-key": MONGODB_DATA_API_KEY,
            },
            body: JSON.stringify({
              dataSource:   MONGODB_DATA_SOURCE,
              database:     MONGODB_DB_NAME,
              ...body,
            }),
          }
        );
        return resp.json();
      },
    };
    next();
  });

  // 3) Multer wiring
  const { uploadPhoto } = configureProfileMulter(env);
  const uploadProduct   = configureMulter(env);
  const uploadAds       = configureUpload(env);

  // 4) All your routes, identical to before
  app.use("/api/profile", createProfileRoutes(uploadPhoto));
  app.use("/api/ads", adRoutes);
  app.use("/api/invitecodes", inviteCodeRoutes);
  app.use("/api/products", productRoutesFactory(uploadProduct));
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
  app.use("/api/bespoke-orders", createBespokeOrderRoutes(uploadAds));
  app.use("/api/measurementConfig", measurementConfigRoute);

  // 5) 404 & global error handler
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));
  app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
  });

  return app;
}
