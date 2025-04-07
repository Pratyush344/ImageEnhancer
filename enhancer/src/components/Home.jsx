import React from "react";
import ImageUpload from "./ImageUpload";
import ImagePreview from "./ImagePreview";
import { enhancedImageApi } from "../utils/enhancedImageApi";
import { useState } from "react";

const Home = () => {
  const [uploadImage, setUploadImage] = useState(null);
  const [enhancedImage, setenhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const UploadImageHandler = async (file) => {
    setUploadImage(URL.createObjectURL(file));
    setLoading(true);
    setError(""); // Reset error state

    // calling the API to enhance the image
    try {
      const enhancedData = await enhancedImageApi(file);

      // Store the returned data object
      setenhancedImage({
        image: enhancedData.imageUrl || enhancedData.image,
      });

      console.log("Enhanced image set:", enhancedData);
    } catch (error) {
      console.error("Enhancement error:", error);
      setError(
        error.message ||
          "Error while enhancing the image. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ImageUpload UploadImageHandler={UploadImageHandler} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4 mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <ImagePreview
        loading={loading}
        uploaded={uploadImage}
        enhanced={enhancedImage?.image}
      />
    </>
  );
};

export default Home;
