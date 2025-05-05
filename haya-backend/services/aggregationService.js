const Event = require("../models/eventModel");

/**
 * Runs an hourly aggregation pipeline to compute metrics.
 * This is a sample aggregation for PAGE_VIEW events.
 */
async function runHourlyAggregations() {
  const results = await Event.aggregate([
    { $match: { eventType: "PAGE_VIEW" } },
    {
      $group: {
        _id: { $hour: "$timestamp" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  console.log("Hourly aggregation results:", results);
  // Optionally, save results to a separate collection for caching
  return results;
}

module.exports = { runHourlyAggregations };
