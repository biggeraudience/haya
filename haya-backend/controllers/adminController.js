const asyncHandler = require("express-async-handler");
const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// Register Admin (invite code verification handled separately)
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists");
  }
  const admin = await Admin.create({ name, email, password });
  if (admin) {
    const { accessToken, refreshToken } = generateToken(admin._id, "admin");
    // Clear cookies for other roles
    res.clearCookie("userAccessToken");
    res.clearCookie("userRefreshToken");
    res.clearCookie("superadminAccessToken");
    res.clearCookie("superadminRefreshToken");
    // Set admin-specific cookies
    res.cookie("adminAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isApproved: admin.isApproved,
      accessToken,
      refreshToken,
      profileImage: admin.profileImage
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && (await admin.matchPassword(password))) {
    if (!admin.isApproved) {
      res.status(403);
      throw new Error("Admin not approved yet");
    }
    const { accessToken, refreshToken } = generateToken(admin._id, "admin");
    // Clear cookies for other roles
    res.clearCookie("userAccessToken");
    res.clearCookie("userRefreshToken");
    res.clearCookie("superadminAccessToken");
    res.clearCookie("superadminRefreshToken");
    // Set admin-specific cookies
    res.cookie("adminAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.cookie("adminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isApproved: admin.isApproved,
      accessToken,
      refreshToken,
      profileImage: admin.profileImage
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Get Admin Profile
const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id).select("-password");
  if (admin) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isApproved: admin.isApproved,
      profileImage: admin.profileImage
    });
  } else {
    res.status(404);
    throw new Error("Admin not found");
  }
});

// Update Admin Profile
const updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);
  if (admin) {
    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    if (req.body.password) {
      admin.password = req.body.password;
    }
    const updatedAdmin = await admin.save();
    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      isApproved: updatedAdmin.isApproved,
      profileImage: updatedAdmin.profileImage
    });
  } else {
    res.status(404);
    throw new Error("Admin not found");
  }
});

// Delete Admin (for superadmin usage)
const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (admin) {
    await admin.remove();
    res.json({ message: "Admin deleted" });
  } else {
    res.status(404);
    throw new Error("Admin not found");
  }
});

// Get all admins (for superadmin view)
const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await Admin.find().select("-password");
  const adminsWithRole = admins.map((admin) => ({
    _id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isApproved: admin.isApproved,
    profileImage: admin.profileImage
  }));
  res.json(adminsWithRole);
});

// Approve Admin
const approveAdmin = asyncHandler(async (req, res) => {
  console.log("Approving admin with ID:", req.params.id);
  const admin = await Admin.findById(req.params.id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }
  admin.isApproved = true;
  const updatedAdmin = await admin.save();
  res.json({
    _id: updatedAdmin._id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
    role: updatedAdmin.role,
    isApproved: updatedAdmin.isApproved,
    profileImage: updatedAdmin.profileImage
  });
});

module.exports = { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile, 
  updateAdminProfile, 
  deleteAdmin, 
  getAllAdmins,
  approveAdmin 
};
