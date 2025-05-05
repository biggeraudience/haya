import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const ActivePageMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Map pathname to page names
  const pageTitles = {
    '/': 'Home',
    '/clothing': 'Clothing',
    '/shoes': 'Shoes',
    '/bags': 'Bags',
    '/jewelry': 'Jewelry',
    '/fragrances': 'Fragrances',
    '/veils': 'Veils',
  };

  // Get the active page name based on the current pathname
  const activePageName = pageTitles[location.pathname] || 'Menu';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="active-page-menu-container">
      {/* Active Page Box */}
      <div className="menu-box" onClick={toggleMenu}>
        <span className="menu-title">{activePageName}</span>
        {/* SVG Arrow Icon */}
        <svg 
          width="18"
          height="15"
          viewBox="0 0 18 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`menu-icon ${isOpen ? 'open ' : ''}`}
        >
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="menu-dropdown">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/clothing">Clothing</Link>
            </li>
            <li>
              <Link to="/shoes">Shoes</Link>
            </li>
            <li>
              <Link to="/bags">Bags</Link>
            </li>
            <li>
              <Link to="/jewelry">Jewelry</Link>
            </li>
            <li>
              <Link to="/fragrances">Fragrances</Link>
            </li>
            <li>
              <Link to="/veils">Veils</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivePageMenu;
