import React from 'react';
import "../styles/index.css";

const ProductFooter = () => {
  return (
    <div className="product-footer">
      <div 
        className="footer-content" 
        style={{ fontFamily: "'Overpass Mono'" }}  // Inline style applied here
      >
        <p>&copy; 2024 Haya Fashion. All rights reserved.</p>
        <div className="social-icons">
          {/* Social media icons */}
          <a href="#" className="social-icon">
            {/* Social icon SVG */}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductFooter;
