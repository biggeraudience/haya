import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import axios from "axios";
import "../styles/notifications.scss";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const BASE_API_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${BASE_API_URL}/messages`, {
          params: { type: "notification" }
        });

        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === id ? { ...notification, isRead: true } : notification
      )
    );
    try {
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      await axios.put(`${BASE_API_URL}/api/notifications/${id}/mark-as-read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };


  return (
    <>
      <ProductNavbar />
      <div className="notifications-page">
        <div className="main-box">
          <div className="inner-box">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No Notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  to={`/messages/${notification._id}`}
                  key={notification._id}
                  className={`notification-tab ${notification.isRead ? "read" : ""}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="icon">
                    {/* Add icon logic here */}
                  </div>
                  <div className="message-content">
                    {notification.body}
                    <div className="timestamp">{new Date(notification.timestamp).toLocaleString()}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
      <ProductFooter />
    </>
  );
};

export default Notifications;
