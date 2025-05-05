import React, { useState } from 'react';
import PropTypes from 'prop-types';

const NextPageModal = ({ products, productsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Check for undefined values and provide default ones
  const totalPages = Math.ceil((products?.length || 0) / (productsPerPage || 16));
  
  const currentProducts = products?.slice(
    (currentPage - 1) * (productsPerPage || 16),
    currentPage * (productsPerPage || 16)
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      {/* Product Grid */}
      <div className="clothing-grid-container">
    
      </div>

      {/* Next Page Modal */}
      <div className="next-page-modal">
        <button className="carousel-toggle" alt={'previous'} onClick={handlePreviousPage} disabled={currentPage === 1}>
        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.7616 0.381216C9.63949 2.93835 5.00517 4.4588 0.886755 6.92374C0.50663 7.18537 0.247988 7.86753 0.649886 8.20709C4.48817 11.503 9.01319 13.8108 13.5899 15.9822C14.0877 16.2333 14.5751 15.6066 14.1732 15.267C14.7534 13.4896 12.9771 10.6007 11.7938 9.0288C13.5992 6.65468 14.7147 4.20638 14.9748 1.2154C15.0011 0.569988 14.2821 0.0790235 13.7616 0.381216ZM10.1557 9.56269C11.3021 10.9022 11.6479 12.6248 12.3257 14.13C8.98463 12.2396 5.6915 10.305 2.69752 7.82843C6.09992 5.93474 9.71229 4.55752 13.1589 2.7118C12.6559 4.86172 11.5629 6.75681 10.1489 8.59268C9.76873 8.85432 9.89022 9.27485 10.1557 9.56269Z" fill="black"/>
<path d="M2.41522 7.71901L6.56521 5.94083L10.1223 4.16265L13.0866 2.97719L11.9009 5.94083L10.7152 7.71901L10.1223 8.31174V9.49719L10.7152 10.0899L11.3081 11.2754L11.9009 13.0536L12.4938 14.239L11.3081 13.6463L7.75092 11.2754L6.56521 10.6826L3.00807 8.31174L2.41522 7.71901Z" fill="#FE5829"/>
<path d="M13.7616 0.381216C9.63949 2.93835 5.00517 4.4588 0.886755 6.92374C0.50663 7.18537 0.247988 7.86753 0.649886 8.20709C4.48817 11.503 9.01319 13.8108 13.5899 15.9822C14.0877 16.2333 14.5751 15.6066 14.1732 15.267C14.7534 13.4896 12.9771 10.6007 11.7938 9.0288C13.5992 6.65468 14.7147 4.20638 14.9748 1.2154C15.0011 0.569988 14.2821 0.0790235 13.7616 0.381216ZM10.1557 9.56269C11.3021 10.9022 11.6479 12.6248 12.3257 14.13C8.98463 12.2396 5.6915 10.305 2.69752 7.82843C6.09992 5.93474 9.71229 4.55752 13.1589 2.7118C12.6559 4.86172 11.5629 6.75681 10.1489 8.59268C9.76873 8.85432 9.89022 9.27485 10.1557 9.56269Z" stroke="black" stroke-width="0.5"/>
<path d="M2.41522 7.71901L6.56521 5.94083L10.1223 4.16265L13.0866 2.97719L11.9009 5.94083L10.7152 7.71901L10.1223 8.31174V9.49719L10.7152 10.0899L11.3081 11.2754L11.9009 13.0536L12.4938 14.239L11.3081 13.6463L7.75092 11.2754L6.56521 10.6826L3.00807 8.31174L2.41522 7.71901Z" stroke="black" stroke-width="0.5"/>
</svg>

        </button>
        <div className="page-indicator">
          <span>{currentPage}</span>
          <span>
         

          </span>
          <span>{currentPage + 1 <= totalPages ? currentPage + 1 : '...'}</span>
        </div>
        <button className="next-page-button" onClick={handleNextPage}>
          Next Page
 
        </button>
      </div>
    </div>
  );
};

// Prop Types validation
NextPageModal.propTypes = {
  products: PropTypes.array.isRequired,
  productsPerPage: PropTypes.number.isRequired,
};

// Default Props
NextPageModal.defaultProps = {
  products: [],
  productsPerPage: 16,
};

export default NextPageModal;
