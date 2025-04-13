import React, { useState } from "react";
import "./ImageDisplay.css";

const ImageDisplay = ({ imageUrl, darkMode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!imageUrl) {
    return <p className={darkMode ? "text-dark" : ""}>No image available</p>;
  }

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const handleImageError = () => {
    setError(true);
    console.error("Failed to load image from URL:", imageUrl);
  };

  return (
    <div className={`image-display ${darkMode ? "dark" : ""}`}>
      {!isLoaded && !error && (
        <div className={`loading-spinner ${darkMode ? "dark" : ""}`}>
          <span className={darkMode ? "text-dark" : ""}>Loading image...</span>
        </div>
      )}

      {error ? (
        <div className={`error-container ${darkMode ? "dark" : ""}`}>
          <p>Failed to load image. Please try again.</p>
          <div className={`debug-info ${darkMode ? "dark" : ""}`}>
            <p>URL: {imageUrl}</p>
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`direct-link ${darkMode ? "dark" : ""}`}
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
          className={`download-button ${darkMode ? "dark" : ""}`}
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