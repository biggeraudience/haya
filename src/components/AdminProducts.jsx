import React from 'react'
import '../styles/adminpanel.scss'
import { Link } from 'react-router-dom'

const AdminProducts = () => {
  return (
    <Link to="/adminproductspage" className="admin-card products-card">
    <div className="admin-card products-card">
      <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000"><path d="M160-733.33V-800h641.33v66.67H160ZM163.33-160v-252h-46v-66.67L160-680h640.67l42.66 201.33V-412h-46v252h-66.66v-252H551.33v252h-388ZM230-226.67h254.67V-412H230v185.33Zm-46-252h592.67H184Zm0 0h592.67L748-613.33H212.67L184-478.67Z"/></svg>
      <div className="card-content">
        <p>Total Products: 120</p>
        <p>Out of Stock: 8</p>
        {/* Add dynamic data later */}
      </div>
    </div>
    </Link>
  )
}

export default AdminProducts
