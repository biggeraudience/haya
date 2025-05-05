const asyncHandler = require("express-async-handler");
const InviteCode = require("../models/InviteCode");
const crypto = require("crypto");

// Create a new invite code (Superadmin only)
const createInviteCode = asyncHandler(async (req, res) => {
  const { expiresInHours } = req.body; // Defaults to 24 hours if not provided
  // req.user is attached by the protect middleware, which should be a superadmin here
  const createdBy = req.user.id;
  const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + (expiresInHours || 24));

  const newCode = await InviteCode.create({
    code: inviteCode,
    expiresAt: expiration,
    createdBy,
    used: false,
  });
  res.status(201).json(newCode);
});

// Get all invite codes (Superadmin only)
const getInviteCodes = asyncHandler(async (req, res) => {
  // Optionally, populate createdBy field to show superadmin details
  const codes = await InviteCode.find().populate("createdBy", "name email");
  res.json(codes);
});

// Update an invite code with admin details (when an admin uses the code)
const updateInviteCodeWithAdmin = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Expected fields in req.body:
  // usedBy, adminEmail, adminName, brand, departments, dateJoined, role
  const updateData = req.body;
  updateData.used = true; // Mark as used
  const updatedCode = await InviteCode.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedCode) {
    res.status(404);
    throw new Error("Invite code not found");
  }
  res.json(updatedCode);
});

// Delete an invite code by ID
const deleteInviteCode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const code = await InviteCode.findById(id);
  if (code) {
    await code.remove();
    res.json({ message: "Invite code deleted" });
  } else {
    res.status(404);
    throw new Error("Invite code not found");
  }
});

// Cleanup expired invite codes
const cleanupExpiredCodes = asyncHandler(async (req, res) => {
  const now = new Date();
  const result = await InviteCode.deleteMany({ expiresAt: { $lte: now } });
  res.json({ message: "Expired invite codes cleaned up", deletedCount: result.deletedCount });
});

module.exports = { 
  createInviteCode, 
  getInviteCodes, 
  updateInviteCodeWithAdmin, 
  deleteInviteCode, 
  cleanupExpiredCodes 
};
