import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "../styles/superadminregister.scss";

const SuperadminRegister = () => {
  const { user, login, register, loginWithGoogle } = useUser();
  const navigate = useNavigate();

  // Redirect based on user role
  useEffect(() => {
    if (!user) {
      navigate("/superadminregister");
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

  // Extra states for login functionality
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Auto-redirect if logged in and not just registered
  useEffect(() => {
    if (user && !justRegistered) {
      navigate("/superadminpanel");
    }
  }, [user, justRegistered, navigate]);

  // Auto-redirect after registration delay
  useEffect(() => {
    if (user && justRegistered) {
      const timer = setTimeout(() => {
        navigate("/superadminpanel");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [user, justRegistered, navigate]);

  // Toggle the password visibility for login form
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle login submission with remember me and role superadmin
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ email, password, role: "superadmin", rememberMe });
      toast.success("Login successful");
      navigate("/superadminpanel");
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
      await register({ name, email, password, role: "superadmin" });
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
        navigate("/superadminpanel");
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
      <div className="superadminregister-page">
        <div className="superadminregister-main-box">
          {user && justRegistered ? (
            <div className="superadminregister-welcome-message" style={{ textAlign: "center" }}>
              <h2>Welcome aboard, {name}!</h2>
              <p>We're excited to have you on the superadmin team.</p>
              <p>You will be redirected shortly...</p>
            </div>
          ) : (
            <>
              <div className="superadminregister-toggle-buttons">
                <button
                  className={`superadminregister-toggle-button ${isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(true)}
                >
                  LOGIN
                </button>
                <button
                  className={`superadminregister-toggle-button ${!isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(false)}
                >
                  REGISTER
                </button>
              </div>
              <div className="superadminregister-inner-box">
                {isLogin ? (
                  <>
                    <h2 className="superadminregister-form-heading">
                      LOGIN TO YOUR SUPERADMIN ACCOUNT
                    </h2>
                    <form className="superadminregister-login-form" onSubmit={handleSubmitLogin}>
                      <input
                        type="email"
                        placeholder="Email"
                        className="superadminregister-input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <div className="superadminregister-password-container">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="superadminregister-input-field"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span
                          className="superadminregister-password-toggle"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                      </div>
                      <div className="superadminregister-options">
                        <label className="superadminregister-remember-me">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                          />
                          Remember me
                        </label>
                        <a href="#" className="superadminregister-forgot-password">
                          Forgot your password?
                        </a>
                      </div>
                      <button type="submit" className="superadminregister-action-button">
                        {isLoading ? "Logging in..." : "LOGIN"}
                      </button>
                    </form>

                    <button
                      className="superadminregister-google-button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                    >
                      <FcGoogle className="superadminregister-google-icon" />
                      Sign in with Google
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="superadminregister-form-heading">
                      CREATE A NEW SUPERADMIN ACCOUNT
                    </h2>
                    <div className="superadminregister-form-animation">
                      <form className="superadminregister-login-form" onSubmit={handleSubmitRegister}>
                        <input
                          type="text"
                          placeholder="Full Name"
                          className="superadminregister-input-field"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="superadminregister-input-field"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          className="superadminregister-input-field"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          className="superadminregister-input-field"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <button type="submit" className="superadminregister-action-button">
                          {isLoading ? "Registering..." : "REGISTER"}
                        </button>
                      </form>
                    </div>
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

export default SuperadminRegister;
