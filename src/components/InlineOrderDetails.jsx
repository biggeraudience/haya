// components/InlineOrderDetails.jsx
import React, { useState, useRef, useEffect } from "react";
import { MdArrowBack, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

const orderStatusOptions = [
  "PROCESSING",
  "ON IT'S WAY!",
  "PENDING",
  "DELIVERED",
  "DECLINED",
  "RETURNED",
];

const orderStatusColors = {
  PROCESSING: "#FF9800",
  "ON IT'S WAY!": "#2196F3",
  PENDING: "#9E9E9E",
  DELIVERED: "#4CAF50",
  DECLINED: "#F44336",
  RETURNED: "#795548",
};

const InlineOrderDetails = ({ order, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(order.orderStatus);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleStatusChange = (status) => {
    setNewStatus(status);
    onStatusUpdate(order._id, status);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="inline-order-details-container">
      <div className="inline-order-details">
        <button className="back-arrow" onClick={onClose}>
          <MdArrowBack />
        </button>
        
        <div className="order-header">
          <h2 style={{ color: orderStatusColors[newStatus] || "#000" }}>
            Order Details - {order.orderId}
          </h2>
          <div className="order-status-control" ref={dropdownRef}>
            <button
              className="status-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {newStatus}
            </button>
            {dropdownOpen && (
              <div className="status-dropdown">
                {orderStatusOptions.map((status) => (
                  <div
                    key={status}
                    className="dropdown-item"
                    onClick={() => handleStatusChange(status)}
                  >
                    {newStatus === status ? (
                      <MdCheckBox className="checkbox-icon" />
                    ) : (
                      <MdCheckBoxOutlineBlank className="checkbox-icon" />
                    )}
                    <span>{status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="order-info">
          <p>
            <strong>Name:</strong> {order.userId?.name || "User Unknown"}
          </p>
          <p>
            <strong>Email:</strong> {order.userId?.email || ""}
          </p>
          <p>
            <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
          </p>
        
          <p>
            <strong>Payment Status:</strong> {order.paymentStatus}
          </p>
          <p>
            <strong>Order Status:</strong> {order.orderStatus}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="order-items">
          <h3>Ordered Items:</h3>
          {order.items && order.items.length > 0 ? (
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  <p>
                    <strong>{item.name}</strong> – Quantity: {item.quantity} – Price: ${item.price}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No items found.</p>
          )}
        </div>
        {order.tracking && (
          <div className="order-tracking">
            <h3>Tracking Information:</h3>
            <p>
              <strong>Carrier:</strong> {order.tracking.carrier}
            </p>
            <p>
              <strong>Tracking Number:</strong> {order.tracking.trackingNumber}
            </p>
            <p>
              <strong>Estimated Delivery:</strong> {order.tracking.estimatedDelivery}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineOrderDetails;
