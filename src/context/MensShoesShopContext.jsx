import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const MensShoesShopContext = createContext();

const MensShoesShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  // Filter states
  const [selectedSubcategory, setSelectedSubcategory] = useState([]); // e.g., Mules, Sandals, Traditional Leather Slippers
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedClosure, setSelectedClosure] = useState(null);
  const [selectedComfort, setSelectedComfort] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');

  // Fetch mens shoes products using public route
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products/public?category=mensshoes');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching mens shoes:', err);
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
    if (selectedClosure) {
      filtered = filtered.filter(product =>
        product.attributes.closure === selectedClosure
      );
    }
    if (selectedComfort) {
      filtered = filtered.filter(product =>
        product.attributes.comfortFeatures === selectedComfort
      );
    }
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilterProducts(filtered);
  }, [selectedSubcategory, selectedColor, selectedMaterial, selectedSize, selectedClosure, selectedComfort, sortOrder, products]);

  const resetFilters = () => {
    setSelectedSubcategory([]);
    setSelectedColor([]);
    setSelectedMaterial(null);
    setSelectedSize([]);
    setSelectedClosure(null);
    setSelectedComfort(null);
    setSortOrder('relevant');
    setFilterProducts(products);
  };

  return (
    <MensShoesShopContext.Provider
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
        selectedClosure,
        setSelectedClosure,
        selectedComfort,
        setSelectedComfort,
        sortOrder,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </MensShoesShopContext.Provider>
  );
};

export const useMensShoesShop = () => useContext(MensShoesShopContext);
export default MensShoesShopProvider;
