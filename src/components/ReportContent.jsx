// src/components/FeedContent/ReportContent.jsx
import React, { useState } from 'react';
import '../styles/reportcontent.scss'; // Import styles for the report form

const ReportContent = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend API
    console.log('Report submitted:', { email, message });

    // For demonstration purposes, we'll just show an alert and clear the form
    alert('Report submitted successfully!');

    // Clear the form fields after submission
    setEmail('');
    setMessage('');
  };

  return (
    <div className="report-container">
      <h2>Submit a Report</h2>
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="email">Your Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required // Make email field required
            placeholder="Enter your email" // Add a placeholder
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="6" // Give it a reasonable height for the message
            required // Make message field required
            placeholder="Enter your message here..." // Add a placeholder
          ></textarea>
        </div>
        <button type="submit" className="send-button">
          Send
          {/* SVG icon for sending */}
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fff">
            <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l260 60-260 60v140Zm0 0v-400 400Z"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ReportContent;