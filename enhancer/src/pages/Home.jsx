import React, { useState } from "react";
import { enhancedImageApi } from "../utils/enhancedImageApi";
import ImageDisplay from "../components/ImageDisplay";
import "./Home.css";

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setEnhancedImage(null);
      setError("");

      // Create preview for original image
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhanceClick = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await enhancedImageApi(selectedFile);
      console.log("Enhanced image result:", result);

      if (result && result.imageUrl) {
        setEnhancedImage(result);
      } else {
        throw new Error("No image URL in the response");
      }
    } catch (err) {
      console.error("Enhancement failed:", err);
      setError(err.message || "Failed to enhance image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>Image Enhancer</h1>

      <div className="upload-container">
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="file-input" className="file-label">
          {selectedFile ? selectedFile.name : "Choose Image"}
        </label>

        <button
          className="enhance-button"
          onClick={handleEnhanceClick}
          disabled={!selectedFile || loading}
        >
          {loading ? "Enhancing..." : "Enhance Image"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="images-container">
        {originalPreview && (
          <div className="image-card">
            <h3>Original Image</h3>
            <div className="image-wrapper">
              <img
                src={originalPreview}
                alt="Original"
                className="preview-image"
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="image-card">
            <h3>Processing...</h3>
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>Enhancing your image...</p>
            </div>
          </div>
        )}

        {!loading && enhancedImage && (
          <div className="image-card">
            <h3>Enhanced Image</h3>
            <ImageDisplay imageUrl={enhancedImage.imageUrl} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
