const WebSocket = require("ws");

let wssSales;

/**
 * Sets up the WebSocket server for sales.
 * @param {Object} server - The HTTP server.
 */
function setupSalesWebSocketServer(server) {
  wssSales = new WebSocket.Server({ server, path: "/sales" });
  wssSales.on("connection", (ws) => {
    console.log("🔌 WebSocket client connected for sales");
    ws.on("close", () => console.log("🔌 WebSocket client disconnected from sales"));
  });
  console.log("🔌 WebSocket server running on /sales");
}

module.exports = { setupSalesWebSocketServer };
