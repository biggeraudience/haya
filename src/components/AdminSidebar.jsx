import React, { useState } from "react"; 
import { 
  FaChevronDown, 
  FaChartBar, 
  FaEnvelope, 
  FaShoppingCart, 
  FaBox, 
  FaUsers, 
  FaSignOutAlt, 
  FaBullhorn 
} from "react-icons/fa";
import { useUser } from "../context/UserContext";
import "../styles/admin.scss"; // Ensure this file imports your admin.scss

// Updated sidebar links – each link uses a 'page' key
const sidebarLinks = [
  { title: 'Ads', page: 'AdminAdsPage', icon: <FaBullhorn /> },
  { title: 'Analytics', page: 'AdminAnalyticsPage', icon: <FaChartBar /> },
  { title: 'Messages', page: 'AdminMessagesPage', icon: <FaEnvelope /> },
  { title: 'Orders', page: 'AdminOrdersPage', icon: <FaShoppingCart /> },
  { title: 'Products', page: 'AdminProductsPage', icon: <FaBox /> },
  
  { title: 'Users', page: 'AdminUsersPage', icon: <FaUsers /> },
];

const AdminSidebar = ({ isOpen, toggleSidebar, activePage, onLinkClick }) => {
  const { user, logout } = useUser();

  // When a link is clicked, call the onLinkClick callback from AdminPanel
  const handleLinkClick = (page) => {
    onLinkClick(page);
    // Optionally, close the sidebar on mobile
    toggleSidebar();
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        {/* Profile Section */}
        <div className="sidebar-profile" onClick={() => onLinkClick("AdminProfilePage")}>
          <img 
            src={user?.profileImage || "/default-profile.png"} 
            alt="Profile" 
          />
          <span>{user?.name}</span>
        </div>

        {/* Navigation Links */}
        <ul className="sidebar-links">
          {sidebarLinks.map((link, index) => (
            <li 
              key={index} 
              className={`sidebar-item ${activePage === link.page ? "active" : ""}`}
              onClick={() => handleLinkClick(link.page)}
            >
              <span className="link-icon">{link.icon}</span>
              <span className="link-title">{link.title}</span>
            </li>
          ))}
        </ul>

        {/* Logout Section */}
        <div 
          className="sidebar-logout" 
          onClick={async () => {
            try {
              await logout();
              window.location.href = "/login";
            } catch (error) {
              console.error(error);
            }
          }}
        >
          <span className="logout-icon">
            <FaSignOutAlt />
          </span>
          <span className="logout-text">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
