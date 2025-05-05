import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const FragranceShopContext = createContext();

const FragranceShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [selectedScent, setSelectedScent] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // Default sortOrder is null
  const [error, setError] = useState('');

  // Fetch all fragrance products using the public route
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get('/products/public?category=fragrance');
        setProducts(response.data || []);
        setFilterProducts(response.data || []); // Initialize filtered products
        setError('');
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products. Please try again later.');
      }
    };

    fetchProductsByCategory();
  }, []);

  // Apply selected filters and update filtered products
  useEffect(() => {
    let filtered = [...products];

    if (selectedScent.length > 0) {
      filtered = filtered.filter((product) =>
        product.attributes.scent?.some((scent) => selectedScent.includes(scent))
      );
    }

    if (selectedSize.length > 0) {
      filtered = filtered.filter((product) =>
        product.attributes.size?.some((size) => selectedSize.includes(size))
      );
    }

    if (selectedBrand.length > 0) {
      filtered = filtered.filter((product) =>
        product.attributes.brand?.some((brand) => selectedBrand.includes(brand))
      );
    }

    if (selectedGender) {
      filtered = filtered.filter(
        (product) => product.attributes.gender === selectedGender
      );
    }

    if (sortOrder === 'lowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'highToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProducts(filtered);
  }, [selectedScent, selectedSize, selectedBrand, selectedGender, sortOrder, products]);

  // Reset filters to default state
  const resetFilters = () => {
    setSelectedScent([]);
    setSelectedSize([]);
    setSelectedBrand([]);
    setSelectedGender(null);
    setSortOrder(null);
    setFilterProducts(products); // Reset to unfiltered products
  };

  return (
    <FragranceShopContext.Provider
      value={{
        products,
        filterProducts,
        setFilterProducts,
        selectedScent,
        setSelectedScent,
        selectedSize,
        setSelectedSize,
        selectedBrand,
        setSelectedBrand,
        selectedGender,
        setSelectedGender,
        sortOrder,
        setSortOrder,
        error,
        resetFilters,
      }}
    >
      {children}
    </FragranceShopContext.Provider>
  );
};

export const useFragranceShop = () => useContext(FragranceShopContext);

export default FragranceShopProvider;
