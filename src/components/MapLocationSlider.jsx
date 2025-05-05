import React, { useState } from 'react';
import MapLibreMap from './MapLibre'; // Live map component
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FaChevronLeft, FaChevronRight, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const dummyRegionData = [
  { name: 'Africa', value: 40 },
  { name: 'Europe', value: 30 },
  { name: 'N. America', value: 30 }
];

const regionTrends = [
  { name: 'Africa', change: 5.2 },
  { name: 'Europe', change: -2.3 },
  { name: 'N. America', change: 3.1 }
];

const COLORS = ['#00D2FF', '#00FFC8', '#7D5FFF'];

const LocationAnalyticsSlide = () => {
  return (
    <div 
      className="location-analytics-slide" 
      style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}
    >
      <div className="region-dots">
        {dummyRegionData.map((region, index) => (
          <div key={index} className="region-dot">
            <span className="dot" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="region-name">{region.name}</span>
          </div>
        ))}
      </div>
      <div className="circular-chart">
        <PieChart width={200} height={200}>
          <Pie data={dummyRegionData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
            {dummyRegionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
      <div className="region-trends">
        {regionTrends.map((trend, index) => (
          <div key={index} className="trend">
            {trend.change >= 0 ? (
              <FaArrowUp className="up-arrow" />
            ) : (
              <FaArrowDown className="down-arrow" />
            )}
            <span className="trend-percentage">{Math.abs(trend.change)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MapLocationSlider = () => {
  // slideIndex 0: live map; slideIndex 1: analytics
  const [slideIndex, setSlideIndex] = useState(0);

  const handlePrev = () => {
    setSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSlideIndex((prev) => Math.min(1, prev + 1));
  };

  return (
    <div className="slider-container">
      <div
        className="slider-wrapper"
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
      >
        <div className="slide">
          <MapLibreMap />
        </div>
        <div className="slide">
          <LocationAnalyticsSlide />
        </div>
      </div>
      <button className="slider-button prev" onClick={handlePrev}>
        <FaChevronLeft />
      </button>
      <button className="slider-button next" onClick={handleNext}>
        <FaChevronRight />
      </button>
    </div>
  );
};

export default MapLocationSlider;
