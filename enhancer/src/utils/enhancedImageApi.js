import axios from "axios";

const API_KEY = "wxjo53bx044ygpwpr";
const BASE_URL = "https://techhk.aoscdn.com"; // Fixed base URL
const MAXIMUM_RETRIES = 15;

export const enhancedImageApi = async (file) => {
  try {
    const taskId = await uploadImage(file);
    console.log("Image Uploaded successfully, Task ID:", taskId);

    const enhancedImageData = await PollForEnhancedImage(taskId);
    console.log("Enhanced Image Data:", enhancedImageData);

    // Check and return the image URL in a structured format
    if (enhancedImageData && enhancedImageData.image) {
      return {
        imageUrl: enhancedImageData.image,
        image: enhancedImageData.image, // Keep backward compatibility
        width: enhancedImageData.image_width || 0,
        height: enhancedImageData.image_height || 0,
      };
    } else {
      throw new Error("Enhanced image URL not found in response");
    }
  } catch (error) {
    console.log("Error enhancing image:", error.message);
    throw error; // Re-throw so calling function can handle it
  }
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image_file", file);

  try {
    // Fixed URL using backticks instead of single quotes
    // Fixed endpoint path
    const { data } = await axios.post(
      `${BASE_URL}/api/tasks/visual/scale`,
      formData,
      {
        headers: {
          // Changed from "Headers" to "headers" - case sensitive!
          "Content-Type": "multipart/form-data",
          "X-API-KEY": API_KEY,
        },
      }
    );

    // Check for task_id
    if (!data?.data?.task_id) {
      throw new Error("Failed to upload image! Task ID not found.");
    }
    return data.data.task_id;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `API Error (${error.response.status}): ${
          error.response.data.message || error.response.statusText
        }`
      );
    } else if (error.request) {
      throw new Error("No response received from server");
    } else {
      throw error;
    }
  }
};

const PollForEnhancedImage = async (taskId, retries = 0) => {
  try {
    const result = await fetchEnhancedImage(taskId);

    if (result.state === 4) {
      // Fixed template string using backticks
      console.log(`Processing...(${retries}/${MAXIMUM_RETRIES})`);

      if (retries >= MAXIMUM_RETRIES) {
        throw new Error("Max retries reached. Please try again later.");
      }
      // wait for 2 sec.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return PollForEnhancedImage(taskId, retries + 1);
    }
    console.log("Enhanced Image URL:", result);
    return result;
  } catch (error) {
    console.error("Polling error:", error.message);
    throw error;
  }
};

const fetchEnhancedImage = async (taskId) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/api/tasks/visual/scale/${taskId}`,
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );

    if (!data?.data) {
      throw new Error("Failed to fetch enhanced image! Image not found.");
    }

    return data.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Image processing failed or task not found.");
    }
    throw error;
  }
};
