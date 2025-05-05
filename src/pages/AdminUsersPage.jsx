import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/globaladmin.scss";
import { TiUserDelete } from "react-icons/ti";
import { CgUnblock } from "react-icons/cg";
import { MdBlock } from "react-icons/md";

const BASE_URL = "http://localhost:5000/api";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("registered");

  useEffect(() => {
    if (activeTab === "registered") {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/users`, {
            withCredentials: true,
          });
          setUsers(response.data);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUsers();
    } else {
      // For guests, simulate loading or use guest data as needed.
      setLoading(false);
    }
  }, [activeTab]);

  const toggleExpand = (e, id) => {
    // Prevent triggering parent click events.
    e.stopPropagation();
    setExpandedUser(expandedUser === id ? null : id);
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, { withCredentials: true });
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleSuspend = async (id) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/users/${id}/suspend`,
        {},
        { withCredentials: true }
      );
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, suspended: response.data.suspended } : user
        )
      );
    } catch (error) {
      console.error("Error toggling suspension:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-container">
      <div className="admin-container">
        <div className="admin-content-wrapper">
          <div className="admin-users-page">
            <div className="admin-toggle-buttons">
              <button
                className={`admin-toggle-button ${
                  activeTab === "registered" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab("registered");
                  setLoading(true);
                }}
              >
                Registered Users
              </button>
              <button
                className={`admin-toggle-button ${
                  activeTab === "guests" ? "active" : ""
                }`}
                onClick={() => {
                  setActiveTab("guests");
                  setLoading(false);
                }}
              >
                Guests
              </button>
            </div>
            {activeTab === "registered" ? (
              <div className="registered-users-container">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="user-roster-item registered-user-tile"
                  >
                    <div className="user-summary">
                      <div className="user-profile">
                        <img
                          src={user.profileImage || "/default-profile.png"}
                          alt={user.name}
                          className="profile-image"
                        />
                        <div className="user-basic-info">
                          <h2>{user.name}</h2>
                          <p>{user.email}</p>
                        </div>
                      </div>
                      <div className="user-id-section">
                        <button
                          className="user-id-button"
                          onClick={(e) => toggleExpand(e, user._id)}
                        >
                          {user._id}
                        </button>
                      </div>
                      <div className="user-joined-date">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {expandedUser === user._id && (
                      <div className="user-details">
                        <div className="detail-row">
                          <strong>Address:</strong>{" "}
                          {user.profile && user.profile.address
                            ? `${user.profile.address.street || ""}, ${user.profile.address.city || ""} ${user.profile.address.state || ""} ${user.profile.address.zip || ""}`
                            : "N/A"}
                        </div>
                        <div className="detail-row">
                          <strong>Phone:</strong>{" "}
                          {user.profile &&
                          user.profile.personalInfo &&
                          user.profile.personalInfo.phone
                            ? user.profile.personalInfo.phone
                            : "N/A"}
                        </div>
                        <div className="detail-row">
                          <strong>Orders:</strong>{" "}
                          {user.orders && user.orders.length > 0
                            ? user.orders.length
                            : 0}
                        </div>
                        <div className="detail-row">
                          <strong>Total Spent:</strong>{" "}
                          {user.totalSpent ? `$${user.totalSpent}` : "N/A"}
                        </div>
                        <div className="detail-row">
                          <strong>Gender:</strong>{" "}
                          {user.profile &&
                          user.profile.personalInfo &&
                          user.profile.personalInfo.gender
                            ? user.profile.personalInfo.gender
                            : "N/A"}
                        </div>
                        <div className="user-actions">
                          <button
                            className="suspend-button"
                            onClick={() => handleToggleSuspend(user._id)}
                          >
                            {user.suspended ? <CgUnblock /> : <MdBlock />}
                          </button>
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <TiUserDelete />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="guests-container">
                <p>Guest users functionality coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;