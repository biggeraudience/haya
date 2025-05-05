// PersonalInformation.jsx
import React, { useState, useEffect } from "react";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import { useUser } from "../context/UserContext";
import "../styles/personalinfo.scss";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const BASE_URL = "http://localhost:5000/api";

const PersonalInformation = () => {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Make sure the updated user object has a profile and personalInfo property
      const { personalInfo } = user.profile || {};
      if (personalInfo) {
        setFormData({
          firstName: personalInfo.firstName || "",
          lastName: personalInfo.lastName || "",
          email: personalInfo.email || "",
          phone: personalInfo.phone || "",
        });
        setIsSaved(true);
      }
    }
  }, [user]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          _id: user._id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
  
      const updatedData = await response.json();
      console.log("Updated user data:", updatedData);
  
      // Replace the entire user state with the updated data
      setUser(updatedData);
      setIsSaved(true);
  
      // Show toast notification
      toast.success("Profile updated successfully!");
  
      // Wait a moment so the user sees the toast, then refresh the page.
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  
  
  
  
  
  
  const handleDelete = () => {
    setFormData({ firstName: "", lastName: "", email: "", phone: "" });
    setIsSaved(false);
  };

  return (
    <div>
      <ProductNavbar />
      <div className="profile-page">
        <div className="main-box">
          <div className="inner-box">
            {loading ? (
              <Loader />
            ) : isSaved ? (
              <>
                <h2 className="form-heading">PERSONAL INFORMATION</h2>
                <div className="saved-info">
                  <p>
                    <strong>First Name:</strong> {formData.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {formData.lastName}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {formData.phone}
                  </p>
                </div>
                <div className="button-group">
                  <button className="action-button" onClick={() => setIsSaved(false)}>
                    UPDATE
                  </button>
                  <button className="delete-button" onClick={handleDelete}>
                    DELETE
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="form-heading">PERSONAL INFORMATION</h2>
                <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    placeholder="First Name"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    placeholder="Last Name"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    placeholder="Phone"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <button type="button" className="action-button" onClick={handleSave}>
                    SAVE
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <ProductFooter />
    </div>
  );
};

export default PersonalInformation;
