// realtimeAnalytics.js
const WebSocket = require('ws');

let wss; // WebSocket server instance

// Call this function to attach the WebSocket server to your HTTP server
function setupWebSocketServer(server) {
  wss = new WebSocket.Server({ server, path: '/analytics' });

  wss.on('connection', (ws) => {
    console.log('🔌 WebSocket client connected.');
    ws.on('close', () => console.log('🔌 WebSocket client disconnected.'));
  });

  console.log('🔌 WebSocket server running on /analytics');
}

// Function to broadcast events to all connected clients
function broadcastAnalyticsEvent(data) {
  if (!wss) {
    console.warn('No WebSocket server instance to broadcast to!');
    return;
  }
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { setupWebSocketServer, broadcastAnalyticsEvent };
