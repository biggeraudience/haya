import React, { useState } from 'react';
import '../styles/sidepanel.scss';

const SidePanel = () => {
  const [showPanel, setShowPanel] = useState(false);

  const togglePanel = () => {
    setShowPanel(!showPanel);
  };

  return (
    <>
      <button className="sidepanel-toggle" onClick={togglePanel}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fe5829"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/></svg>
      </button>
      {showPanel && (
        <div className="side-panel">
          <svg className="icon" viewBox="0 0 24 24">
            {/* SVG path goes here */}
          </svg>
          <svg className="icon" viewBox="0 0 24 24">
            {/* SVG path goes here */}
          </svg>
          <svg className="icon" viewBox="0 0 24 24">
            {/* SVG path goes here */}
          </svg>
          <svg className="icon" viewBox="0 0 24 24">
            {/* SVG path goes here */}
          </svg>
          <svg className="icon" viewBox="0 0 24 24">
            {/* SVG path goes here */}
          </svg>
          <svg className="icon" viewBox="0 0 24 24">
            {/* SVG path goes here */}
          </svg>
        </div>
      )}
    </>
  );
};

export default SidePanel;
