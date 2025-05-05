import React from "react";
import "../styles/settings.scss"; // Import styles for settings page
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import { useSettings } from "../context/SettingsContext"; // Import settings context

const Settings = () => {
  const { settings, updateSettings } = useSettings(); // Access global settings and updater

  const handleChange = (key, value) => {
    updateSettings(key, value);
  };

  const handleLayoutChange = (newLayout) => {
    handleChange('productLayout', newLayout); // Update layout in the context
  };

  // Define SVGs for themes
  const themeIcons = {
    default: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="13" height="13" fill="url(#paint0_linear_44_2428)" stroke="black"/>
        <defs>
          <linearGradient id="paint0_linear_44_2428" x1="0" y1="7" x2="14" y2="7" gradientUnits="userSpaceOnUse">
            <stop offset="0.185" stop-color="#FE5829"/>
            <stop offset="0.55"/>
            <stop offset="0.74" stop-color="white"/>
            <stop offset="0.89" stop-color="#FFFFF0"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    light: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="13" height="13" fill="#FFFFF0" stroke="black"/>
      </svg>
    ),
    dark: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="14" height="14" fill="black"/>
      </svg>
    ),
    pastel: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="13" height="13" fill="url(#paint0_linear_44_2410)" stroke="black"/>
        <defs>
          <linearGradient id="paint0_linear_44_2410" x1="18.5" y1="2" x2="1.9755" y2="2.12615" gradientUnits="userSpaceOnUse">
            <stop offset="0.435" stop-color="#FFD7C2"/>
            <stop offset="1" stop-color="#AFCBFF"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    greyscale: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="13" height="13" fill="#767272" stroke="black"/>
      </svg>
    ),
  };

  // Define SVGs for product layouts
  const layoutIcons = {
    grid: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="13" height="13" fill="#FE5829" stroke="black"/>
        <rect x="2.5" y="2.5" width="3" height="3" fill="#FFFFF0" stroke="black"/>
        <rect x="2.5" y="8.5" width="3" height="3" fill="#FFFFF0" stroke="black"/>
        <rect x="8.5" y="8.5" width="3" height="3" fill="#FFFFF0" stroke="black"/>
        <rect x="8.5" y="2.5" width="3" height="3" fill="#FFFFF0" stroke="black"/>
      </svg>
    ),
    swipe: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="13" height="13" stroke="black"/>
        <path d="M4.07221 6.05861C3.12813 6.53299 2.07098 6.80837 1.12804 7.26521C1.0409 7.31388 0.980045 7.443 1.07026 7.5089C1.93168 8.14837 2.95212 8.60177 3.98472 9.02932C4.097 9.07867 4.20962 8.96081 4.11941 8.89491C4.2567 8.55818 3.86227 8.00253 3.59845 7.69954C4.01582 7.25291 4.27676 6.79004 4.34511 6.22119C4.3531 6.09835 4.19133 6.00265 4.07221 6.05861ZM3.22477 7.7962C3.48097 8.05482 3.55413 8.38396 3.70339 8.6727C2.95052 8.30244 2.20867 7.9239 1.53644 7.44306C2.315 7.09282 3.13964 6.84159 3.92809 6.50063C3.80718 6.90854 3.55306 7.26612 3.22624 7.61144C3.1391 7.6601 3.16538 7.74057 3.22477 7.7962Z" fill="black"/>
        <path d="M1.47268 7.42136L2.42065 7.09541L3.23399 6.76764L3.91085 6.55095L3.63237 7.11175L3.35757 7.44678L3.22109 7.55785L3.21741 7.78362L3.3502 7.89833L3.48115 8.12591L3.61026 8.46639L3.74122 8.69398L3.47379 8.57746L2.67334 8.11502L2.40591 7.9985L1.60547 7.53606L1.47268 7.42136Z" fill="#FE5829"/>
      </svg>
    ),
  };

  return (
    <>
      <ProductNavbar />
      <div className="settings-page">
        <div className="main-box">
          <div className="inner-container">
            {/* Theme Settings */}
            <div className="setting-tab">
              <div className="setting-title">THEME</div>
              <div className="overflow-container">
                {["default", "light", "dark", "pastel", "greyscale"].map((theme) => (
                  <div className="option" key={theme}>
                    <label className="checkbox-label" htmlFor={theme}>
                      <input
                        type="radio"
                        name="theme"
                        id={theme}
                        checked={settings.theme === theme}
                        onChange={() => handleChange("theme", theme)}
                      />
                      {themeIcons[theme]}
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Settings */}
            <div className="setting-tab">
              <div className="setting-title">LANGUAGE</div>
              <div className="overflow-container">
                {[
                  "english",
                  "arabic",
                  "chinese",
                  "spanish",
                  "deutsch",
                  "french",
                  "russian",
                  "hindi",
                  "japanese",
                  "korean",
                ].map((language) => (
                  <div className="option" key={language}>
                    <label className="checkbox-label" htmlFor={language}>
                      <input
                        type="radio"
                        name="language"
                        id={language}
                        checked={settings.language === language}
                        onChange={() => handleChange("language", language)}
                      />
                      {language.charAt(0).toUpperCase() + language.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Font Size Settings */}
            <div className="setting-tab">
              <div className="setting-title">FONT SIZE</div>
              <div className="overflow-container">
                {["small", "medium", "large"].map((size) => (
                  <div className="option" key={size}>
                    <label className="checkbox-label" htmlFor={size}>
                      <input
                        type="radio"
                        name="fontSize"
                        id={size}
                        checked={settings.fontSize === size}
                        onChange={() => handleChange("fontSize", size)}
                      />
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Layout Settings */}
            <div className="setting-tab">
              <div className="setting-title">PRODUCT LAYOUT</div>
              <div className="overflow-container">
                {["grid", "swipe"].map((layout) => (
                  <div className="option" key={layout}>
                    <label className="checkbox-label" htmlFor={layout}>
                      <input
                        type="radio"
                        name="productLayout"
                        id={layout}
                        checked={settings.productLayout === layout}
                        onChange={() => handleChange("productLayout", layout)}
                      />
                      {layoutIcons[layout]}
                      {layout.charAt(0).toUpperCase() + layout.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Settings */}
            <div className="setting-tab">
              <div className="setting-title">PAYMENT METHOD</div>
              <div className="overflow-container">
                {["creditCard", "paypal", "googlePay"].map((method) => (
                  <div className="option" key={method}>
                    <label className="checkbox-label" htmlFor={method}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        id={method}
                        checked={settings.paymentMethod === method}
                        onChange={() => handleChange("paymentMethod", method)}
                      />
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Limit Settings */}
            <div className="setting-tab">
              <div className="setting-title">LIMITS</div>
              <div className="overflow-container">
                <div className="option">
                  <input
                    type="number"
                    placeholder="Min"
                    value={settings.productLimits.min}
                    onChange={(e) =>
                      handleChange("productLimits", {
                        ...settings.productLimits,
                        min: Number(e.target.value),
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={settings.productLimits.max}
                    onChange={(e) =>
                      handleChange("productLimits", {
                        ...settings.productLimits,
                        max: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="message">
                *You will be able to see only products within this range.
              </div>

            {/* Settings Navigation */}
            <div className="nav-bar">
              <button className="save-btn">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
      </div>
      <ProductFooter />
    </>
  );
};

export default Settings;
