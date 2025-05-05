// src/services/analyticsService.js
export const trackEvent = async (eventType, eventData = {}) => {
    try {
        await fetch("/api/track-event", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ eventType, eventData, timestamp: new Date().toISOString() }),
        });
    } catch (error) {
        console.error("Error tracking event:", error);
    }
};
