// src/components/AnnouncementBar.jsx
import React, { useState, useEffect } from 'react';
import '../styles/announcementbar.scss';
import { FaArrowLeft } from 'react-icons/fa';

const AnnouncementBar = () => {
  const headingText = "New Arrivals";
  const fullText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const id = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(id);
    }
  }, [currentIndex, fullText]);

  return (
    <div className="announcement-bar">
      <button className="men-button">
        <FaArrowLeft color="orange" /> MEN
      </button>

      <div className="text-container">
        <h2 className="heading">{headingText}</h2>
        <p className="content">
          {displayText}
          <span className="cursor">|</span>
        </p>
      </div>

      <button className="shop-button">SHOP</button>
    </div>
  );
};

export default AnnouncementBar;
