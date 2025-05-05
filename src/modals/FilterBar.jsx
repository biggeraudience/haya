import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/filterbar.scss";
import { useFilterContext } from "../context/FilterContext";
import PropTypes from "prop-types";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIosNew } from "react-icons/md";
import FilterDropdown from "../components/FilterDropdown";

const FilterBar = ({ category }) => {
  const { dynamicFilterOptions, toggleFilter, activeFilters } = useFilterContext();
  const availableFilters = dynamicFilterOptions || {};
  const [openFilters, setOpenFilters] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainer = useRef(null);
  const buttonRefs = useRef({});

  // Toggle accordion for each filter. Only one section open at a time.
  const toggleFilterDropdown = (filter) => {
    setOpenFilters((prev) => (prev.includes(filter) ? [] : [filter]));
  };

  // Handle checkbox changes
  const handleFilterChange = (filter, option) => {
    toggleFilter(filter, option);
  };

  // Scroll handler functions
  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  // Check if arrows should be shown based on scroll position
  const checkForOverflow = () => {
    const container = scrollContainer.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollWidth > container.clientWidth + container.scrollLeft
      );
    }
  };

  useEffect(() => {
    checkForOverflow();
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener("scroll", checkForOverflow);
      return () => container.removeEventListener("scroll", checkForOverflow);
    }
  }, [availableFilters]);

  return (
    <div className="filter-bar">
      {showLeftArrow && (
        <button className="carousel-toggle arrow-button left-arrow" onClick={scrollLeft}>
          <MdOutlineArrowBackIosNew />
        </button>
      )}
      <div className="filter-buttons-container" ref={scrollContainer}>
        {Object.keys(availableFilters).length > 0 ? (
          Object.entries(availableFilters).map(([filter, options]) => {
            // Save ref for each filter button
            return (
              <div className="filter-wrapper" key={filter}>
                <button
                  ref={(el) => (buttonRefs.current[filter] = el)}
                  className="filter-button"
                  onClick={() => toggleFilterDropdown(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
                {/* Render the dropdown using a portal */}
                <FilterDropdown
                  filter={filter}
                  options={options}
                  isOpen={openFilters.includes(filter)}
                  buttonRect={
                    buttonRefs.current[filter]
                      ? buttonRefs.current[filter].getBoundingClientRect()
                      : null
                  }
                  activeFilters={activeFilters}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            );
          })
        ) : (
          <p>No filters available for this category.</p>
        )}
      </div>
      {showRightArrow && (
        <button className="carousel-toggle arrow-button right-arrow" onClick={scrollRight}>
          <MdOutlineArrowForwardIos />
        </button>
      )}
    </div>
  );
};

FilterBar.propTypes = {
  category: PropTypes.string.isRequired,
};

export default FilterBar;
