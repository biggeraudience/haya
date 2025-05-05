import React from "react";
import ReactDOM from "react-dom";
import "../styles/filterbar.scss";

const FilterDropdown = ({
  filter,
  options,
  isOpen,
  buttonRect,
  activeFilters,
  handleFilterChange,
}) => {
  if (!isOpen || !buttonRect) return null;

  const style = {
    position: "absolute",
    top: buttonRect.bottom + window.scrollY + 5, // 5px gap
    left: buttonRect.left + window.scrollX,
    backgroundColor: "white",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    border: "1px solid black",
    padding: "10px",
    width: "150px",
    zIndex: 99999,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxSizing: "border-box",
    color: "black",
    fontFamily: "Overpass Mono",
    fontSize: "14px"
  };

  return ReactDOM.createPortal(
    <div className="filter-dropdown" style={style}>
      {options.map((option, index) => (
        <label key={index} className="filter-option">
          <input
            type="checkbox"
            checked={activeFilters[filter]?.includes(option) || false}
            onChange={() => handleFilterChange(filter, option)}
          />
          {option}
        </label>
      ))}
    </div>,
    document.body
  );
};

export default FilterDropdown;
