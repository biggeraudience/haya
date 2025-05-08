import { useEffect } from "react";
import axios from "axios";

// Function to track an event
export const trackEvent = async (eventType, details = {}) => {
  try {
    // Use import.meta.env.VITE_API_URL for the base URL
    const BASE_API_URL = import.meta.env.VITE_API_URL;
    await axios.post(`${BASE_API_URL}/analytics/events`, { eventType, details }, { withCredentials: true });
  } catch (error) {
    console.error("Error tracking event:", error.response ? error.response.data : error.message);
  }
};

const useAnalytics = () => {
  useEffect(() => {
    // Ensure BASE_API_URL is accessible here if needed, or rely on trackEvent accessing it
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
    // Added JSON.stringify to dependency array as recommended by ESLint, but be mindful
    // that complex objects stringified can lead to unnecessary re-runs.
    // Consider using a more stable identifier if eventData is large/complex.
  }, [eventName, JSON.stringify(eventData)]);
};

export default useAnalytics;
