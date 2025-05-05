// src/components/CategoryDisplaySection.jsx
import React, { useState, useEffect } from 'react';
import '../styles/categorydisplaysection.scss';

// Accept backgroundImage and a new 'gender' prop
const CategoryDisplaySection = ({ categoryData, backgroundImage, gender }) => {
  const [animateBoxes, setAnimateBoxes] = useState([]);

  useEffect(() => {
    // Reset animation state when categoryData changes
    const count = categoryData.boxItems.length;
    setAnimateBoxes(Array(count).fill(false));

    // Stagger the animation for each box item
    categoryData.boxItems.forEach((_, idx) => {
      setTimeout(() => {
        setAnimateBoxes((prev) => {
          const next = [...prev];
          next[idx] = true; // Set the box at this index to animate
          return next;
        });
      }, 800 * (idx + 1)); // Stagger delay based on index
    });
  }, [categoryData]); // Re-run effect when categoryData changes

  // Determine the gender-specific class based on the 'gender' prop
  const genderClass = gender === 'men' ? 'category-display-section--men' : 'category-display-section--women';

  return (
    <section
      // Add the gender-specific class to the section element
      className={`category-display-section ${genderClass}`}
      style={{
        // Use the backgroundImage prop here
        backgroundImage: `url(${backgroundImage})`,
        backgroundAttachment: 'fixed',       // fixes it in place
        backgroundPosition: 'center center', // center it
        backgroundRepeat: 'no-repeat',       // don't tile
        backgroundSize: 'cover'              // fill the area
      }}
    >
      {/* black semi-transparent overlay */}
      <div className="background-overlay" />

      <div className="content-wrapper">
        <div className="left-image">
          {/* Display the main category image */}
          <img src={categoryData.imageLeft} alt={categoryData.name} />
        </div>

        <div className="main-content">
          {/* Display category heading and content */}
          <h2>{categoryData.heading}</h2>
          <p>{categoryData.content}</p>
          {/* Link to the main shop page for the category */}
          <a href={categoryData.shopLink} className="shop-link">
            <u>SHOP</u>
          </a>
        </div>

        <div className="subcategory-boxes">
          {/* Map through sub-category items and render them */}
          {categoryData.boxItems.map((box, idx) => (
            <div
              key={idx} // Using index as key is okay here as the list order is stable
              className={`box ${animateBoxes[idx] ? 'slide-in' : ''}`} // Apply slide-in class for animation
            >
              {/* Display sub-category image */}
              <img src={box.image} alt={box.title} className="box-image" />
              {/* Show details only after animation starts */}
              {animateBoxes[idx] && (
                <div className="box-details">
                  {/* Display sub-category title and content */}
                  <h3>{box.title}</h3>
                  <p>{box.content}</p>
                  {/* Link to the sub-category shop page */}
                  <a href={box.shopLink} className="shop-button">
                    SHOP
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryDisplaySection;
