// src/pages/SuperadminDashboard.jsx
import React from "react";

const SuperadminDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      <div className="dashboard-widgets">
        <div className="widget">
          <h3>Total Users</h3>
          <p>1,234</p>
        </div>
        <div className="widget">
          <h3>Total Orders</h3>
          <p>567</p>
        </div>
        <div className="widget">
          <h3>Revenue</h3>
          <p>$89,000</p>
        </div>
        <div className="widget">
          <h3>Admin Activity</h3>
          <p>Latest: John Doe updated settings</p>
        </div>
      </div>
    </div>
  );
};

export default SuperadminDashboard;
