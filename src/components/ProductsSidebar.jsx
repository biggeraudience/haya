import React from "react";
import "../styles/productsidebar.scss";

const ProductsSidebar = ({
  isOpen,
  selectedGender,
  setSelectedGender,
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
}) => {
  return (
    <div className={`products-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Filters</h2>
      </div>
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3>Gender</h3>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value.toLowerCase())}
          >
            <option value="all">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </div>
        <div className="sidebar-section">
          <h3>Category</h3>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value.toLowerCase())}
          >
            <option value="all">All</option>
            <option value="clothing">Clothing</option>
            <option value="bags">Bags</option>
            <option value="fragrance">Fragrance</option>
            <option value="jewelry">Jewelry</option>
            <option value="shoes">Shoes</option>
            <option value="veils">Veils</option>
            <option value="womensfabrics">Fabrics (Women)</option>
            <option value="mensaccessories">Accessories (Men)</option>
            <option value="menscaps">Caps (Men)</option>
            <option value="mensclothing">Clothing (Men)</option>
            <option value="mensfabrics">Fabrics (Men)</option>
            <option value="mensperfumes">Perfumes (Men)</option>
            <option value="mensshoes">Shoes (Men)</option>
          </select>
        </div>
        <div className="sidebar-section">
          <h3>Subcategory</h3>
          <select
            value={selectedSubcategory}
            onChange={(e) =>
              setSelectedSubcategory(e.target.value.toLowerCase())
            }
          >
            <option value="all">All</option>
            <option value="abaya">Abaya</option>
            <option value="t-shirt">T-Shirt</option>
            <option value="dress">Dress</option>
            <option value="sneakers">Sneakers</option>
            <option value="heels">Heels</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductsSidebar;
