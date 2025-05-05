/* src/components/FeedContent/CartContent.jsx */
import React, { useState } from "react";
import { useCartContext } from "../context/CartContextContext"; // Adjust path if needed
import useAnalytics from '../hooks/useAnalytics'; // Adjust path if needed

// Import the new styles for the component
import '../styles/cartcontent.scss'; // Make sure this path is correct

const CartContent = () => {
  useAnalytics(); // Keep analytics hook

  const [activeTab, setActiveTab] = useState("bag"); // Keep internal tab state

  // Use the cart context
  const {
    cartItems,
    favorites,
    updateQuantity,
    removeItem,
    addItemToCart,
    removeFavorite,
    total,
    clearAllItems,
  } = useCartContext();

  // Function to handle checkout - will not use navigate directly here
  const handleCheckout = () => {
      // Instead of navigating to a new page, you might
      // 1. Trigger a modal for checkout
      // 2. Redirect the entire application to the checkout page (if it's a separate route)
      // 3. Emit an event that a parent component can handle to change the main view

      console.log("Proceeding to Checkout...");
      // Example: You would typically call a function provided by a parent context
      // or use window.location.href = '/checkout'; if it's a full page redirect
      alert("Checkout functionality would be triggered here!");
  };

  return (
    <div className="cart-content-container"> {/* Use the new container class */}
      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "bag" ? "active" : ""}`}
          onClick={() => setActiveTab("bag")}
        >
          BAG
        </button>
        <button
          className={`tab ${activeTab === "favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("favorites")}
        >
          FAVORITES
        </button>
      </div>

      {/* Bag Section */}
      {activeTab === "bag" && (
        <div className="bag-section">
          <div className="empty-bag">
            <p>Bag ({cartItems.length} items)</p> {/* Show item count */}

            {cartItems.length > 0 && (
              <button
                className="clear-all-btn"
                onClick={clearAllItems}
              >
                X
              </button>
            )}
          </div>
          <div className="products-grid">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${(item.selectedColors || []).join(",")}`}
                className="product-card"
              >
                <img
                  src={item.images?.[0] || "/path/to/placeholder-image.jpg"}
                  alt={item.name}
                />
                <div className="product-name">
                  {item.isBespoke && (
                    <span className="bespoke-icon" title="Custom Bespoke Order">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#000"
                      >
                        <path d="m240-522-40 22q-14 8-30 4t-24-18L66-654q-8-14-4-30t18-24l230-132h70q9 0 14.5 5.5T400-820v20q0 33 23.5 56.5T480-720q33 0 56.5-23.5T560-800v-20q0-9 5.5-14.5T580-840h70l230 132q14 8 18 24t-4 30l-80 140q-8 14-23.5 17.5T760-501l-40-20v361q0 17-11.5 28.5T680-120H280q-17 0-28.5-11.5T240-160v-362Z" />
                      </svg>
                    </span>
                  )}
                  <span>{item.name}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    X
                  </button>
                </div>
                <div className="product-details">
                  {item.selectedColors && item.selectedColors.length > 0 && (
                    <span>Color: {item.selectedColors.join(", ")}</span>
                  )}
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  <div className="quantity-selector">
                    <button
                      className="decrement-btn"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          item.selectedColors,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1} // Disable if quantity is 1 or less
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          item.selectedColors,
                          parseInt(e.target.value, 10) || 1 // Ensure quantity is a number
                        )
                      }
                    />
                    <button
                      className="increment-btn"
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          item.selectedColors,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span> {/* Format price */}
                </div>
              </div>
            ))}
          </div>

          <div className="pay-section">
            <p className="terms">
              {cartItems.length > 3
                ? "*By continuing, I declare that I have read and accept the Purchase Conditions and understand Haya Fashion LLC Privacy and Cookie Policy."
                : "Read T&C"}
            </p>
            <div className="total">
              <span>Total: ${total.toFixed(2)}</span> {/* Format total price */}
              <button
                className="pay-btn"
                onClick={handleCheckout} // Use the local handler
                disabled={cartItems.length === 0} // Disable if cart is empty
              >
                PAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Section */}
      {activeTab === "favorites" && (
        <div className="favorites-section">
          <div className="empty-favorites">
              <p>Favorites ({favorites.length} items)</p> {/* Show favorite count */}
          </div>
           {favorites.length === 0 ? (
             <p>No Favorites Yet</p> // More prominent empty message
           ) : (
            <div className="products-grid favorites-grid">
              {favorites.map((item) => (
                <div key={item.id} className="favorite-card">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : "/path/to/placeholder-image.jpg"}
                    alt={item.name}
                  />
                   <div className="product-name"> {/* Use product-name class for consistency */}
                        <span>{item.name}</span>
                         <button
                             className="remove-btn"
                             onClick={() => removeFavorite(item.id)}
                         >
                             X
                         </button>
                    </div>
                  <div className="favorite-details">
                    <span>Price: ${item.price.toFixed(2)}</span> {/* Format price */}
                    <button
                      className="buy-btn"
                      onClick={() => {
                        addItemToCart({ ...item, quantity: 1 });
                        removeFavorite(item.id); // Optionally remove from favorites after adding to cart
                      }}
                    >
                      BUY
                    </button>
                  </div>
                </div>
              ))}
            </div>
           )}
        </div>
      )}
    </div>
  );
};

export default CartContent;