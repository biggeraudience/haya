import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import ComposeBox from "../components/ComposeBox";
import axios from "axios";
import "../styles/messages.scss";

const Messages = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  const fetchMessages = async () => {
    try {
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${BASE_API_URL}/api/messages/${id}`, {
        withCredentials: true,
      });
      setMessages(response.data.conversation || response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id, refreshFlag]);

  const handleRefresh = () => {
    setRefreshFlag((prev) => !prev);
  };

  return (
    <>
      <ProductNavbar />
      <div className="message-page">
        <div className="main-box">
          <div className="inner-box">
            {messages.length > 0 && (
              <div className="message-header">
                <h2>{messages[0].subject}</h2>
                <p className="timestamp">
                  {new Date(messages[0].timestamp).toLocaleString()}
                </p>
              </div>
            )}
            <div className="message-list">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg._id} className="message-tile">
                    <p className="message-sender">
                      {msg.senderId === msg.userId ? "From:" : "Reply from:"}{" "}
                      {msg.senderName || "Unknown"}
                    </p>
                    <p className="message-body">{msg.body}</p>
                    <p className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No messages found.</p>
              )}
            </div>
            <div className="compose-container">
              {/* The ComposeBox component likely also makes an API call */}
              <ComposeBox onMessageSent={handleRefresh} />
            </div>
          </div>
        </div>
      </div>
      <ProductFooter />
    </>
  );
};

export default Messages;
