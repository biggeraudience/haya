import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductFooter from "../components/ProductFooter";
import "../styles/profile.scss";

const Profile = () => {
  const { user, login, register } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // If no user is logged in, redirect to login page
      navigate("/profile");
    } else if (user.role === "user") {
      // If the user is a regular user, go to their dashboard
      navigate("/profile2");
    } else if (user.role === "admin") {
      // If the user is an admin, go to admin panel
      navigate("/adminpanel");
    } else if (user.role === "superadmin") {
      // If the user is a superadmin, go to superadmin panel
      navigate("/superadminpanel");
    }
  }, [user, navigate]);
  

  // Local state for toggling between login and register forms
  const [isLogin, setIsLogin] = useState(true);
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Flag to indicate that the user just registered
  const [justRegistered, setJustRegistered] = useState(false);

  // If a user is already logged in and not just registered, redirect to Profile2
  useEffect(() => {
    if (user && !justRegistered) {
      navigate("/profile2");
    }
  }, [user, justRegistered, navigate]);

  // When a user has just registered, auto-redirect after a delay
  useEffect(() => {
    if (user && justRegistered) {
      const timer = setTimeout(() => {
        navigate("/profile2");
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [user, justRegistered, navigate]);

  // Handle login submission
  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Explicitly pass role: "user" for profile sign-in
      await login({ email, password, role: "user" });
      toast.success("Login successful");
      navigate("/profile2");
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  // Handle registration submission
  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setIsLoading(true);
    try {
      // Explicitly pass role: "user" for registration
      await register({ name, email, password, role: "user" });
      setJustRegistered(true);
      toast.success(`Welcome to the Haya family, ${name}!`);
    } catch (error) {
      toast.error(error.message);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Navbar />
      <div className="profile-page">
        <div className="main-box">
          {user && justRegistered ? (
            // Welcome message displayed when a new user registers
            <div className="welcome-message" style={{ textAlign: "center" }}>
              <h2>Welcome to the Haya Family, {name}!</h2>
              <p>We're so glad to have you join us.</p>
              <p>You will be redirected shortly...</p>
            </div>
          ) : (
            <>
              <div className="toggle-buttons">
                <button
                  className={`toggle-button ${isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(true)}
                >
                  LOGIN
                </button>
                <button
                  className={`toggle-button ${!isLogin ? "active" : ""}`}
                  onClick={() => setIsLogin(false)}
                >
                  REGISTER
                </button>
              </div>
              <div className="inner-box">
                {isLogin ? (
                  <>
                    <h2 className="form-heading">LOGIN TO YOUR ACCOUNT</h2>
                    <form className="login-form" onSubmit={handleSubmitLogin}>
                      <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button type="submit" className="action-button">
                        {isLoading ? "Logging in..." : "LOGIN"}
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <h2 className="form-heading">CREATE A NEW ACCOUNT</h2>
                    <form className="login-form" onSubmit={handleSubmitRegister}>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="input-field"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        className="input-field"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        className="input-field"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button type="submit" className="action-button">
                        {isLoading ? "Registering..." : "REGISTER"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <ProductFooter />
      <ToastContainer />
    </div>
  );
};

export default Profile;
