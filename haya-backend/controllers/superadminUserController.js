// controllers/superadminUserController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// Get all users (for superadmin dashboard)
// This function returns all users except for the password field.
const getAllUsersForSuperadmin = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

module.exports = { getAllUsersForSuperadmin };
