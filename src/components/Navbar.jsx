import React, { useState, useEffect } from "react"; 
import ReactDOM from "react-dom";
import BespokeOrderModal from "../modals/BespokeOrderModal";
import TrackOrder from "../modals/TrackOrder";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContextContext";
import { useMessageContext } from "../context/MessageContext";
import "../styles/navbar.scss";

const Navbar = () => {
  const { cartItems } = useCartContext();
  const { unreadCount } = useMessageContext();
  const [itemCount, setItemCount] = useState(0);
  const [showWidgets, setShowWidgets] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);

  useEffect(() => {
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setItemCount(totalItems);
  }, [cartItems]);

  const toggleWidgets = () => {
    setShowWidgets(!showWidgets);
  };

  // Widget icons: Favorites & Profile shown only when toggled;
  // Notifications & Cart show if counts > 0 or toggled.
  const showFavorites = showWidgets;
  const showProfile = showWidgets;
  const showNotifications = showWidgets || unreadCount > 0;
  const showCart = showWidgets || itemCount > 0;
  const anyWidgetVisible =
    showFavorites || showProfile || showNotifications || showCart;

  return (
    <>
      <div className="nav">
        {/* Logo */}
        <Link to="/" className="nav__logo-link">
          <div className="nav__logo"></div>
        </Link>

        <div className="nav__icons">
          {/* Only Search remains here. The horizontal panel has been removed. */}
          <div className="nav__search-and-panel">
            <div className="nav__search">
              <input type="text" placeholder="SEARCH" />
            </div>
          </div>

          {/* Blip and Widget Icons */}
          <div className="nav__blip-container">
            <button className="nav__blip-button" onClick={toggleWidgets}>
              <img src="/src/assets/icons/nav_blip.svg" alt="Blip" />
            </button>
            {anyWidgetVisible && (
              <div className="nav__widget-icons">
                {showFavorites && (
                  <Link to="/Favorites" className="nav__icon nav__icon--favorite">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 -960 960 960"
                      fill="#000"
                    >
                      <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
                    </svg>
                  </Link>
                )}
                {showProfile && (
                  <Link to="/Profile" className="nav__icon nav__icon--profile">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 -960 960 960"
                      fill="#000"
                    >
                      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                    </svg>
                  </Link>
                )}
                {showNotifications && (
                  <Link to="/Notifications" className="nav__icon nav__icon--messages">
                    {unreadCount > 0 && (
                      <span className="nav__icon-count">{unreadCount}</span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 -960 960 960"
                      fill="#000"
                    >
                      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
                    </svg>
                  </Link>
                )}
                {showCart && (
                  <Link to="/Cart" className="nav__icon nav__icon--cart">
                    {itemCount > 0 && (
                      <span className="nav__icon-count">{itemCount}</span>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24px"
                      height="24px"
                      viewBox="0 -960 960 960"
                      fill="#000"
                    >
                      <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480ZM400-160v-480Z" />
                    </svg>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showTrackModal && <TrackOrder closeModal={() => setShowTrackModal(false)} />}
      {showModal && <BespokeOrderModal closeModal={() => setShowModal(false)} />}
    </>
  );
};

export default Navbar;
