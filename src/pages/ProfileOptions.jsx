import React from "react";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import "../styles/profile.scss";
import { Link } from "react-router-dom";

const ProfileOptions = () => {
  return (
    <div>
      <ProductNavbar />

      <div className="profile-page">
        <div className="main-box">
          <div className="inner-box">
            <h2 className="form-heading">PROFILE DETAILS</h2>
            <div className="profile-options">
              <Link to="/PersonalInformation">
                <button className="account-options">Personal Info</button>
              </Link>
              <Link to="/Address">
                <button className="account-options">Address</button>
              </Link>
              <Link to="/Cards">
                <button className="account-options">Cards</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ProductFooter />
    </div>
  );
};

export default ProfileOptions;
