import { useEffect } from "react";
import axios from "axios";

// Function to track an event
export const trackEvent = async (eventType, details = {}) => {
  try {
    await axios.post("/analytics/events", { eventType, details }, { withCredentials: true });
  } catch (error) {
    console.error("Error tracking event:", error.response ? error.response.data : error.message);
  }
};

const useAnalytics = () => {
  useEffect(() => {
    trackEvent("PAGE_VIEW", { url: window.location.href, timestamp: new Date() });

    const handleClick = (e) => {
      trackEvent("CLICK", { target: e.target.tagName, timestamp: new Date() });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
};

export const useTrackEvent = (eventName, eventData = {}) => {
  useEffect(() => {
    trackEvent(eventName, eventData);
  }, [eventName, JSON.stringify(eventData)]);
};

export default useAnalytics;
