import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const MensPerfumesShopContext = createContext();

const MensPerfumesShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);

  // Filter states
  const [selectedSubcategory, setSelectedSubcategory] = useState([]); // e.g., Attars, Oudh, Ittar
  const [selectedScent, setSelectedScent] = useState([]);
  const [selectedLongevity, setSelectedLongevity] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevant');

  // Fetch mens perfumes products using public route
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products/public?category=mensperfumes');
        setProducts(response.data || []);
        setFilterProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching mens perfumes:', err);
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
    if (selectedScent.length > 0) {
      filtered = filtered.filter(product =>
        product.attributes.scent?.some(scent => selectedScent.includes(scent))
      );
    }
    if (selectedLongevity) {
      filtered = filtered.filter(product =>
        product.attributes.longevity === selectedLongevity
      );
    }
    if (selectedNotes) {
      filtered = filtered.filter(product =>
        product.attributes.notes === selectedNotes
      );
    }
    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilterProducts(filtered);
  }, [selectedSubcategory, selectedScent, selectedLongevity, selectedNotes, sortOrder, products]);

  const resetFilters = () => {
    setSelectedSubcategory([]);
    setSelectedScent([]);
    setSelectedLongevity(null);
    setSelectedNotes(null);
    setSortOrder('relevant');
    setFilterProducts(products);
  };

  return (
    <MensPerfumesShopContext.Provider
      value={{
        products,
        filterProducts,
        selectedSubcategory,
        setSelectedSubcategory,
        selectedScent,
        setSelectedScent,
        selectedLongevity,
        setSelectedLongevity,
        selectedNotes,
        setSelectedNotes,
        sortOrder,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </MensPerfumesShopContext.Provider>
  );
};

export const useMensPerfumesShop = () => useContext(MensPerfumesShopContext);
export default MensPerfumesShopProvider;
