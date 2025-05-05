// MapSlider.jsx
import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import MapLibre from './MapLibre';
import HexbinMapSlide from './HexbinMapSlide';

const MapSlider = () => {
  // Define two slides: one for the MapLibre map and one for the hexbin map
  const slides = [
    <MapLibre key="maplibre" />,
    <HexbinMapSlide key="hexbin" />
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="slider-container" style={{ position: 'relative', height: '300px' }}>
      <div className="slider-content" style={{ height: '100%' }}>
        <div className="slide" style={{ width: '100%', height: '100%' }}>
          {slides[currentSlide]}
        </div>
      </div>
      <button 
        className="slider-button prev" 
        onClick={prevSlide}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)'
        }}
        title="Previous Map"
      >
        <FaArrowLeft />
      </button>
      <button 
        className="slider-button next" 
        onClick={nextSlide}
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)'
        }}
        title="Next Map"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default MapSlider;
