"use client";
import { useEffect } from 'react';

export default function OcrPage() {
  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@latest/dist/tesseract.min.js';
    s.async = true;
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, []);

  useEffect(() => {
    // Basic init message; the tool logic is inlined via the original script below
  }, []);

  return (
    <main className="app" aria-label="Image OCR Extractor">
      <header className="app-header">
        <h1>Image OCR Extractor</h1>
        <p className="subtitle">All processing happens in your browser; no data is sent externally.</p>
      </header>

      <section className="grid">
        <div className="left">
          <section className="upload">
            <div id="dropArea" className="drop-area" tabIndex={0} aria-label="Drag and drop image here or click to upload">
              <button id="uploadBtn" className="btn upload" type="button" aria-label="Upload Image">
                <span className="icon">📤</span> Upload Image
              </button>
              <input id="fileInput" type="file" accept="image/png, image/jpeg, image/jpg, image/bmp, image/gif" className="visually-hidden" />
              <div className="note">Supported: PNG, JPG, JPEG, BMP, GIF • Max 10MB</div>
            </div>
            <div id="errorMessage" className="error" role="alert" aria-live="polite"></div>
          </section>

          <section className="preview">
            <h2 className="section-title">Preview</h2>
            <canvas id="previewCanvas" aria-label="Image preview"></canvas>
          </section>

          <section className="options">
            <h2 className="section-title">Options</h2>
            <label htmlFor="languageSelect">Language</label>
            <select id="languageSelect" aria-label="Select OCR language">
              <option value="eng" defaultValue="eng">English</option>
              <option value="spa">Spanish</option>
              <option value="fra">French</option>
              <option value="deu">German</option>
              <option value="ita">Italian</option>
              <option value="por">Portuguese</option>
            </select>
            <label htmlFor="engineSelect">Engine</label>
            <select id="engineSelect" aria-label="Select OCR engine">
              <option value="local" defaultValue="local">Local (Tesseract.js)</option>
              <option value="cloud">Cloud (OCR.space)</option>
            </select>
            <div id="apiKeyRow" style={{ display:'none', marginTop:8 }}>
              <label htmlFor="apiKey">OCR.space API Key</label>
              <input id="apiKey" type="text" placeholder="Enter OCR.space API key" aria-label="OCR.space API key" />
              <div className="note">Cloud OCR sends the image to OCR.space for recognition.</div>
            </div>
            <div className="actions">
              <button id="extractBtn" className="btn primary" type="button" aria-label="Extract Text"><span className="icon">🔎</span> Extract Text</button>
              <div id="progress" className="progress" aria-live="polite" aria-label="OCR progress"></div>
            </div>
          </section>
        </div>

        <div className="right">
          <section className="output">
            <h2 className="section-title">Extracted Text</h2>
            <textarea id="outputText" className="output-text" placeholder="Extracted text will appear here" aria-label="Extracted text" spellCheck={false}></textarea>
            <div className="actions">
              <button id="copyBtn" className="btn success" type="button" aria-label="Copy text"><span className="icon">📋</span> Copy Text</button>
              <button id="downloadBtn" className="btn violet" type="button" aria-label="Download text"><span className="icon">⬇️</span> Download .txt</button>
              <button id="clearBtn" className="btn" type="button" aria-label="Clear"><span className="icon">🧹</span> Clear</button>
            </div>
          </section>
        </div>
      </section>

      {/* Inline original client script */}
      <script dangerouslySetInnerHTML={{ __html: `(${clientScript.toString()})()` }} />
    </main>
  );
}

function clientScript() {
  // Minimal bridge: reuse the existing non-React script by injecting it
  // from the original tool folder structure.
  (function(){
    const dropArea = document.getElementById('dropArea');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const errorMessage = document.getElementById('errorMessage');
    const previewCanvas = document.getElementById('previewCanvas');
    const languageSelect = document.getElementById('languageSelect');
    const engineSelect = document.getElementById('engineSelect');
    const apiKeyInput = document.getElementById('apiKey');
    const apiKeyRow = document.getElementById('apiKeyRow');
    const extractBtn = document.getElementById('extractBtn');
    const progressEl = document.getElementById('progress');
    const outputText = document.getElementById('outputText');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');

    let currentFile = null;
    let objectUrl = null;
    let ocrWorker = null;
    let workerLang = null;

    function setError(msg){ errorMessage.textContent = msg || '' }
    function setProgress(msg){ progressEl.textContent = msg || '' }
    function clearUI(){ setError(''); setProgress(''); outputText.value=''; currentFile=null; if(objectUrl){ URL.revokeObjectURL(objectUrl); objectUrl=null;} const ctx=previewCanvas.getContext('2d'); ctx.clearRect(0,0,previewCanvas.width,previewCanvas.height); previewCanvas.width=0; previewCanvas.height=0; }
    const ALLOWED_TYPES = new Set(['image/jpeg','image/png','image/gif','image/bmp']);
    function isValidFile(file){ if(!file) return false; if(file.size>10*1024*1024){ setError('File too large. Max 10MB.'); return false; } if(!file.type||!file.type.startsWith('image/')){ setError('Please upload an image file.'); return false; } const type=file.type==='image/jpg'?'image/jpeg':file.type; if(!ALLOWED_TYPES.has(type)){ setError('Unsupported format. Use PNG, JPG/JPEG, BMP, or GIF.'); return false; } return true; }
    async function drawPreview(file){ if(objectUrl) URL.revokeObjectURL(objectUrl); objectUrl=URL.createObjectURL(file); const img=new Image(); img.src=objectUrl; await img.decode(); const maxW=600; const ratio=Math.min(1, maxW/img.naturalWidth); const w=Math.round(img.naturalWidth*ratio); const h=Math.round(img.naturalHeight*ratio); previewCanvas.width=w; previewCanvas.height=h; const ctx=previewCanvas.getContext('2d'); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high'; ctx.drawImage(img,0,0,w,h); }
    async function handleFile(file){ if(!isValidFile(file)){ clearUI(); return; } setError(''); currentFile=file; await drawPreview(file); }
    function preventDefaults(e){ e.preventDefault(); e.stopPropagation(); }
    ['dragenter','dragover','dragleave','drop'].forEach(evt=>{ dropArea.addEventListener(evt,preventDefaults); });
    dropArea.addEventListener('dragover',()=>{ dropArea.classList.add('dragover'); });
    dropArea.addEventListener('dragleave',()=>{ dropArea.classList.remove('dragover'); });
    dropArea.addEventListener('drop',(e)=>{ dropArea.classList.remove('dragover'); const dt=e.dataTransfer; const files=dt?.files; if(files&&files[0]) handleFile(files[0]); });
    dropArea.addEventListener('click',(e)=>{ const fromUploadBtn = e.target && (e.target.id==='uploadBtn' || (e.target.closest && e.target.closest('#uploadBtn'))); if(fromUploadBtn) return; fileInput.click(); });
    uploadBtn.addEventListener('click',(e)=>{ e.stopPropagation(); fileInput.click(); });
    fileInput.addEventListener('change',()=>{ const file=fileInput.files&&fileInput.files[0]; if(file) handleFile(file); });

    async function runOCR(){
      if(!currentFile || previewCanvas.width===0){ setError('Please upload an image first.'); return; }
      setError(''); setProgress('Initializing...'); const lang = (languageSelect.value||'eng');
      async function ensureWorker(language){ if(!window.Tesseract || typeof window.Tesseract.createWorker!=='function'){ throw new Error('worker_not_supported'); } if(!ocrWorker){ ocrWorker = await window.Tesseract.createWorker(); if(typeof ocrWorker.load==='function'){ await ocrWorker.load(); } else { throw new Error('worker_methods_missing'); } } if(workerLang!==language){ setProgress('Initializing language...'); if(typeof ocrWorker.loadLanguage==='function'){ await ocrWorker.loadLanguage(language); } if(typeof ocrWorker.initialize==='function'){ await ocrWorker.initialize(language); } else { throw new Error('worker_initialize_missing'); } if(typeof ocrWorker.setParameters==='function'){ await ocrWorker.setParameters({ tessedit_pageseg_mode: '4', user_defined_dpi: '300', preserve_interword_spaces: '1' }); } workerLang=language; } }
      async function getProcessedCanvas(){ try{ if(!objectUrl) return previewCanvas; const img=new Image(); img.src=objectUrl; await img.decode(); const targetMaxW=1200; const scale=Math.min(2, targetMaxW/img.naturalWidth); const w=Math.round(img.naturalWidth*scale); const h=Math.round(img.naturalHeight*scale); const c=document.createElement('canvas'); c.width=w; c.height=h; const ctx=c.getContext('2d'); ctx.imageSmoothingEnabled=scale<1; ctx.imageSmoothingQuality=scale<1?'high':'low'; ctx.drawImage(img,0,0,w,h); let imgData=ctx.getImageData(0,0,w,h); let d=imgData.data; let sumY=0; for(let i=0;i<d.length;i+=4){ const y=0.299*d[i]+0.587*d[i+1]+0.114*d[i+2]; d[i]=d[i+1]=d[i+2]=y; sumY+=y; } ctx.putImageData(imgData,0,0); const blur=ctx.getImageData(0,0,w,h); const bd=blur.data; const kernel=[1,1,1,1,1,1,1,1,1]; const kw=3,kh=3,ksum=9; const src=new Uint8ClampedArray(d); for(let y=1;y<h-1;y++){ for(let x=1;x<w-1;x++){ let acc=0; let ki=0; for(let ky=-1;ky<=1;ky++){ for(let kx=-1;kx<=1;kx++){ const sx=x+kx; const sy=y+ky; const si=(sy*w+sx)*4; acc+=src[si]*kernel[ki++]; } } const bi=(y*w+x)*4; const by=acc/ksum; const oy=src[bi]; const ny=Math.max(0, Math.min(255, oy + 0.5*(oy - by))); bd[bi]=bd[bi+1]=bd[bi+2]=ny; bd[bi+3]=255; } } ctx.putImageData(blur,0,0); imgData=ctx.getImageData(0,0,w,h); d=imgData.data; const hist=new Array(256).fill(0); for(let i=0;i<d.length;i+=4){ hist[d[i]|0]++; } let total=w*h; let sum=0; for(let t=0;t<256;t++) sum+=t*hist[t]; let sumB=0,wB=0,wF=0,varMax=0,threshold=128; for(let t=0;t<256;t++){ wB+=hist[t]; if(wB===0) continue; wF=total-wB; if(wF===0) break; sumB+=t*hist[t]; const mB=sumB/wB; const mF=(sum-sumB)/wF; const betweenVar=wB*wF*(mB-mF)*(mB-mF); if(betweenVar>varMax){ varMax=betweenVar; threshold=t; } } for(let i=0;i<d.length;i+=4){ const v=d[i]>threshold?255:0; d[i]=d[i+1]=d[i+2]=v; d[i+3]=255; } const avgY=sumY/(w*h); if(avgY<128){ for(let i=0;i<d.length;i+=4){ d[i]=255-d[i]; d[i+1]=255-d[i+1]; d[i+2]=255-d[i+2]; } } ctx.putImageData(imgData,0,0); return c; } catch { return previewCanvas; } }
      try{
        const processedCanvas = await getProcessedCanvas();
        const dataUrl = processedCanvas.toDataURL('image/png');
        const engine = (engineSelect?.value || 'local');
        if(engine==='cloud'){
          setProgress('Uploading to cloud OCR...');
          const apiKey = (apiKeyInput?.value || '').trim();
          if(!apiKey){ setError('API key required for Cloud OCR.'); setProgress(''); return; }
          const form = new FormData();
          form.append('base64Image', dataUrl);
          form.append('language', (languageSelect.value||'eng'));
          form.append('isOverlayRequired','false');
          form.append('OCREngine','2');
          const resp = await fetch('https://api.ocr.space/parse/image', { method:'POST', headers:{ 'apikey': apiKey }, body: form });
          if(!resp.ok) throw new Error('Cloud OCR request failed');
          const json = await resp.json();
          const parsed = json?.ParsedResults?.[0]?.ParsedText || '';
          outputText.value = parsed;
          setProgress('');
          return;
        }
        await ensureWorker(languageSelect.value||'eng');
        let result;
        try{
          result = await ocrWorker.recognize(dataUrl);
        } catch(workerErr){
          result = await window.Tesseract.recognize(dataUrl, (languageSelect.value||'eng'), { tessedit_pageseg_mode:'4', user_defined_dpi:'300', preserve_interword_spaces:'1', logger: m => { if(m.status && typeof m.progress==='number'){ const pct=Math.round(m.progress*100); setProgress(`${m.status} ${pct}%`); } else if(m.status){ setProgress(m.status); } } });
        }
        const text = (result && result.data && result.data.text) ? result.data.text : '';
        if(!text.trim()){ setError('No text detected.'); }
        outputText.value = text;
        setProgress('');
      } catch(err){ console.error(err); setError('Error processing image.'); setProgress(''); }
    }
    extractBtn.addEventListener('click', runOCR);
    async function copyText(){ const text=outputText.value||''; if(!text.trim()){ setError('No text to copy.'); return; } try{ if(navigator.clipboard && navigator.clipboard.writeText){ await navigator.clipboard.writeText(text); } else { const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);} setError(''); setProgress('Copied to clipboard.'); setTimeout(()=>setProgress(''),1500);} catch(e){ setError('Copy failed.'); } }
    copyBtn.addEventListener('click', copyText);
    function downloadTxt(){ const text=outputText.value||''; if(!text.trim()){ setError('No text to download.'); return; } const blob=new Blob([text], { type:'text/plain' }); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='extracted-text.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(()=>URL.revokeObjectURL(url),0); }
    downloadBtn.addEventListener('click', downloadTxt);
    clearBtn.addEventListener('click', async ()=>{ clearUI(); fileInput.value=''; try{ if(ocrWorker){ await ocrWorker.terminate(); } } catch{} ocrWorker=null; workerLang=null; });
    clearUI();
    engineSelect?.addEventListener('change', ()=>{ const useCloud = engineSelect.value==='cloud'; apiKeyRow.style.display = useCloud? 'block':'none'; });
  })();
}