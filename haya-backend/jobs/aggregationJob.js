// backend/jobs/aggregationJob.js
const cron = require("node-cron");
const aggregationService = require("../services/aggregationService");
const logger = require("../utils/logger");
const { broadcastAnalyticsEvent } = require("../services/realtimeService");
const ReportService = require("../services/reportService");


// Schedule an aggregation job to run every hour
cron.schedule("0 * * * *", async () => {
  try {
    logger.info("Starting hourly aggregation job");
    // Run the hourly aggregation logic
    await aggregationService.runHourlyAggregations();
    logger.info("Hourly aggregation job completed");

    // Generate the daily report
    const report = await ReportService.generateDailyReport();
    logger.info("Daily report generated: " + JSON.stringify(report));

    // Check a threshold (e.g., total revenue below 1000) and broadcast an alert if needed
    if (report.totalRevenue < 1000) {
      broadcastAnalyticsEvent({ alert: "Revenue below threshold!", report });
      logger.info("Alert broadcast: Revenue below threshold!");
      await sendRevenueAlert(report);
    }
  } catch (err) {
    logger.error("Hourly aggregation job failed: " + err);
  }
});
