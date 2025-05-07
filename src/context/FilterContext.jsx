import React, { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import debounce from "lodash.debounce";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [filterProducts, setFilterProducts] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [dynamicFilterOptions, setDynamicFilterOptions] = useState({});
  const [currentFilterKey, setCurrentFilterKey] = useState({ gender: "", category: "" });

  // Fetch dynamic filter options from the backend when currentFilterKey changes.
  // Updated to fetch the options when a gender is selected—even if category is "all".
  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (currentFilterKey.gender) {
        try {
          const params = { gender: currentFilterKey.gender };
          if (currentFilterKey.category && currentFilterKey.category !== "all") {
            params.category = currentFilterKey.category;
          }
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/filters`, { params });
          setDynamicFilterOptions(response.data);
        } catch (error) {
          console.error("Error fetching dynamic filter options:", error);
        }
      } else {
        setDynamicFilterOptions({});
      }
    };

    fetchFilterOptions();
  }, [currentFilterKey]);

  // Debounced filter application that uses the latest currentFilterKey and activeFilters.
  useEffect(() => {
    const debouncedApplyFilters = debounce(async (filters, filterKey) => {
      const query = new URLSearchParams();
      if (filterKey.category && filterKey.category !== "all") {
        query.append("category", filterKey.category);
      }
      if (filterKey.gender) {
        query.append("gender", filterKey.gender);
      }
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          if (key === "sort") {
            query.append("sort", values[0]);
          } else {
            query.append(key, values.join(","));
          }
        }
      });
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/public?${query.toString()}`);
        setFilterProducts(response.data);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    }, 100);

    debouncedApplyFilters(activeFilters, currentFilterKey);
    return () => {
      debouncedApplyFilters.cancel();
    };
  }, [activeFilters, currentFilterKey]);

  // Toggle a filter option on or off.
  const toggleFilter = (filterType, value) => {
    setActiveFilters((prevFilters) => {
      const filterValues = prevFilters[filterType] || [];
      const updatedValues = filterValues.includes(value)
        ? filterValues.filter((item) => item !== value)
        : [...filterValues, value];
      const newFilters = {
        ...prevFilters,
        [filterType]: updatedValues,
      };

      const hasActiveFilters = Object.values(newFilters).some(
        (vals) => Array.isArray(vals) && vals.length > 0
      );
      if (hasActiveFilters) {
        setIsFilterApplied(true);
      } else {
        setIsFilterApplied(false);
        setFilterProducts([]);
      }
      return newFilters;
    });
  };

  const resetFilters = () => {
    setActiveFilters({});
    setFilterProducts([]);
    setIsFilterApplied(false);
  };

  // Persist active filters in localStorage.
  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("activeFilters")) || {};
    setActiveFilters(savedFilters);
  }, []);

  useEffect(() => {
    localStorage.setItem("activeFilters", JSON.stringify(activeFilters));
  }, [activeFilters]);

  return (
    <FilterContext.Provider
      value={{
        activeFilters,
        dynamicFilterOptions,
        toggleFilter,
        resetFilters,
        filterProducts,
        isFilterApplied,
        setCurrentFilterKey,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

FilterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useFilterContext = () => useContext(FilterContext);

export default FilterProvider;
