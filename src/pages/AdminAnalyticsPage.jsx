// src/pages/AdminAnalyticsPage.jsx
import React, { useState, useEffect } from 'react';
import '../styles/globaladmin.scss';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FaArrowUp, FaArrowDown, FaRobot } from 'react-icons/fa';
import SalesAnalytics from '../components/SalesAnalytics';
import SalesPredictionWidget from '../components/SalesPredictionWidget';
import SalesForecastChart from '../components/SalesForecastChart';
import DailyReportWidget from '../components/DailyReportWidget';
import CustomerHeatmap from '../components/CustomerHeatmap';
import SalesComponent from '../components/SalesComponent';
import MapSlider from '../components/MapSlider';
import ChatBot from '../components/ChatBot';

const revenueData = [
  { date: '2025-01-01', revenue: 400 },
  { date: '2025-01-02', revenue: 300 },
  { date: '2025-01-03', revenue: 500 },
  { date: '2025-01-04', revenue: 200 },
  { date: '2025-01-05', revenue: 278 },
  { date: '2025-01-06', revenue: 189 }
];

const pieData = [
  { name: 'Open', value: 400 },
  { name: 'Clicked', value: 300 },
  { name: 'Unsubscribed', value: 300 },
  { name: 'Converted', value: 200 }
];

const COLORS = ['#00D2FF', '#00FFC8', '#7D5FFF', '#FF6347'];

const LiveMetricCard = ({ title, value, change }) => {
  const isPositive = change >= 0;
  return (
    <div className="card live-metric">
      <div className="metric-title">{title}</div>
      <div className="metric-value">{value}</div>
      {change !== undefined && (
        <div className={`metric-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(change)}%
        </div>
      )}
    </div>
  );
};

const RevenueOverTimeChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" stroke="#CCCCCC" />
      <YAxis stroke="#CCCCCC" />
      <Tooltip />
      <Line type="monotone" dataKey="revenue" stroke="#00D2FF" />
    </LineChart>
  </ResponsiveContainer>
);

const FinancialMetricsCard = ({ revenueMetrics }) => (
  <div className="card chart-card">
    <div className="card-header">Financial Metrics</div>
    <div>
      <p>Customer Lifetime Value (CLV): ${revenueMetrics.customerLifetimeValue}</p>
      <p>Refund/Return Rate: {revenueMetrics.refundReturnRates}</p>
    </div>
  </div>
);

const TrafficConversionCard = ({ trafficAnalytics, conversionFunnel }) => {
  const trafficSourceData = trafficAnalytics.trafficSources
    ? Object.entries(trafficAnalytics.trafficSources).map(([source, percent]) => ({
        source,
        percent: parseFloat(percent)
      }))
    : [];
  const trafficColors = ['#00D2FF', '#00FFC8', '#7D5FFF', '#FF6347', '#FFA500'];
  return (
    <div className="card chart-card">
      <div className="card-header">Traffic & Conversion</div>
      <div>
        <p>Session Duration: {trafficAnalytics.sessionDuration}</p>
        <p>Bounce Rate: {trafficAnalytics.bounceRate}</p>
        <p>Cart Abandonment: {conversionFunnel.cartAbandonment}</p>
        <p>Checkout Completion: {conversionFunnel.checkoutCompletion}</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={trafficSourceData}
              dataKey="percent"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#00D2FF"
              label
            >
              {trafficSourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={trafficColors[index % trafficColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const tabs = ['Overview', 'Sales', 'Marketing', 'Customers'];

const AdminAnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChatBot, setShowChatBot] = useState(false);

  useEffect(() => {
    const BASE_API_URL = import.meta.env.VITE_API_URL;
    axios
      .get(`${BASE_API_URL}/analytics`, { withCredentials: true })
      .then((response) => {
        setAnalyticsData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
        setLoading(false);
      });
  }, []);

  const renderOverview = () => {
    if (loading) return <div>Loading metrics...</div>;
    if (error) return <div>{error}</div>;
    const { revenueMetrics, trafficAnalytics } = analyticsData;
    return (
      <div className="tab-content overview">
        <div className="live-metrics-row">
          <LiveMetricCard title="Total Revenue" value={`$${revenueMetrics.totalRevenue || 0}`} change={0} />
          <LiveMetricCard title="Transactions" value={trafficAnalytics.pageViews || "0"} change={0} />
          <LiveMetricCard title="Avg Order Value" value={`$${revenueMetrics.averageOrderValue || 0}`} change={0} />
          <LiveMetricCard title="Conversion Rate" value="3.5%" change={0} />
          <LiveMetricCard title="Total Traffic" value={trafficAnalytics.totalVisitors || "0"} change={0} />
        </div>
        <div className="charts-row">
          <div className="card chart-card">
            <div className="card-header">
              Revenue Over Time
              <div className="date-picker">Last 7 days</div>
            </div>
            <SalesForecastChart />
          </div>
          <div className="card chart-card">
            <div className="card-header">Daily Report</div>
            <DailyReportWidget />
          </div>
        </div>
      </div>
    );
  };

  const renderSales = () => (
    <div className="tab-content sales">
      <div className="charts-row">
        <SalesAnalytics />
        <SalesPredictionWidget />
      </div>
      <div className="charts-row">
        {analyticsData && <SalesComponent salesData={analyticsData} />}
      </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="tab-content marketing">
      <div className="charts-row">
        <div className="card chart-card">
          <div className="card-header">Email Campaign Metrics</div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#00D2FF">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {analyticsData && (
          <TrafficConversionCard
            trafficAnalytics={analyticsData.trafficAnalytics}
            conversionFunnel={analyticsData.conversionFunnel}
          />
        )}
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="tab-content customers">
      <div className="charts-row">
        <div className="card chart-card">
          <div className="card-header">Customer Trends</div>
          <RevenueOverTimeChart />
        </div>
        <div className="card chart-card">
          <div className="card-header">Customer Segmentation (Map)</div>
          <MapSlider />
        </div>
        <div className="card chart-card">
          <div className="card-header">Customer Heatmap</div>
          <CustomerHeatmap />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return renderOverview();
      case 'Sales':
        return renderSales();
      case 'Marketing':
        return renderMarketing();
      case 'Customers':
        return renderCustomers();
      default:
        return null;
    }
  };

  const toggleChatBot = () => {
    setShowChatBot(!showChatBot);
  };

  return (
    <div className="main-container">
      <div className="admin-container">
        <div className="admin-analytics-page">
          <header className="top-bar">

            <div className="admin-toggle-buttons">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`admin-toggle-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              <div className="chatbot-toggle-icon" onClick={toggleChatBot}>
                <FaRobot />
              </div>
            </div>
          </header>
          <div className="content">{renderTabContent()}</div>
          {showChatBot && <ChatBot />}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
