// ../haya-backend/models/eventModel.js

const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  details: { type: Object, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  timestamp: { type: Date, default: Date.now },
  ip: { type: String },           // Client IP address
  userAgent: { type: String },        // Browser/device info
  sessionId: { type: String },        // Unique session identifier
  referrer: { type: String }         // Referrer URL
});

// Use the standard mongoose.model() call directly.
// Mongoose internally manages the model registry and prevents OverwriteModelError
// when accessing an already defined model.
const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
