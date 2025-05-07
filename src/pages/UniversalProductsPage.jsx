// src/pages/UniversalProductsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProductFooter from "../components/ProductFooter";
import ProductPopup from "../components/ProductPopup";
import Chat from "../components/Chat";
import { toast } from "react-toastify";
import useAnalytics from "../hooks/useAnalytics";
import { useSettings } from "../context/SettingsContext";
import ProductSideBar from "../components/ProductSideBar";
import FilterBar from "../modals/FilterBar";
import { useFilterContext } from "../context/FilterContext";
import "../styles/universalproductspage.scss";

const normalizeGender = (gender) => {
  if (!gender) return "";
  const lower = gender.toLowerCase();
  if (lower === "male" || lower === "men") return "men";
  if (lower === "female" || lower === "women") return "women";
  return lower;
};

const mapCategoryKey = (gender, category) => {
  if (normalizeGender(gender) === "women") {
    if (category === "fabrics") return "womensfabrics";
    return category;
  } else if (normalizeGender(gender) === "men") {
    switch (category) {
      case "clothing":
        return "mensclothing";
      case "bags":
        return "mensbags";
      case "caps":
        return "menscaps";
      case "shoes":
        return "mensshoes";
      case "accessories":
        return "mensaccessories";
      case "perfumes":
        return "mensperfumes";
      case "fabrics":
        return "mensfabrics";
      default:
        return category;
    }
  }
  return category;
};


const getQueryCategory = (gender, category) => {
  if (normalizeGender(gender) === 'men' && category === 'accessories') {
    return 'mensaccessories';
  }
  return mapCategoryKey(gender, category);
};

const UniversalProductsPage = () => {
  useAnalytics();
  const { settings } = useSettings();
  const { filterProducts, isFilterApplied, setCurrentFilterKey } = useFilterContext();
  const [allProducts, setAllProducts] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedGender, setSelectedGender] = useState("men");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryCategory = getQueryCategory(selectedGender, selectedCategory);
        console.log("Querying with category:", queryCategory);

        const BASE_API_URL = import.meta.env.VITE_API_URL;

        const response = await axios.get(`${BASE_API_URL}/products/public`, {
          params: {
            gender: selectedGender,
            category: queryCategory
          }
        });

        setAllProducts(response.data);
      } catch (error) {
        console.error("Error fetching public products:", error);
      }
    };
    fetchProducts();
  }, [selectedGender, selectedCategory]);

  useEffect(() => {
    setCurrentFilterKey({ gender: selectedGender, category: selectedCategory });
  }, [selectedGender, selectedCategory, setCurrentFilterKey]);

  const { min, max } = settings.productLimits || { min: 0, max: 10000000 };
  const filteredProducts = allProducts
    .filter((product) => product.price >= min && product.price <= max)
    .filter((product) => {
      const genderMatch =
        product.gender &&
        normalizeGender(product.gender) === normalizeGender(selectedGender);
      const mappedCategory =
        selectedCategory === "all" ? "all" : mapCategoryKey(selectedGender, selectedCategory);
      const categoryMatch =
        mappedCategory === "all" ||
        (product.category && product.category === mappedCategory);
      const subcategoryMatch =
        selectedSubcategory === "all" ||
        (product.attributes && product.attributes.subcategory === selectedSubcategory);
      return genderMatch && categoryMatch && subcategoryMatch;
    });
  const finalProducts = isFilterApplied ? filterProducts : filteredProducts;
  const currentFilterKey = mapCategoryKey(selectedGender, selectedCategory);

  const handleAddToFavorites = (product) => {
    toast.success(`${product.name} added to favorites!`);
  };

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedProduct(null);
  };

  return (
    <div
      className={`universal-products-page ${settings.theme} font-size-${settings.fontSize}`}
      style={{
        backgroundColor: "#fff",
        color: settings.theme === "dark" ? "#fff" : "#000",
        margin: 0,
        padding: 0,
        position: "relative",
        height: "auto",
        overflowY: "auto",
      }}
    >
      <Navbar />
      <div className="mobile-header">
        <button className="hamburger-button" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000">
              <path d="m251.33-204.67-46.66-46.66L433.33-480 204.67-708.67l46.66-46.66L480-526.67l228.67-228.66 46.66 46.66L526.67-480l228.66 228.67-46.66 46.66L480-433.33 251.33-204.67Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000">
              <path d="M120-240v-66.67h720V-240H120Zm0-206.67v-66.66h720v66.66H120Zm0-206.66V-720h720v66.67H120Z"/>
            </svg>
          )}
        </button>
      </div>
      <ProductSideBar
        sidebarOpen={sidebarOpen}
        activeGender={selectedGender}
        selectedCategory={selectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedGender={setSelectedGender}
        setSelectedCategory={setSelectedCategory}
        setSelectedSubcategory={setSelectedSubcategory}
        showNavItems={sidebarOpen}
      />
      <div className="universal-page-container">
        <main className="universal-main-content">
          <FilterBar classname='filterbar' category={currentFilterKey} />
          <div className="products-display-wrapper">
            <div className="products-display">
              {finalProducts.map((product, index) => (
                <div key={index} className="grid-product-box">
                  <Link to={`/product/${product._id}`}>
                    <img src={product.images && product.images[0]} alt={product.name} className="grid-product-image" />
                  </Link>

                  <div className="grid-product-details">
                    <div className="grid-actions">
                      <span className="grid-price">{`$${product.price}`}</span>
                      <button
                        className="grid-favorites-button"
                        onClick={() => handleAddToFavorites(product)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill={product.isFavorite ? "#FE5829" : "#000"}
                        >
                          <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
                        </svg>
                      </button>
                      <button className="grid-buy-button" onClick={() => handleBuyClick(product)}>
                        BUY
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {finalProducts.length === 0 && <p>No products found.</p>}
            </div>
          </div>
        </main>
      </div>
      <Chat />
      <div className="product-footer">
        <ProductFooter />
      </div>
      {isPopupVisible && selectedProduct && (
        <ProductPopup
          product={selectedProduct}
          onClose={closePopup}
          onCheckout={(product) => console.log("Proceed to checkout with:", product)}
        />
      )}
    </div>
  );
};

export default UniversalProductsPage;
