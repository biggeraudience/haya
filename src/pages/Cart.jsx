import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCartContext } from "../context/CartContextContext"; // Updated hook
import "../styles/cart.scss";
import { useNavigate } from "react-router-dom";
import useAnalytics from '../hooks/useAnalytics';


const Cart = () => {
  useAnalytics();
  const [activeTab, setActiveTab] = useState("bag");
  const navigate = useNavigate(); 
  const {
    cartItems,
    favorites,
    updateQuantity,
    removeItem,
    addItemToCart,
    removeFavorite,
    total,
    clearAllItems, // Assuming you have this function in your CartContext
  } = useCartContext();

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <div className="cart-container">
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

          {activeTab === "bag" && (
            <div className="bag-section">
              <div className="empty-bag">
                <p>Empty Bag</p>

                {cartItems.length > 0 && (
                  <button
                    className="clear-all-btn"
                    onClick={clearAllItems} // Assuming this function is implemented in your context
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
        {/* Display bespoke icon if the product is a bespoke fabric */}
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
        {item.selectedColors && item.selectedColors.length > 0 ? (
          <span>Color: {item.selectedColors.join(", ")}</span>
        ) : (
          <span>No color selected</span>
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
                e.target.value
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
        <span>${item.price * item.quantity}</span>
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
                  <span>Total: ${total}</span>
                  <button
                    className="pay-btn"
                    onClick={() => navigate("/checkout")} // Use navigate here
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
              {favorites.length === 0 ? (
                <div className="empty-favorites">
                  <p>No Favorites Yet</p>
                </div>
              ) : (
                <div className="products-grid favorites-grid">
                  {favorites.map((item) => (
                    <div key={item.id} className="favorite-card">
                      {/* Ensure fallback to placeholder if image is missing */}
                      <img
                        src={item.images && item.images.length > 0 ? item.images[0] : "/path/to/placeholder-image.jpg"} // Default placeholder
                        alt={item.name}
                      />
                      <div className="favorite-details">
                        <span>Price: ${item.price}</span>
                        <button
                          className="buy-btn"
                          onClick={() => {
                            addItemToCart({ ...item, quantity: 1 });
                            removeFavorite(item.id);
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
      </div>
    </>
  );
};

export default Cart;
