// src/components/Cards.jsx
import React, { useState, useEffect } from "react";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import { useUser } from "../context/UserContext";
import "../styles/cards.scss";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Cards = () => {
  const { user, updateCards } = useUser();
  const [cardData, setCardData] = useState({
    cardHolder: "",
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load card data when the user is available
  useEffect(() => {
    if (user && user.profile && user.profile.cards && user.profile.cards.length > 0) {
      setCardData(user.profile.cards[0]);
      setIsSaved(true);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handleSave = async () => {
    if (!user || !user._id) return;
    setLoading(true);
    try {
      const updatedCards = await updateCards(user._id, cardData);
      // Update the local state with the updated cards data
      setCardData(updatedCards[0] || {});
      setIsSaved(true);
      toast.success("Card information saved successfully!");
    } catch (error) {
      toast.error(error.message || "Error saving card information.");
    }
    setLoading(false);
  };

  const handleDelete = () => {
    setCardData({ cardHolder: "", cardNumber: "", expirationDate: "", cvv: "" });
    setIsSaved(false);
  };

  return (
    <div>
      <ProductNavbar />
      <div className="profile-page">
        <div className="main-box">
          <div className="inner-box">
            {loading ? (
              <Loader />
            ) : isSaved ? (
              <>
                <h2 className="form-heading">SAVED CARD INFORMATION</h2>
                <div className="saved-info">
                  <p><strong>Card Holder:</strong> {cardData.cardHolder}</p>
                  <p><strong>Card Number:</strong> {cardData.cardNumber}</p>
                  <p><strong>Expiration Date:</strong> {cardData.expirationDate}</p>
                  <p><strong>CVV:</strong> {cardData.cvv}</p>
                </div>
                <div className="button-group">
                  <button className="action-button" onClick={() => setIsSaved(false)}>
                    UPDATE
                  </button>
                  <button className="delete-button" onClick={handleDelete}>
                    DELETE
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="form-heading">CREDIT CARD DETAILS</h2>
                <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    name="cardHolder"
                    value={cardData.cardHolder}
                    placeholder="Card Holder Name"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    placeholder="Card Number"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="expirationDate"
                    value={cardData.expirationDate}
                    placeholder="Expiration Date"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    placeholder="CVV"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <button type="button" className="action-button" onClick={handleSave}>
                    SAVE
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <ProductFooter />
    </div>
  );
};

export default Cards;
