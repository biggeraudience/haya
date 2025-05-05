import React, { useState } from "react";
import PropTypes from "prop-types";
import { useCartContext } from "../context/CartContextContext";
import { useNavigate } from "react-router-dom";

const CATEGORY_FIELDS = {
  clothing: { requires: ["size", "color"] },
  bags: { requires: ["color"] },
  shoes: { requires: ["size", "color"] },
  fragrance: { requires: ["size"] },
  jewelry: { requires: ["color"] },
  veils: { requires: ["color"] },
};

const ProductPopup = ({ product, onClose, onCheckout }) => {
  const navigate = useNavigate();
  const { addItemToCart } = useCartContext();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // Provide a default empty object for attributes to avoid undefined errors
  const { category, attributes = {} } = product;
  const requiredFields = CATEGORY_FIELDS[category]?.requires || [];

  console.log("Product data:", product);

  const handleSizeChange = (size) => setSelectedSize(size);
  const handleColorChange = (color) => setSelectedColor(color);

  const validateSelection = () => {
    if (requiredFields.includes("size") && !selectedSize) {
      alert("Please select a size.");
      return false;
    }
    if (requiredFields.includes("color") && !selectedColor) {
      alert("Please select a color.");
      return false;
    }
    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return false;
    }
    return true;
  };

  const handleAddToBag = () => {
    if (validateSelection()) {
      const selectedProduct = {
        ...product,
        selectedSize: requiredFields.includes("size") ? selectedSize : null,
        selectedColor: requiredFields.includes("color") ? selectedColor : null,
        quantity,
      };
      addItemToCart(selectedProduct);
      setToastMessage(`${product.name} is in your bag!`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Parse color and size options from attributes safely
  const colors = attributes.color ? attributes.color.split(",") : [];
  const sizes = attributes.size ? attributes.size.split(",") : [];

  return (
    <div className="popup-overlay" onClick={onClose}
    style={{ fontFamily: "'Overpass Mono'" }}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-button" onClick={onClose}>
          ✕
        </button>
        <img
          src={product.images[0]}
          alt={product.name}
          className="popup-product-image"
        />
        <h2>{product.name}</h2>
        <p className="popup-price">Price: ${product.price}</p>

        <div className="popup-options">
          {requiredFields.includes("color") && colors.length > 0 ? (
            <div className="popup-colors">
              <p>Color:</p>
              {colors.map((color, index) => (
                <label key={index} className="popup-color-option">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    checked={selectedColor === color}
                    onChange={() => handleColorChange(color)}
                  />
                  {color}
                </label>
              ))}
            </div>
          ) : requiredFields.includes("color") ? (
            <p>No color options available.</p>
          ) : null}

          {requiredFields.includes("size") && sizes.length > 0 ? (
            <div className="popup-sizes">
              <p>Available Sizes:</p>
              {sizes.map((size, index) => (
                <label key={index} className="popup-size-option">
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={selectedSize === size}
                    onChange={() => handleSizeChange(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          ) : requiredFields.includes("size") ? (
            <p>No size options available.</p>
          ) : null}

          <p>Quantity:</p>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="popup-quantity-selector"
          />
        </div>

        <div className="popup-actions">
          <button className="popup-add-to-bag" onClick={handleAddToBag}>
            Add to Bag
          </button>
          <button
            className="popup-checkout"
            onClick={() => {
              if (validateSelection()) {
                const selectedProduct = {
                  ...product,
                  selectedSize: requiredFields.includes("size") ? selectedSize : null,
                  selectedColor: requiredFields.includes("color") ? selectedColor : null,
                  quantity,
                };
                onCheckout(selectedProduct);
                navigate("/checkout");
              }
            }}
          >
            Checkout
          </button>
        </div>
      </div>

      {toastMessage && <div className="toast-message">{toastMessage}</div>}
    </div>
  );
};

ProductPopup.propTypes = {
  product: PropTypes.shape({
    images: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    attributes: PropTypes.shape({
      color: PropTypes.string,
      size: PropTypes.string,
    }),
    category: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckout: PropTypes.func,
};

export default ProductPopup;
