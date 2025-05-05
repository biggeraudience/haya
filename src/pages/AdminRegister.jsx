import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../styles/register.scss";

const AdminRegister = () => {
  const { user, login, register, loginWithGoogle } = useUser();
  const navigate = useNavigate();

  // Redirect based on user role
  useEffect(() => {
    if (!user) {
      navigate("/adminregister");
    } else if (user.role === "user") {
      navigate("/profile2");
    } else if (user.role === "admin") {
      navigate("/adminpanel");
    } else if (user.role === "superadmin") {
      navigate("/superadminpanel");
    }
  }, [user, navigate]);

  // State variables for toggle forms and fields
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false); // Track consent state

  // Extra states for login functionality
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-redirect if logged in and not just registered
  useEffect(() => {
    if (user && !justRegistered) {
      navigate("/adminpanel");
    }
  }, [user, justRegistered, navigate]);

  // Auto-redirect after registration delay
  useEffect(() => {
    if (user && justRegistered) {
      const timer = setTimeout(() => {
        navigate("/adminpanel");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [user, justRegistered, navigate]);

  // Toggle the password visibility for login form
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle login submission with remember me and role admin
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password, role: "admin", rememberMe });
      toast.success("Login successful");
      navigate("/adminpanel");
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  // Handle registration submission with password confirmation
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
      await register({ name, email, password, role: "admin" });
      setJustRegistered(true);
      toast.success(`Welcome aboard, ${name}!`);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
        toast.success("Google login successful");
        navigate("/adminpanel");
      } else {
        toast.error("Google login not implemented");
      }
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="adminregister-page">
        <div className="adminregister-main-box">
          {user && justRegistered ? (
            <div className="adminregister-welcome-message" style={{ textAlign: "center" }}>
              <h2>Welcome aboard, {name}!</h2>
              <p>We're excited to have you on the admin team.</p>
              <p>You will be redirected shortly...</p>
            </div>
          ) : (
            <>
              <div className="adminregister-toggle-buttons">
                <button
                  className={`adminregister-toggle-button ${isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(true)}
                >
                  LOGIN
                </button>
                <button
                  className={`adminregister-toggle-button ${!isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(false)}
                >
                  REGISTER
                </button>
              </div>
              <div className="adminregister-inner-box">
                {isLogin ? (
                  <>
                    <h2 className="adminregister-form-heading">LOGIN TO YOUR ADMIN ACCOUNT</h2>
                    <form className="adminregister-login-form" onSubmit={handleSubmitLogin}>
                      <input
                        type="email"
                        placeholder="Email"
                        className="adminregister-input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{fontFamily: 'Overpass Mono',width: "320px",}}
                      />
                      <div className="adminregister-password-container">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="adminregister-input-field"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span className="adminregister-password-toggle" onClick={togglePasswordVisibility}>
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                      <div className="adminregister-options">
                        <label className="adminregister-remember-me">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          Remember me
                        </label>
                        <a href="#" className="adminregister-forgot-password">
                          Forgot your password?
                        </a>
                      </div>
                      <button type="submit" className="adminregister-action-button">
                        {isLoading ? "Logging in..." : "LOGIN"}
                      </button>
                    </form>
                    
                    <button
                      className="adminregister-google-button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <FcGoogle className="adminregister-google-icon" 
                      />
                      Sign in with Google
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="adminregister-form-heading">CREATE A NEW ADMIN ACCOUNT</h2>
                    { !consentGiven ? (
                      <div className="consent-container">
                        <div className="welcome-message">
                          <h3>Welcome to the Admin Registration!</h3>
                        </div>
                        <div className="terms-container">
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc vel consectetur interdum, 
                            nisi elit consequat urna, vitae convallis neque odio nec sapien. Donec interdum, risus non commodo 
                            sollicitudin, massa metus tincidunt mauris, eget fermentum elit nulla eu erat. Vestibulum eget imperdiet sapien. 
                            Phasellus non pulvinar neque. Vivamus malesuada tincidunt diam.
                          </p>
                        </div>
                        <div className="terms-checkbox">
                          <label>
                            <input
                              type="checkbox"
                              checked={consentGiven}
                              onChange={(e) => setConsentGiven(e.target.checked)}
                            />
                            Accept terms and register
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="form-animation">
                        <form className="adminregister-login-form" onSubmit={handleSubmitRegister}>
                          <input
                            type="text"
                            placeholder="Full Name"
                            className="adminregister-input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            className="adminregister-input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <input
                            type="password"
                            placeholder="Password"
                            className="adminregister-input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <input
                            type="password"
                            placeholder="Confirm Password"
                            className="adminregister-input-field"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                          <button type="submit" className="adminregister-action-button">
                            {isLoading ? "Registering..." : "REGISTER"}
                          </button>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminRegister;
