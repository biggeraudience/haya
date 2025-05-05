import React, { useState } from "react";

const MessagesSettings = () => {
  const [conversationView, setConversationView] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="messages-settings">
      <h2>Messages Settings</h2>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={conversationView}
            onChange={(e) => setConversationView(e.target.checked)}
          />
          Conversation View
        </label>
      </div>
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
          />
          Enable Notifications
        </label>
      </div>
      {/* Add additional settings as needed */}
    </div>
  );
};

export default MessagesSettings;
