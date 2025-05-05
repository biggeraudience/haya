const express = require("express");
const router = express.Router();
const { processChatQuery } = require("../controllers/chatbotController");

// Endpoint to receive chat queries.
router.post("/ask", processChatQuery);

module.exports = router;
