"use client";
import React from "react";

export default function ImageResizerPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [srcUrl, setSrcUrl] = React.useState<string | null>(null);
  const [outUrl, setOutUrl] = React.useState<string | null>(null);
  const [width, setWidth] = React.useState<string>("");
  const [height, setHeight] = React.useState<string>("");
  const [format, setFormat] = React.useState<string>("png");
  const [enhance, setEnhance] = React.useState<boolean>(false);
  const [grayscale, setGrayscale] = React.useState<boolean>(false);
  const [busy, setBusy] = React.useState<boolean>(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const onPick = () => inputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setOutUrl(null);
    setSrcUrl(f ? URL.createObjectURL(f) : null);
  };

  const resize = async () => {
    if (!file) return;
    setBusy(true);
    setOutUrl(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (width) fd.append("width", width);
      if (height) fd.append("height", height);
      fd.append("format", format);
      fd.append("enhance", String(enhance));
      fd.append("grayscale", String(grayscale));
      const res = await fetch("/api/resize", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Resize failed (${res.status})`);
      }
      const blob = await res.blob();
      setOutUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      alert(err?.message || "Resize failed");
    } finally {
      setBusy(false);
    }
  };

  const downloadName = () => {
    const base = (file?.name || "resized").replace(/\.[^.]+$/, "");
    const ext = format === "jpeg" ? "jpg" : format;
    return `${base}-${width || "auto"}x${height || "auto"}.${ext}`;
  };

  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">Image Resizer</h2>
      <p className="text-base text-base-content/70 mb-5">
        Upload an image and resize on the server using high-quality processing.
      </p>

      <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="card bg-base-100 shadow">
          <div className="card-title px-4 pt-4">Source</div>
          {!srcUrl ? (
            <div className="px-4 pb-4 text-base-content/70">No image selected. Pick a file to preview.</div>
          ) : (
            <figure className="rounded-xl overflow-hidden h-64 bg-base-200 grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={srcUrl} alt="Source preview" className="max-h-full max-w-full object-contain" />
            </figure>
          )}
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-title px-4 pt-4">Output</div>
          {!outUrl ? (
            <div className="px-4 pb-4 text-base-content/70">Resized image will appear here.</div>
          ) : (
            <figure className="rounded-xl overflow-hidden h-64 bg-base-200 grid place-items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outUrl} alt="Output preview" className="max-h-full max-w-full object-contain" />
            </figure>
          )}
        </div>
      </div>

      <div className="card bg-base-100 shadow mt-4">
        <div className="card-body">
          <div className="card-title">Settings</div>
          <div className="flex flex-wrap gap-2">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            <button className="btn" onClick={onPick}>Choose File</button>
            {file && <span className="badge badge-outline">{file.name}</span>}
          </div>

          <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <label className="text-sm text-base-content/70">
              Width
              <input value={width} onChange={(e) => setWidth(e.target.value)} placeholder="e.g., 800" className="input input-bordered w-full mt-1" />
            </label>
            <label className="text-sm text-base-content/70">
              Height
              <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 600" className="input input-bordered w-full mt-1" />
            </label>
            <label className="text-sm text-base-content/70">
              Format
              <select value={format} onChange={(e) => setFormat(e.target.value)} className="select select-bordered w-full mt-1">
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WEBP</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="checkbox" checked={enhance} onChange={(e) => setEnhance(e.target.checked)} /> Enhance
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="checkbox" checked={grayscale} onChange={(e) => setGrayscale(e.target.checked)} /> Grayscale
            </label>
          </div>

          <div className="flex gap-2 mt-3">
            <button className="btn btn-primary" disabled={!file || busy} onClick={resize}>
              {busy ? "Resizing…" : "Resize"}
            </button>
            {outUrl && (
              <a className="btn" href={outUrl} download={downloadName()}>
                Download
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}