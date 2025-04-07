const express = require("express");
const app = express();
const port = 3000;

const ImageProcessor = require("./imageProcessor");
const { ErrorHandler } = require("./errorHandler");
const ImageValidator = require("./imageValidator");

// Middleware to serve static files
app.use(express.static("public"));

// Route to handle image upload and processing
app.post("/upload", async (req, res) => {
  try {
    const imageFile = req.files.image; // Assuming this is how the image file is accessed
    const processor = new ImageProcessor();
    showLoadingSpinner(); // Assuming this function exists

    const imageData = await readImageFile(imageFile); // Assuming this function exists
    const enhancedImage = await processor.enhanceImageWithTimeout(imageData);

    hideLoadingSpinner(); // Assuming this function exists
    displayEnhancedImage(enhancedImage); // Assuming this function exists
    res.send("Image processed successfully");
  } catch (error) {
    hideLoadingSpinner(); // Assuming this function exists
    const errorMessage = ErrorHandler.handleImageProcessingError(error);
    showErrorMessage(errorMessage); // Assuming this function exists
    res.status(500).send(errorMessage);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

async function enhanceImage(file, options = {}) {
  const statusElement = document.getElementById("status-message");
  const progressElement = document.getElementById("progress-bar");

  try {
    // Reset UI state
    statusElement.textContent = "Processing...";
    statusElement.className = "status-processing";
    progressElement.style.width = "0%";
    showElement("processing-overlay");

    // Validate before processing
    const validationResult = ImageValidator.validateImage(file);
    if (!validationResult.valid) {
      throw ErrorHandler.createError(
        ErrorHandler.ERROR_TYPES.FORMAT,
        validationResult.errors.join(", ")
      );
    }

    // Initialize processor with retry options
    const processor = new ImageProcessor({
      maxRetries: 2,
      timeoutMs: 60000,
      enableFallbackMode: true,
    });

    // Run diagnostics first if needed
    if (options.runDiagnostics) {
      const diagnostics = await processor.diagnoseSystem();
      if (diagnostics.issues.length > 0) {
        console.warn("System diagnostics warnings:", diagnostics.issues);
      }
    }

    // Start animation
    const progressInterval = animateProgress(progressElement);

    // Process the image
    const enhancedImage = await processor.enhanceImage(file, options);

    // Stop progress animation
    clearInterval(progressInterval);
    progressElement.style.width = "100%";

    // Update UI
    statusElement.textContent = "Enhancement complete!";
    statusElement.className = "status-success";

    // Display the enhanced image
    displayEnhancedImage(enhancedImage);

    // Hide processing overlay after a delay
    setTimeout(() => hideElement("processing-overlay"), 1000);

    return enhancedImage;
  } catch (error) {
    // Stop progress animation if running
    progressElement.style.width = "100%";
    progressElement.className = "progress-error";

    // Get user-friendly message
    const userMessage = ErrorHandler.handleEnhancementError(error);

    // Update UI
    statusElement.textContent = userMessage;
    statusElement.className = "status-error";

    // Show troubleshooting button
    showElement("troubleshoot-button");

    // Hide processing overlay after a delay
    setTimeout(() => hideElement("processing-overlay"), 3000);

    return null;
  }
}

function animateProgress(progressElement) {
  let progress = 0;
  return setInterval(() => {
    // Slowly increase progress, but never reach 100%
    if (progress < 90) {
      progress += Math.random() * 3;
      progressElement.style.width = `${progress}%`;
    }
  }, 300);
}

function showElement(id) {
  const element = document.getElementById(id);
  if (element) element.style.display = "block";
}

function hideElement(id) {
  const element = document.getElementById(id);
  if (element) element.style.display = "none";
}

function displayEnhancedImage(blob) {
  // Create URL for blob and display it
  const url = URL.createObjectURL(blob);
  const imageElement = document.getElementById("result-image");
  imageElement.src = url;
  showElement("result-container");
}

// Expose functions to the global scope
window.enhanceImage = enhanceImage;
