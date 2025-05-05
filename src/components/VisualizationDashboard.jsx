// src/components/VisualizationDashboard.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const VisualizationDashboard = ({ data }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (data && d3Container.current) {
      // Clear previous visualization
      d3.select(d3Container.current).selectAll("*").remove();

      // Example: Create a simple bar chart for new customer signups by region
      const width = 300, height = 200;
      const svg = d3.select(d3Container.current)
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

      // Format data as needed, e.g., data = [{ region: "US", count: 140 }, ...]
      const x = d3.scaleBand()
                  .domain(data.map(d => d.region))
                  .range([0, width])
                  .padding(0.1);
      const y = d3.scaleLinear()
                  .domain([0, d3.max(data, d => d.count)])
                  .range([height, 0]);

      svg.append("g")
         .selectAll("rect")
         .data(data)
         .enter()
         .append("rect")
         .attr("x", d => x(d.region))
         .attr("y", d => y(d.count))
         .attr("width", x.bandwidth())
         .attr("height", d => height - y(d.count))
         .attr("fill", "#00d2ff");

      // Add axes (optional)
      svg.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(d3.axisBottom(x));
      svg.append("g")
         .call(d3.axisLeft(y));
    }
  }, [data]);

  return (
    <div>
      <h3>Customer Geolocation Chart</h3>
      <div ref={d3Container}></div>
    </div>
  );
};

export default VisualizationDashboard;
