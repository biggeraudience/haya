import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const ClothingShopContext = createContext();

const ClothingShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedGender, setSelectedGender] = useState("all"); // New gender filter state
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');
  const [cartItems, setCartItems] = useState([]);

  // Fetch all clothing products using the public route
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get('/products/public?category=clothing');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProductsByCategory();
  }, []);

  // Apply selected filters (including gender) and update filtered products
  useEffect(() => {
    let filtered = [...products];

    // Filter by gender if a specific gender is selected (skip if "all")
    if (selectedGender !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.gender &&
          product.gender.toLowerCase() === selectedGender.toLowerCase()
      );
    }

    // Apply filters for color, size, and material
    if (selectedColor.length > 0) {
      filtered = filtered.filter((product) =>
        product.attributes.color?.some((color) => selectedColor.includes(color))
      );
    }

    if (selectedSize.length > 0) {
      filtered = filtered.filter((product) =>
        product.attributes.size?.some((size) => selectedSize.includes(size))
      );
    }

    if (selectedMaterial) {
      filtered = filtered.filter(
        (product) => product.attributes.material === selectedMaterial
      );
    }

    // Sort products
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
  }, [selectedGender, selectedColor, selectedSize, selectedMaterial, sortOrder, products]);

  // Cart actions
  const addToCart = (product) => {
    setCartItems((prevItems) => [...prevItems, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Filter handlers
  const handleColorChange = (color) => {
    setSelectedColor((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSize((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleMaterialChange = (material) => {
    setSelectedMaterial((prev) => (prev === material ? null : material));
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // New gender handler (if you want to change it externally)
  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

  // Reset filters to default state
  const resetFilters = () => {
    setSelectedColor([]);
    setSelectedSize([]);
    setSelectedMaterial(null);
    setSortOrder('relevant');
    setSelectedGender("all");
    setFilterProducts(products); // Reset to unfiltered products
  };

  return (
    <ClothingShopContext.Provider
      value={{
        products,
        filterProducts,
        setFilterProducts,
        selectedGender,
        handleGenderChange, // Expose handler for external changes
        selectedColor,
        handleColorChange,
        selectedSize,
        handleSizeChange,
        selectedMaterial,
        handleMaterialChange,
        sortOrder,
        handleSortChange,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        resetFilters,
      }}
    >
      {children}
    </ClothingShopContext.Provider>
  );
};

export const useClothingShop = () => useContext(ClothingShopContext);

export default ClothingShopProvider;
