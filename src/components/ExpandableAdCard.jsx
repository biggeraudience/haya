import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/adminads.scss";

const ExpandableAdCard = ({ category, cardNumber, savedAd, refreshAds }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [media, setMedia] = useState(""); // Holds the preview URL or saved image URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null); // File object for upload
  const fileInputRef = useRef(null);

  // If a saved ad exists, initialize fields from it.
  useEffect(() => {
    if (savedAd) {
      setIsSaved(true);
      setMedia(savedAd.images[0]);
      setTitle(savedAd.title);
      setDescription(savedAd.description);
    }
  }, [savedAd]);

  // Handle file selection & preview; for Ads category, if video, limit duration.
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (category === "Ads" && selectedFile.type.startsWith("video/")) {
        const videoEl = document.createElement("video");
        videoEl.preload = "metadata";
        videoEl.onloadedmetadata = function () {
          window.URL.revokeObjectURL(videoEl.src);
          if (videoEl.duration > 30) {
            alert("Video must be 30 seconds or less.");
            setFile(null);
            return;
          } else {
            setFile(selectedFile);
            const previewUrl = URL.createObjectURL(selectedFile);
            setMedia(previewUrl);
          }
        };
        videoEl.src = URL.createObjectURL(selectedFile);
      } else {
        setFile(selectedFile);
        const previewUrl = URL.createObjectURL(selectedFile);
        setMedia(previewUrl);
      }
    }
  };

  // Trigger hidden file input for uploading file
  const handleSimulateUpload = () => {
    fileInputRef.current.click();
  };

  // Save the ad to the backend – the preview mimics the live landing page.
  const handleSave = async () => {
    if (!file || (!title && !description)) {
      alert("Please provide a title, description, and select a file before saving.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category); // Explicit category
      formData.append("images", file);

      const response = await axios.post("/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data && response.data.images && response.data.images.length > 0) {
        setMedia(response.data.images[0]);
      }
      setIsSaved(true);
      refreshAds();
    } catch (error) {
      console.error("Error uploading ad:", error);
      alert("Failed to save ad. Please try again.");
    }
  };

  // Reset the ad card for editing
  const handleEditOrReset = () => {
    setIsSaved(false);
    setMedia("");
    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="ad-card">
      <div className="card-buttons">
        {isSaved ? (
          <button className="edit-button" onClick={handleEditOrReset}>
            Edit
          </button>
        ) : (
          <button className="edit-button" onClick={handleSave}>
            Save
          </button>
        )}
        <button className="reset-button" onClick={handleEditOrReset}>
          Reset
        </button>
      </div>
      <div className="card-heading">
        {category} - Ad {cardNumber}
      </div>
      <div
        className="card-content"
        onClick={!isSaved ? handleSimulateUpload : undefined}
        style={{ cursor: !isSaved ? "pointer" : "default" }}
      >
        {isSaved && media ? (
          <img
            src={media}
            alt="Ad Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="file-placeholder">Click to insert file</div>
        )}
      </div>
      <div className="card-fields">
        {isSaved ? (
          <>
            <p className="saved-title">{title}</p>
            <p className="saved-description">{description}</p>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Title"
              className="title-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              className="desc-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        )}
      </div>
      {!isSaved && (
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={category === "Ads" ? "image/*,video/*" : "image/*"}
        />
      )}
    </div>
  );
};

export default ExpandableAdCard;
