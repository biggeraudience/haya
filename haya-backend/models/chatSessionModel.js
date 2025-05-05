const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "bot"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [ChatMessageSchema],
  createdAt: { type: Date, default: Date.now },
});

const ChatSession = mongoose.models.ChatSession || mongoose.model("ChatSession", ChatSessionSchema);

module.exports = ChatSession;
