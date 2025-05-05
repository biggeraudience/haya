// src/hooks/useAlerts.js
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const useAlerts = () => {
  useEffect(() => {
    // Connect to the dedicated alerts WebSocket endpoint
    const ws = new WebSocket('ws://localhost:5000/alerts');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.alert) {
          toast.error(`Alert: ${data.alert}`);
        }
      } catch (error) {
        console.error('Error processing alert message:', error);
      }
    };

    ws.onerror = (error) => console.error('Alerts WebSocket error:', error);
    return () => ws.close();
  }, []);
};
