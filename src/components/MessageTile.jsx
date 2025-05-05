import React from "react";
import { MdStar, MdStarBorder, MdDelete } from "react-icons/md";

const labelColors = {
  message: "#4caf50",    // Green for normal messages
  order: "#2196f3",      // Blue for orders
  issues: "#f44336",     // Red for issues
  promotions: "#9c27b0", // Purple for promotions
};

const MessageTile = ({
  message,
  subject,
  body,
  timestamp,
  displayName,
  displayEmail,
  displayProfile,
  isOutgoing,
  onToggleStar,
  onDelete,
}) => {
  const labelColor = labelColors[message.label] || "#000";

  return (
    <div
      className="message-tile"
      style={{ borderLeft: `5px solid ${labelColor}` }}
    >
      <div className="message-tile-header">
        <div className="sender-info">
          <img src={displayProfile} alt="profile" className="profile-photo" />
          <div className="sender-details">
            <div className="user-name">{displayName}</div>
            <div className="user-email">{displayEmail}</div>
          </div>
        </div>
        <div className="message-actions">
          <button onClick={onToggleStar} className="star-btn">
            {message.isStarred ? (
              <MdStar color="#FFD700" />
            ) : (
              <MdStarBorder />
            )}
          </button>
          <button onClick={onDelete} className="delete-btn">
            <MdDelete />
          </button>
        </div>
      </div>
      <div className="message-tile-content">
        <div className="subject">{subject}</div>
        <div className="body-preview">{body}</div>
      </div>
      <div className="message-tile-footer">
        <span className="message-timestamp">
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default MessageTile;
