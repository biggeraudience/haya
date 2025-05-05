// HexbinMapSlide.jsx
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import * as d3 from 'd3';
import { hexbin as d3Hexbin } from 'd3-hexbin';
import 'maplibre-gl/dist/maplibre-gl.css';

const HexbinMapSlide = () => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize MapLibre map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-74.006, 40.7128], // New York City as center example
      zoom: 12,
      pitch: 45
    });
    map.addControl(new maplibregl.NavigationControl());

    map.on('load', () => {
      // Create some dummy data: random points around NYC
      const points = d3.range(200).map(() => [
        -74.006 + (Math.random() - 0.5) * 0.1,
        40.7128 + (Math.random() - 0.5) * 0.1
      ]);

      // Configure the hexbin generator (using map coordinates here)
      const hexbin = d3Hexbin()
        .x(d => d[0])
        .y(d => d[1])
        .radius(0.005) // Adjust this value as needed
        .extent([[-74.1, 40.7], [-73.9, 40.75]]);

      const bins = hexbin(points);

      // Create an SVG overlay on top of the map's canvas container
      const container = map.getCanvasContainer();
      const svg = d3.select(container)
        .append("svg")
        .attr("class", "hexbin-overlay")
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0)
        .attr("width", map.getCanvas().width)
        .attr("height", map.getCanvas().height);

      // Function to draw hexagons based on current map projection
      const drawHexagons = () => {
        svg.selectAll("path").remove();
        svg.selectAll("path")
          .data(bins)
          .enter()
          .append("path")
          .attr("d", d3Hexbin().hexagon(10)) // fixed pixel radius for hexagons
          .attr("transform", d => {
            const coords = map.project(new maplibregl.LngLat(d.x, d.y));
            return `translate(${coords.x}, ${coords.y})`;
          })
          .attr("fill", "rgba(0, 210, 255, 0.6)")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);
      };

      drawHexagons();

      // Redraw hexagons on map move/zoom
      map.on("move", () => {
        svg.attr("width", map.getCanvas().width)
          .attr("height", map.getCanvas().height);
        drawHexagons();
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div 
      className="slider-container" 
      style={{
        width: '100%', 
        height: '300px', 
        borderRadius: '8px', 
        overflow: 'hidden',
        backgroundColor: '#121212'
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default HexbinMapSlide;
