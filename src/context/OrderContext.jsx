// src/context/OrderContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

const OrderProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders for the current user
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: "GET",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new order using order data (e.g., from the cart)
  const createOrder = async (orderData) => {
    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(orderData),
      });
      if (res.ok) {
        const data = await res.json();
        // Optionally, update orders state by prepending the new order
        setOrders((prevOrders) => [data, ...prevOrders]);
        return data;
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading, fetchOrders, createOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
