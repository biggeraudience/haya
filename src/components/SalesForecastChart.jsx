// src/components/SalesForecastChart.jsx
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const historicalData = [
  { date: '2025-02-21', sales: 100 },
  { date: '2025-02-22', sales: 120 },
  { date: '2025-02-23', sales: 90 },
  { date: '2025-02-24', sales: 150 },
  { date: '2025-02-25', sales: 130 },
];

const forecastData = [
  { date: '2025-02-26', forecast: 140 },
  { date: '2025-02-27', forecast: 135 },
  { date: '2025-02-28', forecast: 145 },
];

const mergeData = (historical, forecast) => {
  const dataMap = {};
  historical.forEach(item => {
    dataMap[item.date] = { date: item.date, sales: item.sales };
  });
  forecast.forEach(item => {
    dataMap[item.date] = { ...dataMap[item.date], forecast: item.forecast };
  });
  return Object.values(dataMap).sort((a, b) => new Date(a.date) - new Date(b.date));
};

const data = mergeData(historicalData, forecastData);

const SalesForecastChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" stroke="#CCCCCC" />
      <YAxis stroke="#CCCCCC" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="sales"
        stroke="#00D2FF"
        name="Historical Sales"
        isAnimationActive={true}
        animationDuration={1000}
      />
      <Line
        type="monotone"
        dataKey="forecast"
        stroke="#FF6347"
        name="Forecasted Sales"
        isAnimationActive={true}
        animationDuration={1000}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default SalesForecastChart;
