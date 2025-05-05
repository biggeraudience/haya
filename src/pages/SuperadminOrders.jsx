// src/pages/SuperadminOrders.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/globalsuperadmin.scss";

const BASE_URL = "http://localhost:5000/api";

const SuperadminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders`, {
          withCredentials: true,
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  const toggleExpand = (e, id) => {
    e.stopPropagation();
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="superadmin-orders-page">
      <div className="superadmin-main-box">
        <div className="superadmin-toggle-buttons">
        <button
            className={`superadmin-toggle-button ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("pending");
              setLoading(true);
            }}
          >
            Pending Orders
          </button>
          <button
            className={`superadmin-toggle-button ${activeTab === "all" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("all");
              setLoading(true);
            }}
          >
            All Orders
          </button>
          
        </div>
        <div className="superadmin-inner-box">
          {orders
            .filter((order) => {
              if (activeTab === "all") return true;
              if (activeTab === "pending") return order.status === "pending";
              return true;
            })
            .map((order) => (
              <div key={order._id} className="superadmin-order-tab">
                <div className="status">{order.status}</div>
                <div className="order-details">
                  <div className="order-number">Order #: {order.orderNumber || order._id}</div>
                  <div className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="order-total">Total: ${order.total}</div>
                </div>
                <button
                  className="superadmin-see-details-button"
                  onClick={(e) => toggleExpand(e, order._id)}
                >
                  See Details
                </button>
                {expandedOrder === order._id && (
                  <div className="superadmin-order-full-details">
                    <h4>Order Details</h4>
                    <p>Status: {order.status}</p>
                    <p>
                      Order Date: {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p>Total: ${order.total}</p>
                    <div className="superadmin-order-items">
                      <ul>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <li key={index}>
                              {item.name} - {item.quantity} x ${item.price}
                            </li>
                          ))
                        ) : (
                          <li>No items found.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SuperadminOrders;
