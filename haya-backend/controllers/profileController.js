const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");



// Handle Profile Photo Upload
const uploadProfilePhotoController = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update the user's profile image using the Cloudinary URL from multer
  user.profileImage = req.file.path; 
  await user.save();

  res.json({ message: "Profile photo updated", profileImage: user.profileImage });
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({ name, email, password });
  if (user) {
    const { accessToken, refreshToken } = generateToken(user.id, user.role);
    // Clear any admin/superadmin cookies
    res.clearCookie("adminAccessToken");
    res.clearCookie("adminRefreshToken");
    res.clearCookie("superadminAccessToken");
    res.clearCookie("superadminRefreshToken");
    // Set user-specific cookies
    res.cookie("userAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.cookie("userRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const { accessToken, refreshToken } = generateToken(user.id, user.role);
    // Clear any admin/superadmin cookies
    res.clearCookie("adminAccessToken");
    res.clearCookie("adminRefreshToken");
    res.clearCookie("superadminAccessToken");
    res.clearCookie("superadminRefreshToken");
    // Set user-specific cookies
    res.cookie("userAccessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.cookie("userRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("userAccessToken");
  res.clearCookie("userRefreshToken");
  res.json({ message: "Logged out successfully" });
});

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      profile: {
        personalInfo: user.profile.personalInfo || {},
        address: user.profile.address || {},
        cards: user.profile.cards || []
      }
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Get User Profile




// Refresh Token
const refreshToken = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies.userRefreshToken;
  if (!tokenFromCookie) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(tokenFromCookie, process.env.JWT_SECRET);
    const User = require("../models/userModel");
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    const newAccessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.cookie("userAccessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});



// Update Profile (Personal Information)
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.profileImage !== undefined) {
      user.profileImage = req.body.profileImage;
    }
    if (req.body.password) {
      user.password = req.body.password;
    }
    user.profile = user.profile || {};
    user.profile.personalInfo = {
      firstName: req.body.firstName || (user.profile.personalInfo && user.profile.personalInfo.firstName) || "",
      lastName: req.body.lastName || (user.profile.personalInfo && user.profile.personalInfo.lastName) || "",
      email: req.body.email || (user.profile.personalInfo && user.profile.personalInfo.email) || "",
      phone: req.body.phone || (user.profile.personalInfo && user.profile.personalInfo.phone) || "",
    };
    const updatedUser = await user.save();
    const updatedUserObj = updatedUser.toObject();
    delete updatedUserObj.password;
    res.json({ ...updatedUserObj, isLoggedIn: true });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


// GET Address (New endpoint)
const getUserAddress = asyncHandler(async (req, res) => {
  // We use req.user.id rather than req.params.userId to secure the endpoint.
  const user = await User.findById(req.user.id);
  if (user && user.profile && user.profile.address && Object.keys(user.profile.address).length) {
    res.json(user.profile.address);
  } else {
    res.status(404);
    throw new Error("Address not found");
  }
});

// Update Address Controller
const updateUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.profile = user.profile || {};
    user.profile.address = {
      street: req.body.street || "",
      city: req.body.city || "",
      state: req.body.state || "",
      zip: req.body.zip || "",
    };
    await user.save();
    res.json(user.profile.address);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Delete Address Controller
const deleteUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    if (user.profile) {
      user.profile.address = {};
      await user.save();
      res.json({ message: "Address deleted" });
    } else {
      res.status(404);
      throw new Error("Address not found");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Update Cards Controller
const updateUserCards = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.profile = user.profile || {};
    user.profile.cards = [req.body]; // Update with the incoming card data
    await user.save();
    res.json(user.profile.cards);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Delete Profile
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteAllUsers = asyncHandler(async (req, res) => {
  await User.deleteMany({});
  res.json({ message: "All users deleted successfully" });
});

// Get All Users (Admin Route)
const getAllUsers = asyncHandler(async (req, res) => {
  // Removed production check to allow access in development mode
  const users = await User.find().select("-password");
  res.json(users);
});


module.exports = { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserProfile, 
  updateUserProfile, 
  deleteUserProfile, 
  refreshToken,
  getUserAddress,
  updateUserAddress,
  deleteUserAddress,
  updateUserCards,
  getAllUsers,
  deleteAllUsers,
  uploadProfilePhotoController,
};
