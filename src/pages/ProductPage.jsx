import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FilterBar from '../modals/FilterBar';
import ActivePageMenu from '../modals/ActivePageMenu';
import ProductFooter from '../components/ProductFooter';
import ProductPopup from '../components/ProductPopup';
import GridLayout from '../components/GridLayout';
import SwipeLayout from '../components/SwipeLayout';
import ViewToggleButton from '../components/ViewToggleButton';
import Chat from '../components/Chat';
import { useFilterContext } from '../context/FilterContext';
import { useSettings } from '../context/SettingsContext';
import useAnalytics from '../hooks/useAnalytics';
import '../styles/productpage.scss';

// Import all shop contexts
import { ClothingShopContext } from '../context/ClothingShopContext';
import { BagsShopContext } from '../context/BagsShopContext';
import { FragranceShopContext } from '../context/FragrancesShopContext';
import { JewelryShopContext } from '../context/JewelryShopContext';
import { ShoesShopContext } from '../context/ShoesShopContext';
import { VeilsShopContext } from '../context/VeilsShopContext';

// Map each category to its corresponding context
const contextMap = {
  clothing: ClothingShopContext,
  bags: BagsShopContext,
  fragrance: FragranceShopContext,
  jewelry: JewelryShopContext,
  shoes: ShoesShopContext,
  veils: VeilsShopContext,
};

const ProductPage = () => {
  useAnalytics();
  const { category } = useParams(); // e.g., "clothing", "bag", "jewellery", etc.

  // Normalize the category from the URL
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

  // Use normalized category everywhere!
  const normalizedCategory = normalizeCategory(category);
  const ShopContext = contextMap[normalizedCategory];

  if (!ShopContext) {
    return <div>Invalid category: {category}</div>;
  }

  // Retrieve shop-specific data using the mapped context
  const shopData = useContext(ShopContext);
  const { filterProducts, handleAddToFavorites } = shopData;
  const { applyFilters } = useFilterContext();
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    // Use normalizedCategory here instead of the raw category from URL
    applyFilters(normalizedCategory);
  }, [applyFilters, normalizedCategory]);

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedProduct(null);
  };

  // Optionally filter products by price if settings.productLimits exists
  let productsToDisplay = filterProducts;
  if (settings.productLimits) {
    const { min, max } = settings.productLimits;
    productsToDisplay = filterProducts.filter(
      (product) => product.price >= min && product.price <= max
    );
  }

  const productLayout = settings.productLayout || 'grid';

  return (
    <div className={`product-container ${settings.theme} font-size-${settings.fontSize}`}>
      <Navbar />
      <div className="container">
        <div className="wrapper">
          <FilterBar category={normalizedCategory} />
          <div className="product-main-box">
            {productLayout === 'grid' ? (
              <GridLayout
                filteredProducts={productsToDisplay}
                handleAddToFavorites={handleAddToFavorites}
                handleBuyClick={handleBuyClick}
                category={normalizedCategory}
              />
            ) : (
              <SwipeLayout
                filteredProducts={productsToDisplay}
                handleAddToFavorites={handleAddToFavorites}
                handleBuyClick={handleBuyClick}
                category={normalizedCategory}
              />
            )}
          </div>
        </div>
      </div>
      <Chat />
      <ProductFooter />
      {isPopupVisible && (
        <ProductPopup product={selectedProduct} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default ProductPage;
