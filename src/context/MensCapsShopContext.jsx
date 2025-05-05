import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const MensCapsShopContext = createContext();

const MensCapsShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  // Filter states
  const [selectedSubcategory, setSelectedSubcategory] = useState([]); // e.g., Tangaran, Bangol, Damanga, Zannuwa
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');

  // Fetch mens caps products using public route
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products/public?category=menscaps');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching mens caps:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (selectedSubcategory.length > 0) {
      filtered = filtered.filter(product =>
        selectedSubcategory.includes(product.attributes.subcategory)
      );
    }
    if (selectedColor.length > 0) {
      filtered = filtered.filter(product =>
        product.attributes.color?.some(color => selectedColor.includes(color))
      );
    }
    if (selectedMaterial) {
      filtered = filtered.filter(product =>
        product.attributes.material === selectedMaterial
      );
    }
    if (selectedSize.length > 0) {
      filtered = filtered.filter(product =>
        product.attributes.size?.some(size => selectedSize.includes(size))
      );
    }
    if (selectedStyle) {
      filtered = filtered.filter(product =>
        product.attributes.style === selectedStyle
      );
    }
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilterProducts(filtered);
  }, [selectedSubcategory, selectedColor, selectedMaterial, selectedSize, selectedStyle, sortOrder, products]);

  const resetFilters = () => {
    setSelectedSubcategory([]);
    setSelectedColor([]);
    setSelectedMaterial(null);
    setSelectedSize([]);
    setSelectedStyle(null);
    setSortOrder('relevant');
    setFilterProducts(products);
  };

  return (
    <MensCapsShopContext.Provider
      value={{
        products,
        filterProducts,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedColor,
        setSelectedColor,
        selectedMaterial,
        setSelectedMaterial,
        selectedSize,
        setSelectedSize,
        selectedStyle,
        setSelectedStyle,
        sortOrder,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </MensCapsShopContext.Provider>
  );
};

export const useMensCapsShop = () => useContext(MensCapsShopContext);
export default MensCapsShopProvider;
