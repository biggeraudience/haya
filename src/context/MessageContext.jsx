import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { useUser } from "./UserContext";

const MessageContext = createContext();

export const useMessageContext = () => useContext(MessageContext);

export const MessageProvider = ({ children }) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]); // Notifications and system messages
  const [chatMessages, setChatMessages] = useState([]);     // Real-time chat messages
  const [unreadCount, setUnreadCount] = useState(0);
  const wsRef = useRef(null);

  // Fetch notifications from the backend for the logged-in user
  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages?userId=${user._id}`, {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
          setUnreadCount(data.filter((msg) => !msg.isRead).length);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  // Set up a WebSocket connection for real-time chat and notifications
  useEffect(() => {
    if (!user) return;

    // Create the WebSocket connection
    const ws = new WebSocket("ws://localhost:3000");

    // Send a join message when the WebSocket connection is established
    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      ws.send(JSON.stringify({ type: "join", userId: user._id }));

      // Set an interval to send a ping every 30 seconds
      const interval = setInterval(() => {
        ws.send(JSON.stringify({ type: "ping" }));
      }, 30000); // Send ping every 30 seconds

      // Clear the interval when the WebSocket closes
      ws.onclose = () => clearInterval(interval);
    };

    // Handle incoming WebSocket messages
    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.type === "notification") {
          setNotifications((prev) => {
            // Prevent duplicate notifications
            if (!prev.some((notification) => notification._id === messageData._id)) {
              return [messageData, ...prev];
            }
            return prev;
          });
          if (!messageData.isRead) {
            setUnreadCount((prev) => prev + 1);
          }
        } else if (messageData.type === "chat") {
          setChatMessages((prev) => [...prev, messageData]);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    // Handle WebSocket errors
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle WebSocket closure
    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    wsRef.current = ws;

    // Cleanup the WebSocket connection and the ping interval when the component unmounts
    return () => {
      ws.close();
    };
  }, [user]);

  // Mark a single notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) => {
      const updated = prev.map((msg) =>
        msg._id === notificationId ? { ...msg, isRead: true } : msg
      );
      setUnreadCount(updated.filter((msg) => !msg.isRead).length);
      return updated;
    });
    // Optionally, call your backend API to update the message read status.
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((msg) => ({ ...msg, isRead: true }));
      setUnreadCount(0);
      return updated;
    });
    // Optionally, notify the backend about this change.
  };

  // Send a chat message via WebSocket
  const sendChatMessage = (text) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const messagePayload = {
        type: "chat",
        userId: user._id,
        text,
        timestamp: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(messagePayload));
      setChatMessages((prev) => [...prev, messagePayload]);
    }
  };

  // Refresh notifications from the backend
  const refreshNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/messages?userId=${user._id}`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((msg) => !msg.isRead).length);
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        notifications,
        chatMessages,
        unreadCount,
        markAsRead,
        markAllAsRead,
        sendChatMessage,
        refreshNotifications,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
