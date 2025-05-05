// src/pages/SuperadminUsers.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/globalsuperadmin.scss";
import { TiUserDelete } from "react-icons/ti";
import { CgUnblock } from "react-icons/cg";
import { MdBlock } from "react-icons/md";

// Update the base URL if needed; if your working endpoint is "/superadmin/users"
// you might want to use that directly instead of constructing a new URL.
const BASE_URL = ""; // using relative URL so that the call becomes "/superadmin/users"

const SuperadminUsers = () => {
  // State for user data, loading, error, expanded user details, and active tab
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedUser, setExpandedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("registered");

  // Fetch users when the active tab changes to "registered"
  useEffect(() => {
    if (activeTab === "registered") {
      const fetchUsers = async () => {
        setLoading(true);
        try {
          // Using the working endpoint here.
          const res = await axios.get("/superadmin/users", { withCredentials: true });
          setUsers(res.data);
          setError("");
        } catch (err) {
          console.error("Error fetching users:", err);
          setError("Failed to load users.");
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    } else {
      // For guests: right now, we're not fetching guest data.
      setUsers([]);
      setLoading(false);
    }
  }, [activeTab]);

  // Toggle expanded view for a user detail
  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedUser(expandedUser === id ? null : id);
  };

  // Delete a user and update UI
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/superadmin/users/${id}`, { withCredentials: true });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Toggle suspension state for a user
  const handleToggleSuspend = async (id) => {
    try {
      const response = await axios.patch(
        `/superadmin/users/${id}/suspend`,
        {},
        { withCredentials: true }
      );
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, suspended: response.data.suspended } : user
        )
      );
    } catch (err) {
      console.error("Error toggling suspension:", err);
    }
  };

  return (
    <div className="superadmin-main-container">
      <div className="superadmin-container">
        <div className="superadmin-content-wrapper">
          <div className="superadmin-users-page">
            <div className="superadmin-toggle-buttons">
              <button
                className={`superadmin-toggle-button ${activeTab === "registered" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("registered");
                  setLoading(true);
                }}
              >
                Registered Users
              </button>
              <button
                className={`superadmin-toggle-button ${activeTab === "guests" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("guests");
                  setLoading(false);
                }}
              >
                Guests
              </button>
            </div>
            {loading ? (
              <p>Loading users...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : activeTab === "registered" ? (
              <div className="superadmin-registered-users-container">
                {users.length > 0 ? (
                  users.map((user) => (
                    <div
                      key={user._id}
                      className="superadmin-user-roster-item superadmin-registered-user-tile"
                    >
                      <div className="superadmin-user-summary">
                        <div className="superadmin-user-profile">
                          <img
                            src={user.profileImage || "/default-profile.png"}
                            alt={user.name}
                            className="superadmin-profile-image"
                          />
                          <div className="superadmin-user-basic-info">
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                          </div>
                        </div>
                        <div className="superadmin-user-id-section">
                          <button
                            className="superadmin-user-id-button"
                            onClick={(e) => toggleExpand(e, user._id)}
                          >
                            {user._id}
                          </button>
                        </div>
                        <div className="superadmin-user-joined-date">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {expandedUser === user._id && (
                        <div className="superadmin-user-details">
                          <div className="superadmin-detail-row">
                            <strong>Address:</strong>{" "}
                            {user.profile && user.profile.address
                              ? `${user.profile.address.street || ""}, ${user.profile.address.city || ""} ${user.profile.address.state || ""} ${user.profile.address.zip || ""}`
                              : "N/A"}
                          </div>
                          <div className="superadmin-detail-row">
                            <strong>Phone:</strong>{" "}
                            {user.profile &&
                            user.profile.personalInfo &&
                            user.profile.personalInfo.phone
                              ? user.profile.personalInfo.phone
                              : "N/A"}
                          </div>
                          <div className="superadmin-detail-row">
                            <strong>Orders:</strong>{" "}
                            {user.orders && user.orders.length > 0 ? user.orders.length : 0}
                          </div>
                          <div className="superadmin-detail-row">
                            <strong>Total Spent:</strong>{" "}
                            {user.totalSpent ? `$${user.totalSpent}` : "N/A"}
                          </div>
                          <div className="superadmin-detail-row">
                            <strong>Gender:</strong>{" "}
                            {user.profile &&
                            user.profile.personalInfo &&
                            user.profile.personalInfo.gender
                              ? user.profile.personalInfo.gender
                              : "N/A"}
                          </div>
                          <div className="superadmin-user-actions">
                            <button
                              className="superadmin-suspend-button"
                              onClick={() => handleToggleSuspend(user._id)}
                            >
                              {user.suspended ? <CgUnblock /> : <MdBlock />}
                            </button>
                            <button
                              className="superadmin-delete-button"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <TiUserDelete />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No users found.</p>
                )}
              </div>
            ) : (
              <div className="superadmin-guests-container">
                <p>Guest users functionality coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperadminUsers;
