// src/components/SalesPredictionWidget.jsx
import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";
import { SiDatadotai } from "react-icons/si";
import * as d3 from "d3";
import { useSalesPrediction } from "../hooks/usePrediction";

/* ------------------ D3DonutChart ------------------
   Used for both AOV ranges and Customer Behavior.
   Now includes a detailed tooltip on hover. */
const D3DonutChart = ({ data, width = 200, height = 200, innerRadius = 50, outerRadius = 80 }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    let tooltip = d3.select(tooltipRef.current);
    if (tooltip.empty()) {
      tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "#fff")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);
    }
    
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
      .attr("d", arc)
      .on("mouseover", function (event, d) {
         d3.select(this).transition().duration(200).attr("opacity", 0.7);
         tooltip.transition().duration(200).style("opacity", 0.9);
         tooltip.html(`Label: ${d.data.label || "N/A"}<br/>Value: ${d.data.value}`)
            .style("left", (event.pageX+10) + "px")
            .style("top", (event.pageY-28) + "px");
      })
      .on("mouseout", function () {
         d3.select(this).transition().duration(200).attr("opacity", 1);
         tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data, width, height, innerRadius, outerRadius]);
  return (
    <>
      <svg ref={svgRef} width={width} height={height}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
};

/* ------------------ SalesForecastChart ------------------
   Line chart for historical revenue trends.
   Now draws circles on each data point with detailed tooltips.
*/
const SalesForecastChart = ({ data }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  useEffect(() => {
    if (!data || data.length === 0) return;
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove();
    
    let tooltip = d3.select(tooltipRef.current);
    if (tooltip.empty()) {
      tooltip = d3.select("body")
         .append("div")
         .attr("class", "tooltip")
         .style("position", "absolute")
         .style("background", "rgba(0,0,0,0.7)")
         .style("color", "#fff")
         .style("padding", "5px")
         .style("border-radius", "4px")
         .style("pointer-events", "none")
         .style("opacity", 0);
    }
    
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const widthChart = 500 - margin.left - margin.right;
    const heightChart = 250 - margin.top - margin.bottom;
    const svg = svgEl
      .attr("width", widthChart + margin.left + margin.right)
      .attr("height", heightChart + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const parseDate = d3.timeParse("%Y-%m-%d");
    const chartData = data.map(d => ({
      date: parseDate(d._id),
      totalRevenue: d.totalRevenue
    }));
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(chartData, d => d.date))
      .range([0, widthChart]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.totalRevenue)])
      .nice()
      .range([heightChart, 0]);
    
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.totalRevenue));
    
    svg.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#00D2FF")
      .attr("stroke-width", 2)
      .attr("d", line);
    
    svg.append("g")
      .attr("transform", `translate(0, ${heightChart})`)
      .call(d3.axisBottom(xScale).ticks(5));
    svg.append("g")
      .call(d3.axisLeft(yScale));
    
    // Add circles with tooltips on each data point.
    svg.selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.totalRevenue))
      .attr("r", 4)
      .attr("fill", "#00D2FF")
      .on("mouseover", function(event, d) {
         d3.select(this).transition().duration(200).attr("r", 6);
         tooltip.transition().duration(200).style("opacity", 0.9);
         tooltip.html(`Date: ${d3.timeFormat("%b %d, %Y")(d.date)}<br/>Revenue: $${d.totalRevenue}`)
            .style("left", (event.pageX+10) + "px")
            .style("top", (event.pageY-28) + "px");
      })
      .on("mouseout", function() {
         d3.select(this).transition().duration(200).attr("r", 4);
         tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data]);
  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
};

/* ------------------ D3CandlestickChart ------------------
   For Promotional & Seasonal Effects.
   Uses candlesticks with hover tooltips detailing open, high, low, close.
*/
const D3CandlestickChart = ({ data, width = 400, height = 250 }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const parseDate = d3.timeParse("%Y-%m-%d");
    const chartData = data.map(d => ({
      date: parseDate(d.date),
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close
    }));
    
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.3);
    const yScale = d3.scaleLinear()
      .domain([d3.min(chartData, d => d.low), d3.max(chartData, d => d.high)])
      .range([innerHeight, 0])
      .nice();
    
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d")));
    g.append("g")
      .call(d3.axisLeft(yScale));
    
    let tooltip = d3.select(tooltipRef.current);
    if (tooltip.empty()) {
      tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "#fff")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);
    }
    
    chartData.forEach(d => {
      const x = xScale(d.date);
      const candleWidth = xScale.bandwidth();
      const color = d.close >= d.open ? "green" : "red";
      // Draw wick
      g.append("line")
        .attr("x1", x + candleWidth / 2)
        .attr("x2", x + candleWidth / 2)
        .attr("y1", yScale(d.high))
        .attr("y2", yScale(d.low))
        .attr("stroke", color)
        .attr("stroke-width", 1);
      // Draw body
      g.append("rect")
        .attr("x", x)
        .attr("y", yScale(Math.max(d.open, d.close)))
        .attr("width", candleWidth)
        .attr("height", Math.abs(yScale(d.open) - yScale(d.close)))
        .attr("fill", color)
        .on("mouseover", function (event) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(
            `<strong>${d3.timeFormat("%b %d, %Y")(d.date)}</strong><br/>Open: ${d.open}<br/>High: ${d.high}<br/>Low: ${d.low}<br/>Close: ${d.close}`
          )
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    });
  }, [data, width, height]);
  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
};

/* ------------------ D3GroupedTrafficConversionChart ------------------
   Grouped bar chart for traffic and conversion.
   Now includes more detailed tooltips with formatted dates.
*/
const D3GroupedTrafficConversionChart = ({ data, width = 400, height = 250 }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    let tooltip = d3.select(tooltipRef.current);
    if (tooltip.empty()) {
      tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "#fff")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);
    }
    
    const parseDate = d3.timeParse("%Y-%m-%d");
    const chartData = data.map(d => ({
      date: parseDate(d.date),
      traffic: d.traffic,
      conversion: d.conversionRate * 100 // scale conversion for comparison
    }));
    
    const xScale = d3.scaleBand()
      .domain(chartData.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.2);
    const subgroups = ["traffic", "conversion"];
    const xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, xScale.bandwidth()])
      .padding(0.05);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => Math.max(d.traffic, d.conversion))])
      .nice()
      .range([innerHeight, 0]);
    
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d")));
    g.append("g")
      .call(d3.axisLeft(yScale));
    
    chartData.forEach(d => {
      const xPos = xScale(d.date);
      subgroups.forEach(key => {
        g.append("rect")
          .attr("x", xPos + xSubgroup(key))
          .attr("y", yScale(d[key]))
          .attr("width", xSubgroup.bandwidth())
          .attr("height", innerHeight - yScale(d[key]))
          .attr("fill", key === "traffic" ? "#00D2FF" : "#00FFC8")
          .on("mouseover", function (event) {
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`${key === "traffic" ? "Traffic" : "Conversion"}<br/>Date: ${d3.timeFormat("%b %d, %Y")(d.date)}<br/>Value: ${d[key]}`)
              .style("left", (event.pageX + 10) + "px")
              .style("top", (event.pageY - 28) + "px");
          })
          .on("mouseout", function () {
            tooltip.transition().duration(500).style("opacity", 0);
          });
      });
    });
    
    // Overlay line for conversion values.
    const lineData = chartData.map(d => ({
      date: d.date,
      conversion: d.conversion
    }));
    const lineGenerator = d3.line()
      .x(d => xScale(d.date) + xSubgroup("conversion") + xSubgroup.bandwidth() / 2)
      .y(d => yScale(d.conversion));
    g.append("path")
      .datum(lineData)
      .attr("fill", "none")
      .attr("stroke", "#FFA500")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);
    g.selectAll("circle")
      .data(lineData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date) + xSubgroup("conversion") + xSubgroup.bandwidth() / 2)
      .attr("cy", d => yScale(d.conversion))
      .attr("r", 4)
      .attr("fill", "#FFA500")
      .on("mouseover", function (event, d) {
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Conversion<br/>Date: ${d3.timeFormat("%b %d, %Y")(d.date)}<br/>Value: ${d.conversion}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      });
  }, [data, width, height]);
  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
};

/* ------------------ D3MarketingDifferenceChart ------------------
   A difference chart for Marketing Spend & ROI.
   Data is normalized using the overall max so both series are comparable.
   The area between the two lines is filled green if ROI outperforms spend and red otherwise.
   Detailed tooltips on each data point explain the raw values and normalized percentages.
*/
const D3MarketingDifferenceChart = ({ data, width = 400, height = 250 }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const margin = { top: 20, right: 50, bottom: 30, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const parseDate = d3.timeParse("%Y-%m-%d");
    const chartData = data.map(d => ({
      date: parseDate(d.date),
      spend: d.spend,
      roi: d.roi
    }));
    const overallMax = d3.max(chartData, d => Math.max(d.spend, d.roi));
    chartData.forEach(d => {
      d.normalizedSpend = d.spend / overallMax;
      d.normalizedROI = d.roi / overallMax;
    });
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(chartData, d => d.date))
      .range([0, innerWidth]);
    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0])
      .nice();
    
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));
    g.append("g")
      .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".0%")));
      
    // Draw area segments between spend and ROI for each adjacent pair.
    for (let i = 0; i < chartData.length - 1; i++) {
      const seg = [chartData[i], chartData[i+1]];
      const avgDiff = ((seg[0].normalizedROI - seg[0].normalizedSpend) + (seg[1].normalizedROI - seg[1].normalizedSpend)) / 2;
      const fillColor = avgDiff >= 0 ? "green" : "red";
      const areaGenerator = d3.area()
        .x(d => xScale(d.date))
        .y0(d => yScale(d.normalizedSpend))
        .y1(d => yScale(d.normalizedROI));
      g.append("path")
        .datum(seg)
        .attr("fill", fillColor)
        .attr("opacity", 0.3)
        .attr("d", areaGenerator);
    }
    
    // Draw spend and ROI lines.
    const spendLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.normalizedSpend));
    const roiLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.normalizedROI));
    g.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#00D2FF")
      .attr("stroke-width", 2)
      .attr("d", spendLine);
    g.append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "#00FFC8")
      .attr("stroke-width", 2)
      .attr("d", roiLine);
      
    let tooltip = d3.select(tooltipRef.current);
    if (tooltip.empty()) {
      tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "#fff")
        .style("padding", "5px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);
    }
    
    // Add circles with tooltips for both spend and ROI points.
    chartData.forEach(d => {
      // Spend point
      g.append("circle")
        .attr("cx", xScale(d.date))
        .attr("cy", yScale(d.normalizedSpend))
        .attr("r", 4)
        .attr("fill", "#00D2FF")
        .on("mouseover", function(event) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(`Date: ${d3.timeFormat("%b %d, %Y")(d.date)}<br/>Spend: $${d.spend}<br/>Normalized: ${(d.normalizedSpend*100).toFixed(1)}%`)
            .style("left", (event.pageX+10)+"px")
            .style("top", (event.pageY-28)+"px");
        })
        .on("mouseout", function() {
          tooltip.transition().duration(500).style("opacity", 0);
        });
      // ROI point
      g.append("circle")
        .attr("cx", xScale(d.date))
        .attr("cy", yScale(d.normalizedROI))
        .attr("r", 4)
        .attr("fill", "#00FFC8")
        .on("mouseover", function(event) {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(`Date: ${d3.timeFormat("%b %d, %Y")(d.date)}<br/>ROI: $${d.roi}<br/>Normalized: ${(d.normalizedROI*100).toFixed(1)}%`)
            .style("left", (event.pageX+10)+"px")
            .style("top", (event.pageY-28)+"px");
        })
        .on("mouseout", function() {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    });
  }, [data, width, height]);
  return (
    <>
      <svg ref={svgRef}></svg>
      <div ref={tooltipRef}></div>
    </>
  );
};

/* ------------------ SalesPredictionWidget Main Component ------------------
   Uses a slider with several cards.
   Each card now includes descriptive headings, detailed tooltips (via the info icon overlay),
   and the updated D3 components with maximum labeling.
*/
const SalesPredictionWidget = () => {
  const { prediction, loading, error, getPrediction } = useSalesPrediction();
  const [historicalData, setHistoricalData] = useState(null);
  const [showPredictedSales, setShowPredictedSales] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);

  // Fetch historical sales data from backend.
  useEffect(() => {
    fetch("/api/predictions/sales-prediction-data")
      .then((res) => res.json())
      .then((data) => {
        setHistoricalData(data.dailyAggregation);
      })
      .catch((err) => console.error("Error fetching historical data:", err));
  }, []);

  // Dummy data for visualizations:
  const trafficData = [
    { date: "2025-01-01", traffic: 500, conversionRate: 2.5 },
    { date: "2025-01-02", traffic: 600, conversionRate: 3.0 },
    { date: "2025-01-03", traffic: 550, conversionRate: 2.8 },
    { date: "2025-01-04", traffic: 700, conversionRate: 3.5 },
    { date: "2025-01-05", traffic: 650, conversionRate: 3.2 }
  ];
  const aovRanges = [
    { label: "$0-50", value: 10 },
    { label: "$50-100", value: 30 },
    { label: "$100-150", value: 25 },
    { label: "$150-200", value: 20 },
    { label: "$200+", value: 15 }
  ];
  const promoData = [
    { date: "2025-02-01", open: 280, high: 320, low: 260, close: 300 },
    { date: "2025-02-02", open: 300, high: 550, low: 290, close: 500 },
    { date: "2025-02-03", open: 480, high: 720, low: 450, close: 700 },
    { date: "2025-02-04", open: 700, high: 680, low: 640, close: 650 },
    { date: "2025-02-05", open: 650, high: 850, low: 630, close: 800 },
    { date: "2025-02-06", open: 800, high: 770, low: 730, close: 750 },
    { date: "2025-02-07", open: 750, high: 950, low: 740, close: 900 }
  ];
  
  const marketingData = [
    { date: "2025-01-01", spend: 1000, roi: 150 },
    { date: "2025-01-02", spend: 1200, roi: 180 },
    { date: "2025-01-03", spend: 1100, roi: 160 },
    { date: "2025-01-04", spend: 1300, roi: 200 },
    { date: "2025-01-05", spend: 1250, roi: 190 }
  ];

  // Compute sales score and progress bar.
  const targetSales = 2000;
  const numericPrediction = Number(prediction);
  const score = numericPrediction ? Math.min((numericPrediction / targetSales) * 100, 100) : 0;
  let progressColor = "red";
  let performanceSummary = "";
  if (score >= 90) {
    progressColor = "green";
    performanceSummary = "Great job! Your sales are on track. Keep optimizing your marketing channels and exploring new opportunities for growth.";
  } else if (score >= 50) {
    progressColor = "orange";
    performanceSummary = "Your sales are average. Consider refining your promotional strategies and exploring additional sales channels to boost performance.";
  } else {
    progressColor = "red";
    performanceSummary = "Sales are low. Focus on targeted promotions, customer engagement, and revisiting your pricing strategy to improve sales.";
  }

  // Define slider cards with titles, info and content.
  const sliderCards = [
    {
      title: "Sales Forecast",
      info: "Predicted sales, score & business insights. Toggle to reveal forecast, progress and recommendations.",
      content: (
        <div>
          <h5 style={{ textAlign: "center", color: "#fff" }}>Sales Forecast & Insights</h5>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "1rem" }}>
          <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "1rem"
  }}
>
  <button
    onClick={() => {
      if (!showPredictedSales) {
        getPrediction(100);
      }
      setShowPredictedSales(!showPredictedSales);
    }}
    style={{
      width: "3rem",
      height: "3rem",
      borderRadius: "50%",
      border: "none",
      background: "#121212",
      cursor: "pointer",
      fontSize: "1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }}
    title="Toggle predicted sales"
  >
    {/* Hidden SVG gradient definition */}
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="iconGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="red" />
          <stop offset="33%" stopColor="yellow" />
          <stop offset="66%" stopColor="blue" />
          <stop offset="100%" stopColor="green" />
        </linearGradient>
      </defs>
    </svg>
    <SiDatadotai style={{ fill: "url(#iconGradient)" }} />
  </button>
</div>

          </div>
          {showPredictedSales && !loading && prediction !== null && (
            <>
              <p>
                Predicted Sales: <strong>{prediction}</strong>
              </p>
              <div style={{ width: "100%", background: "#333", height: "20px", borderRadius: "10px", marginTop: "1rem" }}>
                <div style={{ width: `${score}%`, height: "100%", background: progressColor, transition: "width 1s ease" }}></div>
              </div>
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>Score: {Math.round(score)}%</p>
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>{performanceSummary}</p>
            </>
          )}
          {loading && <p>Loading prediction...</p>}
          {error && <p>Error: {error}</p>}
          {historicalData && historicalData.length > 0 && (
            <div>
              <h6 style={{ color: "#fff" }}>Historical Revenue Trends (Last 90 Days)</h6>
              <SalesForecastChart data={historicalData} />
            </div>
          )}
        </div>
      )
    },
    {
      title: "Overall Sales Trend",
      info: "Daily/Weekly revenue trend with key milestones.",
      content: historicalData && historicalData.length > 0 ? (
        <div>
          <h5>Overall Sales Trend</h5>
          <SalesForecastChart data={historicalData} />
        </div>
      ) : (
        <p>Loading overall sales trend...</p>
      )
    },
    {
      title: "Traffic & Conversion",
      info: "Grouped view of traffic and conversion with interactive tooltips detailing date, traffic and conversion values.",
      content: (
        <div>
          <h5>Traffic & Conversion</h5>
          <D3GroupedTrafficConversionChart data={trafficData} />
        </div>
      )
    },
    {
      title: "Average Order Value (AOV)",
      info: "Donut chart of order value ranges. Hover over segments to see the range and percentage of orders.",
      content: (
        <div>
          <h5>Average Order Value Ranges</h5>
          <D3DonutChart data={aovRanges} />
        </div>
      )
    },
    {
      title: "Promotional & Seasonal Effects",
      info: "Candlestick chart showing promotional impact and seasonal volatility. Hover over each candlestick for detailed insights.",
      content: (
        <div>
          <h5>Promotional & Seasonal Effects</h5>
          <D3CandlestickChart data={promoData} />
        </div>
      )
    },
    {
      title: "Customer Behavior & Segmentation",
      info: "Donut chart breaking down customer types. Hover over each segment for detailed percentages.",
      content: (
        <div>
          <h5>Customer Behavior & Segmentation</h5>
          <D3DonutChart data={[
            { label: "Trendsetters", value: 25 },
            { label: "Bargain Hunters", value: 40 },
            { label: "Seasonal Shoppers", value: 20 },
            { label: "Occasional Explorers", value: 15 }
          ]} />
        </div>
      )
    },
    {
      title: "Marketing Spend & ROI",
      info: "Difference chart comparing marketing spend and ROI. The filled area indicates which is outperforming.",
      content: (
        <div>
          <h5>Marketing Spend vs. ROI</h5>
          <D3MarketingDifferenceChart data={marketingData} />
        </div>
      )
    }
  ];
  

  const nextCard = () => {
    setOverlayVisible(false);
    setCurrentIndex((prev) => (prev + 1) % sliderCards.length);
  };

  const prevCard = () => {
    setOverlayVisible(false);
    setCurrentIndex((prev) => (prev - 1 + sliderCards.length) % sliderCards.length);
  };

  const toggleOverlay = () => {
    setOverlayVisible((prev) => !prev);
  };

  const currentCard = sliderCards[currentIndex];

  return (
    <div className="card prediction-widget" style={{ position: 'relative' }}>
      <div className="card-header" style={{ position: 'relative' }}>
        {currentCard.title}
        <span 
          className="info-icon" 
          onClick={toggleOverlay}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            cursor: 'pointer',
            fontSize: '1.2rem'
          }}
          title="More info"
        >
          ℹ️
        </span>
      </div>
      <div className="slider-container">
        <button className="slider-button prev" onClick={prevCard}>
          <FaArrowLeft />
        </button>
        <div className="slider-content">
          <div className="slide-content">
            {currentCard.content}
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

export default SalesPredictionWidget;
