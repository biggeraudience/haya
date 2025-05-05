import React from "react"; 
import { useUser } from "../context/UserContext";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/superadminpanel.scss";

// Define the sidebar links, replacing "Dashboard" with "Ads"
const sidebarLinks = [
  { title: 'Ads', page: 'ads', icon: <span className="superadmin-icon">📢</span> },
  { title: 'Invite Codes', page: 'invite-codes', icon: <span className="superadmin-icon">🔑</span> },
  { title: 'Users', page: 'users', icon: <span className="superadmin-icon">👥</span> },
  { title: 'Orders', page: 'orders', icon: <span className="superadmin-icon">🛒</span> },
  { title: 'Analytics', page: 'analytics', icon: <span className="superadmin-icon">📊</span> },
  { title: 'Admins', page: 'admins', icon: <span className="superadmin-icon">🛡️</span> },
  { title: 'Products', page: 'products', icon: <span className="superadmin-icon">📦</span> },
  { title: 'Settings', page: 'settings', icon: <span className="superadmin-icon">⚙️</span> },
];

const SuperadminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // Navigate to the specific nested route.
  const handleLinkClick = (page) => {
    navigate(`/superadminpanel/${page}`);
    if (isOpen) toggleSidebar();
  };

  return (
    <div className={`superadmin-sidebar ${isOpen ? "open" : ""}`}>
      <div className="superadmin-sidebar-content">
        {/* Profile Section */}
        <div
          className="superadmin-sidebar-profile"
          onClick={() => navigate("/superadminprofile")}
        >
          <img
            src={user?.profileImage || "/default-profile.png"}
            alt="Profile"
            className="superadmin-profile-image"
          />
          <span className="superadmin-profile-name">{user?.name}</span>
        </div>

        {/* Navigation Links */}
        <ul className="superadmin-sidebar-links">
          {sidebarLinks.map((link, index) => (
            <li
              key={index}
              className="superadmin-sidebar-item"
              onClick={() => handleLinkClick(link.page)}
            >
              <span className="superadmin-link-icon">{link.icon}</span>
              <span className="superadmin-link-title">{link.title}</span>
            </li>
          ))}
        </ul>

        {/* Logout Section */}
        <div
          className="superadmin-sidebar-logout"
          onClick={async () => {
            try {
              await logout();
              navigate("/login");
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <span className="superadmin-logout-icon">
            <FaSignOutAlt />
          </span>
          <span className="superadmin-logout-text">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default SuperadminSidebar;
