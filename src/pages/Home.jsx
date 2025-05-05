import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Access user context
import { useSettings } from "../context/SettingsContext"; // Access settings context

const Home = () => {
  const { user, setUser, updateUserProfile } = useUser(); // Access user context
  const { settings } = useSettings(); // Access settings context

  // Get colors and font size dynamically from the settings
  const backgroundColor = settings.theme === "dark" ? "#333" :
                          settings.theme === "light" ? "#f9f9f9" : "#fff";
  const textColor = settings.theme === "dark" ? "#fff" : "#000";
  const usernameColor = settings.theme === "dark" ? "#FFFFF0" : "#333";
  const fontSize = settings.fontSize === "small" ? "14px" :
                   settings.fontSize === "large" ? "18px" : "16px";

  return (
    <div
    className={`home-container ${settings.theme} font-size-${settings.fontSize}`}
      style={{
        backgroundColor,
        color: textColor,
        fontSize,
      }}
    >
      {/* User Greeting */}
      <div className="user-greeting">
        {user ? (
          <>
            <span>Hello! </span>
            <span style={{ color: usernameColor }}>{user.username}</span>
            <button onClick={() => setUser(null)} className="login-button"> {/* Logout */} 
              Log Out
            </button>
          </>
        ) : (
          <>
            <span>Welcome! </span>
            <button onClick={() => setUser({ username: "YourName" })} className="login-button">
              Log In
            </button>
          </>
        )}
      </div>

      <Navbar />
      
      <div className="content-box">
        {/* Top section (Left and Right boxes) */}
        <div className="top-section">
          <div className="left-box">
            <div className="button-container-wrapper">
              <Link to="/clothing" className="button-container">
                <button className="button">CLOTHING</button>
              </Link>
            </div>
          </div>
          <div className="right-box-container">
            <div className="right-box">
              <div className="button-container-wrapper">
                <Link to="/veils" className="button-container">
                  <button className="button">VEILS</button>
                </Link>
              </div>
            </div>

            {/* New section for the two boxes under the right box (side by side) */}
            <div className="right-box-bottom-section">
              <div className="right-box-item right-box-item-1">
                <div className="button-container-wrapper">
                  <Link to="/bags" className="button-container">
                    <button className="button">BAGS</button>
                  </Link>
                </div>
              </div>
              <div className="right-box-item right-box-item-2">
                <div className="button-container-wrapper">
                  <Link to="/shoes" className="button-container">
                    <button className="button">SHOES</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section (Two boxes side by side under the right box) */}
        <div className="bottom-section">
          <div className="bottom-box-1">
            <div className="button-container-wrapper">
              <Link to="/jewelry" className="button-container">
                <button className="button">JEWELRY</button>
              </Link>
            </div>
          </div>
          <div className="bottom-box-2">
            <div className="button-container-wrapper">
              <Link to="/fragrances" className="button-container">
                <button className="button">FRAGRANCES</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
