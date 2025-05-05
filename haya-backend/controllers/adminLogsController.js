const asyncHandler = require("express-async-handler");

const getAdminActivityLogs = asyncHandler(async (req, res) => {
  const adminId = req.params.id;
  // Replace this dummy data with a real query from your logs collection.
  const logs = [
    { type: "LOGIN", timestamp: new Date(), message: "Logged in successfully" },
    { type: "PRODUCT_CREATE", timestamp: new Date(), message: "Created product 'Widget A'" },
    { type: "PRODUCT_UPDATE", timestamp: new Date(), message: "Updated product 'Gadget B'" },
    { type: "LOGOUT", timestamp: new Date(), message: "Logged out" },
  ];
  res.json({ adminId, logs });
});

module.exports = { getAdminActivityLogs };
