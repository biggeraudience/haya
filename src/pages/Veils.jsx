import React, { useState, useEffect, useContext } from 'react';
import { VeilsShopContext } from '../context/VeilsShopContext';
import FilterBar from "../modals/FilterBar";
import Navbar from "../components/Navbar";
import ProductFooter from "../components/ProductFooter";
import ActivePageMenu from '../modals/ActivePageMenu';
import ProductPopup from "../components/ProductPopup";
import { useFilterContext } from '../context/FilterContext';
import { useSettings } from "../context/SettingsContext";
import GridLayout from '../components/GridLayout';
import SwipeLayout from '../components/SwipeLayout';
import ViewToggleButton from '../components/ViewToggleButton';
import useAnalytics from '../hooks/useAnalytics';


const Veils = () => {
  useAnalytics();
  const { filterProducts, handleAddToFavorites } = useContext(VeilsShopContext);
  const { applyFilters } = useFilterContext();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    applyFilters('veils');
  }, [applyFilters]);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedProduct(null);
  };

  const productLayout = settings.productLayout || 'grid';

  return (
    <div className={`clothing-container ${settings.theme} font-size-${settings.fontSize}`}>
      <Navbar />
      <div className="container">
        <div className="wrapper">
          <div className="active-page-menu">
            <ActivePageMenu />
          </div>
          <div className="view-toggle-container">
            <ViewToggleButton
              onViewChange={(newView) => updateSettings('productLayout', newView ? 'swipe' : 'grid')}
            />
          </div>
          <FilterBar category="veils" />
          <div className="clothing-main-box">
            {productLayout === 'grid' ? (
              <GridLayout
                filteredProducts={filterProducts}
                handleAddToFavorites={handleAddToFavorites}
                handleBuyClick={handleBuyClick}
                category="veils"
              />
            ) : (
              <SwipeLayout
                filteredProducts={filterProducts}
                handleAddToFavorites={handleAddToFavorites}
                handleBuyClick={handleBuyClick}
              />
            )}
          </div>
        </div>
      </div>
      <ProductFooter />
      {isPopupVisible && <ProductPopup product={selectedProduct} onClose={handleClosePopup} />}
    </div>
  );
};

export default Veils;
