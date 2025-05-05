import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const BagsShopContext = createContext();

const BagsShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedSize, setSelectedSize] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);
  
  // Fetch all bags products using the public route
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get('/products/public?category=bags');
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

    // Apply filters for color, material, size, and sortOrder
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
    setFilterProducts(products); // Reset to unfiltered products
  };

  return (
    <BagsShopContext.Provider value={{
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
    </BagsShopContext.Provider>
  );
};

export const useBagsShop = () => useContext(BagsShopContext);

export default BagsShopProvider;
