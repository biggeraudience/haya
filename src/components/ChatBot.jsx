// src/components/ChatBot.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaComments, FaTimes } from 'react-icons/fa';
import { MdOutlineInsights } from 'react-icons/md';
import axios from 'axios';
import '../styles/chatbot.scss';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to the bottom whenever the chat log updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatLog]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Append user's message to chat log
    const userMessage = { sender: 'user', text: input, timestamp: new Date() };
    setChatLog(prev => [...prev, userMessage]);

    const messageToSend = input;
    setInput('');
    setIsLoading(true);

    try {
      // Send query to your backend chatbot endpoint
      const response = await axios.post('/chatbot/ask', { query: messageToSend });
      const botMessage = { sender: 'bot', text: response.data.message, timestamp: new Date() };
      setChatLog(prev => [...prev, botMessage]);
    } catch (error) {
      setChatLog(prev => [
        ...prev,
        { sender: 'bot', text: 'Oops, something went wrong. Please try again.', timestamp: new Date() }
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'open' : 'closed'}`}>
      {!isOpen && (
        <div className="chatbot-toggle" onClick={toggleChat}>
          <FaComments />
        </div>
      )}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="header-left">
              <h3>Business Genie</h3>
              <span className="insights-icon">
                {/* Set the icon color to transparent so the background gradient shows */}
                <MdOutlineInsights />
              </span>
            </div>
            <button className="close-button" onClick={closeChat}>
              <FaTimes />
            </button>
          </div>
          <div className="chatbot-log" ref={chatContainerRef}>
            {chatLog.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
              </div>
            ))}
            {isLoading && (
              <div className="chat-message bot">
                <div className="message-text">Typing...</div>
              </div>
            )}
          </div>
          <form onSubmit={sendMessage} className="chatbot-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about sales, pricing, and more..."
            />
            <button type="submit" className="send-button">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
