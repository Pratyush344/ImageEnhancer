
import React from 'react';
import ImageUpload from './ImageUpload';
import ImagePreview from './ImagePreview';
import { enhancedImageApi } from '../utils/enhancedimageApi';
import { useState } from 'react';

const Home = () => {
  const [uploadImage, setUploadImage] = useState(null);
  const [enhancedImage, setenhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const UploadImageHandler = async (file) => {
    setUploadImage(URL.createObjectURL(file));
    setLoading(true);
    // calling the API to enhance the image
    try {
      const enhancedURL = await enhancedImageApi(file);  // Fixed this line
      setenhancedImage(enhancedURL.image);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert('Error while enhancing the image. Please try again later.');
    }
  };

  return (
    <>
      <ImageUpload UploadImageHandler={UploadImageHandler} />
      <ImagePreview
        loading={loading}
        uploaded={uploadImage}
        enhanced={enhancedImage?.image}
      />
    </>
  );
};

export default Home;









