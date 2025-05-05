import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      {/* Newsletter Section (above the footer) */}
      <div className="footer-newsletter">
        <button className="footer-newsletter-btn">Join Our Newsletter</button>
        <div className="footer-svgs">
          <svg className="footer-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          

          </svg>
          <svg className="footer-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            {/* SVG content here */}
          </svg>
          <svg className="footer-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            {/* SVG content here */}
          </svg>
          <svg className="footer-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            {/* SVG content here */}
          </svg>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-overlay">
          {/* Top Section: Social Media and Contact */}
          <div className="footer-top">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Instagram
            </a>
            <a href="mailto:example@gmail.com" className="footer-link">
              Gmail
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              WhatsApp
            </a>
            <Link to="/contact" className="footer-link">
              Contact
            </Link>
          </div>

          {/* Bottom Section: Policies */}
          <div className="footer-bottom">
            <Link to="/cookie-settings" className="footer-link">
              Cookie Settings
            </Link>
            <Link to="/faq" className="footer-link">
              FAQ
            </Link>
            <Link to="/privacy-policy" className="footer-link">
              Privacy Policy
            </Link>
          </div>

          {/* Copyright */}
          <p className="footer-copy">&copy; 2024 Haya. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
