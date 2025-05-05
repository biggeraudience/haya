import React, { useState } from "react";
import { FiSend, FiX } from "react-icons/fi";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/globaladmin.scss";

const InlineReplyMessage = ({ parentMessage, onCancel, onMessageSent }) => {
  const { user, loading } = useUser();
  const [recipientEmail, setRecipientEmail] = useState(
    parentMessage ? parentMessage.senderId?.email || "" : ""
  );
  const [subject, setSubject] = useState(
    parentMessage ? `Re: ${parentMessage.subject}` : ""
  );
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSendMessage = async () => {
    if (!subject || !body) {
      setError("All fields are required.");
      return;
    }
    setSending(true);
    setError("");
    try {
      let endpoint = "";
      let payload = { subject, body };
      if (user.role === "admin" || user.role === "superadmin") {
        payload.recipientEmail = recipientEmail.trim();
        endpoint = "http://localhost:5000/api/messages/admin";
      } else {
        payload.userId = user._id;
        endpoint = "http://localhost:5000/api/messages";
      }
      const response = await axios.post(endpoint, payload, { withCredentials: true });
      if (response.status === 201) {
        onMessageSent && onMessageSent(response.data);
        // Reset subject (if needed) and body for new reply
        setSubject(parentMessage ? `Re: ${parentMessage.subject}` : "");
        setBody("");
      }
    } catch (err) {
      console.error("Send message error:", err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Error: You must be logged in to send a message.</div>;

  return (
    <div className="inline-reply-message-container">
      <div className="reply-header">
        <h3>Reply</h3>
        <button className="cancel-btn" onClick={onCancel}>
          <FiX size={20} />
        </button>
      </div>
      <div className="reply-content">
        <input
          type="email"
          placeholder="Recipient Email"
          value={recipientEmail}
          readOnly
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Write your reply..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <div className="reply-actions">
        <button className="send-btn" onClick={handleSendMessage}>
          <FiSend size={20} /> Send
        </button>
      </div>
      {sending && <div className="loading">Sending...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default InlineReplyMessage;
