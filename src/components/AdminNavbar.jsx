import React from "react";
import { Link } from "react-router-dom";
import  "../styles/adminmessagespage.scss";

const AdminNavbar = () => {
  return (
    <div className="admin-navbar">
      {/* Haya Logo */}
      <Link to="/" className="haya-logo">
        <div className="haya-logo-container"></div>
      </Link>

     {/* Icons container */}
     <div className="product-navbar-icons">
        <div className="product-search-bar">
          <input type="text" placeholder="SEARCH" />
        </div>

      {/* Admin Profile */}
      <div className="admin-profile-container">
        <img src="/path-to-admin-profile.jpg" alt="Admin Profile" className="admin-profile-pic" />
      </div>
    </div>
    </div>
  );
};

export default AdminNavbar;
