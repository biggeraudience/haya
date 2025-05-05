import React, { useContext, useState } from 'react';
import { FragranceShopContext } from '../context/FragrancesShopContext';
import FilterBar from '../modals/FilterBar';
import Navbar from '../components/Navbar';
import ProductFooter from '../components/ProductFooter';
import ActivePageMenu from '../modals/ActivePageMenu';
import ProductPopup from '../components/ProductPopup';
import { useSettings } from '../context/SettingsContext';
import GridLayout from '../components/GridLayout';
import SwipeLayout from '../components/SwipeLayout';
import ViewToggleButton from '../components/ViewToggleButton';
import useAnalytics from '../hooks/useAnalytics'; 


const Fragrances = () => {useAnalytics();
  const { filterProducts, resetFilters } = useContext(FragranceShopContext);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { settings, updateSettings } = useSettings();

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
    <div
      className={`fragrance-container ${settings.theme} font-size-${settings.fontSize}`}
      style={{
        backgroundColor: settings.theme === 'dark' ? '#333' : '#f9f9f9',
        color: settings.theme === 'dark' ? '#fff' : '#000',
        fontSize:
          settings.fontSize === 'small'
            ? '14px'
            : settings.fontSize === 'large'
            ? '18px'
            : '16px',
      }}
    >
      <Navbar />
      <div className="container">
        <div className="wrapper">
          <div className="active-page-menu">
            <ActivePageMenu />
          </div>
          <div className="view-toggle-container">
            <ViewToggleButton
              onViewChange={(newView) =>
                updateSettings('productLayout', newView ? 'swipe' : 'grid')
              }
            />
          </div>
          <FilterBar category="fragrance" />
          
          <div className="fragrance-main-box">
            {productLayout === 'grid' ? (
              <GridLayout
                filteredProducts={filterProducts}
                handleBuyClick={handleBuyClick}
                category="fragrance"
              />
            ) : (
              <SwipeLayout
                filteredProducts={filterProducts}
                handleBuyClick={handleBuyClick}
                category="fragrance"
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

export default Fragrances;
