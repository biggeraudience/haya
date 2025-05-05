// feedbackRoutes.js
const express = require("express");
const router = express.Router();

router.post("/feedback", async (req, res) => {
  // Save feedback to your database for later analysis and retraining
  const feedback = req.body;
  // TODO: Insert your feedback processing logic here (e.g., save to a DB)
  res.json({ message: "Feedback received, thanks!" });
});

module.exports = router;
