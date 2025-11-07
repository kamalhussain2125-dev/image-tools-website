import Link from 'next/link';
import './globals.css';

type Tool = {
  id: string;
  name: string;
  desc: string;
  path: string;
  cat: 'analyze' | 'edit' | 'convert' | 'create' | 'fun';
  icon: string;
  server?: boolean;
};

const tools: Tool[] = [
  { id: 'image-ocr-extractor', name: 'Image OCR Extractor', desc: 'Extract text from images with local or cloud OCR.', path: '/tools/image-ocr-extractor', cat: 'analyze', icon: '🔎' },
  { id: 'image-dithering-tool', name: 'Image Dithering Tool', desc: 'Apply classic dithering patterns to images.', path: '/tools/image-dithering-tool', cat: 'edit', icon: '🟣' },
  { id: 'image-exif-tool', name: 'Image EXIF Tool', desc: 'View and strip EXIF metadata.', path: '/tools/image-exif-tool', cat: 'analyze', icon: '📋' },
  { id: 'image-pixel-sorter', name: 'Image Pixel Sorter', desc: 'Create glitch art via pixel sorting.', path: '/tools/image-pixel-sorter', cat: 'edit', icon: '🧪' },
  { id: 'image-ascii-art-converter', name: 'ASCII Art Converter', desc: 'Turn images into ASCII art.', path: '/tools/image-ascii-art-converter', cat: 'convert', icon: '🔠' },
  { id: 'image-anaglyph-3d', name: 'Anaglyph 3D Maker', desc: 'Create red-cyan 3D images (server page).', path: '/apps/image-anaglyph-3d', cat: 'edit', icon: '🕶️', server: true },
  { id: 'image-format-converter', name: 'Format Converter', desc: 'Convert PNG/JPG/WebP (server page).', path: '/apps/image-format-converter', cat: 'convert', icon: '🔄', server: true },
  { id: 'image-resizer', name: 'Image Resizer', desc: 'Resize images (server page).', path: '/apps/image-resizer', cat: 'edit', icon: '📐', server: true },
  { id: 'image-hidden-message', name: 'Hidden Message Finder', desc: 'Reveal hidden patterns (server page).', path: '/apps/image-hidden-message', cat: 'analyze', icon: '🕵️', server: true },
  { id: 'favicon-maker', name: 'Favicon Maker', desc: 'Create custom favicons with cropping and effects.', path: '/tools/favicon-maker', cat: 'create', icon: '🎯' },
  { id: 'animated-gif-maker', name: 'Animated GIF Maker', desc: 'Create animated GIFs from multiple images.', path: '/tools/animated-gif-maker', cat: 'create', icon: '🎬' },
  { id: 'custom-card-maker', name: 'Custom Card Maker', desc: 'Design custom greeting cards with images.', path: '/tools/custom-card-maker', cat: 'create', icon: '💳' },
  { id: 'image-background-changer', name: 'Image Background Changer', desc: 'Replace or remove image backgrounds.', path: '/tools/image-background-changer', cat: 'edit', icon: '🖼️' },
  { id: 'image-puzzle-game', name: 'Image Puzzle Game', desc: 'Turn images into interactive puzzles.', path: '/tools/image-puzzle-game', cat: 'fun', icon: '🧩' },
  { id: 'image-to-cartoon', name: 'Image to Cartoon', desc: 'Convert photos to cartoon style (server page).', path: '/apps/image-to-cartoon', cat: 'convert', icon: '🎨', server: true },
];

function ToolCard({ tool }: { tool: Tool }) {
  const unavailable = tool.server; // placeholder until integrated
  return (
    <div className={`card${unavailable ? ' offline' : ''}`}>
      <div className="icon">{tool.icon || '🖼️'}</div>
      <div className="title">{tool.name}</div>
      <div className="desc">{tool.desc}</div>
      {tool.server ? <span className="badge">Server app</span> : null}
      <div className="actions">
        {unavailable ? (
          <a className="btn" aria-disabled="true" onClick={(e) => e.preventDefault()} href="#">Unavailable</a>
        ) : (
          <Link className="btn" href={tool.path}>Open</Link>
        )}
        {!unavailable ? (
          <Link className="btn" href={tool.path} target="_blank">New Tab</Link>
        ) : null}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <main>
      <header className="site-header">
        <div className="brand">
          <div className="logo">🖼️</div>
          <h1>Image Tools</h1>
        </div>
        <nav className="nav">
          <Link href="#">About</Link>
          <Link href="#">Contact</Link>
        </nav>
      </header>

      <section className="hero">
        <h2>Your all‑in‑one image toolkit</h2>
        <p>Use fast client-side tools and integrated server apps under one umbrella.</p>
        <div className="cta">
          <a className="btn primary" href="#tools">Browse tools</a>
        </div>
      </section>

      <div className="ad">
        <div className="ad-placeholder" title="This is a placeholder for Google AdSense">Ad Placeholder</div>
      </div>

      <section id="tools" className="tools">
        <h3>Tools</h3>
        <div className="toolbar">
          <input type="text" placeholder="Search" aria-label="Search" />
          <select aria-label="Filter">
            <option value="all">All</option>
            <option value="analyze">Analyze</option>
            <option value="edit">Edit</option>
            <option value="convert">Convert</option>
            <option value="create">Create</option>
            <option value="fun">Fun</option>
          </select>
        </div>
        <div className="grid">
          {tools.map((t) => <ToolCard key={t.id} tool={t} />)}
        </div>
      </section>

      <footer className="site-footer">© <span id="year">{new Date().getFullYear()}</span> Image Tools</footer>
    </main>
  );
}