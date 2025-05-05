const asyncHandler = require("express-async-handler");
const SuperAdmin = require("../models/SuperAdmin");
const generateToken = require("../utils/generateToken");

// Register Superadmin
const registerSuperAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const superAdminExists = await SuperAdmin.findOne({ email });
  if (superAdminExists) {
    res.status(400);
    throw new Error("Superadmin already exists");
  }
  const superAdmin = await SuperAdmin.create({ name, email, password });
  if (superAdmin) {
    const { accessToken, refreshToken } = generateToken(superAdmin._id, "superadmin");
    // Clear other role cookies
    res.clearCookie("userAccessToken");
    res.clearCookie("userRefreshToken");
    res.clearCookie("adminAccessToken");
    res.clearCookie("adminRefreshToken");
    // Set superadmin-specific cookies
    res.cookie("superadminAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development", // adjust as needed
      sameSite: "None",
      maxAge: 3600000,
    });
    res.cookie("superadminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "None",
      maxAge: 604800000,
    });
    res.status(201).json({
      _id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role,
      accessToken,
      refreshToken,
      profileImage: superAdmin.profileImage
    });
  } else {
    res.status(400);
    throw new Error("Invalid superadmin data");
  }
});

// Login Superadmin
const loginSuperAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const superAdmin = await SuperAdmin.findOne({ email });
  if (superAdmin && (await superAdmin.matchPassword(password))) {
    const { accessToken, refreshToken } = generateToken(superAdmin._id, "superadmin");
    console.log("Logging in as role:", "superadmin");
    // Clear other role cookies
    res.clearCookie("userAccessToken");
    res.clearCookie("userRefreshToken");
    res.clearCookie("adminAccessToken");
    res.clearCookie("adminRefreshToken");
    // Set superadmin-specific cookies
    res.cookie("superadminAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "None",
      maxAge: 3600000,
    });
    res.cookie("superadminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "None",
      maxAge: 604800000,
    });
    res.json({
      _id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role,
      accessToken,
      refreshToken,
      profileImage: superAdmin.profileImage
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutSuperAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("superadminAccessToken");
  res.clearCookie("superadminRefreshToken");
  res.json({ message: "Superadmin logged out successfully" });
});

// Get Superadmin Profile
const getSuperAdminProfile = asyncHandler(async (req, res) => {
  const superAdmin = await SuperAdmin.findById(req.user.id).select("-password");
  if (superAdmin) {
    res.json({
      _id: superAdmin._id,
      name: superAdmin.name,
      email: superAdmin.email,
      role: superAdmin.role,
      profileImage: superAdmin.profileImage
    });
  } else {
    res.status(404);
    throw new Error("Superadmin not found");
  }
});

// Update Superadmin Profile
const updateSuperAdminProfile = asyncHandler(async (req, res) => {
  const superAdmin = await SuperAdmin.findById(req.user.id);
  if (superAdmin) {
    superAdmin.name = req.body.name || superAdmin.name;
    superAdmin.email = req.body.email || superAdmin.email;
    if (req.body.password) {
      superAdmin.password = req.body.password;
    }
    const updatedSuperAdmin = await superAdmin.save();
    res.json({
      _id: updatedSuperAdmin._id,
      name: updatedSuperAdmin.name,
      email: updatedSuperAdmin.email,
      role: updatedSuperAdmin.role,
      profileImage: updatedSuperAdmin.profileImage
    });
  } else {
    res.status(404);
    throw new Error("Superadmin not found");
  }
});

module.exports = { 
  registerSuperAdmin, 
  loginSuperAdmin, 
  getSuperAdminProfile, 
  updateSuperAdminProfile, 
  logoutSuperAdmin 
};
