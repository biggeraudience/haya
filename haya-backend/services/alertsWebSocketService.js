// backend/services/alertsWebSocketService.js
const WebSocket = require('ws');

let wssAlerts;

function setupAlertsWebSocketServer(server) {
  wssAlerts = new WebSocket.Server({ server, path: '/alerts' });
  wssAlerts.on('connection', (ws) => {
    console.log('🔌 Alerts WebSocket client connected.');
    ws.on('close', () => console.log('🔌 Alerts WebSocket client disconnected.'));
  });
  console.log('🔌 Alerts WebSocket server running on /alerts');
}

function broadcastAlert(data) {
  if (!wssAlerts) {
    console.warn('No Alerts WebSocket server instance to broadcast to!');
    return;
  }
  wssAlerts.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

module.exports = { setupAlertsWebSocketServer, broadcastAlert };
