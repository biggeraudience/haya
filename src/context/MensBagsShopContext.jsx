import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const MensBagsShopContext = createContext();

const MensBagsShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  // Filter states based on mens bags product attributes
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedPockets, setSelectedPockets] = useState(null); // Could be a boolean or specific type
  const [selectedDimensions, setSelectedDimensions] = useState(null); // Could be a string or object
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null); // Could be a number or string
  const [selectedClosing, setSelectedClosing] = useState(null); // e.g., Zipper, Buckle
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [selectedTexture, setSelectedTexture] = useState(null);
  const [selectedHandle, setSelectedHandle] = useState(null); // e.g., Top Handle, Shoulder Strap
  const [sortOrder, setSortOrder] = useState('relevant');

  // Fetch mens bags products using public route
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products/public?category=mensbags');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching mens bags:', err);
      }
    };
    fetchProducts();
  }, []);

  // Apply filtering based on attributes
  useEffect(() => {
    let filtered = [...products];

    if (selectedMaterial) {
      filtered = filtered.filter(product =>
        product.attributes.material === selectedMaterial
      );
    }
    if (selectedPockets !== null) {
      filtered = filtered.filter(product =>
        String(product.attributes.pockets)?.toLowerCase() === String(selectedPockets)?.toLowerCase()
      );
    }
    if (selectedDimensions) {
      filtered = filtered.filter(product =>
        String(product.attributes.dimensions)?.toLowerCase().includes(String(selectedDimensions)?.toLowerCase())
      );
    }
    if (selectedColor.length > 0) {
      filtered = filtered.filter(product =>
        product.colors?.some(colorObj => selectedColor.includes(colorObj.name))
      );
    }
    if (selectedWeight) {
      filtered = filtered.filter(product =>
        String(product.attributes.weight)?.toLowerCase().includes(String(selectedWeight)?.toLowerCase())
      );
    }
    if (selectedClosing) {
      filtered = filtered.filter(product =>
        product.attributes.closing === selectedClosing
      );
    }
    if (selectedOccasion) {
      filtered = filtered.filter(product =>
        product.attributes.occasion === selectedOccasion
      );
    }
    if (selectedTexture) {
      filtered = filtered.filter(product =>
        product.attributes.texture === selectedTexture
      );
    }
    if (selectedHandle) {
      filtered = filtered.filter(product =>
        product.attributes.handle === selectedHandle
      );
    }
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
  }, [
    selectedMaterial,
    selectedPockets,
    selectedDimensions,
    selectedColor,
    selectedWeight,
    selectedClosing,
    selectedOccasion,
    selectedTexture,
    selectedHandle,
    sortOrder,
    products,
  ]);

  const resetFilters = () => {
    setSelectedMaterial(null);
    setSelectedPockets(null);
    setSelectedDimensions(null);
    setSelectedColor([]);
    setSelectedWeight(null);
    setSelectedClosing(null);
    setSelectedOccasion(null);
    setSelectedTexture(null);
    setSelectedHandle(null);
    setSortOrder('relevant');
    setFilterProducts(products);
  };

  return (
    <MensBagsShopContext.Provider
      value={{
        products,
        filterProducts,
        selectedMaterial,
        setSelectedMaterial,
        selectedPockets,
        setSelectedPockets,
        selectedDimensions,
        setSelectedDimensions,
        selectedColor,
        setSelectedColor,
        selectedWeight,
        setSelectedWeight,
        selectedClosing,
        setSelectedClosing,
        selectedOccasion,
        setSelectedOccasion,
        selectedTexture,
        setSelectedTexture,
        selectedHandle,
        setSelectedHandle,
        sortOrder,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </MensBagsShopContext.Provider>
  );
};

export const useMensBagsShop = () => useContext(MensBagsShopContext);
export default MensBagsShopProvider;