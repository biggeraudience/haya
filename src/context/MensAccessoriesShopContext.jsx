import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const MensAccessoriesShopContext = createContext();

const MensAccessoriesShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  // Filter states
  const [selectedSubcategory, setSelectedSubcategory] = useState([]); // e.g., Cufflinks, Watches, Prayer Beads, Prayer Mat
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');

  // Fetch mens accessories products using public route
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products/public?category=mensaccessories');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching mens accessories:', err);
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
    if (selectedDesign) {
      filtered = filtered.filter(product =>
        product.attributes.design === selectedDesign
      );
    }
    if (selectedOccasion) {
      filtered = filtered.filter(product =>
        product.attributes.occasion === selectedOccasion
      );
    }
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilterProducts(filtered);
  }, [selectedSubcategory, selectedColor, selectedMaterial, selectedDesign, selectedOccasion, sortOrder, products]);

  const resetFilters = () => {
    setSelectedSubcategory([]);
    setSelectedColor([]);
    setSelectedMaterial(null);
    setSelectedDesign(null);
    setSelectedOccasion(null);
    setSortOrder('relevant');
    setFilterProducts(products);
  };

  return (
    <MensAccessoriesShopContext.Provider
      value={{
        products,
        filterProducts,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedColor,
        setSelectedColor,
        selectedMaterial,
        setSelectedMaterial,
        selectedDesign,
        setSelectedDesign,
        selectedOccasion,
        setSelectedOccasion,
        sortOrder,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </MensAccessoriesShopContext.Provider>
  );
};

export const useMensAccessoriesShop = () => useContext(MensAccessoriesShopContext);
export default MensAccessoriesShopProvider;
