import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export const ShoesShopContext = createContext();

const ShoesShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);

  // Fetch all shoes products using the public route
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get('/products/public?category=shoes');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProductsByCategory();
  }, []);

  // Apply selected filters and update filtered products
  useEffect(() => {
    let filtered = [...products];

    if (selectedColor.length > 0) {
      filtered = filtered.filter((product) =>
        product.attributes.color?.some((color) => selectedColor.includes(color))
      );
    }
    if (selectedMaterial) {
      filtered = filtered.filter((product) => product.attributes.material === selectedMaterial);
    }
    if (selectedSize.length > 0) {
      filtered = filtered.filter((product) => selectedSize.includes(product.attributes.size));
    }
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
  }, [selectedColor, selectedMaterial, selectedSize, sortOrder, products]);

  // Reset filters to default state
  const resetFilters = () => {
    setSelectedColor([]);
    setSelectedMaterial(null);
    setSelectedSize([]);
    setSortOrder(null);
    setFilterProducts(products);
  };

  return (
    <ShoesShopContext.Provider value={{
      products,
      filterProducts,
      setFilterProducts,
      selectedColor, setSelectedColor,
      selectedMaterial, setSelectedMaterial,
      selectedSize, setSelectedSize,
      sortOrder, setSortOrder,
      resetFilters,
    }}>
      {children}
    </ShoesShopContext.Provider>
  );
};

export const useShoesShop = () => useContext(ShoesShopContext);

export default ShoesShopProvider;
