const Event = require("../models/eventModel");

exports.trackEvent = async (req, res) => {
  try {
    const { eventType, eventData, timestamp } = req.body;
    if (!eventType) {
      return res.status(400).json({ error: "Event type is required" });
    }
    const event = new Event({ eventType, eventData, timestamp });
    await event.save();
    res.status(201).json({ message: "Event tracked successfully" });
  } catch (error) {
    console.error("Error tracking event:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
