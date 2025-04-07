import React, { useState } from "react";
import axios from "axios";
import ImageValidator from "./imageValidator";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError("");
    setEnhancedImage(null);
  };

  const UploadImageHandler = async () => {
    try {
      setLoading(true);
      setError("");

      // Validate image before uploading
      const validationResult = ImageValidator.validateImage(selectedFile);
      if (!validationResult.valid) {
        setError(validationResult.errors.join(", "));
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", selectedFile);

      // Make sure the API endpoint URL is correct
      const response = await axios.post(
        "http://localhost:5000/api/enhance",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      // Check if response and response.data exist before accessing properties
      if (response && response.data && response.data.image) {
        setEnhancedImage(response.data.image);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Enhancement error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 404) {
          setError(
            "Enhancement service not found. Please check if the server is running."
          );
        } else {
          setError(
            `Error enhancing image: ${
              error.response.data.message || error.response.statusText
            }`
          );
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error enhancing image: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Image Enhancer</h1>

      <div className="upload-section">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.bmp,.webp"
        />
        <button
          onClick={UploadImageHandler}
          disabled={!selectedFile || loading}
          className="enhance-btn"
        >
          {loading ? "Processing..." : "Enhance Image"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="images-container">
        {selectedFile && (
          <div className="image-preview">
            <h3>Original Image</h3>
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Original"
              className="preview-img"
            />
          </div>
        )}

        {enhancedImage && (
          <div className="image-preview">
            <h3>Enhanced Image</h3>
            <img src={enhancedImage} alt="Enhanced" className="preview-img" />
            <a
              href={enhancedImage}
              download="enhanced_image"
              className="download-btn"
            >
              Download Enhanced Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
