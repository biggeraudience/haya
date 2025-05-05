import React, { useState, useRef, useEffect } from 'react';

// Sample carrier data with simple SVG placeholders.
const carriers = [
  {
    id: 'fedex',
    name: 'FedEx',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#FF6600" />
        <text x="12" y="16" fontSize="12" textAnchor="middle" fill="white">
          F
        </text>
      </svg>
    ),
  },
  {
    id: 'ups',
    name: 'UPS',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#4A4A4A" />
        <text x="12" y="16" fontSize="12" textAnchor="middle" fill="white">
          U
        </text>
      </svg>
    ),
  },
  {
    id: 'usps',
    name: 'USPS',
    svg: (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#002868" />
        <text x="12" y="16" fontSize="12" textAnchor="middle" fill="white">
          U
        </text>
      </svg>
    ),
  },
];

const TrackOrder = ({ closeModal }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState(carriers[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bespoke-order-overlay track-order-overlay" onClick={closeModal}>
      <div className="bespoke-order-container track-order-container" onClick={(e) => e.stopPropagation()}>
        <button className="bespoke-order__close-button" onClick={closeModal}>
          X
        </button>
        <h2>Track Order</h2>
        <div className="track-order-form">
          <input
            type="text"
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="tracking-input"
          />
          <div className="carrier-dropdown" ref={dropdownRef}>
            <div className="dropdown-header" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="carrier-selected">
                {selectedCarrier.svg}
                <span className="carrier-name">{selectedCarrier.name}</span>
              </div>
              <div className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</div>
            </div>
            {dropdownOpen && (
              <ul className="dropdown-list">
                {carriers.map((carrier) => (
                  <li
                    key={carrier.id}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedCarrier(carrier);
                      setDropdownOpen(false);
                    }}
                  >
                    {carrier.svg}
                    <span className="carrier-name">{carrier.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="track-button">Track Order</button>
        </div>
      </div>
    </div>
  );
};


export default TrackOrder;
