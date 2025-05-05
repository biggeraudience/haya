// SuperadminAdsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaEdit, 
  FaUndo, 
  FaArrowLeft, 
  FaArrowRight, 
  FaInfoCircle 
} from "react-icons/fa";
import "../styles/globalsuperadmin.scss";

const SuperadminAdsPage = () => {
  // Backend ads state
  const [ads, setAds] = useState([]);

  // Carousel state for each category
  const [currentIndices, setCurrentIndices] = useState({
    top: 0,
    men: 0,
    women: 0,
    brands: 0,
    products: 0,
  });
  const [detailsVisible, setDetailsVisible] = useState({
    top: false,
    men: false,
    women: false,
    brands: false,
    products: false,
  });
  const [editModal, setEditModal] = useState({ visible: false, section: null });
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch ads from backend on mount
  useEffect(() => {
    axios.get("/ads")
      .then((response) => {
        // Sort ads by creation date
        const sortedAds = response.data.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        console.log("Sorted ads:", sortedAds);
        setAds(sortedAds);
      })
      .catch((error) => {
        console.error("Error fetching ads:", error);
      });
  }, []);

  // Filter ads by category
  const topAds = ads.filter((ad) => ad.category === "Ads");
  const menAds = ads.filter((ad) => ad.category === "Men");
  const womenAds = ads.filter((ad) => ad.category === "Women");
  const brandsAds = ads.filter((ad) => ad.category === "Brands");
  const productsAds = ads.filter((ad) => ad.category === "Products");

  // Handlers to cycle carousel items
  const handleNext = (section, adsArray) => {
    setCurrentIndices((prev) => ({
      ...prev,
      [section]: (prev[section] + 1) % (adsArray.length || 1)
    }));
  };

  const handlePrev = (section, adsArray) => {
    setCurrentIndices((prev) => ({
      ...prev,
      [section]: (prev[section] - 1 + (adsArray.length || 1)) % (adsArray.length || 1)
    }));
  };

  // Toggle details overlay visibility
  const toggleDetails = (section) => {
    setDetailsVisible((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Open/close edit modal overlay
  const openEditModal = (section) => {
    setEditModal({ visible: true, section });
    setSelectedImage(null);
  };

  const closeEditModal = () => {
    setEditModal({ visible: false, section: null });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Clear selected image
  const clearSelectedImage = () => {
    setSelectedImage(null);
  };

  // Placeholder reset function
  const handleReset = (section) => {
    console.log(`Reset: ${section}`);
  };

  // Render details overlay for a given ad
  const renderDetailsOverlay = (section, ad) => (
    <div className="superadmin-details-overlay">
      <h3>{ad.adTitle || "Ad Details"}</h3>
      <p>{ad.adDescription || "Description not available"}</p>
      <button 
        className="superadmin-button" 
        onClick={() => toggleDetails(section)}
      >
        Close
      </button>
    </div>
  );

  // Render edit modal overlay
  const renderEditModal = () => {
    const section = editModal.section;
    return (
      <div className="superadmin-edit-modal-overlay">
        <div className="superadmin-edit-modal">
          <button 
            className="superadmin-close-edit-modal" 
            onClick={closeEditModal}
          >
            X
          </button>
          <form className="superadmin-edit-form">
            <input type="text" placeholder="Title" />
            <input type="text" placeholder="Description" />
            <input type="date" placeholder="Active From" />
            <input type="date" placeholder="Expire Date" />
            {section === "products" && (
              <>
                <input type="text" placeholder="Product Name" />
                <input type="number" placeholder="Price" />
                <input type="text" placeholder="Brand" />
              </>
            )}
            {section === "brands" && (
              <input type="text" placeholder="Brand" />
            )}
            <div className="superadmin-file-upload-box">
              {selectedImage ? (
                <div className="superadmin-file-preview">
                  <img src={selectedImage} alt="Preview" />
                  <button 
                    type="button" 
                    className="superadmin-clear-file" 
                    onClick={clearSelectedImage}
                  >
                    X
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    id="superadmin-file-upload"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label 
                    htmlFor="superadmin-file-upload" 
                    className="superadmin-choose-file-btn"
                  >
                    Choose File
                  </label>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="superadmin-main-container">
      <div className="superadmin-container">
        <div className="superadmin-content-wrapper">
          {/* Top Ads Carousel */}
          <div className="superadmin-ad-box carousel">
            <button 
              className="superadmin-carousel-arrow superadmin-left-arrow" 
              onClick={() => handlePrev("top", topAds)}
            >
              <FaArrowLeft />
            </button>
            <div className="carousel-card">
              {topAds.length > 0 ? (
                <>
                  <img
                    src={topAds[currentIndices.top].images[0]}
                    alt={topAds[currentIndices.top].adTitle || "Top Ad"}
                  />
                  <p>{topAds[currentIndices.top].adTitle}</p>
                </>
              ) : (
                "No Ads"
              )}
            </div>
            <button 
              className="superadmin-carousel-arrow superadmin-right-arrow" 
              onClick={() => handleNext("top", topAds)}
            >
              <FaArrowRight />
            </button>
            <div className="superadmin-ad-controls">
              <button 
                className="superadmin-button" 
                onClick={() => openEditModal("top")}
              >
                <FaEdit />
              </button>
              <button 
                className="superadmin-button" 
                onClick={() => handleReset("top")}
              >
                <FaUndo />
              </button>
              <button 
                className="superadmin-button superadmin-details-button" 
                onClick={() => toggleDetails("top")}
              >
                <FaInfoCircle />
              </button>
            </div>
            {detailsVisible.top && renderDetailsOverlay("top", topAds[currentIndices.top])}
          </div>

          {/* Main Content Section */}
          <div className="superadmin-content">
            {/* Left Column: Men & Women */}
            <div className="superadmin-left-column">
              <div className="superadmin-merged-box">
                <div className="superadmin-half superadmin-men carousel">
                  <button 
                    className="superadmin-carousel-arrow superadmin-left-arrow" 
                    onClick={() => handlePrev("men", menAds)}
                  >
                    <FaArrowLeft />
                  </button>
                  <div className="carousel-card">
                    {menAds.length > 0 ? (
                      <>
                        <img
                          src={menAds[currentIndices.men].images[0]}
                          alt={menAds[currentIndices.men].adTitle || "Men Ad"}
                        />
                        <p>{menAds[currentIndices.men].adTitle}</p>
                      </>
                    ) : (
                      "No Men Ads"
                    )}
                  </div>
                  <button 
                    className="superadmin-carousel-arrow superadmin-right-arrow" 
                    onClick={() => handleNext("men", menAds)}
                  >
                    <FaArrowRight />
                  </button>
                  <div className="superadmin-ad-controls">
                    <button 
                      className="superadmin-button" 
                      onClick={() => openEditModal("men")}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="superadmin-button" 
                      onClick={() => handleReset("men")}
                    >
                      <FaUndo />
                    </button>
                    <button 
                      className="superadmin-button superadmin-details-button" 
                      onClick={() => toggleDetails("men")}
                    >
                      <FaInfoCircle />
                    </button>
                  </div>
                  {detailsVisible.men && renderDetailsOverlay("men", menAds[currentIndices.men])}
                </div>
                <div className="superadmin-half superadmin-women carousel">
                  <button 
                    className="superadmin-carousel-arrow superadmin-left-arrow" 
                    onClick={() => handlePrev("women", womenAds)}
                  >
                    <FaArrowLeft />
                  </button>
                  <div className="carousel-card">
                    {womenAds.length > 0 ? (
                      <>
                        <img
                          src={womenAds[currentIndices.women].images[0]}
                          alt={womenAds[currentIndices.women].adTitle || "Women Ad"}
                        />
                        <p>{womenAds[currentIndices.women].adTitle}</p>
                      </>
                    ) : (
                      "No Women Ads"
                    )}
                  </div>
                  <button 
                    className="superadmin-carousel-arrow superadmin-right-arrow" 
                    onClick={() => handleNext("women", womenAds)}
                  >
                    <FaArrowRight />
                  </button>
                  <div className="superadmin-ad-controls">
                    <button 
                      className="superadmin-button" 
                      onClick={() => openEditModal("women")}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="superadmin-button" 
                      onClick={() => handleReset("women")}
                    >
                      <FaUndo />
                    </button>
                    <button 
                      className="superadmin-button superadmin-details-button" 
                      onClick={() => toggleDetails("women")}
                    >
                      <FaInfoCircle />
                    </button>
                  </div>
                  {detailsVisible.women && renderDetailsOverlay("women", womenAds[currentIndices.women])}
                </div>
              </div>
            </div>

            {/* Right Column: Brands & Products */}
            <div className="superadmin-right-column">
              <div className="superadmin-square superadmin-brands carousel">
                <button 
                  className="superadmin-carousel-arrow superadmin-left-arrow" 
                  onClick={() => handlePrev("brands", brandsAds)}
                >
                  <FaArrowLeft />
                </button>
                <div className="carousel-card">
                  {brandsAds.length > 0 ? (
                    <>
                      <img
                        src={brandsAds[currentIndices.brands].images[0]}
                        alt={brandsAds[currentIndices.brands].adTitle || "Brands Ad"}
                      />
                      <p>{brandsAds[currentIndices.brands].adTitle}</p>
                    </>
                  ) : (
                    "No Brands Ads"
                  )}
                </div>
                <button 
                  className="superadmin-carousel-arrow superadmin-right-arrow" 
                  onClick={() => handleNext("brands", brandsAds)}
                >
                  <FaArrowRight />
                </button>
                <div className="superadmin-ad-controls">
                  <button 
                    className="superadmin-button" 
                    onClick={() => openEditModal("brands")}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="superadmin-button" 
                    onClick={() => handleReset("brands")}
                  >
                    <FaUndo />
                  </button>
                  <button 
                    className="superadmin-button superadmin-details-button" 
                    onClick={() => toggleDetails("brands")}
                  >
                    <FaInfoCircle />
                  </button>
                </div>
                {detailsVisible.brands && renderDetailsOverlay("brands", brandsAds[currentIndices.brands])}
              </div>
              <div className="superadmin-square superadmin-products carousel">
                <button 
                  className="superadmin-carousel-arrow superadmin-left-arrow" 
                  onClick={() => handlePrev("products", productsAds)}
                >
                  <FaArrowLeft />
                </button>
                <div className="carousel-card">
                  {productsAds.length > 0 ? (
                    <>
                      <img
                        src={productsAds[currentIndices.products].images[0]}
                        alt={productsAds[currentIndices.products].adTitle || "Products Ad"}
                      />
                      <p>{productsAds[currentIndices.products].adTitle}</p>
                    </>
                  ) : (
                    "No Products Ads"
                  )}
                </div>
                <button 
                  className="superadmin-carousel-arrow superadmin-right-arrow" 
                  onClick={() => handleNext("products", productsAds)}
                >
                  <FaArrowRight />
                </button>
                <div className="superadmin-ad-controls">
                  <button 
                    className="superadmin-button" 
                    onClick={() => openEditModal("products")}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="superadmin-button" 
                    onClick={() => handleReset("products")}
                  >
                    <FaUndo />
                  </button>
                  <button 
                    className="superadmin-button superadmin-details-button" 
                    onClick={() => toggleDetails("products")}
                  >
                    <FaInfoCircle />
                  </button>
                </div>
                {detailsVisible.products && renderDetailsOverlay("products", productsAds[currentIndices.products])}
              </div>
            </div>
          </div>
        </div>
      </div>
      {editModal.visible && renderEditModal()}
    </div>
  );
};

export default SuperadminAdsPage;
