import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const initialProfitCostData = [
  { name: 'Revenue', value: 2400 },
  { name: 'Cost', value: 1398 }
];

const SalesAnalytics = () => {
  const [profitCostData, setProfitCostData] = useState(initialProfitCostData);
  const [trend, setTrend] = useState({ revenueChange: 0, costChange: 0 });
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connectWebSocket = () => {
    ws.current = new WebSocket('ws://localhost:5000/sales');
    
    ws.current.onopen = () => {
      console.log('Sales WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const salesUpdate = JSON.parse(event.data);
        setProfitCostData([
          { name: 'Revenue', value: salesUpdate.revenue },
          { name: 'Cost', value: salesUpdate.cost }
        ]);
        setTrend({
          revenueChange: salesUpdate.revenueChange,
          costChange: salesUpdate.costChange
        });
      } catch (err) {
        console.error('Error parsing sales update:', err);
      }
    };

    ws.current.onerror = (error) => {
      console.error('Sales WebSocket error:', error);
    };

    ws.current.onclose = (event) => {
      console.log('Sales WebSocket closed. Reconnecting in 3 seconds...', event);
      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current) ws.current.close();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, []);

  return (
    <div className="card chart-card">
      <div className="card-header">
        Profit vs. Cost (Real-time)
        <div className="sales-trend">
          <div className="trend-item">
            Revenue Change:{' '}
            {trend.revenueChange >= 0 ? (
              <FaArrowUp style={{ color: '#00FFC8' }} />
            ) : (
              <FaArrowDown style={{ color: '#FF6347' }} />
            )}{' '}
            {Math.abs(trend.revenueChange)}%
          </div>
          <div className="trend-item">
            Cost Change:{' '}
            {trend.costChange >= 0 ? (
              <FaArrowUp style={{ color: '#00FFC8' }} />
            ) : (
              <FaArrowDown style={{ color: '#FF6347' }} />
            )}{' '}
            {Math.abs(trend.costChange)}%
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={profitCostData}>
          <CartesianGrid stroke="#333" />
          <XAxis dataKey="name" stroke="#CCCCCC" />
          <YAxis stroke="#CCCCCC" />
          <Tooltip />
          <Bar dataKey="value" fill="#00FFC8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesAnalytics;
