const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { protect, autoGenerateToken } = require("../middlewares/authMiddleware");
const { isCloudflareWorker } = require("../utils/runtimeCheck");

const router = express.Router();

// Message Schema & Model (unchanged)…
const messageSchema = new mongoose.Schema({ /* … */ });
const Message = mongoose.model("Message", messageSchema);

// … your existing REST endpoints here …

// ------------------------------
// Real-time Chat (only in Node)
// ------------------------------
let wss;
if (!isCloudflareWorker()) {
  const { Server: WebSocketServer } = require("ws");
  wss = new WebSocketServer({ port: 3000 });

  wss.on("connection", (ws) => {
    console.log("WebSocket client connected");

    ws.on("message", async (data) => {
      try {
        const messageData = JSON.parse(data);
        if (messageData.type === "chat") {
          const chatMessage = new Message({
            subject:   messageData.subject || "",
            body:      messageData.text,
            type:      "chat",
            userId:    messageData.userId,
            senderId:  messageData.senderId || messageData.userId,
            timestamp: new Date(),
          });
          await chatMessage.save();

          // broadcast to all connected clients
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
} else {
  console.log("⚡️ Skipping WebSocket.Server setup in Worker");
}

module.exports = router;
