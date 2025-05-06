// services/realtimeService.js

let WebSocket;
try {
  WebSocket = require("ws");
} catch {
  // we're in the Worker—skip loading ws
}

let wssAnalytics;

/**
 * Sets up the WebSocket server for analytics.
 * @param {Object} server - The HTTP server.
 */
function setupWebSocketServer(server) {
  if (!WebSocket) return;
  wssAnalytics = new WebSocket.Server({ server, path: "/analytics" });
  wssAnalytics.on("connection", (ws) => {
    console.log("🔌 WebSocket client connected for analytics");
    ws.on("close", () =>
      console.log("🔌 WebSocket client disconnected from analytics")
    );
  });
  console.log("🔌 WebSocket server running on /analytics");
}

/**
 * Broadcasts data to all connected analytics WebSocket clients.
 * @param {Object} data - The data to broadcast.
 */
function broadcastAnalyticsEvent(data) {
  if (!wssAnalytics) {
    console.warn("No WebSocket server instance for analytics");
    return;
  }
  wssAnalytics.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { setupWebSocketServer, broadcastAnalyticsEvent };
