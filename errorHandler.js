/**
 * Error handler for the ImageEnhancer application
 * Centralizes error handling logic
 */
class ErrorHandler {
  static ERROR_TYPES = {
    VALIDATION: "validation",
    API: "api",
    UPLOAD: "upload",
    PROCESSING: "processing",
    NETWORK: "network",
    INTERNAL: "internal",
  };

  /**
   * Handle errors and return user-friendly messages
   * @param {Error|Object} error - The error object
   * @param {string} errorType - Type of error from ERROR_TYPES
   * @returns {string} User-friendly error message
   */
  static handleError(error, errorType = this.ERROR_TYPES.INTERNAL) {
    // Log error for debugging
    console.error(`[${errorType.toUpperCase()}] Error:`, error);

    // Store error for analytics
    this.logErrorForAnalytics(error, errorType);

    // Generate user-friendly message based on error type
    switch (errorType) {
      case this.ERROR_TYPES.VALIDATION:
        return this.formatValidationError(error);

      case this.ERROR_TYPES.API:
        return this.formatApiError(error);

      case this.ERROR_TYPES.UPLOAD:
        return this.formatUploadError(error);

      case this.ERROR_TYPES.PROCESSING:
        return this.formatProcessingError(error);

      case this.ERROR_TYPES.NETWORK:
        return this.formatNetworkError(error);

      case this.ERROR_TYPES.INTERNAL:
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  }

  /**
   * Format validation errors
   * @param {Object|Error} error - Validation error
   * @returns {string} Formatted error message
   */
  static formatValidationError(error) {
    // Handle ImageValidator error format
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.join("\n");
    }

    return (
      error.message ||
      "Invalid image. Please check file requirements and try again."
    );
  }

  /**
   * Format API errors
   * @param {Object|Error} error - API error
   * @returns {string} Formatted error message
   */
  static formatApiError(error) {
    // Check for server response
    if (error.response) {
      const status = error.response.status;

      // Handle common HTTP status codes
      switch (status) {
        case 400:
          return "The request was invalid. Please check your image and try again.";
        case 401:
          return "Authentication failed. Please check your API key.";
        case 403:
          return "You don't have permission to perform this operation.";
        case 404:
          return "The image enhancing service couldn't be found. Please try again later.";
        case 413:
          return "The image is too large. Please try a smaller image.";
        case 429:
          return "Too many requests. Please wait a moment and try again.";
        case 500:
        case 502:
        case 503:
          return "The image enhancement server is currently unavailable. Please try again later.";
        default:
          return `Server error (${status}). Please try again later.`;
      }
    }

    return error.message || "Error connecting to the enhancement service.";
  }

  /**
   * Format upload errors
   * @param {Object|Error} error - Upload error
   * @returns {string} Formatted error message
   */
  static formatUploadError(error) {
    if (error.message && error.message.includes("timeout")) {
      return "Upload timed out. Please check your connection and try again.";
    }

    return error.message || "Failed to upload the image. Please try again.";
  }

  /**
   * Format processing errors
   * @param {Object|Error} error - Processing error
   * @returns {string} Formatted error message
   */
  static formatProcessingError(error) {
    if (error.message && error.message.includes("timeout")) {
      return "Image processing timed out. Please try with a smaller image.";
    }

    return error.message || "Failed to process the image. Please try again.";
  }

  /**
   * Format network errors
   * @param {Object|Error} error - Network error
   * @returns {string} Formatted error message
   */
  static formatNetworkError(error) {
    if (!navigator.onLine) {
      return "You appear to be offline. Please check your internet connection.";
    }

    return (
      error.message ||
      "Network error. Please check your connection and try again."
    );
  }

  /**
   * Log error for analytics
   * @param {Error|Object} error - The error object
   * @param {string} type - Error type
   */
  static logErrorForAnalytics(error, type) {
    try {
      // Store in local storage for now
      const errorLog = {
        timestamp: new Date().toISOString(),
        type,
        message: error.message || "Unknown error",
        stack: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Get existing logs
      const logs = JSON.parse(
        localStorage.getItem("imageEnhancer_errorLogs") || "[]"
      );

      // Add new log
      logs.push(errorLog);

      // Keep only last 20 logs
      while (logs.length > 20) logs.shift();

      // Save back to storage
      localStorage.setItem("imageEnhancer_errorLogs", JSON.stringify(logs));
    } catch (e) {
      // Silently fail if logging fails
      console.warn("Failed to log error for analytics", e);
    }
  }
}

// Support both CommonJS and ES modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ErrorHandler;
} else {
  // For browsers without module support
  if (typeof window !== "undefined") {
    window.ErrorHandler = ErrorHandler;
  }
}

// Support ES modules
export default ErrorHandler;
