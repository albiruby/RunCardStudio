/* eslint-disable react-hooks/set-state-in-effect */
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { Copy, Save, Upload, Eye, Map } from "lucide-react";

interface RoutePosterGeneratorProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function RoutePosterGenerator({ previewRef, showToast }: RoutePosterGeneratorProps) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    distance: "",
    showStartEnd: false,
    showElevation: false
  });

  const [template, setTemplate] = useState("minimal line");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const exportSize = useExportSize();
  const activeAccentId = useTemplateAccent();
  const activeAccent = ACCENTS.find(a => a.id === activeAccentId) || ACCENTS[0];

  const [parsedData, setParsedData] = useState<{
    path: string;
    points: {x: number, y: number, ele: number | null}[];
    bounds: {minX: number, maxX: number, minY: number, maxY: number};
    eleInfo: {min: number, max: number, valid: boolean};
  } | null>(null);


  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        let target = 480;
        if (exportSize === "story") target = 400;
        else if (exportSize === "landscape") target = 640;
        else if (exportSize === "compact") target = 540;
        else if (exportSize === "printable") target = 595;
        if (width < target) {
          setScale(width / target);
        } else {
          setScale(1);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [exportSize]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.gpx') && file.type !== 'application/gpx+xml') {
      showToast("Please upload a valid GPX file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "application/xml");
        const trkpts = doc.querySelectorAll('trkpt');

        if (trkpts.length === 0) {
          showToast("No track points found in GPX file.");
          return;
        }

        const points: {lat: number, lon: number, ele: number | null}[] = [];
        let minLat = Infinity, maxLat = -Infinity;
        let minLon = Infinity, maxLon = -Infinity;
        let minEle = Infinity, maxEle = -Infinity;
        let hasEle = false;

        trkpts.forEach(pt => {
          const lat = parseFloat(pt.getAttribute('lat') || '0');
          const lon = parseFloat(pt.getAttribute('lon') || '0');
          const eleNode = pt.querySelector('ele');
          const ele = eleNode ? parseFloat(eleNode.textContent || '0') : null;

          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
          if (lon < minLon) minLon = lon;
          if (lon > maxLon) maxLon = lon;

          if (ele !== null && !isNaN(ele)) {
            hasEle = true;
            if (ele < minEle) minEle = ele;
            if (ele > maxEle) maxEle = ele;
          }

          points.push({ lat, lon, ele });
        });

        const midLat = (minLat + maxLat) / 2;
        const latRad = midLat * Math.PI / 180;
        const lonScale = Math.cos(latRad);

        let xrMin = Infinity, xrMax = -Infinity;
        let yrMin = Infinity, yrMax = -Infinity;

        const pointsRender = points.map(p => {
          const x = p.lon * lonScale;
          const y = -p.lat;
          if (x < xrMin) xrMin = x;
          if (x > xrMax) xrMax = x;
          if (y < yrMin) yrMin = y;
          if (y > yrMax) yrMax = y;
          return { x, y, ele: p.ele };
        });

        const width = 360;
        const height = 360;
        const dX = xrMax - xrMin;
        const dY = yrMax - yrMin;
        const margin = 20;

        let sc = Math.min((width - margin * 2) / (dX || 1), (height - margin * 2) / (dY || 1));

        const scaledPoints = pointsRender.map(p => ({
          x: (p.x - xrMin) * sc + (width - dX * sc) / 2,
          y: (p.y - yrMin) * sc + (height - dY * sc) / 2,
          ele: p.ele
        }));

        const pathData = scaledPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

        setParsedData({
          path: pathData,
          points: scaledPoints,
          bounds: { minX: 0, maxX: width, minY: 0, maxY: height },
          eleInfo: { min: minEle, max: maxEle, valid: hasEle }
        });
        
        showToast("GPX route loaded!");
      } catch (err) {
        showToast("Failed to parse GPX.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (e.target) e.target.value = '';
  };

  const handleCopy = () => {
    const lines = [];
    if (formData.title) lines.push(formData.title);
    if (formData.location) lines.push("Location: " + formData.location);
    if (formData.date) lines.push("Date: " + formData.date);
    if (formData.distance) lines.push("Distance: " + formData.distance);
    lines.push("");
    const textToCopy = lines.join("\n");
    
    const fallbackCopy = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast("Copied to clipboard!");
      } catch (err) {
        showToast("Failed to copy.");
      }
      textArea.remove();
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showToast("Copied to clipboard!"))
        .catch((err) => {
          fallbackCopy(textToCopy);
        });
    } else {
      fallbackCopy(textToCopy);
    }
  };

  const getPlainFormDataForCurrentCard = () => {
    return { ...formData };
  };

  const saveCurrentDraft = () => {
    const plainData = getPlainFormDataForCurrentCard();
    for (const key in plainData) {
      const val = (plainData as any)[key];
      if (typeof HTMLElement !== "undefined" && val instanceof HTMLElement) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Node !== "undefined" && val instanceof Node) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Event !== "undefined" && val instanceof Event) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof File !== "undefined" && val instanceof File) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Blob !== "undefined" && val instanceof Blob) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof val === "function") { showToast("Draft contains unsafe data and was not saved."); return; }
    }

    const pd = plainData as any;
    const title = pd.title || "Untitled Route";

    const draft = {
      id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
      cardType: "route-poster" as any, // bypassing the enum check for drafts temporarily
      title: String(title),
      template: typeof template !== 'undefined' ? template : "default",
      exportSize: typeof window !== 'undefined' ? localStorage.getItem('runcard-default-export-size') || "square" : "square",
      formData: plainData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0"
    };

    try {
      const existingStr = localStorage.getItem('runcard-drafts');
      let drafts = [];
      if (existingStr) {
        drafts = JSON.parse(existingStr);
      }
      drafts.push(draft);
      localStorage.setItem('runcard-drafts', JSON.stringify(drafts));
      showToast("Draft saved!");
    } catch(err) {
      showToast("Failed to save draft.");
    }
  };

  useEffect(() => {
    try {
       if (typeof window !== 'undefined') {
          const loadStr = localStorage.getItem('runcard-draft-load');
          if (loadStr) {
             const draft = JSON.parse(loadStr);
             if (draft && draft.cardType === "route-poster") {
                if (draft.formData) setFormData(draft.formData);
                if (draft.template && typeof setTemplate === "function") setTemplate(draft.template);
             }
          }
       }
    } catch {}
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,380px)_1fr_minmax(280px,340px)] gap-6 w-full font-sans">
      {/* COLUMN 1: POSTER DATA */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2 px-1">
          <Map className="w-3.5 h-3.5" style={{ color: activeAccent.hex }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">POSTER DATA</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-xl flex flex-col gap-4 shadow-xl">
          <div>
            <label className="block text-[11px] font-mono text-primary-coral font-bold uppercase tracking-wider mb-2">Upload GPX</label>
            <label className="w-full bg-surface-lowest border border-brand-border border-dashed hover:border-primary-action px-3 py-4 rounded text-sm text-text-muted flex flex-col items-center justify-center gap-2 cursor-pointer transition-all min-h-[80px]">
              <Upload className="w-5 h-5 text-text-muted" />
              <span className="text-xs uppercase font-bold tracking-wider">Select GPX File</span>
              <input type="file" accept=".gpx" className="hidden" onChange={handleFileUpload} />
            </label>
            {parsedData && <p className="text-[10px] uppercase font-mono mt-2" style={{ color: activeAccent.hex }}>Route loaded ✓</p>}
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Route Title</label>
             <input 
               type="text" 
               value={formData.title}
               onChange={e => handleChange("title", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Morning Loop"
             />
          </div>
          
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Location (Opt)</label>
             <input 
               type="text" 
               value={formData.location}
               onChange={e => handleChange("location", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Central Park, NY"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date (Opt)</label>
               <input 
                 type="text" 
                 value={formData.date}
                 onChange={e => handleChange("date", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Oct 12"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Distance (Opt)</label>
               <input 
                 type="text" 
                 value={formData.distance}
                 onChange={e => handleChange("distance", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="10K"
               />
             </div>
          </div>

          <div className="flex flex-col gap-3 mt-2 border-t border-brand-border pt-4">
             <label className="flex items-center gap-2 cursor-pointer group">
               <div className="relative">
                 <input 
                   type="checkbox" 
                   checked={formData.showStartEnd}
                   onChange={e => handleChange("showStartEnd", e.target.checked)}
                   className="sr-only"
                 />
                 <div className={`block w-8 h-4 rounded-full transition-colors ${formData.showStartEnd ? '' : 'bg-surface-lowest border border-brand-border'}`} style={formData.showStartEnd ? { backgroundColor: activeAccent.hex } : undefined}></div>
                 <div className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-transform ${formData.showStartEnd ? 'translate-x-4 bg-surface-lowest' : 'bg-brand-border'}`}></div>
               </div>
               <span className="text-xs uppercase font-bold text-text-muted group-hover:text-text-primary transition-colors">Show Start / End Markers</span>
             </label>

             <label className="flex items-center gap-2 cursor-pointer group">
               <div className="relative">
                 <input 
                   type="checkbox" 
                   checked={formData.showElevation}
                   onChange={e => handleChange("showElevation", e.target.checked)}
                   className="sr-only"
                 />
                 <div className={`block w-8 h-4 rounded-full transition-colors ${formData.showElevation ? '' : 'bg-surface-lowest border border-brand-border'}`} style={formData.showElevation ? { backgroundColor: activeAccent.hex } : undefined}></div>
                 <div className={`absolute left-1 top-1 w-2 h-2 rounded-full transition-transform ${formData.showElevation ? 'translate-x-4 bg-surface-lowest' : 'bg-brand-border'}`}></div>
               </div>
               <span className="text-xs uppercase font-bold text-text-muted group-hover:text-text-primary transition-colors">Show Elevation Stats</span>
             </label>
             {formData.showElevation && (!parsedData || !parsedData.eleInfo.valid) && (
               <p className="text-[10px] text-text-muted italic -mt-1 ml-10">No elevation data in GPX.</p>
             )}
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-3.5 h-3.5 text-primary-action" /> SAVE DRAFT</button>
          <button 
            onClick={handleCopy} 
            className="w-full py-2.5 bg-transparent border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:bg-gray-800"
            style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}
          ><Copy className="w-3.5 h-3.5" style={{ color: activeAccent.hex }} /> COPY ROUTE INFO</button>
        </div>
      </div>

      {/* COLUMN 2: LIVE PREVIEW */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] xl:self-start">
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" style={{ color: activeAccent.hex }} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">LIVE PREVIEW</span>
          </div>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">REPRESENTS COMPLETED CANVAS</p>
        </div>

        {/* Scalable Container for preview */}
        <div ref={containerRef} className="w-full bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:16px_16px] bg-[#07080a] border border-brand-border rounded-xl p-4 md:p-8 flex items-center justify-center min-h-[500px] xl:min-h-[550px] overflow-hidden relative shadow-inner">
          <div 
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: "center",
              transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)" 
            }}
            className="shrink-0"
          >
            <div
              ref={previewRef}
              className={`${getExportSizeClasses(exportSize, template)}` + ` flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden
                ${template === 'minimal line' ? 'bg-[#f4f4f5] border border-[#e4e4e7] text-[#18181b]' : ''}
                ${template === 'dark route' ? 'bg-[#181a1f] border border-[#22252a] text-[#f2f4f7]' : ''}
                ${template === 'race route' ? 'bg-[#111316] border-2 text-white' : ''}
              `}
              style={{ 
                minHeight: '550px',
                borderColor: template === 'race route' ? activeAccent.hex : undefined 
              }}
            >
              {template === 'minimal line' && (
                <div className="flex-1 flex flex-col p-8 font-sans">
                   <div className="flex-1 border p-2 flex items-center justify-center">
                      {parsedData ? (
                         <svg viewBox="0 0 360 360" className="w-[320px] h-[320px] stroke-[#18181b] overflow-visible">
                            <path d={parsedData.path} fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                            {formData.showStartEnd && parsedData.points.length > 0 && (
                              <>
                                <circle cx={parsedData.points[0].x} cy={parsedData.points[0].y} r="6" fill={activeAccent.hex} stroke="#18181b" strokeWidth="2" />
                                <circle cx={parsedData.points[parsedData.points.length-1].x} cy={parsedData.points[parsedData.points.length-1].y} r="6" fill="#ff0055" stroke="#18181b" strokeWidth="2" />
                              </>
                            )}
                         </svg>
                      ) : (
                        <div className="text-gray-400 font-bold uppercase tracking-widest text-xs opacity-50">Upload GPX</div>
                      )}
                   </div>
                   <div className="mt-8">
                     <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">{formData.title || 'ROUTE TITLE'}</h1>
                     <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                        {formData.location && <span>{formData.location}</span>}
                        {formData.date && <span>{formData.date}</span>}
                     </div>
                     
                     <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-300">
                       {formData.distance ? (
                         <div className="text-4xl font-black uppercase" style={{ color: activeAccent.hex }}>{formData.distance}</div>
                       ) : <div></div>}
                       
                       {formData.showElevation && parsedData?.eleInfo.valid && (
                          <div className="text-right">
                             <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Max Ele</div>
                             <div className="text-sm font-black text-gray-600">{Math.round(parsedData.eleInfo.max)}m</div>
                          </div>
                       )}
                     </div>
                   </div>
                </div>
                )}

              {template === 'dark route' && (
                <div className="flex-1 flex flex-col p-8 font-mono relative">
                   <div className="absolute top-0 right-0 bg-[#22252a] text-[9px] uppercase tracking-widest px-3 py-1 font-bold" style={{ color: activeAccent.hex }}>ROUTE DATA</div>
                   
                   <div className="mb-6 z-10 pt-4">
                     <h1 className="text-3xl font-black text-[#f2f4f7] tracking-tight uppercase leading-none mb-2">{formData.title || 'UNKNOWN ROUTE'}</h1>
                     <div className="text-xs text-gray-500 uppercase tracking-widest flex flex-col gap-1">
                        {formData.location && <span>LOC: {formData.location}</span>}
                        {formData.date && <span>DAT: {formData.date}</span>}
                     </div>
                   </div>

                   <div className="flex-1 flex items-center justify-center relative">
                      <div className="absolute w-[240px] h-[240px] border border-[#22252a] rounded-full opacity-30"></div>
                      <div className="absolute w-[360px] h-[360px] border-l border-r border-[#22252a] opacity-20"></div>
                      <div className="absolute w-[360px] h-[360px] border-t border-b border-[#22252a] opacity-20"></div>
                      {parsedData ? (
                         <svg viewBox="0 0 360 360" className="w-[340px] h-[340px] z-10 overflow-visible" style={{ stroke: activeAccent.hex, filter: `drop-shadow(0 0 8px ${activeAccent.hex}80)` }}>
                            <path d={parsedData.path} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            {formData.showStartEnd && parsedData.points.length > 0 && (
                              <>
                                <circle cx={parsedData.points[0].x} cy={parsedData.points[0].y} r="5" fill="#f2f4f7" stroke="#181a1f" strokeWidth="2" />
                                <circle cx={parsedData.points[parsedData.points.length-1].x} cy={parsedData.points[parsedData.points.length-1].y} r="5" fill="#ff0055" stroke="#181a1f" strokeWidth="2" />
                              </>
                            )}
                         </svg>
                      ) : (
                        <div className="text-[#22252a] font-bold uppercase tracking-widest text-xs z-10">NO DATA</div>
                      )}
                   </div>

                   <div className="mt-8 flex justify-between items-end border-t border-[#22252a] pt-4">
                     <div>
                       <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">TOTAL DST</div>
                       <div className="text-2xl font-black text-white">{formData.distance || '-'}</div>
                     </div>
                     
                     {formData.showElevation && parsedData?.eleInfo.valid && (
                        <div className="text-right">
                           <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">ELEVATION MAX</div>
                           <div className="text-xl font-bold font-sans text-white">{Math.round(parsedData.eleInfo.max)}m</div>
                        </div>
                     )}
                   </div>
                </div>
             )}

              {template === 'race route' && (
                <div className="flex-1 flex flex-col relative bg-[#111316]">
                   <div className="h-4 bg-[#ff0055] w-full"></div>
                   <div className="p-8 flex-1 flex flex-col font-sans">
                     
                     <div className="flex justify-between items-start mb-6">
                       <div>
                          <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1 text-white">{formData.title || 'RACE ROUTE'}</h1>
                          <div className="text-xs font-bold uppercase tracking-widest text-[#f2f4f7] mb-1">
                             {formData.location || 'UNKNOWN LOCATION'} {formData.date ? ` // ${formData.date}` : ''}
                          </div>
                       </div>
                       <div className="bg-[#22252a] border border-[#3f3f46] p-2 text-center rounded w-20">
                         <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">DST</div>
                         <div className="text-sm font-black uppercase" style={{ color: activeAccent.hex }}>{formData.distance || '-'}</div>
                       </div>
                     </div>

                     <div className="flex-1 flex items-center justify-center bg-[#07080a] border border-[#22252a] rounded overflow-hidden">
                        {parsedData ? (
                           <svg viewBox="0 0 360 360" className="w-[320px] h-[320px] stroke-[#ff0055] overflow-visible">
                              <path d={parsedData.path} fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                              {formData.showStartEnd && parsedData.points.length > 0 && (
                                <>
                                  <circle cx={parsedData.points[0].x} cy={parsedData.points[0].y} r="6" fill={activeAccent.hex} stroke="#07080a" strokeWidth="3" />
                                  <circle cx={parsedData.points[parsedData.points.length-1].x} cy={parsedData.points[parsedData.points.length-1].y} r="6" fill="white" stroke="#07080a" strokeWidth="3" />
                                </>
                              )}
                           </svg>
                        ) : (
                          <div className="text-[#3f3f46] font-black uppercase tracking-widest text-sm opacity-50">Upload GPX</div>
                        )}
                     </div>

                     {formData.showElevation && parsedData?.eleInfo.valid && (
                       <div className="mt-4 flex gap-4 border-t border-[#22252a] pt-4">
                         <div className="flex-1 text-center">
                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-widest">Min Ele</div>
                            <div className="text-sm font-black">{Math.round(parsedData.eleInfo.min)}m</div>
                         </div>
                         <div className="flex-1 text-center border-l border-[#22252a]">
                            <div className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-widest">Max Ele</div>
                            <div className="text-sm font-black">{Math.round(parsedData.eleInfo.max)}m</div>
                         </div>
                       </div>
                     )}

                     <div className="mt-8 text-center text-[9px] font-mono tracking-widest text-gray-600 uppercase opacity-50">
                     </div>

                   </div>
                </div>
                )}
            {!['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) && (
  <div className={`mt-auto text-center font-mono text-[9px] tracking-[0.25em] uppercase pt-4 border-t ${
    ['community challenge', 'weekly board', 'clean white', 'minimal award', 'minimal nutrition', 'minimal gear', 'classic', 'elite', 'receipt', 'white', 'table', 'minimal'].includes(template) 
      ? 'border-dashed border-gray-400 text-gray-400' 
      : 'border-dashed border-brand-border opacity-40 text-white'
  }`}>
    {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
  </div>
)}

{['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) && (
              <SharedTemplates template={template} formData={formData} componentName="RoutePosterGenerator" extraData={{ parsedData }} />
            )}
            </div>
          </div>

          {/* Centered Ratio Dock */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#090b0e]/95 backdrop-blur border border-brand-border/85 px-2 py-1.5 rounded-full flex items-center gap-1 shadow-[0_8px_24px_rgba(0,0,0,0.6)] z-10 hover:border-brand-border-strong transition-all">
            {[
              { id: "square", label: "1:1 Feed" },
              { id: "story", label: "9:16 Story" },
              { id: "landscape", label: "16:9 Classic" },
              { id: "compact", label: "Fit" },
              { id: "printable", label: "PDF/A4" }
            ].map((ratio) => {
              const isActive = exportSize === ratio.id;
              return (
                <button
                  key={ratio.id}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('runcard-default-export-size', ratio.id);
                      window.dispatchEvent(new CustomEvent('export-size-changed', { detail: ratio.id }));
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase transition-all cursor-pointer outline-none focus:outline-none whitespace-nowrap
                    ${isActive 
                      ? 'bg-secondary-lime text-black shadow-[0_0_8px_rgba(160,204,0,0.4)] font-extrabold' 
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-lowest/50'}`}
                  style={isActive ? { backgroundColor: activeAccent.hex } : undefined}
                >
                  {ratio.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* COLUMN 3: STYLE CONTROLS */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px]">
        <div className="flex flex-col gap-0.5 px-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">STYLE CONTROLS</span>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Tweak appearance</p>
        </div>
        
        <TemplateSelector 
          activeTemplate={template}
          onSelectTemplate={setTemplate}
          localTemplates={[
            {
              "id": "minimal line",
              "label": "Minimal Line"
            },
            {
              "id": "dark route",
              "label": "Dark Route"
            },
            {
              "id": "race route",
              "label": "Race Route"
            }
          ]}
        />
      </div>
    </div>
  );
}
