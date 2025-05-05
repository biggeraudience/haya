import React from 'react'
import '../styles/adminpanel.scss'
import { Link } from 'react-router-dom'

const AdminReports = () => {
  return (
    <Link to="/adminreportspage" className="admin-card reports-card">
    <div className="admin-card reports-card">
      <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000"><path d="M200-120v-680h348.67l18 84H800v380H536l-17.96-83.33H266.67V-120H200Zm300-448Zm92 165.33h141.33v-246.66H510.67l-18-84h-226V-486H574l18 83.33Z"/></svg>
      <div className="card-content">
        <p>Monthly Report: Available</p>
        {/* Add dynamic data later */}
      </div>
    </div>
    </Link>
  )
}

export default AdminReports
