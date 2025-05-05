import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import { toast } from "react-toastify";
import { FaPen, FaTrashAlt } from "react-icons/fa"; // Importing pen and trash icons
import "../styles/profile.scss";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dwk5eorvm/upload";
const CLOUDINARY_PRESET = "profile_images";

const Profile2 = () => {
  const { user, logout, updateProfile } = useUser();
  const navigate = useNavigate();
  const [image, setImage] = useState(user?.profileImage || "");

  useEffect(() => {
    console.log("User's profile image:", user?.profileImage);
    if (user && user.profileImage) {
      setImage(user.profileImage);
    }
  }, [user]);
  

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      const responseBody = await res.json();
      if (!res.ok) throw new Error(responseBody.message || "Unknown error");

      const imageUrl = responseBody.secure_url;
      await updateProfile({ profileImage: imageUrl });
      setImage(imageUrl);
      toast.success("Profile picture updated!");
    } catch (error) {
      toast.error("Failed to upload image");
    }
    
  };

  const handleDeleteProfileImage = async () => {
    if (window.confirm("Are you sure you want to delete your profile photo?")) {
      await updateProfile({ profileImage: "", userId: user._id });
      setImage(""); // Set to fallback image
      toast.success("Profile photo deleted.");
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Signed out successfully");
      navigate("/profile");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible!")) {
      try {
        await deleteAccount();
        toast.success("Account deleted successfully");
        navigate("/profile");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div>
      <ProductNavbar />
      <div className="profile-page">
        <div className="main-box">
          <div className="inner-box">
            <h2 className="form-heading">PROFILE DETAILS</h2>
            
            {/* Profile Image */}
            <div className="profile-image-container">
              <img
                src={image || "/default-profile.png"}
                alt="Profile"
                className="profile-image"
              />
              <div className="profile-image-actions">
                <FaPen className="icon" onClick={() => document.getElementById("fileInput").click()} />
                <FaTrashAlt className="icon delete-icon" onClick={handleDeleteProfileImage} />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="profile-options">
              <Link to="/profileoptions"><button className="account-options">Profile</button></Link>
              <Link to="/orders"><button className="account-options">Orders</button></Link>
              <Link to="/notifications"><button className="account-options">Notifications</button></Link>
              <Link to="/settings"><button className="account-options">Settings</button></Link>
            </div>

            <div className="account-actions">
              <button className="account-action" onClick={handleSignOut}>Sign Out</button>
              <button className="account-action delete" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
          </div>
        </div>
      </div>
      <ProductFooter />
    </div>
  );
};

export default Profile2;
