import React, { createContext, useState, useContext, useEffect } from "react";

// Creating the Settings Context
const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Load settings from localStorage or use default values
  const loadSettings = () => {
    const savedSettings = localStorage.getItem("settings");
    return savedSettings ? JSON.parse(savedSettings) : {
      theme: "default",  // default theme
      language: "english",
      fontSize: "medium",  // default font size
      productLayout: "grid",
      paymentMethods: "all",
      productLimits: { min: 0, max: 1000 },
    };
  };

  const [settings, setSettings] = useState(loadSettings);

  // Update the settings and save to localStorage
  const updateSettings = (key, value) => {
    const updatedSettings = {
      ...settings,
      [key]: value,
    };
    setSettings(updatedSettings);
    localStorage.setItem("settings", JSON.stringify(updatedSettings));
  };

  // Ensure that settings are updated when the component is first mounted
  useEffect(() => {
    const storedSettings = loadSettings();
    setSettings(storedSettings); // If there is something in localStorage, set it
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Hook to use the Settings Context
export const useSettings = () => useContext(SettingsContext);
