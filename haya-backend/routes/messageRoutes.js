const express = require("express");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws");
const User = require("../models/userModel");

const { protect, autoGenerateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

// Mongoose Message Model
// In routes/messageRoutes.js (or wherever you define your schema)
const messageSchema = new mongoose.Schema({
  subject: { type: String },
  body: { type: String, required: true },
  type: { type: String, enum: ["notification", "chat"], default: "notification" },
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  scheduleTime: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Added sender details for easy rendering on the frontend:
  senderName: { type: String },
  senderEmail: { type: String },
  senderProfileImage: { type: String },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});


const Message = mongoose.model("Message", messageSchema);

/**
 * POST /api/messages
 * Create a new message (by userId).
 */
router.post(
  "/",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const { subject, body, type, userId, senderId, recipients } = req.body;
    if (!userId) {
      res.status(400);
      throw new Error("Recipient userId is required");
    }
    const newMessage = new Message({
      subject,
      body,
      type: type || "notification",
      userId,
      senderId: senderId || req.user.id,
      recipients: recipients || []
    });
    const createdMessage = await newMessage.save();
    res.status(201).json(createdMessage);
  })
);

/**
 * POST /api/messages/admin
 * ADMIN endpoint to create a new message by recipient email.
 */
// POST /api/messages/admin – admin sends a message by recipient email
router
  .route("/admin")
  // GET: Fetch all messages related to the admin (sent or received)
  .get(
    protect,
    autoGenerateToken,
    asyncHandler(async (req, res) => {
      const adminId = req.user.id;
      const messages = await Message.find({
        $or: [{ senderId: adminId }, { userId: adminId }],
      })
        .sort({ timestamp: -1 })
        .populate("userId", "name email profileImage")
        .populate("senderId", "name email profileImage");
      res.json(messages);
    })
  )
  // POST: Admin sends a message by recipient email.
  .post(
    protect,
    autoGenerateToken,
    asyncHandler(async (req, res) => {
      const { subject, body, recipientEmail } = req.body;

      if (!recipientEmail) {
        res.status(400);
        throw new Error("Recipient email is required");
      }

      const normalizedEmail = recipientEmail.trim().toLowerCase();
      const recipientUser = await User.findOne({ email: normalizedEmail });

      if (!recipientUser) {
        res.status(404);
        throw new Error("User not found");
      }

      const newMessage = new Message({
        subject,
        body,
        type: "notification",
        userId: recipientUser._id, // Receiver's ObjectId
        senderId: req.user.id, // Admin's id should be set here
        senderName: req.user.name,
        senderEmail: req.user.email,
        senderProfileImage: req.user.profileImage,
      });

      const createdMessage = await newMessage.save();
      res.status(201).json(createdMessage);
    })
  );






/**
 * POST /api/messages/multiple-by-email
 * Create messages for multiple recipients by their email addresses.
 */
router.post(
  "/multiple-by-email",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const { subject, body, type, recipients } = req.body;
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      res.status(400);
      throw new Error("At least one recipient email is required");
    }
    const messagesToCreate = [];
    for (const email of recipients) {
      const user = await User.findOne({ email });
      if (user) {
        messagesToCreate.push({
          subject,
          body,
          type: type || "notification",
          userId: user._id,
          senderId: req.user.id,
        });
      }
    }
    if (messagesToCreate.length === 0) {
      res.status(404);
      throw new Error("No valid recipient users found");
    }
    const createdMessages = await Message.insertMany(messagesToCreate);
    res.status(201).json(createdMessages);
  })
);

/**
 * POST /api/messages/schedule/admin
 * ADMIN endpoint to schedule a message by recipient email.
 */
router.post(
  "/schedule/admin",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const { subject, body, scheduleTime, recipientEmail } = req.body;
    if (!recipientEmail || !scheduleTime) {
      res.status(400);
      throw new Error("Recipient email and schedule time are required");
    }
    const normalizedEmail = recipientEmail.trim().toLowerCase();
    const recipientUser = await User.findOne({
      email: normalizedEmail
    });
    
    
    if (!recipientUser) {
      res.status(404);
      throw new Error("User not found");
    }
    const newMessage = new Message({
      subject,
      body,
      type: "notification",
      userId: recipientUser._id,
      senderId: req.user.id,
      scheduleTime,
    });
    const createdMessage = await newMessage.save();
    res.status(201).json(createdMessage);
  })
);

/**
 * POST /api/messages/schedule
 * Schedule a message for the logged-in user.
 */
router.post(
  "/schedule",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const { subject, body, scheduleTime, userId, label } = req.body;
    if (!scheduleTime) {
      res.status(400);
      throw new Error("Schedule time is required");
    }
    const newMessage = new Message({
      subject,
      body,
      type: "notification",
      userId: userId || req.user.id,
      senderId: req.user.id,
      scheduleTime,
    });
    const createdMessage = await newMessage.save();
    res.status(201).json(createdMessage);
  })
);

/**
 * POST /api/messages/multiple
 * Create messages for multiple recipients by userId.
 */
router.post(
  "/multiple",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const { subject, body, type, recipients } = req.body;
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      res.status(400);
      throw new Error("At least one recipient is required");
    }
    const messagesToCreate = recipients.map((recipientId) => ({
      subject,
      body,
      type: type || "notification",
      userId: recipientId,
      senderId: req.user.id,
    }));
    const createdMessages = await Message.insertMany(messagesToCreate);
    res.status(201).json(createdMessages);
  })
);

/**
 * GET /api/messages/admin
 * ADMIN endpoint to fetch all messages related to the admin (sent or received).
 */
router.get(
  "/admin",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const adminId = req.user.id;
    const messages = await Message.find({
      $or: [{ senderId: adminId }, { userId: adminId }],
    }).sort({ timestamp: -1 });
    res.json(messages);
  })
);

/**
 * GET /api/messages
 * Fetch messages for the authenticated user.
 * Optional query parameter: ?type=notification or ?type=chat to filter.
 */
router.get(
  "/",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const { type } = req.query;
    const query = { userId: req.user.id };
    if (type) {
      query.type = type;
    }
    const messages = await Message.find(query).sort({ timestamp: -1 });
    res.json(messages);
  })
);

/**
 * GET /api/messages/:id
 * Fetch a single message by its ID.
 */
router.get(
  "/:id",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    if (message) {
      res.json(message);
    } else {
      res.status(404);
      throw new Error("Message not found");
    }
  })
);

/**
 * PUT /api/messages/:id
 * Update a message (e.g., mark as read).
 */
router.put(
  "/:id",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    if (message) {
      message.isRead = req.body.isRead !== undefined ? req.body.isRead : message.isRead;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404);
      throw new Error("Message not found");
    }
  })
);

/**
 * DELETE /api/messages/:id
 * Delete a message.
 */
router.delete(
  "/:id",
  protect,
  autoGenerateToken,
  asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);
    if (message) {
      await message.remove();
      res.json({ message: "Message removed" });
    } else {
      res.status(404);
      throw new Error("Message not found");
    }
  })
);

// ================================
// WebSocket Server for Real-time Chat
// ================================
const wss = new WebSocket.Server({ port: 3000 });

wss.on("connection", (ws, req) => {
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
        await chatMessage.save().catch(err =>
          console.error("Error saving chat message:", err)
        );
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
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

module.exports = router;
