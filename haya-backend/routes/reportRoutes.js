// backend/routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const { generateDailyReport } = require("../services/reportService");

router.get("/daily", async (req, res) => {
  try {
    const report = await generateDailyReport();
    res.json(report);
  } catch (err) {
    console.error("Error generating daily report:", err);
    res.status(500).json({ error: "Report generation failed" });
  }
});

module.exports = router;
