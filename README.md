# ImageEnhancer

## Overview

ImageEnhancer is a lightweight application designed to improve image quality through various enhancement techniques including noise reduction, sharpening, color correction, and resolution upscaling.

## Features

- Image noise reduction
- Automatic color correction
- Contrast and brightness optimization
- Image sharpening
- Resolution upscaling (up to 2x)
- Batch processing support

## Installation

### Prerequisites

- Node.js v14.0 or higher
- 4GB RAM minimum (8GB recommended for large images)

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/Pratyush344/ImageEnhancer.git
   ```
2. Navigate to the project directory:
   ```
   cd ImageEnhancer
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

### Basic Operation

1. Launch the application:
   ```
   npm run dev
   ```
2. Click "Open" to select an image
3. Choose enhancement options from the sidebar
4. Click "Enhance" to process the image
5. Use "Save As" to export the enhanced image

### Command Line Usage

```
node cli.js enhance --input=path/to/image.jpg --output=path/to/output.jpg --preset=high
```

## Troubleshooting

### Common Errors

#### "Error while enhancing the image"

This generic error may occur due to:

- Insufficient memory
- Unsupported file format
- Network issues when using cloud-based features

Solutions:

- Try using a smaller image
- Ensure you're using supported formats (JPG, PNG, BMP)
- Check your internet connection
- Restart the application

#### Performance Issues

- Close other memory-intensive applications
- Use the "Light" enhancement preset for faster processing
- For batch processing, reduce the concurrent processing limit

## Technologies Used

- Node.js
- Electron
- TensorFlow.js for AI-powered enhancements
- Sharp for image processing

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
