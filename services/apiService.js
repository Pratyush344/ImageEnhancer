import axios from "axios";

// Base URL configuration - adjust this to match your backend API
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  async (config) => {
    // You can add authentication tokens here if needed
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is network related, customize the message
    if (!error.response) {
      return Promise.reject({
        ...error,
        message: "Network error - please check your connection",
      });
    }

    // Customize error messages based on status code
    switch (error.response.status) {
      case 404:
        error.message = "The requested resource was not found";
        break;
      case 500:
        error.message = "Server error occurred - please try again later";
        break;
      case 429:
        error.message = "Too many requests - please try again later";
        break;
      default:
        // Keep the original error message
        break;
    }

    return Promise.reject(error);
  }
);

// API methods
export const enhanceImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await apiClient.post("/enhance", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Service - Enhance Image Error:", error);
    throw error;
  }
};

export default {
  enhanceImage,
};
