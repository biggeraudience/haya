// src/components/Address.jsx
import React, { useState, useEffect } from "react";
import ProductNavbar from "../components/ProductNavbar";
import ProductFooter from "../components/ProductFooter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../context/UserContext";
import "../styles/address.scss";

const Address = () => {
  const { user, fetchAddress, updateAddress, deleteAddress } = useUser();
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load address data when the user is available
  useEffect(() => {
    if (user && user._id) {
      const loadAddress = async () => {
        try {
          const address = await fetchAddress(user._id);
          setAddressData(address);
          setIsSaved(true);
        } catch (error) {
          toast.error("Failed to load address.");
        }
      };
      loadAddress();
    }
  }, [user, fetchAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
  };

  const handleSave = async () => {
    if (!user || !user._id) return;
    setIsLoading(true);
    try {
      const updatedAddress = await updateAddress(user._id, addressData);
      setAddressData(updatedAddress);
      setIsSaved(true);
      toast.success("Address saved successfully!");
    } catch (error) {
      toast.error(error.message || "Error saving address.");
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!user || !user._id) return;
    try {
      await deleteAddress(user._id);
      setAddressData({ street: "", city: "", state: "", zip: "" });
      setIsSaved(false);
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting address.");
    }
  };

  return (
    <div>
      <ProductNavbar />
      <div className="profile-page">
        <div className="main-box">
          <div className="inner-box">
            {isSaved ? (
              <>
                <h2 className="form-heading">SAVED ADDRESS</h2>
                <div className="saved-info">
                  <p><strong>Street:</strong> {addressData.street}</p>
                  <p><strong>City:</strong> {addressData.city}</p>
                  <p><strong>State:</strong> {addressData.state}</p>
                  <p><strong>Zip Code:</strong> {addressData.zip}</p>
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
                <h2 className="form-heading">ADDRESS DETAILS</h2>
                <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="text"
                    name="street"
                    value={addressData.street}
                    placeholder="Street"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    placeholder="City"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="state"
                    value={addressData.state}
                    placeholder="State"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="zip"
                    value={addressData.zip}
                    placeholder="Zip Code"
                    className="input-field"
                    onChange={handleChange}
                  />
                  <div className="button-group">
                    <button
                      type="button"
                      className="action-button"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : "SAVE"}
                    </button>
                    
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      <ProductFooter />
    </div>
  );
};

export default Address;
