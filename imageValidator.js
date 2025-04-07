/**
 * Image Validator
 * Validates images for format, size, dimensions, and content type
 */
class ImageValidator {
  static SUPPORTED_FORMATS = ["jpg", "jpeg", "png", "bmp", "webp", "gif"];
  static MAX_SIZE_MB = 20;
  static MIN_WIDTH = 50; // Minimum image width in pixels
  static MIN_HEIGHT = 50; // Minimum image height in pixels
  static MAX_WIDTH = 5000; // Maximum image width in pixels
  static MAX_HEIGHT = 5000; // Maximum image height in pixels
  static MIME_TYPES = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    bmp: "image/bmp",
    webp: "image/webp",
    gif: "image/gif",
  };

  /**
   * Validates an image file
   * @param {File|Blob} file - The image file to validate
   * @param {Object} options - Optional validation options
   * @returns {Object} Validation result with valid status and errors
   */
  static validateImage(file, options = {}) {
    const result = {
      valid: true,
      errors: [],
    };

    // Check if file exists
    if (!file) {
      result.valid = false;
      result.errors.push("No image file provided");
      return result;
    }

    // Use provided options or defaults
    const maxSize = options.maxSize || this.MAX_SIZE_MB;
    const supportedFormats = options.formats || this.SUPPORTED_FORMATS;

    // Check if the file is actually a File or Blob object
    if (!(file instanceof File) && !(file instanceof Blob)) {
      result.valid = false;
      result.errors.push("Invalid file object");
      return result;
    }

    // Check file format by extension
    const fileName = file.name || "";
    if (fileName) {
      const extension = fileName.split(".").pop().toLowerCase();
      if (!supportedFormats.includes(extension)) {
        result.valid = false;
        result.errors.push(
          `Unsupported format: ${extension}. Please use: ${supportedFormats.join(
            ", "
          )}`
        );
      }
    }

    // Check MIME type
    const fileType = file.type;
    const validMimeTypes = Object.values(this.MIME_TYPES);
    if (fileType && !validMimeTypes.includes(fileType)) {
      result.valid = false;
      result.errors.push(
        `Invalid file type: ${fileType}. Please upload a valid image file.`
      );
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      result.valid = false;
      result.errors.push(
        `Image too large: ${fileSizeMB.toFixed(
          2
        )}MB. Maximum allowed: ${maxSize}MB`
      );
    }

    return result;
  }

  /**
   * Validates image dimensions
   * @param {HTMLImageElement|string} image - Image element or URL
   * @returns {Promise<Object>} Validation result
   */
  static async validateDimensions(image) {
    return new Promise((resolve, reject) => {
      const result = {
        valid: true,
        errors: [],
        width: 0,
        height: 0,
      };

      try {
        // If image is a URL, create an image element
        const img = typeof image === "string" ? new Image() : image;

        const checkDimensions = () => {
          result.width = img.naturalWidth || img.width;
          result.height = img.naturalHeight || img.height;

          // Check minimum dimensions
          if (
            result.width < this.MIN_WIDTH ||
            result.height < this.MIN_HEIGHT
          ) {
            result.valid = false;
            result.errors.push(
              `Image dimensions too small: ${result.width}x${result.height}px. 
              Minimum dimensions: ${this.MIN_WIDTH}x${this.MIN_HEIGHT}px`
            );
          }

          // Check maximum dimensions
          if (
            result.width > this.MAX_WIDTH ||
            result.height > this.MAX_HEIGHT
          ) {
            result.valid = false;
            result.errors.push(
              `Image dimensions too large: ${result.width}x${result.height}px. 
              Maximum dimensions: ${this.MAX_WIDTH}x${this.MAX_HEIGHT}px`
            );
          }

          resolve(result);
        };

        if (typeof image === "string") {
          img.onload = checkDimensions;
          img.onerror = () => {
            result.valid = false;
            result.errors.push("Failed to load image for dimension validation");
            resolve(result);
          };
          img.src = image;
        } else {
          // Check if the image is already loaded
          if (img.complete) {
            checkDimensions();
          } else {
            img.onload = checkDimensions;
            img.onerror = () => {
              result.valid = false;
              result.errors.push(
                "Failed to load image for dimension validation"
              );
              resolve(result);
            };
          }
        }
      } catch (error) {
        result.valid = false;
        result.errors.push(`Error validating dimensions: ${error.message}`);
        resolve(result);
      }
    });
  }

  /**
   * Creates a readable file size string
   * @param {number} bytes - Size in bytes
   * @returns {string} Human-readable size
   */
  static getReadableFileSize(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    else return (bytes / 1073741824).toFixed(1) + " GB";
  }

  /**
   * Get file extension from file object or name
   * @param {File|string} file - File object or filename
   * @returns {string} The file extension
   */
  static getFileExtension(file) {
    const name = typeof file === "string" ? file : file.name;
    return name.split(".").pop().toLowerCase();
  }
}

// Support both CommonJS and ES modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ImageValidator;
} else {
  // For browsers without module support
  if (typeof window !== "undefined") {
    window.ImageValidator = ImageValidator;
  }
}

// Support ES modules
export default ImageValidator;
