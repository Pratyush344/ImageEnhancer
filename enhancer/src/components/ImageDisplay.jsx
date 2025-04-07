import React, { useState } from "react";
import "./ImageDisplay.css";

const ImageDisplay = ({ imageUrl }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!imageUrl) {
    return <p>No image available</p>;
  }

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setError(true);
    console.error("Failed to load image from URL:", imageUrl);
  };

  return (
    <div className="image-display">
      {!isLoaded && !error && (
        <div className="loading-spinner">
          <span>Loading image...</span>
        </div>
      )}

      {error ? (
        <div className="error-container">
          <p>Failed to load image. Please try again.</p>
          <div className="debug-info">
            <p>URL: {imageUrl}</p>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="direct-link"
            >
              View Image Directly
            </a>
          </div>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt="Enhanced"
          className={`enhanced-image ${isLoaded ? "visible" : "hidden"}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {isLoaded && !error && (
        <a
          href={imageUrl}
          download="enhanced-image.png"
          className="download-button"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Image
        </a>
      )}
    </div>
  );
};

export default ImageDisplay;
