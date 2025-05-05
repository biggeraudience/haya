import React, { useState } from "react";
import {
  FiMinus,
  FiX,
  FiSend,
  FiPaperclip,
  FiImage,
  FiChevronDown,
} from "react-icons/fi";
import axios from "axios";
import { useUser } from "../context/UserContext";
import "../styles/composeBox.scss";

const ComposeBox = ({ onClose, onMinimize, onMessageSent }) => {
  const { user, loading } = useUser();
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Error: You must be logged in to compose a message.</div>;

  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipients, setRecipients] = useState("");
  const [subject, setSubject] = useState("");
  const [label, setLabel] = useState("");
  const [body, setBody] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  const handleSendMessage = async () => {
    if (!subject || !body) {
      setError("Subject and body are required.");
      return;
    }
    setSending(true);
    setError("");
    try {
      let endpoint = "";
      let payload = { subject, body };
      if (user.role === "admin" || user.role === "superadmin") {
        if (!recipientEmail.trim()) {
          setError("Recipient email is required for admin messages.");
          setSending(false);
          return;
        }
        endpoint = "http://localhost:5000/api/messages/admin";
        payload.recipientEmail = recipientEmail.trim();
      } else {
        endpoint = "http://localhost:5000/api/messages";
        payload.userId = user._id;
      }
      const response = await axios.post(endpoint, payload, { withCredentials: true });
      if (response.status === 201) {
        onMessageSent && onMessageSent();
        setSubject("");
        setBody("");
        setRecipientEmail("");
      }
    } catch (err) {
      console.error("Send message error:", err);
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleSendToMany = async () => {
    if (!recipients || !subject || !label || !body) {
      setError("All fields, including recipients, are required.");
      return;
    }
    setLoadingState(true);
    setError("");
    try {
      const recipientList = recipients
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);
      if (recipientList.length === 0) {
        setError("Please enter at least one recipient email.");
        setLoadingState(false);
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/messages/multiple-by-email",
        { subject, body, recipients: recipientList },
        { withCredentials: true }
      );
      if (response.status === 201) {
        onClose && onClose();
      }
    } catch (err) {
      setError("Failed to send message to multiple recipients.");
    } finally {
      setLoadingState(false);
    }
  };

  const handleScheduleSend = async () => {
    if (!scheduleTime || !subject || !label || !body) {
      setError("All fields, including schedule time, are required.");
      return;
    }
    setLoadingState(true);
    setError("");
    try {
      let response;
      if (recipientEmail.trim() !== "") {
        response = await axios.post(
          "http://localhost:5000/api/messages/schedule/admin",
          { subject, body, scheduleTime, recipientEmail: recipientEmail.trim() },
          { withCredentials: true }
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/messages/schedule",
          { subject, label, body, scheduleTime, userId: user._id },
          { withCredentials: true }
        );
      }
      if (response.status === 201) {
        onClose && onClose();
      }
    } catch (err) {
      setError("Failed to schedule message.");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="compose-box">
      <div className="compose-header">
        <span>New Mail</span>
        <div className="compose-header-icons">
          <FiMinus className="icon" onClick={onMinimize} />
          <FiX className="icon" onClick={onClose} />
        </div>
      </div>
      <div className="compose-content">
        <input
          type="email"
          placeholder="Recipient Email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          type="text"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <textarea
          placeholder="Write your message..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        {showDropdown && (
          <>
            <input
              type="text"
              placeholder="Recipients (comma-separated emails)"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </>
        )}
      </div>
      <div className="compose-actions">
        <FiPaperclip className="action-icon" title="Attach File" />
        <FiImage className="action-icon" title="Insert Image" />
        <div className="send-container">
          <FiSend
            className="action-icon send"
            title="Send"
            onClick={handleSendMessage}
          />
          <FiChevronDown
            className="action-icon dropdown-toggle"
            title="More options"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="dropdown-menu">
              <button onClick={handleSendToMany}>Send to Many</button>
              <button onClick={handleScheduleSend}>Schedule Send</button>
            </div>
          )}
        </div>
      </div>
      {(sending || loadingState) && (
        <div className="loading">Sending...</div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ComposeBox;
