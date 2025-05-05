import React, { useState, useEffect } from "react";
import "../styles/feed.scss";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";

const dummyFeedData = [
  {
    id: 1,
    pinned: true,
    admin: {
      email: "admin1@example.com",
      profilePhoto: "/assets/admin1.jpg"
    },
    message:
      "Breaking news! Our latest arrivals are here. Check out the new collection now available in-store and online.",
    attachments: [
      { type: "image", url: "/assets/latest-arrivals.jpg" }
    ],
    timestamp: 1669001000
  },
  {
    id: 2,
    pinned: false,
    admin: {
      email: "admin2@example.com",
      profilePhoto: "/assets/admin2.jpg"
    },
    message:
      "Special promotion: Buy one, get one free on select items! Don't miss out on these offers.",
    attachments: [
      { type: "pdf", url: "/assets/promo.pdf" },
      { type: "video", url: "/assets/promo-video.mp4" }
    ],
    timestamp: 1669000500
  },
  {
    id: 3,
    pinned: false,
    admin: {
      email: "admin3@example.com",
      profilePhoto: "/assets/admin3.jpg"
    },
    message: "Heads up! New arrivals coming in tomorrow – stay tuned for more details.",
    attachments: [],
    timestamp: 1669000000
  }
];

const Feed = () => {
  const [feedData, setFeedData] = useState([]);

  useEffect(() => {
    // Sort posts: pinned posts first, then by descending timestamp (latest first)
    const sortedData = [...dummyFeedData].sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return b.pinned - a.pinned;
      }
      return b.timestamp - a.timestamp;
    });
    setFeedData(sortedData);
  }, []);

  return (
    <>
    <Navbar/>
    <div className="feed">
      {feedData.map(item => (
        <div key={item.id} className="feed-item">
          <div className="feed-item-header">
            <img
              src={item.admin.profilePhoto}
              alt={item.admin.email}
              className="feed-item-profile"
            />
            <div className="feed-item-admin">{item.admin.email}</div>
          </div>
          <div className="feed-item-body">{item.message}</div>
          {item.attachments && item.attachments.length > 0 && (
            <div className="feed-item-attachments">
              {item.attachments.map((att, index) => {
                if (att.type === "image") {
                  return (
                    <img
                      key={index}
                      src={att.url}
                      alt="attachment"
                      className="feed-item-attachment-image"
                    />
                  );
                } else if (att.type === "video") {
                  return (
                    <video
                      key={index}
                      controls
                      className="feed-item-attachment-video"
                    >
                      <source src={att.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  );
                } else if (att.type === "pdf") {
                  return (
                    <a
                      key={index}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="feed-item-attachment-pdf"
                    >
                      {/* A simple PDF icon SVG */}
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19 2H8C6.89 2 6 .89 6 2v20c0 1.11.89 2 2 2h11c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2M8 22V2h11v20H8m9-16h-2v6h2V6m-4 0H11v6h2V6Z" />
                      </svg>
                      <span>View PDF</span>
                    </a>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          )}
        </div>
      ))}
    </div>
    </>
  );
};

export default Feed;
