import React, { useState } from 'react';
import '../styles/adminreports.scss';

const initialReports = [
  {
    id: 1,
    user: {
      photo: 'https://via.placeholder.com/50',
      email: 'john.doe@example.com',
      name: 'John Doe',
    },
    subject: 'Issue with Product Delivery',
    status: 'open',
    body: 'I did not receive my package on time. Please check!',
    date: '2025-03-10',
    adminQuote: '',
  },
  {
    id: 2,
    user: {
      photo: 'https://via.placeholder.com/50',
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
    },
    subject: 'Wrong item delivered',
    status: 'open',
    body: 'I received a different product than what I ordered.',
    date: '2025-03-11',
    adminQuote: '',
  },
  {
    id: 3,
    user: {
      photo: 'https://via.placeholder.com/50',
      email: 'sam.wilson@example.com',
      name: 'Sam Wilson',
    },
    subject: 'Defective item received',
    status: 'resolved',
    body: 'The item I got is defective and needs a replacement.',
    date: '2025-03-09',
    adminQuote: 'We apologize for the inconvenience. A replacement is on its way.',
  },
];

const AdminReportsPage = () => {
  const [reports, setReports] = useState(initialReports);
  const [activeTab, setActiveTab] = useState('open'); // 'open' or 'logged'
  const [quoteReportId, setQuoteReportId] = useState(null);
  const [quoteText, setQuoteText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const handleQuoteClick = (id) => {
    setQuoteReportId(id);
  };

  const handleQuoteSubmit = (id) => {
    setReports(prev =>
      prev.map(report => {
        if (report.id === id) {
          return { ...report, adminQuote: quoteText, status: 'resolved' };
        }
        return report;
      })
    );
    setQuoteReportId(null);
    setQuoteText('');
  };

  const filteredReports = reports.filter(report => {
    if (activeTab === 'open') {
      return report.status === 'open';
    } else {
      // logged tab: resolved reports that have an admin response
      return report.status === 'resolved' && report.adminQuote;
    }
  }).filter(report => {
    if (searchTerm.trim() === '') return true;
    const term = searchTerm.toLowerCase();
    return report.subject.toLowerCase().includes(term) || report.body.toLowerCase().includes(term);
  });

  const sortedReports = activeTab === 'logged'
    ? [...filteredReports].sort((a, b) => {
        if (sortOrder === 'asc') {
          return new Date(a.date) - new Date(b.date);
        }
        return new Date(b.date) - new Date(a.date);
      })
    : filteredReports;

  return (
    <div className="admin-reports-page">
      <header className="reports-header">
        <h1>Customer Reports</h1>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'open' ? 'active' : ''}`}
          onClick={() => setActiveTab('open')}
        >
          Open Reports
        </button>
        <button 
          className={`tab ${activeTab === 'logged' ? 'active' : ''}`}
          onClick={() => setActiveTab('logged')}
        >
          Logged Reports
        </button>
      </div>

      {activeTab === 'logged' && (
        <div className="filters">
          <input 
            type="text" 
            placeholder="Search keywords..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            Sort by Date ({sortOrder === 'asc' ? 'Asc' : 'Desc'})
          </button>
        </div>
      )}

      <div className="reports-feed">
        {sortedReports.map(report => (
          <div key={report.id} className="report-tile">
            <div className="report-header">
              <div className="user-info">
                <img src={report.user.photo} alt={report.user.name} />
                <div className="user-details">
                  <p className="user-name">{report.user.name}</p>
                  <p className="user-email">{report.user.email}</p>
                </div>
              </div>
              <div className="report-subject">
                <h2>{report.subject}</h2>
              </div>
              <div className="report-status">
                <span>{report.status}</span>
                <div 
                  className="status-indicator" 
                  style={{ backgroundColor: report.status === 'resolved' ? 'red' : 'green' }}
                ></div>
              </div>
            </div>

            <div className="report-body">
              <p>{report.body}</p>
              {report.adminQuote && (
                <div className="admin-quote">
                  <blockquote>{report.adminQuote}</blockquote>
                </div>
              )}
            </div>

            {activeTab === 'open' && (
              <div className="report-actions">
                {quoteReportId === report.id ? (
                  <div className="quote-form">
                    <textarea 
                      value={quoteText} 
                      onChange={(e) => setQuoteText(e.target.value)}
                      placeholder="Enter your response..."
                    ></textarea>
                    <button onClick={() => handleQuoteSubmit(report.id)}>Submit Quote</button>
                    <button onClick={() => setQuoteReportId(null)}>Cancel</button>
                  </div>
                ) : (
                  <button className="quote-button" onClick={() => handleQuoteClick(report.id)}>
                    Quote
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        {sortedReports.length === 0 && (
          <p className="no-reports">No reports to display.</p>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
