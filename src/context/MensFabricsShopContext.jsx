import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const MensFabricsShopContext = createContext();

const MensFabricsShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  // Filter states
  const [selectedSubcategory, setSelectedSubcategory] = useState([]); // e.g., African Traditional Prints, Woven Fabrics, Lace
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');

  // Fetch mens fabrics products using public route
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products/public?category=mensfabrics');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching mens fabrics:', err);
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
    if (selectedPattern) {
      filtered = filtered.filter(product =>
        product.attributes.pattern === selectedPattern
      );
    }
    if (selectedWeight) {
      filtered = filtered.filter(product =>
        product.attributes.weight === selectedWeight
      );
    }
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilterProducts(filtered);
  }, [selectedSubcategory, selectedColor, selectedMaterial, selectedPattern, selectedWeight, sortOrder, products]);

  const resetFilters = () => {
    setSelectedSubcategory([]);
    setSelectedColor([]);
    setSelectedMaterial(null);
    setSelectedPattern(null);
    setSelectedWeight(null);
    setSortOrder('relevant');
    setFilterProducts(products);
  };

  return (
    <MensFabricsShopContext.Provider
      value={{
        products,
        filterProducts,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedColor,
        setSelectedColor,
        selectedMaterial,
        setSelectedMaterial,
        selectedPattern,
        setSelectedPattern,
        selectedWeight,
        setSelectedWeight,
        sortOrder,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </MensFabricsShopContext.Provider>
  );
};

export const useMensFabricsShop = () => useContext(MensFabricsShopContext);
export default MensFabricsShopProvider;
