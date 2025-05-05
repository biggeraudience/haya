// src/components/DailyReportWidget.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DailyReportWidget = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDailyReport = async () => {
    setLoading(true);
    try {
      // Use relative URL because your base URL already includes '/api'
      const response = await axios.get('/reports/daily', { withCredentials: true });
      setReport(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReport();
    // Refresh every 5 minutes
    const intervalId = setInterval(fetchDailyReport, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>Loading Daily Report...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="card report-widget">
      <h3>Daily Report - {report?.date}</h3>
      {report && (
        <ul>
          <li>Total Revenue: ${report.totalRevenue}</li>
          <li>Total Orders: {report.totalOrders}</li>
          <li>Page Views: {report.pageViews}</li>
          <li>Average Order Value: ${report.averageOrderValue}</li>
          <li>
            Customer Analytics: {report.customerAnalytics?.newVsReturning} | Churn: {report.customerAnalytics?.churnRate}
          </li>
        </ul>
      )}
    </div>
  );
};

export default DailyReportWidget;
