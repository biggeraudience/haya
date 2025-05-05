import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/bespokeorder.scss";

const BespokeOrderModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("men");
  const [selectedProductType, setSelectedProductType] = useState("");

    // Remove useNavigate and handleClose calling navigate(-1)
    const handleClose = () => {
      closeModal(); // simply hide the modal
    };
  const renderDynamicFields = () => {
    if (selectedCategory === "men") {
      return (
        <div className="bespoke-order__dynamic-fields">
          <label>
            Shoulders:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Chest:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Waist:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Thigh:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Bicep:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Seat:
            <input type="number" placeholder="cm" />
          </label>
        </div>
      );
    } else if (selectedCategory === "women") {
      return (
        <div className="bespoke-order__dynamic-fields">
          <label>
            Bust:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Hips:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Waist:
            <input type="number" placeholder="cm" />
          </label>
        </div>
      );
    } else if (selectedCategory === "footwear") {
      return (
        <div className="bespoke-order__dynamic-fields">
          <label>
            Foot Length:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Foot Width:
            <input type="number" placeholder="cm" />
          </label>
          <label>
            Material:
            <input type="text" placeholder="e.g. leather" />
          </label>
        </div>
      );
    } else if (selectedCategory === "headgear") {
      if (selectedProductType.toLowerCase() === "men") {
        return (
          <div className="bespoke-order__dynamic-fields">
            <label>
              Head Size:
              <input type="number" placeholder="cm" />
            </label>
            <label>
              Headgear Name:
              <input type="text" placeholder="Name" />
            </label>
            <label>
              Additional Info:
              <textarea placeholder="Extra details..." />
            </label>
            <label>
              Upload Image:
              <input type="file" />
            </label>
          </div>
        );
      } else if (selectedProductType.toLowerCase() === "women") {
        return (
          <div className="bespoke-order__dynamic-fields">
            <label>
              Fabric Type:
              <input type="text" placeholder="Fabric" />
            </label>
            <label>
              Length:
              <input type="number" placeholder="cm" />
            </label>
            <label>
              Headgear Name:
              <input type="text" placeholder="Name" />
            </label>
            <label>
              Additional Info:
              <textarea placeholder="Extra details..." />
            </label>
            <label>
              Upload Image:
              <input type="file" />
            </label>
          </div>
        );
      } else {
        return (
          <div className="bespoke-order__dynamic-fields">
            <p>Please select product type for headgear.</p>
          </div>
        );
      }
    }
  };

  

  return (
    <div className="bespoke-order-overlay">
      <div className="bespoke-order-container">
        <button className="bespoke-order__close-button" onClick={handleClose}>
          X
        </button>
        <div className="bespoke-order-header">
          <div className="bespoke-order__header-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              fill="#fff"
            >
              {/* Leave the path for you to fill */}
              <path d="" />
            </svg>
          </div>
        </div>
        <div className="bespoke-order-content">
          {/* Left Form Box */}
          <div className="bespoke-order-left-box">
            <div className="bespoke-order__left-box-header">
              <div className="bespoke-order__category-select">
                <label>
                  Category:
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="footwear">Footwear</option>
                    <option value="headgear">Headgear</option>
                  </select>
                </label>
              </div>
              <div className="bespoke-order__product-type-select">
                <label>
                  Product Type:
                  <select
                    value={selectedProductType}
                    onChange={(e) => setSelectedProductType(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="bespoke-order__form-fields">
              {renderDynamicFields()}
              <div className="bespoke-order__notes">
                <label>
                  Notes:
                  <textarea rows="4" placeholder="Enter additional details..." />
                </label>
              </div>
              <div className="bespoke-order__uploads">
                <label>
                  Upload Style Photo:
                  <input type="file" />
                </label>
                <label>
                  Upload Your Photo:
                  <input type="file" />
                </label>
              </div>
            </div>
          </div>
          {/* Right Boxes Grid */}
          <div className="bespoke-order-right-boxes">
            {/* Box 1: Out-of-Stock Order */}
            <div className="bespoke-order__right-box">
              <div className="bespoke-order__box-header">
                <div className="bespoke-order__gender-select">
                  <label>
                    Gender:
                    <select>
                      <option value="men">Men</option>
                      <option value="women">Women</option>
                    </select>
                  </label>
                </div>
                <div className="bespoke-order__category-select">
                  <label>
                    Category:
                    <select>
                      <option value="apparel">Apparel</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="bespoke-order__box-content">
                <label>
                  Product Name:
                  <input type="text" />
                </label>
                <label>
                  Size:
                  <input type="text" />
                </label>
                <label>
                  Quantity:
                  <input type="number" />
                </label>
                <label>
                  Upload Product Image:
                  <input type="file" />
                </label>
              </div>
            </div>
            {/* Box 2: Ready-Made Product Request */}
            <div className="bespoke-order__right-box">
              <div className="bespoke-order__box-content">
                <label>
                  Product Name:
                  <input type="text" />
                </label>
                <label>
                  Size:
                  <input type="text" />
                </label>
                <label>
                  Upload Image:
                  <input type="file" />
                </label>
              </div>
            </div>
            {/* Box 3: Book Consultation */}
            <div className="bespoke-order__right-box">
              <div className="bespoke-order__box-content">
                <label>
                  Gender:
                  <select>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </label>
                <div className="bespoke-order__consultation">
                  <button className="bespoke-order__consultation-button">
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>
            {/* Box 4: Placeholder */}
            <div className="bespoke-order__right-box">
              {/* Empty for now */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BespokeOrderModal;
