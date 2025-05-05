import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import ProductFooter from "../components/ProductFooter";
import SuperadminSidebar from "../components/SuperadminSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "../styles/superadminpanel.scss";

const SuperadminPanel = () => {
  const { user, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignOut = async () => {
    try {
      await logout();
      window.location.href = "/superadminregister";
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileClick = () => {
    window.location.href = "/superadminprofile";
  };

  return (
    <>
      <Navbar />
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleSidebar}>
        <FaBars />
      </div>
      <div className="admin-panel">
        <SuperadminSidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="main-content">
          {user && (
            <div className="profile-section">
              <div className="profile-info" onClick={handleProfileClick}>
                <img
                  src={user.profileImage || "/default-profile.png"}
                  alt="Profile"
                  className="profile-image"
                />
                <div className="user-details">
                  <p className="user-name">{user.name}</p>
                  <p className="user-role">{user.role}</p>
                </div>
              </div>
              {user.role === "superadmin" && (
                <button
                  className="approval-btn"
                  onClick={() => (window.location.href = "/adminapproval")}
                />
              )}
              <button className="signout-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
          <div className="inner-box">
            <Outlet />
          </div>
        </div>
      </div>
      <ProductFooter />
    </>
  );
};

export default SuperadminPanel;
