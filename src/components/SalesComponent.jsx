import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown, FaTimes } from 'react-icons/fa';
import * as d3 from 'd3';

// D3Bar: Renders an animated bar showing the metric value.
const D3Bar = ({ value, maxValue, width = 200, height = 20 }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // Draw the background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#333');

    // Scale the metric value to the bar width
    const scale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, width]);

    // Animate the bar from 0 to the scaled width.
    svg.append('rect')
      .attr('fill', '#00D2FF')
      .attr('height', height)
      .attr('width', 0)
      .transition()
      .duration(800)
      .attr('width', scale(value));
  }, [value, maxValue, width, height]);

  return <svg ref={ref} width={width} height={height}></svg>;
};

// D3LineChart: Renders an animated line chart for time-series data.
const D3LineChart = ({ data, width = 300, height = 200 }) => {
  const ref = useRef();
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const parseDate = d3.timeParse("%Y-%m-%d");
    const parsedData = data.map(d => ({ date: parseDate(d.date), value: d.value }));
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date))
      .range([0, innerWidth]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(parsedData, d => d.value)])
      .nice()
      .range([innerHeight, 0]);
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    g.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "#00D2FF")
      .attr("stroke-width", 2)
      .attr("d", line);
    // Axes with white labels
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));
    g.append("g")
      .call(d3.axisLeft(yScale));
    svg.append("text")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Date");
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - (margin.top + innerHeight / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Value");
  }, [data, width, height]);
  return <svg ref={ref} width={width} height={height}></svg>;
};

// D3ScatterChart: Renders a simple scatter chart.
const D3ScatterChart = ({ data, width = 300, height = 200 }) => {
  const ref = useRef();
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.x))
      .range([0, innerWidth]).nice();
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.y))
      .range([innerHeight, 0]).nice();
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 4)
      .attr("fill", "#00D2FF");
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    g.append("g")
      .call(d3.axisLeft(yScale));
    svg.append("text")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("X Axis");
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - (margin.top + innerHeight / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Y Axis");
  }, [data, width, height]);
  return <svg ref={ref} width={width} height={height}></svg>;
};

// D3DonutChart: Renders a donut chart for categorical data.
const D3DonutChart = ({ data, width = 200, height = 200, innerRadius = 50, outerRadius = 80 }) => {
  const ref = useRef();
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcs = g.selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");
    arcs.append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", arc);
  }, [data, width, height, innerRadius, outerRadius]);
  return <svg ref={ref} width={width} height={height}></svg>;
};

/* New Chart Components with Labels, Animations, and Tooltips */

// D3StackedChart: Renders a stacked bar chart for Total Revenue segmented by channel.
const D3StackedChart = ({ data = [], width = 400, height = 250 }) => {
  const ref = useRef();
  
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const keys = Object.keys(data[0]).filter(k => k !== "date");
    const parseDate = d3.timeParse("%Y-%m-%d");
    const formattedData = data.map(d => ({ ...d, date: parseDate(d.date) }));
    
    const xScale = d3.scaleBand()
      .domain(formattedData.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.1);
      
    const stackGenerator = d3.stack().keys(keys);
    const layers = stackGenerator(formattedData);
    
    const yMax = d3.max(layers, layer => d3.max(layer, d => d[1]));
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);
      
    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(d3.schemeCategory10);
      
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
      
    // Create tooltip div (appended to body)
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "8px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none");
      
    layers.forEach(layer => {
      g.selectAll(`.bar-${layer.key}`)
        .data(layer)
        .enter()
        .append("rect")
        .attr("class", `bar-${layer.key}`)
        .attr("x", d => xScale(d.data.date))
        .attr("y", innerHeight) // start at bottom for animation
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", color(layer.key))
        .on("mouseover", function(event, d) {
          const channel = layer.key;
          const value = d.data[channel];
          const dateFormat = d3.timeFormat("%Y-%m-%d");
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(`<strong>Date:</strong> ${dateFormat(d.data.date)}<br/><strong>Channel:</strong> ${channel}<br/><strong>Revenue:</strong> $${value}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
          tooltip.transition().duration(500).style("opacity", 0);
        })
        .transition()
        .duration(800)
        .attr("y", d => yScale(d[1]))
        .attr("height", d => yScale(d[0]) - yScale(d[1]));
    });
    
    // Axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d"));
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);
      
    const yAxis = d3.axisLeft(yScale);
    g.append("g")
      .call(yAxis);
      
    // Axis labels in white
    svg.append("text")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Date");
      
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - (margin.top + innerHeight / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Revenue");
      
    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);
  
  return <svg ref={ref} width={width} height={height}></svg>;
};

// D3GroupedBarChart: Renders a grouped bar chart for Average Order Value per group of 10 orders.
const D3GroupedBarChart = ({ data, width = 400, height = 250 }) => {
  const ref = useRef();
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.group))
      .range([0, innerWidth])
      .padding(0.2);
    
    const yMax = d3.max(data, d => d.aov);
    const yScale = d3.scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);
      
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
      
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "8px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none");
      
    g.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.group))
      .attr("y", innerHeight)
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", "#00D2FF")
      .on("mouseover", function(event, d) {
         tooltip.transition().duration(200).style("opacity", 0.9);
         tooltip.html(`<strong>Group:</strong> ${d.group}<br/><strong>AOV:</strong> $${d.aov}`)
           .style("left", (event.pageX + 10) + "px")
           .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
         tooltip.transition().duration(500).style("opacity", 0);
      })
      .transition()
      .duration(800)
      .attr("y", d => yScale(d.aov))
      .attr("height", d => innerHeight - yScale(d.aov));
      
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));
    g.append("g")
      .call(d3.axisLeft(yScale));
      
    svg.append("text")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Order Group");
      
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - (margin.top + innerHeight / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Average Order Value");
      
    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);
  return <svg ref={ref} width={width} height={height}></svg>;
};

// D3DifferenceChart: Renders a difference chart comparing lifetime orders vs. order value per quarter.
const D3DifferenceChart = ({ data, width = 400, height = 250 }) => {
  const ref = useRef();
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.quarter))
      .range([0, innerWidth]);
    
    const yMin = d3.min(data, d => Math.min(d.lifetimeOrders, d.orderValue));
    const yMax = d3.max(data, d => Math.max(d.lifetimeOrders, d.orderValue));
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .nice()
      .range([innerHeight, 0]);
      
    const lineLifetime = d3.line()
      .x(d => xScale(d.quarter))
      .y(d => yScale(d.lifetimeOrders));
    const lineOrderValue = d3.line()
      .x(d => xScale(d.quarter))
      .y(d => yScale(d.orderValue));
    const area = d3.area()
      .x(d => xScale(d.quarter))
      .y0(d => yScale(Math.min(d.lifetimeOrders, d.orderValue)))
      .y1(d => yScale(Math.max(d.lifetimeOrders, d.orderValue)));
      
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
      
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "8px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "4px")
      .style("pointer-events", "none");
      
    g.append("path")
      .datum(data)
      .attr("fill", "#00D2FF")
      .attr("opacity", 0.3)
      .attr("d", area);
      
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ff7f0e")
      .attr("stroke-width", 2)
      .attr("d", lineLifetime);
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#2ca02c")
      .attr("stroke-width", 2)
      .attr("d", lineOrderValue);
      
    // Add circles and tooltips for both data sets.
    g.selectAll(".dot-lifetime")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-lifetime")
      .attr("cx", d => xScale(d.quarter))
      .attr("cy", d => yScale(d.lifetimeOrders))
      .attr("r", 4)
      .attr("fill", "#ff7f0e")
      .on("mouseover", function(event, d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(`<strong>Quarter:</strong> ${d.quarter}<br/><strong>Lifetime Orders:</strong> ${d.lifetimeOrders}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
          tooltip.transition().duration(500).style("opacity", 0);
      });
      
    g.selectAll(".dot-orderValue")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot-orderValue")
      .attr("cx", d => xScale(d.quarter))
      .attr("cy", d => yScale(d.orderValue))
      .attr("r", 4)
      .attr("fill", "#2ca02c")
      .on("mouseover", function(event, d) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(`<strong>Quarter:</strong> ${d.quarter}<br/><strong>Order Value:</strong> $${d.orderValue}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
          tooltip.transition().duration(500).style("opacity", 0);
      });
      
    const xAxis = d3.axisBottom(xScale).ticks(data.length);
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);
    g.append("g")
      .call(d3.axisLeft(yScale));
      
    svg.append("text")
      .attr("x", margin.left + innerWidth / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Quarter");
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", - (margin.top + innerHeight / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Value");
      
    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);
  return <svg ref={ref} width={width} height={height}></svg>;
};

/* Updated SalesComponent with New Chart Types and White Axis Labels */

const SalesComponent = ({ salesData }) => {
  const revenueMetrics = salesData?.revenueMetrics || {
    totalRevenue: 3200000,
    averageOrderValue: 213,
    customerLifetimeValue: 1200,
    refundReturnRates: "3%",
    stackedData: [
      { date: "2025-03-01", online: 150000, inStore: 100000, partner: 50000 },
      { date: "2025-03-02", online: 180000, inStore: 120000, partner: 60000 },
      { date: "2025-03-03", online: 200000, inStore: 150000, partner: 70000 },
      { date: "2025-03-04", online: 220000, inStore: 160000, partner: 80000 },
      { date: "2025-03-05", online: 250000, inStore: 180000, partner: 90000 },
      { date: "2025-03-06", online: 270000, inStore: 190000, partner: 100000 },
      { date: "2025-03-07", online: 300000, inStore: 210000, partner: 110000 }
    ]
  };
  const conversionFunnel = salesData?.conversionFunnel || {
    cartAbandonment: "55%",
    checkoutCompletion: "85%",
    conversionMobile: "3.2%",
    conversionDesktop: "4.5%"
  };
  const productPerformance = salesData?.productPerformance || {
    inventoryTurnover: "5x per month",
    unitsPerTransaction: 2.5,
    promotionalSalesImpact: "20%",
    seasonalTrends: "Winter peak"
  };
  const marketingPerformance = salesData?.marketingPerformance || {
    costPerAcquisition: "$45",
    repeatPurchaseRate: "40%",
    grossProfitMargin: "45%",
    checkoutAbandonment: "55%",
    conversionByDevice: "Avg: 4.0%"
  };

  const metricCards = [
    {
      title: "Total Revenue",
      value: `$${revenueMetrics.totalRevenue}`,
      numericValue: revenueMetrics.totalRevenue,
      maxValue: 5000000,
      change: 0,
      info: "Total revenue generated from sales over the period.",
      chartType: "stacked",
      chartData: revenueMetrics.stackedData
    },
    {
      title: "Average Order Value (AOV)",
      value: `$${revenueMetrics.averageOrderValue}`,
      numericValue: revenueMetrics.averageOrderValue,
      maxValue: 500,
      change: 0,
      info: "Average revenue per order grouped per every 10 orders.",
      chartType: "grouped",
      chartData: [
        { group: "1-10", aov: 200 },
        { group: "11-20", aov: 210 },
        { group: "21-30", aov: 215 },
        { group: "31-40", aov: 220 },
        { group: "41-50", aov: 230 }
      ]
    },
    {
      title: "Customer Lifetime Value (CLV)",
      value: `$${revenueMetrics.customerLifetimeValue}`,
      numericValue: revenueMetrics.customerLifetimeValue,
      maxValue: 2000,
      change: 0,
      info: "Average customer's lifetime orders vs. order value per quarter.",
      chartType: "difference",
      chartData: [
        { quarter: 1, lifetimeOrders: 5, orderValue: 250 },
        { quarter: 2, lifetimeOrders: 6, orderValue: 300 },
        { quarter: 3, lifetimeOrders: 7, orderValue: 350 },
        { quarter: 4, lifetimeOrders: 8, orderValue: 400 }
      ]
    },
    {
      title: "Refund/Return Rate",
      value: revenueMetrics.refundReturnRates,
      numericValue: 3,
      maxValue: 10,
      change: 0,
      info: "Percentage of orders that are returned or refunded.",
      chartType: "bar"
    },
    {
      title: "Cart Abandonment Rate",
      value: conversionFunnel.cartAbandonment,
      numericValue: 55,
      maxValue: 100,
      change: 0,
      info: "Percentage of shoppers who add items to their cart but do not complete the purchase.",
      chartType: "bar"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const nextCard = () => {
    setOverlayVisible(false);
    setCurrentIndex((prev) => (prev + 1) % metricCards.length);
  };

  const prevCard = () => {
    setOverlayVisible(false);
    setCurrentIndex((prev) => (prev - 1 + metricCards.length) % metricCards.length);
  };

  const toggleOverlay = () => {
    setOverlayVisible((prev) => !prev);
  };

  const currentCard = metricCards[currentIndex];

  const renderChart = (card) => {
    switch(card.chartType) {
      case "stacked":
        return <D3StackedChart data={card.chartData} />;
      case "grouped":
        return <D3GroupedBarChart data={card.chartData} />;
      case "difference":
        return <D3DifferenceChart data={card.chartData} />;
      case "line":
        return <D3LineChart data={card.chartData} />;
      case "scatter":
        return <D3ScatterChart data={card.chartData} />;
      case "donut":
        return <D3DonutChart data={card.chartData} />;
      case "bar":
      default:
        return <D3Bar value={card.numericValue} maxValue={card.maxValue} />;
    }
  };

  return (
    <div className="card chart-card sales-metrics-slider" style={{ position: 'relative' }}>
      <div className="card-header" style={{ position: 'relative' }}>
        Sales Metrics Story
        <span 
          className="info-icon" 
          onClick={toggleOverlay}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}>
          ℹ️
        </span>
      </div>
      <div className="slider-container">
        <button className="slider-button prev" onClick={prevCard}>
          <FaArrowLeft />
        </button>
        <div className="slider-content">
          <div className="slide-content">
            <div className="metric-title">{currentCard.title}</div>
            <div className="metric-value">{currentCard.value}</div>
            {renderChart(currentCard)}
            {currentCard.change !== undefined && (
              <div className={`metric-change ${currentCard.change >= 0 ? 'positive' : 'negative'}`}>
                {currentCard.change >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(currentCard.change)}%
              </div>
            )}
          </div>
        </div>
        <button className="slider-button next" onClick={nextCard}>
          <FaArrowRight />
        </button>
      </div>
      {overlayVisible && (
        <div 
          className="overlay" 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '1rem'
          }}
        >
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <button 
              onClick={toggleOverlay} 
              style={{
                position: 'absolute',
                top: '-1.5rem',
                right: '-1.5rem',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              <FaTimes />
            </button>
            <p>{currentCard.info}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesComponent;
