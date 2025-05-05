import { createContext, useState, useEffect } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/messages", {
          params: { type: "notification" }  // Filter by type: "notification"
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
