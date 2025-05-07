// ../haya-backend/routes/profileRoutes.js

const express = require("express");

export default (uploadPhoto) => {
  const router = express.Router();

  const {
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
  } = require("../controllers/profileController");
  const { protect, autoGenerateToken, adminOnly } = require("../middlewares/authMiddleware");


  // Authentication routes
  router.post("/auth/register", registerUser);
  router.post("/auth/login", loginUser);
  router.post("/auth/logout", logoutUser);
  router.post("/auth/refresh-token", refreshToken);

  // User profile routes
  router.get("/auth/profile", protect, autoGenerateToken, getUserProfile);
  router.put("/auth/profile", protect, autoGenerateToken, updateUserProfile);
  router.delete("/auth/profile", protect, autoGenerateToken, deleteUserProfile);

  // Profile photo upload route - USE the uploadPhoto passed as an argument
  router.put(
    "/auth/profile/photo",
    protect,
    autoGenerateToken,
    uploadPhoto.single("profilePhoto"),
    uploadProfilePhotoController
  );

  // Address routes
  router.get("/user/addresses/:userId", protect, autoGenerateToken, getUserAddress);
  router.put("/user/addresses/:userId", protect, autoGenerateToken, updateUserAddress);
  router.delete("/user/addresses/:userId", protect, autoGenerateToken, deleteUserAddress);

  // Cards route
  router.put("/profile/cards", protect, autoGenerateToken, updateUserCards);

  // *** New route for fetching all users (Admin-only) ***
  router.get("/users", protect, adminOnly, getAllUsers);


  let wss;
  if (!isCloudflareWorker()) { // Conditional check is now irrelevant as block is removed
    // const { Server: WebSocketServer } = require("ws"); // <--- THIS LINE IS DELETED
    wss = new WebSocketServer({ port: 3000 });

    wss.on("connection", (ws) => {
      console.log("WebSocket client connected");
      // ... WebSocket server logic ...
    });

    console.log("WebSocket server running on ws://localhost:3000");
  } else { // This else block is also removed
    console.log("⚡️ Skipping WebSocket.Server setup in Worker");
  }

  return router;
};
