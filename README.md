# Image Tools Website (Next.js)

A Next.js umbrella app that hosts multiple image tools under one site. Server tools run on Node.js API routes; client tools run fully in-browser.

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

Deploy with Vercel (recommended):

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. In Vercel, create a new project and select the repository.
3. Framework preset: `Next.js` (auto-detected).
4. Build command: `npm run build` (auto).
5. Node runtime: auto; APIs explicitly set to Node via `export const runtime = 'nodejs'`.
6. Environment variables: none required.

CLI alternative:

```bash
npm i -g vercel
vercel login
vercel link # choose ImageToolsWebsite
vercel deploy --prod
```

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

Install and run locally:
```bash
npm install
npm run dev
```

Visit: `http://localhost:3000`

Styling uses Tailwind CSS + DaisyUI.

Tailwind config: `tailwind.config.ts`

PostCSS config: `postcss.config.cjs`