import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);

// Create WebSocket server and attach it to the existing HTTP server
const wss = new WebSocketServer({
  server,  // Pass the existing HTTP server here
  verifyClient: (info, done) => {
    if (info.origin === 'http://localhost:5174') {
      done(true);
    } else {
      done(false, 403, 'Forbidden');
    }
  },
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Broadcast to all clients when a message is received
wss.on('connection', (ws) => {
  console.log('A new client connected');
  
  ws.on('message', (message) => {
    console.log('received: %s', message);
    // Broadcast the message to all clients except the sender
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  });

  // Send a welcome message to the newly connected client
  ws.send('Hello Client!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
