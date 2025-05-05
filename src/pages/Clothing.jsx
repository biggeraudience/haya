import React, { useState, useContext, useEffect } from 'react';
import { ClothingShopContext } from '../context/ClothingShopContext';
import FilterBar from "../modals/FilterBar";
import Navbar from "../components/Navbar";
import ProductFooter from "../components/ProductFooter";
import ProductPopup from "../components/ProductPopup";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import NextPageModal from '../modals/NextPageModal';
import { useFilterContext } from '../context/FilterContext';
import { useSettings } from "../context/SettingsContext"; 
import GridLayout from '../components/GridLayout'; 
import Chat from '../components/Chat';
import useAnalytics from '../hooks/useAnalytics'; 
import "../styles/productspage.scss";

const Clothing = () => {
  useAnalytics();
  const { filterProducts } = useContext(ClothingShopContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { settings, updateSettings } = useSettings();

  const { applyFilters } = useFilterContext();

  useEffect(() => {
    applyFilters("clothing");
  }, [applyFilters]);

  const handleAddToFavorites = (productName) => {
    toast.success(`${productName} added to favorites!`);
  };

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedProduct(null);
  };

  const { min, max } = settings.productLimits;
  const filteredByPrice = filterProducts.filter(product => product.price >= min && product.price <= max);
  const productLayout = settings.productLayout || 'grid';

  return (
    <div
      className={`clothing-page ${settings.theme} font-size-${settings.fontSize}`}
      style={{
        backgroundColor: "#fff", // Force white background
        color: settings.theme === "dark" ? "#fff" : "#000",
        margin: 0,
        padding: 0
      }}
    >
      <Navbar />
      <div className="page-container">
        <div className="content-section">
          <div className="content-wrapper">
            <div className="toggle-view-wrapper">
              <ViewToggleButton
                onViewChange={(newView) => {
                  updateSettings('productLayout', newView ? 'swipe' : 'grid');
                }} 
              />
            </div>
            {/* The FilterBar sits on top of the grid container */}
            <FilterBar category="clothing" />
            <div className="product-display-area">
              {productLayout === 'grid' ? (
                <GridLayout 
                  filteredProducts={filteredByPrice} 
                  handleAddToFavorites={handleAddToFavorites} 
                  handleBuyClick={handleBuyClick} 
                  category="clothing"
                />
              ) : (
                <SwipeLayout 
                  filteredProducts={filteredByPrice} 
                  handleAddToFavorites={handleAddToFavorites} 
                  handleBuyClick={handleBuyClick} 
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Chat />
      <ProductFooter />
      {isPopupVisible && <ProductPopup product={selectedProduct} onClose={handleClosePopup} />}
    </div>
  );
};

export default Clothing;
