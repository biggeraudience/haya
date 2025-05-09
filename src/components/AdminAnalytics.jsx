import React from 'react'
import '../styles/adminpanel.scss'
import { Link } from 'react-router-dom'

const AdminAnalytics = () => {
  return (
    <Link to="/adminanalyticspage" className="admin-card analytics-card">
    <div className="admin-card analytics-card">
      <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000"><path d="M94.33-407.67 40-447.33l195.33-313.34 123.34 144L522-882l123.33 184 140.34-222 53.66 39-192.66 305.33L524.33-758 367.67-503.67 244-648 94.33-407.67Zm487.67 181q46 0 78.67-32 32.66-32 32.66-78 0-46.66-32.33-79Q628.67-448 582-448q-46 0-78 32.67-32 32.66-32 78.66t32 78q32 32 78 32ZM792.67-80 682-190.67Q660.33-176 635.17-168 610-160 582-160q-73.67 0-125.17-51.5t-51.5-125.17q0-73.66 51.5-125.83T582-514.67q74.33 0 126.17 51.84Q760-411 760-336.67q0 28-8 53.17t-23.33 46.83l110.66 110L792.67-80Z"/></svg>
      <div className="card-content">
        <p>Total Sales: $5,000</p>
        <p>Total Visitors: 3,500</p>
        {/* Add dynamic data later */}
      </div>
    </div>
    </Link>
  )
}

export default AdminAnalytics
