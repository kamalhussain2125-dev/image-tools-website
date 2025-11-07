"use client";
import React from "react";

export default function PdfToWordPage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const onPick = () => inputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setError(null);
  };

  const convert = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const pdfjs: any = await import("pdfjs-dist");
      const { getDocument } = pdfjs;
      const ab = await file.arrayBuffer();
      const pdf = await getDocument({ data: new Uint8Array(ab), disableWorker: true }).promise;
      let textContent = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const tx = await page.getTextContent();
        const pageText = tx.items
          .map((it: any) => (typeof it.str === "string" ? it.str : ""))
          .filter(Boolean)
          .join(" ");
        if (pageText.trim()) {
          textContent += (textContent ? "\n\n" : "") + pageText;
        }
      }
      if (!textContent.trim()) {
        throw new Error("No text found in PDF");
      }

      const res = await fetch("/api/convert-text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: textContent }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Conversion failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "") + ".docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err?.message || "Failed to convert");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-2">PDF to Word</h2>
      <p className="text-base text-base-content/70 mb-5">
        Extracts text locally with PDF.js and generates a DOCX on the server.
      </p>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="card-title">Select PDF</div>
          <div className="flex flex-wrap gap-2">
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={onFileChange} />
            <button className="btn" onClick={onPick}>Choose File</button>
            {file && <span className="badge badge-outline">{file.name}</span>}
          </div>
          <div className="flex items-center gap-3 mt-3">
            <button className="btn btn-primary" disabled={!file || busy} onClick={convert}>
              {busy ? "Converting…" : "Convert to DOCX"}
            </button>
            {error && <span className="text-error">{error}</span>}
          </div>
        </div>
      </div>
    </main>
  );
}