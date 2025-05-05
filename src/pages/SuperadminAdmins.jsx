// src/pages/SuperadminAdmins.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/globalsuperadmin.scss";

const SuperadminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedAdmin, setExpandedAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState("admins");
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "admins") {
      const fetchAdmins = async () => {
        setLoading(true);
        try {
          const res = await axios.get("/admin/all", { withCredentials: true });
          setAdmins(res.data);
          setError("");
        } catch (err) {
          console.error("Error fetching admins:", err);
          setError("Failed to load admins.");
        } finally {
          setLoading(false);
        }
      };
      fetchAdmins();
    } else {
      // For the analytics tab, you might later plug in your charts and numbers.
      setLoading(false);
    }
  }, [activeTab]);

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedAdmin(expandedAdmin === id ? null : id);
  };

  const handleViewLogs = (id) => {
    navigate(`/superadmin/admins/${id}`);
  };

  return (
    <div className="superadmin-admin-container">
      <div className="superadmin-container">
        <div className="superadmin-content-wrapper">
          <div className="superadmin-admins-page">
            {/* Tabs Area without arrow buttons and overflow */}
            <div className="superadmin-admins-tabs-wrapper">
              <button
                className={`superadmin-admins-toggle-button ${activeTab === "admins" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("admins");
                  setLoading(true);
                }}
              >
                Admins
              </button>
              <button
                className={`superadmin-admins-toggle-button ${activeTab === "analytics" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("analytics");
                  setLoading(false);
                }}
              >
                Admin Analytics
              </button>
            </div>

            {loading ? (
              <p>Loading admins...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : activeTab === "admins" ? (
              <div className="superadmin-registered-admins-container">
                {admins.length > 0 ? (
                  admins.map((admin) => (
                    <div
                      key={admin._id}
                      className="superadmin-admin-tile"
                      onClick={(e) => toggleExpand(e, admin._id)}
                    >
                      <div className="superadmin-admin-summary">
                        <div className="superadmin-admin-profile">
                          <img
                            src={admin.profileImage || "/default-admin.png"}
                            alt={admin.name}
                            className="superadmin-profile-image"
                          />
                          <div className="superadmin-admin-basic-info">
                            <h2>{admin.name}</h2>
                            <p>{admin.email}</p>
                          </div>
                        </div>
                        <div className="superadmin-admin-id-section">
                          <button
                            className="superadmin-admin-id-button"
                            onClick={(e) => toggleExpand(e, admin._id)}
                          >
                            {admin._id}
                          </button>
                        </div>
                        <div className="superadmin-admin-created-date">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {expandedAdmin === admin._id && (
                        <div className="superadmin-admin-details">
                          <div className="superadmin-detail-row">
                            <strong>Approved:</strong> {admin.isApproved ? "Yes" : "No"}
                          </div>
                          <div className="superadmin-detail-row">
                            <strong>Last Login:</strong>{" "}
                            {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "N/A"}
                          </div>
                          <div className="superadmin-admin-actions">
                            <button onClick={() => handleViewLogs(admin._id)}>
                              View Logs
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No admins found.</p>
                )}
              </div>
            ) : (
              <div className="superadmin-analytics-container">
                <p>
                  Admin analytics functionality coming soon. Stay tuned for insights hotter than your morning coffee!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminAdmins;
