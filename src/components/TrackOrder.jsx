// src/components/FeedContent/TrackOrder.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // Assuming user context is needed to get user ID
import '../styles/trackordercontent.scss'; // New SCSS file

const TrackOrder = () => {
  const { user } = useUser(); // Get the logged-in user
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for viewing details

  useEffect(() => {
    // Fetch orders when the component mounts or user changes
    const fetchOrders = async () => {
      if (!user) {
        // Handle case where user is not logged in (maybe show a message or redirect)
        setIsLoading(false);
        setOrders([]); // Clear any previous orders
        return;
      }

      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        // Replace with your actual API call to fetch user orders
        const response = await fetch(`/api/orders/user/${user._id}`); // Example API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders. Please try again.");
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    // Cleanup function if needed (e.g., to cancel fetch on unmount)
    // return () => { /* cleanup */ };

  }, [user]); // Re-run effect if the user object changes


  // Function to show order details
  const viewOrderDetails = (order) => {
      setSelectedOrder(order);
  };

  // Function to go back to the order list
  const backToOrdersList = () => {
      setSelectedOrder(null);
  };


  // --- Render Logic ---

  if (!user) {
      return (
          <div className="track-order-container">
              <div className="track-order-message">
                  <p>Please log in to view your order history.</p>
              </div>
          </div>
      );
  }


  if (isLoading) {
    return (
         <div className="track-order-container">
              <div className="track-order-message">
                  <p>Loading orders...</p>
               </div>
         </div>
    );
  }

  if (error) {
    return (
         <div className="track-order-container">
              <div className="track-order-message error">
                  <p>{error}</p>
               </div>
         </div>
    );
  }

  // If an order is selected, show details
  if (selectedOrder) {
      return (
          <div className="track-order-container">
              <button onClick={backToOrdersList} className="back-button">Back to Orders</button>
               <div className="order-details-view">
                  <h2>Order Details</h2>
                  <p>Order ID: {selectedOrder.orderId}</p>
                  <p>Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p> {/* Format date */}
                  <p>Status: {selectedOrder.status}</p>
                  <p>Total: ${selectedOrder.total.toFixed(2)}</p> {/* Format total */}

                  <h3>Items:</h3>
                  <ul>
                      {selectedOrder.items.map(item => (
                          <li key={item.itemId}>
                              {item.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
                          </li>
                      ))}
                  </ul>

                  {/* Add shipping info, tracking number etc. if available in your order data */}
               </div>
          </div>
      );
  }


  // Otherwise, show the list of orders
  if (orders.length === 0) {
    return (
         <div className="track-order-container">
              <div className="track-order-message">
                   <p>You have no recent orders.</p>
               </div>
         </div>
    );
  }


  return (
    <div className="track-order-container">
      <h2>Your Orders</h2>
      <ul className="order-list">
        {orders.map(order => (
          <li key={order.orderId} className="order-summary-item"> {/* Use orderId as key */}
            <div className="order-info">
              <span>Order #{order.orderId}</span> {/* Display Order ID */}
              <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span> {/* Format date */}
              <span>Status: {order.status}</span>
              <span>Total: ${order.total.toFixed(2)}</span> {/* Format total */}
            </div>
            <button onClick={() => viewOrderDetails(order)} className="details-button">View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackOrder;