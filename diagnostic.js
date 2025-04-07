class EnhancerDiagnostic {
  static async runDiagnostics() {
    const results = {
      timestamp: new Date().toISOString(),
      systemInfo: this._getSystemInfo(),
      tests: {},
    };

    // Test memory
    results.tests.memory = await this._testMemory();

    // Test image loading
    results.tests.imageLoading = await this._testImageLoading();

    // Test processing capability
    results.tests.processing = await this._testProcessing();

    // Analyze and provide recommendations
    results.recommendations = this._generateRecommendations(results);

    return results;
  }

  static _getSystemInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      deviceMemory: navigator.deviceMemory || "unknown",
      hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };
  }

  static async _testMemory() {
    const result = { status: "pass", details: {} };

    try {
      // Try allocating memory in increasing chunks
      const testSizesMB = [50, 100, 200, 500];
      const allocations = [];

      for (const size of testSizesMB) {
        try {
          // Allocate memory (1MB = 1048576 bytes)
          const bytes = size * 1048576;
          const array = new Uint8Array(bytes);
          array[0] = 123; // Write to ensure it's allocated
          allocations.push(array);
          result.details[`${size}MB`] = "success";
        } catch (e) {
          result.details[`${size}MB`] = "failed";
          result.status = "warning";
          result.maxAllocated = `${
            testSizesMB[testSizesMB.indexOf(size) - 1] || 0
          }MB`;
          break;
        }
      }

      // Clean up
      allocations.length = 0;
    } catch (error) {
      result.status = "error";
      result.error = error.message;
    }

    return result;
  }

  static async _testImageLoading() {
    const result = { status: "pending", details: {} };

    try {
      // Test loading a small test image
      const testImageUrl =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          result.status = "pass";
          result.details.loadTime = "fast";
          resolve();
        };
        img.onerror = (e) => {
          result.status = "fail";
          result.details.error = "Failed to load test image";
          reject(new Error("Image load failed"));
        };
        img.src = testImageUrl;
      });
    } catch (error) {
      result.status = "error";
      result.error = error.message;
    }

    return result;
  }

  static async _testProcessing() {
    const result = { status: "pending", details: {} };

    try {
      // Create a small canvas for testing
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");

      // Draw something
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 50, 50);
      ctx.fillStyle = "blue";
      ctx.fillRect(50, 50, 50, 50);

      // Try to get image data
      const imageData = ctx.getImageData(0, 0, 100, 100);

      // Try some basic processing
      const startTime = performance.now();

      // Simple image processing (inverting colors)
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i]; // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
      }

      ctx.putImageData(imageData, 0, 0);

      const processingTime = performance.now() - startTime;

      result.status = "pass";
      result.details.processingTime = processingTime.toFixed(2) + "ms";
      result.details.performance =
        processingTime < 50
          ? "good"
          : processingTime < 200
          ? "acceptable"
          : "slow";
    } catch (error) {
      result.status = "error";
      result.error = error.message;
    }

    return result;
  }

  static _generateRecommendations(results) {
    const recommendations = [];

    // Memory recommendations
    if (results.tests.memory.status === "warning") {
      recommendations.push(
        `Limited memory detected. Maximum allocation: ${results.tests.memory.maxAllocated}. Try closing other applications or processing smaller images.`
      );
    } else if (results.tests.memory.status === "error") {
      recommendations.push(
        `Memory test failed. Your device might not have enough memory to run this application.`
      );
    }

    // Processing performance recommendations
    if (
      results.tests.processing.status === "pass" &&
      results.tests.processing.details.performance === "slow"
    ) {
      recommendations.push(
        `Your device shows slower image processing performance. Consider using lower quality settings for faster results.`
      );
    }

    // Browser recommendations
    const browser = this._detectBrowser(results.systemInfo.userAgent);
    if (browser === "Internet Explorer") {
      recommendations.push(
        `You're using Internet Explorer which has limited support for modern web features. We recommend switching to Chrome, Firefox, or Edge for better performance.`
      );
    }

    return recommendations;
  }

  static _detectBrowser(userAgent) {
    if (userAgent.indexOf("Chrome") > -1) return "Chrome";
    if (userAgent.indexOf("Safari") > -1) return "Safari";
    if (userAgent.indexOf("Firefox") > -1) return "Firefox";
    if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1)
      return "Internet Explorer";
    if (userAgent.indexOf("Edge") > -1) return "Edge";
    return "Unknown";
  }
}

module.exports = EnhancerDiagnostic;
