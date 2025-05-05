import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const MensClothingShopContext = createContext();

const MensClothingShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  // Filter states based on product attributes
  const [selectedSubcategory, setSelectedSubcategory] = useState([]); // e.g., Agbada, Kaftan, Thobe (Jalabiya)
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedFit, setSelectedFit] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');

  // Fetch mens clothing products using public route
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products/public?category=mensclothing');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching mens clothing:', err);
      }
    };
    fetchProducts();
  }, []);

  // Apply filtering based on attributes
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
    if (selectedSize.length > 0) {
      filtered = filtered.filter(product =>
        product.attributes.size?.some(size => selectedSize.includes(size))
      );
    }
    if (selectedMaterial) {
      filtered = filtered.filter(product =>
        product.attributes.material === selectedMaterial
      );
    }
    if (selectedFit) {
      filtered = filtered.filter(product =>
        product.attributes.fit === selectedFit
      );
    }
    if (selectedOccasion) {
      filtered = filtered.filter(product =>
        product.attributes.occasion === selectedOccasion
      );
    }
    if (selectedPattern) {
      filtered = filtered.filter(product =>
        product.attributes.pattern === selectedPattern
      );
    }
    if (selectedSeason) {
      filtered = filtered.filter(product =>
        product.attributes.season === selectedSeason
      );
    }
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
  }, [
    selectedSubcategory,
    selectedColor,
    selectedSize,
    selectedMaterial,
    selectedFit,
    selectedOccasion,
    selectedPattern,
    selectedSeason,
    sortOrder,
    products,
  ]);

  const resetFilters = () => {
    setSelectedSubcategory([]);
    setSelectedColor([]);
    setSelectedSize([]);
    setSelectedMaterial(null);
    setSelectedFit(null);
    setSelectedOccasion(null);
    setSelectedPattern(null);
    setSelectedSeason(null);
    setSortOrder('relevant');
    setFilterProducts(products);
  };

  return (
    <MensClothingShopContext.Provider
      value={{
        products,
        filterProducts,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        selectedMaterial,
        setSelectedMaterial,
        selectedFit,
        setSelectedFit,
        selectedOccasion,
        setSelectedOccasion,
        selectedPattern,
        setSelectedPattern,
        selectedSeason,
        setSelectedSeason,
        sortOrder,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </MensClothingShopContext.Provider>
  );
};

export const useMensClothingShop = () => useContext(MensClothingShopContext);
export default MensClothingShopProvider;
