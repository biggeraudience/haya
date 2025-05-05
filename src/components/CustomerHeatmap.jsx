// src/components/CustomerHeatmap.jsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const data = [
  {
    id: "Trendsetters",
    data: [
      { x: "Jan", y: 75 },
      { x: "Feb", y: 80 },
      { x: "Mar", y: 90 },
      { x: "Apr", y: 100 },
      { x: "May", y: 110 },
      { x: "Jun", y: 120 },
      { x: "Jul", y: 130 },
      { x: "Aug", y: 140 },
      { x: "Sep", y: 135 },
      { x: "Oct", y: 125 },
      { x: "Nov", y: 115 },
      { x: "Dec", y: 105 }
    ]
  },
  {
    id: "Bargain Hunters",
    data: [
      { x: "Jan", y: 40 },
      { x: "Feb", y: 35 },
      { x: "Mar", y: 30 },
      { x: "Apr", y: 25 },
      { x: "May", y: 20 },
      { x: "Jun", y: 15 },
      { x: "Jul", y: 20 },
      { x: "Aug", y: 25 },
      { x: "Sep", y: 30 },
      { x: "Oct", y: 35 },
      { x: "Nov", y: 40 },
      { x: "Dec", y: 45 }
    ]
  },
  {
    id: "Seasonal Shoppers",
    data: [
      { x: "Jan", y: 20 },
      { x: "Feb", y: 25 },
      { x: "Mar", y: 30 },
      { x: "Apr", y: 35 },
      { x: "May", y: 40 },
      { x: "Jun", y: 45 },
      { x: "Jul", y: 50 },
      { x: "Aug", y: 55 },
      { x: "Sep", y: 60 },
      { x: "Oct", y: 65 },
      { x: "Nov", y: 70 },
      { x: "Dec", y: 75 }
    ]
  },
  {
    id: "Occasional Explorers",
    data: [
      { x: "Jan", y: 10 },
      { x: "Feb", y: 15 },
      { x: "Mar", y: 20 },
      { x: "Apr", y: 25 },
      { x: "May", y: 30 },
      { x: "Jun", y: 35 },
      { x: "Jul", y: 30 },
      { x: "Aug", y: 25 },
      { x: "Sep", y: 20 },
      { x: "Oct", y: 15 },
      { x: "Nov", y: 10 },
      { x: "Dec", y: 5 }
    ]
  }
];

const CustomerHeatmap = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Remove existing content
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();

    // Set dimensions and margins
    const margin = { top: 60, right: 20, bottom: 60, left: 120 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append group element to svg
    const svg = svgEl
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get unique months and segments
    const months = data[0].data.map(d => d.x);
    const segments = data.map(d => d.id);

    // Flatten the data: each cell has segment, month, and value.
    const heatData = [];
    data.forEach(segment => {
      segment.data.forEach(cell => {
        heatData.push({
          segment: segment.id,
          month: cell.x,
          value: cell.y
        });
      });
    });

    // Create scales for x and y axes using scaleBand
    const xScale = d3.scaleBand()
      .domain(months)
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(segments)
      .range([0, height])
      .padding(0.05);

    // Determine min and max values for the color scale
    const minValue = d3.min(heatData, d => d.value);
    const maxValue = d3.max(heatData, d => d.value);
    // Define stops: min, lowMed, highMed, and max.
    const lowMed = minValue + (maxValue - minValue) / 3;
    const highMed = minValue + 2 * (maxValue - minValue) / 3;

    // Create a custom color scale:
    // Very low: pale grey; low to moderate: light green; medium-high: warm orange; very high: deep purple.
    const colorScale = d3.scaleLinear()
      .domain([minValue, lowMed, highMed, maxValue])
      .range(["#f7f7f7", "#a1d99b", "#fc8d59", "#542788"])
      .interpolate(d3.interpolateHcl);

    // Create tooltip div (appended to body)
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "8px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px");

    // Draw heatmap cells with tooltips
    svg.selectAll("rect")
      .data(heatData)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.month))
      .attr("y", d => yScale(d.segment))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", d => colorScale(d.value))
      .style("stroke", "#fff")
      .on("mouseover", function(event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(
          `<strong>Segment:</strong> ${d.segment}<br/>
           <strong>Month:</strong> ${d.month}<br/>
           <strong>Activity:</strong> ${d.value}`
        )
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mousemove", function(event, d) {
        tooltip.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Add x-axis
    const xAxis = d3.axisBottom(xScale);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis)
      .selectAll("text")
      .attr("text-anchor", "middle");

    // Add y-axis
    const yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .call(yAxis);

    // Add x-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text("Month");

    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 40)
      .attr("text-anchor", "middle")
      .style("fill", "#fff")
      .style("font-size", "14px")
      .text("Customer Segment");

    // Cleanup tooltip on unmount
    return () => {
      tooltip.remove();
    };
  }, []);

  return (
    <div style={{ height: 400 }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default CustomerHeatmap;
