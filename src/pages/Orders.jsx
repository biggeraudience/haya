// src/pages/Orders.jsx
import React, { useState } from "react";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import { useOrders } from "../context/OrderContext";
import "../styles/orders.scss";

const statusIcons = {
  PROCESSING: (
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000"><path d="M691-80q-78.43 0-133.72-55.28Q502-190.57 502-269t55.28-133.72Q612.57-458 691-458t133.72 55.28Q880-347.43 880-269t-55.28 133.72Q769.43-80 691-80Zm58.24-88L777-196l-75-75v-112h-39v126l86.24 89ZM180-120q-24.75 0-42.37-17.63Q120-155.25 120-180v-600q0-26 17-43t43-17h202q7-35 34.5-57.5T480-920q36 0 63.5 22.5T578-840h202q26 0 43 17t17 43v308q-15-9-29.52-15.48Q795.97-493.96 780-499v-281h-60v90H240v-90h-60v600h280q5 15 12 29.5t17 30.5H180Zm300-660q17 0 28.5-11.5T520-820q0-17-11.5-28.5T480-860q-17 0-28.5 11.5T440-820q0 17 11.5 28.5T480-780Z"/></svg>
  ),
  "ON IT'S WAY!": (
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000"><path d="M224.12-161q-49.12 0-83.62-34.42Q106-229.83 106-279H40v-461q0-24 18-42t42-18h579v167h105l136 181v173h-71q0 49.17-34.38 83.58Q780.24-161 731.12-161t-83.62-34.42Q613-229.83 613-279H342q0 49-34.38 83.5t-83.5 34.5Zm-.12-60q24 0 41-17t17-41q0-24-17-41t-41-17q-24 0-41 17t-17 41q0 24 17 41t41 17ZM100-339h22q17-27 43.04-43t58-16q31.96 0 58.46 16.5T325-339h294v-401H100v401Zm631 118q24 0 41-17t17-41q0-24-17-41t-41-17q-24 0-41 17t-17 41q0 24 17 41t41 17Zm-52-204h186L754-573h-75v148ZM360-529Z"/></svg>
  ),
  PENDING: (
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000"><path d="M266.12-430q20.88 0 35.38-14.62 14.5-14.62 14.5-35.5 0-20.88-14.62-35.38-14.62-14.5-35.5-14.5-20.88 0-35.38 14.62-14.5 14.62-14.5 35.5 0 20.88 14.62 35.38 14.62 14.5 35.5 14.5Zm214 0q20.88 0 35.38-14.62 14.5-14.62 14.5-35.5 0-20.88-14.62-35.38-14.62-14.5-35.5-14.5-20.88 0-35.38 14.62-14.5 14.62-14.5 35.5 0 20.88 14.62 35.38 14.62 14.5 35.5 14.5Zm213 0q20.88 0 35.38-14.62 14.5-14.62 14.5-35.5 0-20.88-14.62-35.38-14.62-14.5-35.5-14.5-20.88 0-35.38 14.62-14.5 14.62-14.5 35.5 0 20.88 14.62 35.38 14.62 14.5 35.5 14.5ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg>
  ),
  DELIVERED: (
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000"><path d="M294-242 70-466l43-43 181 181 43 43-43 43Zm170 0L240-466l43-43 181 181 384-384 43 43-427 427Zm0-170-43-43 257-257 43 43-257 257Z"/></svg>
  ),
  DECLINED: (
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000"><path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/></svg>
  ),
  RETURNED: (
      <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#000"><path d="M196-331q-20-36-28-72.5t-8-74.5q0-131 94.5-225.5T480-798h43l-80-80 39-39 149 149-149 149-40-40 79-79h-41q-107 0-183.5 76.5T220-478q0 29 5.5 55t13.5 49l-43 43ZM476-40 327-189l149-149 39 39-80 80h45q107 0 183.5-76.5T740-479q0-29-5-55t-15-49l43-43q20 36 28.5 72.5T800-479q0 131-94.5 225.5T480-159h-45l80 80-39 39Z"/></svg>
  ),
};

const Orders = () => {
  const { orders, loading } = useOrders();
  const [activeTab, setActiveTab] = useState("currentOrders");

  if (loading) return <p>Loading orders...</p>;

  // Filter orders based on status
  const currentOrders = orders.filter(
    (order) =>
      order.orderStatus === "PROCESSING" ||
      order.orderStatus === "ON IT'S WAY!" ||
      order.orderStatus === "PENDING"
  );

  const orderHistory = orders.filter(
    (order) =>
      order.orderStatus === "DELIVERED" ||
      order.orderStatus === "DECLINED" ||
      order.orderStatus === "RETURNED"
  );

  return (
    <>
      <ProductNavbar />
      <div className="orders-page">
        <div className="main-box">
          {/* Tabs for Current Orders and Order History */}
          <div className="toggle-buttons">
            <button
              className={`toggle-button ${activeTab === "currentOrders" ? "active" : ""}`}
              onClick={() => setActiveTab("currentOrders")}
            >
              CURRENT ORDERS
            </button>
            <button
              className={`toggle-button ${activeTab === "orderHistory" ? "active" : ""}`}
              onClick={() => setActiveTab("orderHistory")}
            >
              ORDER HISTORY
            </button>
          </div>

          {/* Orders Content */}
          <div className="inner-box">
            {activeTab === "currentOrders" &&
              currentOrders.map((order) => (
                <div key={order.orderId} className="order-tab">
                  <div className="status">
                    {statusIcons[order.orderStatus]} {order.orderStatus}
                  </div>
                  <div className="order-details">
                    <span className="order-number">
                      Order Number: {order.orderId}
                    </span>
                    <span className="order-date">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="order-total">
                      Total: ${order.totalAmount}
                    </span>
                  </div>
                  <button className="see-details-button">
                    See Full Details
                  </button>
                </div>
              ))}

            {activeTab === "orderHistory" &&
              orderHistory.map((order) => (
                <div key={order.orderId} className="order-tab">
                  <div className="status">
                    {statusIcons[order.orderStatus]} {order.orderStatus}
                  </div>
                  <div className="order-details">
                    <span className="order-number">
                      Order Number: {order.orderId}
                    </span>
                    <span className="order-date">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <span className="order-total">
                      Total: ${order.totalAmount}
                    </span>
                  </div>
                  <button className="see-details-button">
                    See Full Details
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
      <ProductFooter />
    </>
  );
};

export default Orders;
