// components/OrderTile.jsx
import React from "react";
import { MdDelete } from "react-icons/md";

const orderStatusColors = {
  PROCESSING: "#FF9800",
  "ON IT'S WAY!": "#2196F3",
  PENDING: "#9E9E9E",
  DELIVERED: "#4CAF50",
  DECLINED: "#F44336",
  RETURNED: "#795548",
};

const OrderTile = ({ order, onDelete, onClick }) => {
  const borderColor = orderStatusColors[order.orderStatus] || "#000";

  return (
    <div
      className="order-tile"
      style={{ borderLeft: `5px solid ${borderColor}` }}
      onClick={() => onClick(order)}
    >
      <div className="order-tile-header">
        <div className="sender-info">
        // In OrderTile.jsx
<img
  src={order.userId?.profileImage || "/default-profile.png"}
  alt="profile"
  className="profile-photo"
/>
<div className="sender-details">
  <div className="user-name">{order.userId?.name || "User Unknown"}</div>
  <div className="user-email">{order.userId?.email || ""}</div>
</div>

        </div>
        <div className="order-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(order._id);
            }}
            className="delete-btn"
          >
            <MdDelete />
          </button>
        </div>
      </div>
      <div className="order-tile-content">
        <div className="subject">Order ID: {order.orderId}</div>
        <div className="body-preview">Total: ${order.totalAmount.toFixed(2)}</div>
      </div>
      <div className="order-tile-footer">
        <span className="order-timestamp">{new Date(order.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default OrderTile;
