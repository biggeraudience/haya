// ../haya-backend/routes/messageRoutes.js

const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken"); // Assuming jwt is needed

const User = require("../models/userModel");
const { protect, autoGenerateToken } = require("../middlewares/authMiddleware");

const router = express.Router();


const messageSchema = new mongoose.Schema({
  subject: String,
  body: { type: String, required: true },
  type: { type: String, enum: ["notification", "chat"], default: "notification" },
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  scheduleTime: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  senderName: String,
  senderEmail: String,
  senderProfileImage: String,
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});
const Message = mongoose.model("Message", messageSchema);


let wss;
if (!isCloudflareWorker()) { // Conditional check is now irrelevant as block is removed
  const { Server: WebSocketServer } = require("ws"); // This is the problematic line
  wss = new WebSocketServer({ port: 3000 });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", async (data) => {
      try {
        const messageData = JSON.parse(data);
        if (messageData.type === "chat") {
          const chatMessage = new Message({
            subject: messageData.subject || "",
            body: messageData.text,
            type: "chat",
            userId: messageData.userId,
            senderId: messageData.senderId || messageData.userId,
            timestamp: new Date(),
          });
          await chatMessage.save();

          // broadcast to all connected clients (this logic is Node.js specific)
          wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify(messageData));
            }
          });
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  console.log("WebSocket server running on ws://localhost:3000");
} else { // This else block is also removed
  console.log("⚡️ Skipping WebSocket.Server setup in Worker");
}



module.exports = router; // Keep the standard Express router export
