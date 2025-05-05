import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import ProductFooter from "../components/ProductFooter";
import AdminAdsPage from "../pages/AdminAdsPage";
import AdminAnalyticsPage from "../pages/AdminAnalyticsPage";
import AdminMessagesPage from "../pages/AdminMessagesPage";
import AdminOrdersPage from "../pages/AdminOrdersPage";
import AdminProductPage from "../pages/AdminProductPage";
import AdminReportsPage from "../pages/AdminReportsPage";
import AdminUsersPage from "../pages/AdminUsersPage";
import AdminSidebar from "../components/AdminSidebar";
import { FaBars } from "react-icons/fa";
import "../styles/adminpanel.scss";

const AdminPanel = () => {
  const { user, logout } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Default active page can be set to whichever page you want first
  const [activePage, setActivePage] = useState("AdminAdsPage");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSignOut = async () => {
    try {
      const userRole = user?.role;
      await logout();
      if (userRole === "superadmin") {
        window.location.href = "/superadminregister";
      } else {
        window.location.href = "/admin/register";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileClick = () => {
    window.location.href = "/adminprofile";
  };

  // Dynamically render the active page based on state
  const renderActivePage = () => {
    switch (activePage) {
      case "AdminAdsPage":
        return <AdminAdsPage />;
      case "AdminAnalyticsPage":
        return <AdminAnalyticsPage />;
      case "AdminMessagesPage":
        return <AdminMessagesPage />;
      case "AdminOrdersPage":
        return <AdminOrdersPage />;
      case "AdminProductsPage":
        return <AdminProductPage />;
      case "AdminReportsPage":
        return <AdminReportsPage />;
      case "AdminUsersPage":
        return <AdminUsersPage />;
      default:
        return <AdminAdsPage />;
    }
  };

  return (
    <>
      <Navbar />
      {/* Hamburger Icon */}
      <div className="hamburger" onClick={toggleSidebar}>
        <FaBars />
      </div>
      <div className="admin-panel">
        <AdminSidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          activePage={activePage}
          onLinkClick={(page) => setActivePage(page)}
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
                <button className="approval-btn" onClick={() => window.location.href="/adminapproval"} />
              )}
              <button className="signout-btn" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
          <div className="inner-box">
            {renderActivePage()}
          </div>
        </div>
      </div>
      
      <ProductFooter />
      
    </>
  );
};

export default AdminPanel;
