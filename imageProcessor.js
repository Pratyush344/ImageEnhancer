const { ErrorHandler } = require("./errorHandler");
const ImageValidator = require("./imageValidator");

class ImageProcessor {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 2;
    this.timeoutMs = options.timeoutMs || 30000;
    this.enableFallbackMode = options.enableFallbackMode || false;
  }

  async enhanceImage(imageFile, enhancementOptions = {}) {
    // Validate image before processing
    const validationResult = ImageValidator.validateImage(imageFile);
    if (!validationResult.valid) {
      throw ErrorHandler.createError(
        ErrorHandler.ERROR_TYPES.FORMAT,
        validationResult.errors.join(", ")
      );
    }

    let attempts = 0;

    while (attempts <= this.maxRetries) {
      try {
        attempts++;

        // Run the enhancement with timeout
        return await this._processWithTimeout(imageFile, enhancementOptions);
      } catch (error) {
        console.warn(`Enhancement attempt ${attempts} failed:`, error.message);

        // If it's the last attempt, throw the error
        if (attempts > this.maxRetries) {
          if (
            this.enableFallbackMode &&
            this._canUseFallbackMode(enhancementOptions)
          ) {
            console.log("Using fallback enhancement mode");
            return this._fallbackEnhancement(imageFile);
          }
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  async _processWithTimeout(imageFile, enhancementOptions) {
    return Promise.race([
      this._enhance(imageFile, enhancementOptions),
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            ErrorHandler.createError(
              ErrorHandler.ERROR_TYPES.TIMEOUT,
              "Enhancement process timed out",
              { timeoutMs: this.timeoutMs }
            )
          );
        }, this.timeoutMs);
      }),
    ]);
  }

  async _enhance(imageFile, enhancementOptions) {
    try {
      // Read the file as ArrayBuffer
      const buffer = await this._readFileAsArrayBuffer(imageFile);

      // This is where your actual image enhancement code would go
      // For now we'll simulate the process
      console.log("Enhancing image:", imageFile.name);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate memory error on large files (for testing)
      if (buffer.byteLength > 10 * 1024 * 1024) {
        throw ErrorHandler.createError(
          ErrorHandler.ERROR_TYPES.MEMORY,
          "Not enough memory to process this image"
        );
      }

      // Return enhanced image (simulated)
      return new Blob([buffer], { type: imageFile.type });
    } catch (error) {
      if (error instanceof Error && !(error.name === "EnhancementError")) {
        // Convert generic errors to enhancement errors
        if (
          error.message.includes("memory") ||
          error.message.includes("allocation failed")
        ) {
          throw ErrorHandler.createError(
            ErrorHandler.ERROR_TYPES.MEMORY,
            "Out of memory while processing image"
          );
        } else {
          throw ErrorHandler.createError(
            ErrorHandler.ERROR_TYPES.UNKNOWN,
            error.message
          );
        }
      }
      throw error;
    }
  }

  _readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsArrayBuffer(file);
    });
  }

  _canUseFallbackMode(options) {
    // Check if we can use fallback mode based on options
    return true;
  }

  async _fallbackEnhancement(imageFile) {
    // A simpler enhancement that's less likely to fail
    // This would be your basic enhancement code
    console.log("Using fallback enhancement mode");
    const buffer = await this._readFileAsArrayBuffer(imageFile);
    return new Blob([buffer], { type: imageFile.type });
  }

  // Diagnostic method to help identify issues
  async diagnoseSystem() {
    const results = {
      memory: this._checkAvailableMemory(),
      gpu: await this._checkGpuAvailability(),
      diskSpace: this._checkDiskSpace(),
      issues: [],
    };

    if (results.memory < 500) {
      results.issues.push(
        "Low system memory. Close other applications for better performance."
      );
    }

    if (!results.gpu.available) {
      results.issues.push(
        "GPU acceleration unavailable. Using CPU fallback which may be slower."
      );
    }

    return results;
  }

  _checkAvailableMemory() {
    // This is a simplified version - in real implementation you'd use
    // system APIs to check available memory
    try {
      // Try to allocate a large array and see if it works
      const testArray = new Uint8Array(100 * 1024 * 1024);
      testArray[0] = 1;
      return 1000; // Mock 1000MB available
    } catch (e) {
      return 200; // Mock 200MB available
    }
  }

  async _checkGpuAvailability() {
    // Mock GPU check
    return { available: true, name: "Mock GPU" };
  }

  _checkDiskSpace() {
    // Mock disk space check
    return { available: 10000 }; // 10GB free
  }
}

module.exports = ImageProcessor;
