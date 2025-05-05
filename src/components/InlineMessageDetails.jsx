import React from "react";
import { MdArrowBack, MdStar, MdStarBorder, MdDelete, MdReply } from "react-icons/md";
import "../styles/globaladmin.scss";

const InlineMessageDetails = ({ message, onClose, onToggleStar, onDelete, onReply }) => {
  const labelColors = {
    message: "#4caf50",
    order: "#2196f3",
    issues: "#f44336",
    promotions: "#9c27b0",
  };
  const labelColor = labelColors[message.label] || "#000";

  return (
    <div className="inline-message-details-container">
      <button className="back-arrow" onClick={onClose}>
        <MdArrowBack size={24} />
      </button>
      <div className="message-header" style={{ borderLeft: `5px solid ${labelColor}` }}>
        <div className="sender-info">
          <img
            src={message.senderId?.profileImage || "/default-profile.png"}
            alt="profile"
            className="profile-photo"
          />
          <div className="sender-details">
            <div className="user-name">{message.senderId?.name || "Sender Unknown"}</div>
            <div className="user-email">{message.senderId?.email || "No Email"}</div>
          </div>
        </div>
        <h2 className="message-subject">{message.subject}</h2>
        <div className="message-actions">
          <button onClick={() => onToggleStar && onToggleStar(message._id)} className="star-btn">
            {message.isStarred ? (
              <MdStar color="#FFD700" size={20} />
            ) : (
              <MdStarBorder size={20} />
            )}
          </button>
          <button onClick={() => onDelete && onDelete(message._id)} className="delete-btn">
            <MdDelete size={20} />
          </button>
          <button onClick={onReply} className="reply-btn">
            <MdReply size={20} />
          </button>
        </div>
      </div>
      <div className="message-body">
        <p>{message.body}</p>
      </div>
      <div className="message-footer">
        <span className="message-timestamp">
          {new Date(message.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default InlineMessageDetails;
