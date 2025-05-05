import React, { useState, useRef } from 'react';  
import { Link } from 'react-router-dom';
import ProductPopup from './ProductPopup';
import '../styles/grid.scss';

// New component to handle hover autoplay of product images
const HoverImage = ({ images, alt }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);

  const handleMouseEnter = () => {
    if (images && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1000);
    }
  };

  const handleMouseLeave = () => {
    clearInterval(intervalRef.current);
    setCurrentImageIndex(0);
  };

  return (
    <img
      src={images && images[currentImageIndex]}
      alt={alt}
      className="grid-product-image"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

// Helper function to normalize category names
const normalizeCategory = (cat) => {
  switch (cat.toLowerCase()) {
    case 'bag':
    case 'bags':
      return 'bags';
    case 'jewellery':
    case 'jewelry':
      return 'jewelry';
    default:
      return cat.toLowerCase();
  }
};

const GridLayout = ({ handleAddToFavorites, handleBuyClick, filteredProducts, category }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favoriteStatus, setFavoriteStatus] = useState({});

  const handleBuyButtonClick = (product) => {
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const handleFavoriteClick = (productId) => {
    setFavoriteStatus((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Normalize both product and route category before comparing
  const productsToRender = filteredProducts.filter(
    product => normalizeCategory(product.category) === normalizeCategory(category)
  );

  return (
    <div className="grid-products-container">
      {productsToRender.map((product, index) => (
        <div key={index} className="grid-product-box">
          <Link to={`/${product.name}`}>
            <HoverImage images={product.images} alt={product.name} />
          </Link>
          <div className="grid-product-details">
            <div className="grid-actions">
              <span className="grid-price">{`$${product.price}`}</span>
              <button
                className="grid-favorites-button"
                onClick={() => handleFavoriteClick(product.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill={favoriteStatus[product.id] ? "#FE5829" : "#000"}
                >
                  <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
                </svg>
              </button>
              <button 
                className="grid-buy-button"
                onClick={() => handleBuyButtonClick(product)}
              >
                BUY
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {isPopupOpen && selectedProduct && (
        <ProductPopup 
          product={selectedProduct}
          onClose={closePopup} 
          onCheckout={(product) => console.log('Proceed to checkout with:', product)} 
        />
      )}
    </div>
  );
};

export default GridLayout;
