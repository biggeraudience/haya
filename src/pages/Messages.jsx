import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import ComposeBox from "../components/ComposeBox";
import axios from "axios";
import "../styles/messages.scss";

const Messages = () => {
  const { id } = useParams(); // For example, the conversation or thread ID
  const [messages, setMessages] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  // Function to fetch the message thread
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`/api/messages/${id}`, {
        withCredentials: true,
      });
      // Adapt based on your API response structure. Here we assume either a 'conversation' or a flat array.
      setMessages(response.data.conversation || response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id, refreshFlag]);

  // When a new message is sent, refresh the messages list
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
