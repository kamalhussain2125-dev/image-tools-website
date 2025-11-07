# Image Tools Website

A comprehensive collection of web-based image processing tools, all in one place.

## 🛠️ Tools Available

### Analyze
- **Image OCR Extractor** - Extract text from images
- **Image EXIF Tool** - View image metadata

### Edit  
- **Image Dithering Tool** - Apply dithering effects
- **Image Pixel Sorter** - Sort pixels by various criteria
- **Image Background Changer** - Remove/change image backgrounds

### Convert
- **ASCII Art Converter** - Convert images to ASCII art

### Create
- **Favicon Maker** - Create favicons from images
- **Animated GIF Maker** - Create animated GIFs
- **Custom Card Maker** - Design custom cards

### Fun
- **Image Puzzle Game** - Turn images into puzzles

## 🚀 Deployment

This site is deployed on Vercel and ready to use!

## 📁 Structure

```
ImageToolsWebsite/
├── index.html          # Main landing page
├── script.js           # Main JavaScript
├── style.css           # Main styles
├── vercel.json         # Vercel configuration
├── README.md           # This file
└── tools/              # All tool modules
    ├── index.html      # Tools directory page
    ├── [tool-name]/    # Individual tool directories
    └── ...
```

## 🌟 Features

- **Responsive Design** - Works on all devices
- **Category Filtering** - Browse tools by category
- **Search Functionality** - Find tools quickly
- **Modular Architecture** - Each tool is self-contained
- **Fast Loading** - Optimized for performance

## 🎯 Usage

1. Visit the main site
2. Browse tools by category or search
3. Click on any tool to open it
4. Each tool works independently with its own interface

## 🔧 Development

To run locally:
```bash
python -m http.server 5200
# or
npx http-server -p 5200
```

Then visit: http://localhost:5200