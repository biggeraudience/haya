const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  // Check for token in Authorization header first.
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies) {
    // Check cookies in a prioritized order:
    if (req.cookies.adminAccessToken) {
      token = req.cookies.adminAccessToken;
    } else if (req.cookies.superadminAccessToken) {
      token = req.cookies.superadminAccessToken;
    } else if (req.cookies.userAccessToken) {
      token = req.cookies.userAccessToken;
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded; // decoded contains id and role
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Admin access only");
  }
};

const superadminOnly = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(403);
    throw new Error("Superadmin access only");
  }
};

const autoGenerateToken = asyncHandler(async (req, res, next) => {
  // Prefer token from req.user.id; fallback to req.body._id if needed.
  let userId = req.body._id || req.user?.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required for token generation" });
  }
  try {
    let user;
    if (req.user && req.user.role === "superadmin") {
      const SuperAdmin = require("../models/SuperAdmin");
      user = await SuperAdmin.findById(userId);
    } else if (req.user && req.user.role === "admin") {
      const Admin = require("../models/Admin");
      user = await Admin.findById(userId);
    } else {
      const User = require("../models/userModel");
      user = await User.findById(userId);
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { accessToken } = require("../utils/generateToken")(user._id, user.role);
    // Set the proper cookie name based on role:
    let cookieName = "userAccessToken";
    if (user.role === "admin") cookieName = "adminAccessToken";
    else if (user.role === "superadmin") cookieName = "superadminAccessToken";
    
    res.cookie(cookieName, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 3600000, // 1 hour
    });
    req.accessToken = accessToken;
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to generate token", error: error.message });
  }
});


module.exports = { protect, adminOnly, superadminOnly, autoGenerateToken };
