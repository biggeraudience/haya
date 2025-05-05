import React from "react";
import "../styles/checkout.scss";
import { useCartContext } from "../context/CartContextContext";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import ProductFooter from "../components/ProductFooter";

const Checkout = () => {
  const { cartItems } = useCartContext();
  const { user } = useUser();
  const { formattedTotal } = useCartContext();
  const { totalWithDelivery, formattedDeliveryFee } = useCartContext();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <p>Your cart is empty. Please add items to proceed.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-label">CHECKOUT</div>
          
          <div className="user-info">
            <div className="user-image">
              <img
                src={user?.image || "default-image-url.jpg"}
                alt={user?.name || "User"}
              />
            </div>
            <div className="user-details">
              <div className="logged-in-user">{user?.name}</div>
              <button className="guest-checkout-button">
                Checkout as Guest
              </button>
            </div>
          </div>

          <div className="content-wrapper">
            <div className="left-column">
              <div className="address">
                <div className="address-box-label">
                  {user ? "Address" : ""}
                </div>
                <button className="address-edit-button">Edit</button>
                {user ? (
                  <div className="saved-address">
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Address:</strong> {user.address}
                    </p>
                    <p>
                      <strong>City:</strong> {user.city}
                    </p>
                    <p>
                      <strong>Country:</strong> {user.country}
                    </p>
                    <p>
                      <strong>Phone:</strong> {user.phone}
                    </p>
                  </div>
                ) : (
                  <form>
                    
                    <input
                      type="text"
                      id="full-name"
                      placeholder="Enter your full name"
                    />
                    <input
                      type="text"
                      id="address-line"
                      placeholder="Enter your address"
                    />
                    <input
                      type="text"
                      id="city"
                      placeholder="Enter your city"
                    />
                    <input
                      type="text"
                      id="phone"
                      placeholder="Enter your phone number"
                    />
                  </form>
                )}
                <div className="delivery-fee">
                  <p>
                    <strong>Delivery Fee:</strong> $
                    {(Number(formattedDeliveryFee) || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="cards">
                <button className="edit-button">Edit</button>
                <div className="card-details">
                  <div className="financial-service">
                    <svg
                      width="58"
                      height="48"
                      viewBox="0 0 58 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    ></svg>
                  </div>
                  <div className="user-name">{user?.name}</div>
                  <div className="user-card-name">
                    Debit Mastercard (0648)
                  </div>
                  <div className="expiry-date">10/27</div>
                </div>
                <div className="input-fields">
                  <input type="text" id="cvv" placeholder="CVV" />
                  <input type="text" id="pin" placeholder="PIN" />
                </div>
              </div>
            </div>

            <div className="right-column">
              <div className="items">
                <button className="item-edit-button">Edit</button>
                <div className="items-grid">
                  {cartItems.map((item, index) => (
                    <div key={index} className="item-card">
                      <div className="item-image">
                        <img
                          src={
                            Array.isArray(item.images)
                              ? item.images[0]
                              : item.images
                          }
                          alt={item.name}
                        />
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-color">
                          Color: {item.selectedColors.join(", ")}
                        </div>
                        <div className="item-price">
                          Price: ${item.price}
                        </div>
                        <div className="item-quantity">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="item-subtotal">
                  <span>Subtotal: ${formattedTotal}</span>
                </div>
              </div>
              {/* Footer with Total and Complete Order button */}
              <div className="footer">
                <div className="svg-container">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#75FB4C"
                  >
                    <path d="M420-360h120l-23-129q20-10 31.5-29t11.5-42q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 23 11.5 42t31.5 29l-23 129Zm60 280q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" />
                  </svg>
                  <span>
                    Secured by<span className="knox">Knox Inc</span>
                  </span>
                </div>
                <div className="total-amount">
                  <p>
                    <strong>Total:</strong> ${totalWithDelivery.toFixed(2)}
                  </p>
                </div>
                <button className="complete-order-btn">Complete Order</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductFooter />
    </>
  );
};

export default Checkout;
