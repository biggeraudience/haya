/* src/components/FeedSection.jsx */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/feedsection.scss';
import { FaThumbsUp, FaThumbsDown, FaPlus, FaPaperPlane } from 'react-icons/fa'; // Import Plus and Send icons

// Import components - keeping the paths as specified by the user
import ProfileContent from './ProfileContent';
import CartContent from './CartContent';
import TrackOrder from './TrackOrder';
import BespokeOrderContent from './BespokeOrderContent';
import ReportContent from './ReportContent';
import PolicyContent from './PolicyContent';
import ContactContent from './ContactContent';
// Import the Settings component
import Settings from './Settings';

// Define DefaultFeed component with feed item structure
const DefaultFeed = () => {
  const [showSeeMore, setShowSeeMore] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [vote, setVote] = useState(null);
  const [thumbsUpCount, setThumbsUpCount] = useState(50);
  const [thumbsDownCount, setThumbsDownCount] = useState(20);
  // Correctly define contentText using template literals
  const contentText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ${'More text to exceed 160 characters.'.repeat(3)}`;
  const displayedContent = showSeeMore ? contentText : contentText.slice(0, 160);
  const shouldShowSeeMoreButton = contentText.length > 160 && !showSeeMore;
  const totalVotes = thumbsUpCount + thumbsDownCount;
  const thumbsUpPct = totalVotes ? (thumbsUpCount / totalVotes) * 100 : 0;
  const thumbsDownPct = totalVotes ? (thumbsDownCount / totalVotes) * 100 : 0;

  const toggleSeeMore = () => setShowSeeMore((v) => !v);

  const handleVote = (choice) => {
    if (!hasVoted) {
      setVote(choice);
      setHasVoted(true);
      if (choice === 'up') setThumbsUpCount((n) => n + 1);
      else setThumbsDownCount((n) => n + 1);
    }
  };

  return (
    <>
      {/* Individual Feed Item */}
      <div className="feed-item">
        <div className="profile-header">
          <div className="profile-image-container">
            <div className="profile-image"></div> {/* Placeholder for profile image */}
          </div>
          {/* Added a div to apply gap */}
          <div className="profile-info-gap-container">
            <div className="name">John Doe</div>
            <div className="username">@johndoe_official</div>
            <div className="timestamp">21h</div>
          </div>
        </div>

        {/* Content Wrapper with subtle gray border */}
        <div className={`feed-content-wrapper ${showSeeMore ? 'expanded' : ''}`}>
          <div className="content-text">
            {displayedContent}
            {shouldShowSeeMoreButton && (
              <button className="see-more-button" onClick={toggleSeeMore}>
                See more
              </button>
            )}
          </div>

          {/* Placeholder for media */}
          <div className="content-media">
            <div className="media-grid">
              <div className="media-item"></div>
              <div className="media-item"></div>
              <div className="media-item"></div>
            </div>
          </div>

          {/* PDF Button */}
          <button className="pdf-button">PDF</button>

          {/* Poll Section */}
          <div className="poll">
            <div className="poll-question">
              Would you like to see more men's beard oil and skin care products?
            </div>
            <div className="poll-options">
              <div className="vote-actions">
                <button
                  className={`thumb-button ${vote === 'up' ? 'selected' : ''}`}
                  onClick={() => handleVote('up')}
                  disabled={hasVoted}
                >
                  <FaThumbsUp size="1.2rem" color={vote === 'up' ? ' #fe5829' : 'black'} />
                </button>
                <button
                  className={`thumb-button ${vote === 'down' ? 'selected' : ''}`}
                  onClick={() => handleVote('down')}
                  disabled={hasVoted}
                >
                  <FaThumbsDown size="1.2rem" color={vote === 'down' ? '#fe5829' : 'black'} />
                </button>
              </div>
            </div>

            {hasVoted && (
              <div className="poll-results">
                <div className="result-bar-container">
                  <div className="result-label">Yes</div>
                  <div className="result-bar yes" style={{ width: `${thumbsUpPct}%` }}>
                    <span>{thumbsUpPct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="result-bar-container">
                  <div className="result-label">No</div>
                  <div className="result-bar no" style={{ width: `${thumbsDownPct}%` }}>
                   <span>{thumbsDownPct.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Add more feed items here if needed */}
       {/* Add some empty space to demonstrate sticky footer */}
       <div style={{ height: '500px' }}></div>
        <div style={{ height: '500px' }}></div>
        <div style={{ height: '500px' }}></div>
        <div style={{ height: '500px' }}></div>
    </>
  );
};

// Placeholder for unimplemented or unexpected tabs
const Placeholder = ({ name }) => (
  <div className="tab-content">{name} content goes here.</div>
);

// SVG placeholders (using path data)
const ICON_SVGS = {
 Home: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M160-120q-33 0-56.5-23.5T80-200v-640l67 67 66-67 67 67 67-67 66 67 67-67 67 67 66-67 67 67 67-67 66 67 67-67v640q0 33-23.5 56.5T800-120H160Zm0-80h280v-240H160v240Zm360 0h280v-80H520v80Zm0-160h280v-80H520v80ZM160-520h640v-120H160v120Z"/></svg>',
 Account: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z"/></svg>',
 Bag: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z"/></svg>',
 Favorites: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/></svg>',
 'Track Order' : '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M280-160q-50 0-85-35t-35-85H60l18-80h113q17-19 40-29.5t49-10.5q26 0 49 10.5t40 29.5h167l84-360H182l4-17q6-28 27.5-45.5T264-800h456l-37 160h117l120 160-40 200h-80q0 50-35 85t-35 85H400q0 50-35 85t-85 35Zm357-280h193l4-21-74-99h-95l-28 120Zm-19-273 2-7-84 360 2-7 34-146 46-200ZM20-427l20-80h220l-20 80H20Zm80-146 20-80h260l-20 80H100Zm180 333q17 0 28.5-11.5T320-280q0-17-11.5-28.5T280-320q-17 0-28.5 11.5T240-280q0 17 11.5 28.5T280-240Zm400 0q17 0 28.5-11.5T720-280q0-17-11.5-28.5T680-320q-17 0-28.5 11.5T640-280q0 17 11.5 28.5T680-240Z"/></svg>',
 'Bespoke Order': '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m280-80v-240h-64q-40 0-68-28t-28-68q0-29 16-53.5t42-36.5l262-116v-26q-36-13-58-43.5T360-760q0-50 35-85t85-35q50 0 85 35t35 85h-80q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760q0 17 11.5 28.5T480-720t28.5 11.5Q520-697 520-680v58l262 116q26 12 42 36.5t16 53.5q0 40-28 68t-68 28h-64v240H280Zm-64-320h64v-40h400v40h64q7 0 11.5-5t4.5-13q0-5-2.5-8.5T750-432L480-552 210-432q-5 2-7.5 5.5T200-418q0 8 4.5 13t11.5 5Zm144 240h266.66v-226.66H346.67v226.66Zm0-226.66h266.66-266.66Z"/></svg>',
 Report: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm34-80h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z"/></svg>',
 Policy: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M240-80q-50 0-85-35t-35-85v-120h120v-560h600v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-600H320v480h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h360v80H360ZM0 120v-80h360v80H360ZM240-160h360v-80H200v40q0 17 11.5 28.5T240-160Zm0 0h-40 400-360Z"/></svg>',
 Contact: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M760-480q0-117-81.5-198.5T480-760v-80q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480h-80Zm-160 0q0-50-35-85t-85-35v-80q83 0 141.5 58.5T680-480h-80Zm198 360q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z"/></svg>',
 Settings: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q22-23 48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>',
};


// Map tab names to their corresponding components
const tabComponents = {
  Home: DefaultFeed, // Use the detailed DefaultFeed
  Account: ProfileContent,
  Bag: CartContent,
  Favorites: () => <Placeholder name="Favorites" />, // Keep Placeholder for Favorites or replace if component exists
  'Track Order': TrackOrder,
  'Bespoke Order': BespokeOrderContent,
  Report: ReportContent,
  Policy: PolicyContent,
  Contact: ContactContent,
  Settings: Settings,
};

export default function FeedSection() {
  const { tab } = useParams();
  const navigate = useNavigate();

  const normalizedTab = tab ? decodeURIComponent(tab) : 'Home';

  const [activeTab, setActiveTab] = useState(
    tabComponents[normalizedTab] ? normalizedTab : 'Home'
  );

  // Update activeTab if URL changes externally
  useEffect(() => {
    if (tabComponents[normalizedTab] && normalizedTab !== activeTab) {
      setActiveTab(normalizedTab);
    }
  }, [normalizedTab, activeTab]); // Added activeTab to dependency array

  // Update URL if internal tab state changes
  useEffect(() => {
    if (activeTab !== normalizedTab) {
      navigate(`/feed/${encodeURIComponent(activeTab)}`, { replace: true });
    }
     // Added normalizedTab to dependency array to avoid unnecessary re-renders
  }, [activeTab, normalizedTab, navigate]);


  const tabs = Object.keys(tabComponents);
  const ActiveComp = tabComponents[activeTab] || (() => <Placeholder name="Unknown" />);

  return (
    <div className="feed-section-container">
      <div className="sidebarr">
        {tabs.map((t) => (
          <div
            key={t}
            className={`sidebar-item ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            <div
              className="icon-placeholder"
              // Use dangerouslySetInnerHTML only if SVGs are actually provided in ICON_SVGS
              // otherwise, remove this line and the icon-placeholder div if no icons are used.
              dangerouslySetInnerHTML={{ __html: ICON_SVGS[t] || '' }}
            />
            <div className="icon-title">{t}</div> {/* Added div for title styling */}
          </div>
        ))}
      </div>

      <div className="content-area">
        {/* This area will render the component associated with the active tab */}
        {/* Ensure ActiveComp is a valid component before rendering */}
        {ActiveComp ? <ActiveComp /> : <Placeholder name="Unknown Tab" />}

        {/* Sticky Input Field Area - Only show on Home tab */}
        {activeTab === 'Home' && (
          <div className="sticky-input-area">
            <button className="plus-button"><FaPlus size="1.2rem" /></button>
            <input type="text" placeholder="Write a comment..." className="comment-input" />
            <button className="send-button"><FaPaperPlane size="1.2rem" /></button>
          </div>
        )}
      </div>
    </div>
  );
}