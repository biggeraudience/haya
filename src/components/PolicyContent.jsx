// src/components/FeedContent/PolicyContent.jsx
import React, { useState } from 'react';
import '../styles/policycontent.scss'; // Import styles for the policy content

// Define the content for each policy page
const policyPages = [
  {
    title: 'Page 1: Introduction to Our Policy',
    content: `
      Welcome to the Haya Fashion LLC Policy section. This document outlines the terms and conditions, privacy policy, and other important guidelines that govern your use of our services and products. We are committed to transparency and ensuring you have a clear understanding of your rights and obligations when interacting with us. Please read through each section carefully. Your continued use of our website and services implies your agreement to these policies.
    `,
  },
  {
    title: 'Page 2: Terms and Conditions',
    content: `
      These terms and conditions govern your access to and use of Haya Fashion LLC's website, products, and services. By accessing or using our services, you agree to be bound by these terms. This includes your responsibilities, our liabilities, intellectual property rights, and dispute resolution procedures. Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page.
    `,
  },
  {
    title: 'Page 3: Privacy Policy',
    content: `
      Your privacy is critically important to us. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Haya Fashion LLC. We explain what information we collect, how we use it, who we share it with, and how we protect it. We are committed to protecting your personal data and complying with applicable data protection laws.
    `,
  },
  {
    title: 'Page 4: Returns and Refunds',
    content: `
      Our Returns and Refunds Policy outlines the process and conditions for returning products and receiving refunds. We want you to be satisfied with your purchase. This section details eligibility for returns, the return period, the condition of returned items, the refund process, and any associated costs. Please review this policy before making a return.
    `,
  },
];

const PolicyContent = () => {
  // State to keep track of the current page index
  const [currentPage, setCurrentPage] = useState(0); // Start at the first page (index 0)

  // Function to navigate to the next page
  const handleNextPage = () => {
    // Only navigate if there is a next page
    if (currentPage < policyPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to navigate to the previous page
  const handlePrevPage = () => {
    // Only navigate if there is a previous page
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get the content for the current page
  const currentPolicy = policyPages[currentPage];

  return (
    <div className="policy-container">
      <h2>{currentPolicy.title}</h2>
      <div className="policy-text">
        <p>{currentPolicy.content}</p>
      </div>
      <div className="pagination-controls">
        {/* Previous page button */}
        <button onClick={handlePrevPage} disabled={currentPage === 0}>
          {/* Back Arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>
          Back
        </button>
        {/* Display current page number */}
        <span>Page {currentPage + 1} of {policyPages.length}</span>
        {/* Next page button */}
        <button onClick={handleNextPage} disabled={currentPage === policyPages.length - 1}>
          Next
          {/* Forward Arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m360-80-71-71 329-329-329-329 71-71 400 400-400 400Z"/></svg>
        </button>
      </div>
    </div>
  );
};

export default PolicyContent;
