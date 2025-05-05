// src/pages/SuperadminSettings.jsx
import React, { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SuperadminSettings = () => {
  const [activeTab, setActiveTab] = useState("userRole");
  const tabContainerRef = useRef(null);

  const scrollTabs = (direction) => {
    const container = tabContainerRef.current;
    if (container) {
      const scrollAmount = 100;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "userRole":
        return (
          <div>
            <h3>User &amp; Role Management</h3>
            <p>
              Manage admin and user accounts, adjust roles, and assign granular permissions.
            </p>
            <ul>
              <li>
                Account Locking: <input type="checkbox" />
              </li>
              <li>
                Forced Password Reset: <input type="checkbox" />
              </li>
              <li>
                Two-Factor Authentication: <input type="checkbox" />
              </li>
            </ul>
          </div>
        );
      case "security":
        return (
          <div>
            <h3>Security Settings</h3>
            <p>
              Configure password policies, expiry, and reuse rules. Setup IP whitelisting or VPN restrictions and monitor audit logs.
            </p>
            <div className="superadmin-form-group">
              <label>Password Complexity:</label>
              <input type="text" placeholder="e.g., 8 characters, mix of cases, numbers, symbols" />
            </div>
            <div className="superadmin-form-group">
              <label>IP Whitelisting:</label>
              <input type="text" placeholder="Enter allowed IPs" />
            </div>
            <div className="superadmin-form-group">
              <label>Enable Audit Log Alerts:</label>
              <input type="checkbox" />
            </div>
          </div>
        );
      case "monitoring":
        return (
          <div>
            <h3>System &amp; Performance Monitoring</h3>
            <p>
              Dashboard analytics that show server load, error rates, and usage patterns.
            </p>
            <div className="superadmin-form-group">
              <label>Automated Reports:</label>
              <input type="checkbox" />
            </div>
            <div className="superadmin-form-group">
              <label>Real-Time Notifications:</label>
              <input type="checkbox" />
            </div>
          </div>
        );
      case "featureToggles":
        return (
          <div>
            <h3>Feature Toggles &amp; Customizations</h3>
            <p>
              Enable or disable features based on current needs and customize dashboard layout and theme.
            </p>
            <div className="superadmin-form-group">
              <label>Enable Beta Features:</label>
              <input type="checkbox" />
            </div>
            <div className="superadmin-form-group">
              <label>Dashboard Theme:</label>
              <select>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        );
      case "integrations":
        return (
          <div>
            <h3>Integrations &amp; API Management</h3>
            <p>
              Manage API keys, third-party integrations, and webhooks. Set rate limits and monitor usage statistics.
            </p>
            <div className="superadmin-form-group">
              <label>API Key:</label>
              <input type="text" placeholder="Your API key" />
            </div>
            <div className="superadmin-form-group">
              <label>Rate Limit:</label>
              <input type="number" placeholder="Requests per minute" />
            </div>
          </div>
        );
      case "backup":
        return (
          <div>
            <h3>Backup &amp; Recovery Options</h3>
            <p>
              Schedule automated backups, manage restore points, and define retention policies.
            </p>
            <div className="superadmin-form-group">
              <label>Backup Schedule:</label>
              <input type="text" placeholder="e.g., Daily at 2 AM" />
            </div>
            <div className="superadmin-form-group">
              <label>Retention Policy (days):</label>
              <input type="number" placeholder="e.g., 30" />
            </div>
          </div>
        );
      case "notifications":
        return (
          <div>
            <h3>Notification &amp; Communication Preferences</h3>
            <p>
              Configure email, SMS, or in-app notifications and set escalation paths for critical alerts.
            </p>
            <div className="superadmin-form-group">
              <label>Email Notifications:</label>
              <input type="checkbox" />
            </div>
            <div className="superadmin-form-group">
              <label>SMS Notifications:</label>
              <input type="checkbox" />
            </div>
          </div>
        );
      case "billing":
        return (
          <div>
            <h3>Billing &amp; Subscription Management</h3>
            <p>
              Manage payment settings, subscriptions, and invoicing for premium features.
            </p>
            <div className="superadmin-form-group">
              <label>Billing API Key:</label>
              <input type="text" placeholder="Enter billing API key" />
            </div>
            <div className="superadmin-form-group">
              <label>Subscription Plan:</label>
              <select>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="superadmin-settings-page">
      <div className="superadmin-main-box">
        {/* Scrollable Tab Buttons with Arrows */}
        <div
          className="superadmin-settings-tabs-wrapper"
          style={{ position: "relative", width: "100%", padding: "0 40px" }}
        >
          <button
            className="superadmin-tab-arrow left"
            onClick={() => scrollTabs("left")}
            style={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaChevronLeft size={20} color="black" />
          </button>

          <div
            className="superadmin-settings-toggle-buttons"
            ref={tabContainerRef}
            style={{
              overflowX: "auto",
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <button
              className={`superadmin-settings-toggle-button ${activeTab === "userRole" ? "active" : ""}`}
              onClick={() => setActiveTab("userRole")}
            >
              User &amp; Role
            </button>
            <button
              className={`superadmin-settings-toggle-button ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              Security
            </button>
            <button
              className={`superadmin-settings-toggle-button ${activeTab === "monitoring" ? "active" : ""}`}
              onClick={() => setActiveTab("monitoring")}
            >
              Monitoring
            </button>
            <button
              className={`superadmin-settings-toggle-button ${activeTab === "featureToggles" ? "active" : ""}`}
              onClick={() => setActiveTab("featureToggles")}
            >
              Features
            </button>
            <button
              className={`superadmin-settings-toggle-button ${activeTab === "integrations" ? "active" : ""}`}
              onClick={() => setActiveTab("integrations")}
            >
              Integrations
            </button>
            <button
              className={`superadmin-settings-toggle-button ${activeTab === "backup" ? "active" : ""}`}
              onClick={() => setActiveTab("backup")}
            >
              Backup
            </button>
            <button
              className={`superadmin-settings-toggle-button ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              Notifications
            </button>
            <button
              className={`superadmin-settings-toggle-button ${activeTab === "billing" ? "active" : ""}`}
              onClick={() => setActiveTab("billing")}
            >
              Billing
            </button>
          </div>

          <button
            className="superadmin-tab-arrow right"
            onClick={() => scrollTabs("right")}
            style={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FaChevronRight size={20} color="black" />
          </button>
        </div>

        {/* Inner Box for Tab Content */}
        <div className="superadmin-inner-box">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default SuperadminSettings;
