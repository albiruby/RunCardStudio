/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, AlertCircle, Eye, FileText } from "lucide-react";

interface PaceBandProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

const DISTANCES = {
  "5K": 5,
  "10K": 10,
  "Half Marathon": 21.0975,
  "Marathon": 42.195,
  "Custom": 0,
};

const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';

export default function PaceBandGenerator({ previewRef, showToast }: PaceBandProps) {
  const [formData, setFormData] = useState({
    distanceChoice: "Marathon",
    customDistance: "",
    hr: "",
    min: "",
    sec: "",
    interval: "5"
  });

  const unit = getUnit();
  const [template, setTemplate] = useState("wristband");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const exportSize = useExportSize();
  const activeAccentId = useTemplateAccent();
  const activeAccent = ACCENTS.find(a => a.id === activeAccentId) || ACCENTS[0];

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        let targetW = 480;
        let targetH = 480;
        if (exportSize === "story") { targetW = 400; targetH = 711; }
        else if (exportSize === "landscape") { targetW = 640; targetH = 360; }
        else if (exportSize === "compact") { targetW = 540; targetH = 283; }
        else if (exportSize === "printable") { targetW = 595; targetH = 842; }

        // We leave 48px horizontal padding, and 100px vertical padding (for the ratio dock and top spacing)
        const scaleW = width / (targetW + 48);
        const scaleH = height / (targetH + 110);
        const newScale = Math.min(scaleW, scaleH, 1); // Cap at 1
        
        setScale(newScale);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [exportSize, template]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDistance = () => {
    if (formData.distanceChoice === "Custom") {
      return parseFloat(formData.customDistance) || 0;
    }
    return DISTANCES[formData.distanceChoice as keyof typeof DISTANCES] || 0;
  };

  // Validation
  const hrVal = parseInt(formData.hr);
  const minVal = parseInt(formData.min);
  const secVal = parseInt(formData.sec);
  const isTimeInvalid = isNaN(hrVal) || isNaN(minVal) || isNaN(secVal) || hrVal < 0 || minVal < 0 || minVal >= 60 || secVal < 0 || secVal >= 60;

  const calculateSplits = () => {
    const dist = getDistance();
    const h = isNaN(hrVal) ? 0 : hrVal;
    const m = isNaN(minVal) ? 0 : minVal;
    const s = isNaN(secVal) ? 0 : secVal;
    const totalSeconds = h * 3600 + m * 60 + s;
    const interval = parseFloat(formData.interval) || 5;

    if (dist <= 0 || totalSeconds <= 0 || interval <= 0) return [];

    const splits = [];
    const avgSecondsPerKm = totalSeconds / dist;
    
    let currentMarker = interval;
    while (currentMarker < dist) {
       splits.push({
         marker: currentMarker,
         cumTime: currentMarker * avgSecondsPerKm
       });
       currentMarker += interval;
    }

    // Final fraction
    splits.push({
      marker: dist,
      cumTime: totalSeconds
    });

    return splits;
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "—";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatPace = (secsPerKm: number) => {
    if (isNaN(secsPerKm) || secsPerKm <= 0) return "—";
    const m = Math.floor(secsPerKm / 60);
    const s = Math.floor(secsPerKm % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const splits = calculateSplits();
  const dist = getDistance();
  const rawSecs = (isNaN(hrVal) ? 0 : hrVal) * 3600 + (isNaN(minVal) ? 0 : minVal) * 60 + (isNaN(secVal) ? 0 : secVal);
  const avgPaceSecs = dist > 0 ? rawSecs / dist : 0;

  const handleCopy = () => {
    const lines = [];
    if (formData.distanceChoice !== undefined && formData.distanceChoice !== null && (formData.distanceChoice as any) !== false && (formData.distanceChoice as any) !== "—" && (formData.distanceChoice as any) !== "Input required" && String(formData.distanceChoice).trim() !== "") {
      const val = typeof formData.distanceChoice === 'boolean' ? 'Yes' : formData.distanceChoice;
      lines.push("Distance Choice: " + val);
    }
    if (formData.customDistance !== undefined && formData.customDistance !== null && (formData.customDistance as any) !== false && (formData.customDistance as any) !== "—" && (formData.customDistance as any) !== "Input required" && String(formData.customDistance).trim() !== "") {
      const val = typeof formData.customDistance === 'boolean' ? 'Yes' : formData.customDistance;
      lines.push("Custom Distance: " + val);
    }
    if (formData.hr !== undefined && formData.hr !== null && (formData.hr as any) !== false && (formData.hr as any) !== "—" && (formData.hr as any) !== "Input required" && String(formData.hr).trim() !== "") {
      const val = typeof formData.hr === 'boolean' ? 'Yes' : formData.hr;
      lines.push("Hr: " + val);
    }
    if (formData.min !== undefined && formData.min !== null && (formData.min as any) !== false && (formData.min as any) !== "—" && (formData.min as any) !== "Input required" && String(formData.min).trim() !== "") {
      const val = typeof formData.min === 'boolean' ? 'Yes' : formData.min;
      lines.push("Min: " + val);
    }
    if (formData.sec !== undefined && formData.sec !== null && (formData.sec as any) !== false && (formData.sec as any) !== "—" && (formData.sec as any) !== "Input required" && String(formData.sec).trim() !== "") {
      const val = typeof formData.sec === 'boolean' ? 'Yes' : formData.sec;
      lines.push("Sec: " + val);
    }
    if (formData.interval !== undefined && formData.interval !== null && (formData.interval as any) !== false && (formData.interval as any) !== "—" && (formData.interval as any) !== "Input required" && String(formData.interval).trim() !== "") {
      const val = typeof formData.interval === 'boolean' ? 'Yes' : formData.interval;
      lines.push("Interval: " + val);
    }
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
    const title = pd.name || pd.title || pd.athleteName || pd.sessionName || pd.runnerName || pd.raceName || pd.sessionType || pd.distanceChoice || "Untitled Draft";

    const draft = {
      id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
      cardType: "pace-band",
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
             if (draft && draft.cardType === "pace-band") {
                if (draft.formData) setFormData(draft.formData);
                if (draft.template && typeof setTemplate === "function") setTemplate(draft.template);
                // Template is loaded if the form has a template state.
                // We'll just check if setTemplate exists in this code.
             }
          }
       }
    } catch {}
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)_minmax(300px,380px)] gap-6 w-full">
      {/* COLUMN 1: INPUT */}
      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Pace Band Configuration</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
            <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Event Distance</label>
            <select 
              value={formData.distanceChoice}
              onChange={e => handleChange("distanceChoice", e.target.value)}
              className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary font-mono focus:border-secondary-lime outline-none cursor-pointer"
            >
              <option value="5K">5K (5.0k)</option>
              <option value="10K">10K (10.0k)</option>
              <option value="Half Marathon">Half Marathon (21.1k)</option>
              <option value="Marathon">Marathon (42.2k)</option>
              <option value="Custom">Custom Distance</option>
            </select>
          </div>

          {formData.distanceChoice === "Custom" && (
            <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Custom Distance ({unit})</label>
              <input 
                type="number" 
                step="0.1"
                value={formData.customDistance}
                onChange={e => handleChange("customDistance", e.target.value)}
                className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary font-mono outline-none border-brand-border focus:border-secondary-lime`}
                placeholder="e.g. 15.0"
              />
                        </div>
              )}
<div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Target Finish Time</label>
             <div className="flex items-center gap-2">
               <div className="w-full relative">
                 <input 
                   type="text" 
                   maxLength={2}
                   value={formData.hr}
                   onChange={e => handleChange("hr", e.target.value)}
                   className={`w-full bg-surface-lowest border p-2 pt-4 pb-1 rounded text-center text-xl font-bold font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                   placeholder="03"
                 />
                 <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono opacity-50 uppercase font-black">HR</span>
               </div>
               <div className="w-full relative">
                 <input 
                   type="text" 
                   maxLength={2}
                   value={formData.min}
                   onChange={e => handleChange("min", e.target.value)}
                   className={`w-full bg-surface-lowest border p-2 pt-4 pb-1 rounded text-center text-xl font-bold font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                   placeholder="30"
                 />
                 <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono opacity-50 uppercase font-black">MIN</span>
               </div>
               <div className="w-full relative">
                 <input 
                   type="text" 
                   maxLength={2}
                   value={formData.sec}
                   onChange={e => handleChange("sec", e.target.value)}
                   className={`w-full bg-surface-lowest border p-2 pt-4 pb-1 rounded text-center text-xl font-bold font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                   placeholder="00"
                 />
                 <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono opacity-50 uppercase font-black">SEC</span>
               </div>
             </div>
             {isTimeInvalid && (
               <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                 <AlertCircle className="w-3.5 h-3.5" /> Please check MM/SS constraints (00-59)
 </p>
 )}

                  </div>

           <div className="flex justify-between items-center py-2.5 border-b border-[#22252a] mb-2 font-mono text-sm uppercase">
            <span className="text-text-muted text-xs">Required Pace:</span>
            <span className="font-black text-secondary-lime">{formatPace(avgPaceSecs)}/{unit}</span>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Split Interval</label>
             <div className="grid grid-cols-2 gap-2">
               <button 
                 onClick={() => handleChange("interval", "1")}
                 className={`py-2 rounded font-mono font-bold uppercase transition-all border text-xs cursor-pointer ${formData.interval === "1" ? 'bg-secondary-lime text-surface-lowest border-secondary-lime font-black' : 'bg-surface-lowest text-text-muted border-brand-border hover:border-text-muted'}`}
               >
                 1 {unit}
               </button>
               <button 
                 onClick={() => handleChange("interval", "5")}
                 className={`py-2 rounded font-mono font-bold uppercase transition-all border text-xs cursor-pointer ${formData.interval === "5" ? 'bg-secondary-lime text-surface-lowest border-secondary-lime font-black' : 'bg-surface-lowest text-text-muted border-brand-border hover:border-text-muted'}`}
               >
                 5 {unit}
               </button>
             </div>
          </div>
          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-3.5 h-3.5 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2.5 bg-transparent border hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} /> COPY PACE BAND</button>
        </div>
      </div>

      {/* COLUMN 2: LIVE PREVIEW */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] xl:self-start min-h-[calc(100vh-140px)] min-w-0">
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} />
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">LIVE PREVIEW</h2>
          </div>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">REPRESENTS COMPLETED CANVAS</p>
        </div>

        {/* Scalable Container for preview */}
        <div ref={containerRef} className="w-full bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:16px_16px] bg-[#07080a] border border-brand-border rounded-xl p-4 md:p-8 flex items-center justify-center flex-1 min-h-[500px] xl:min-h-[600px] relative shadow-inner overflow-clip">
          
          {/* Wrapper to handle different layouts */}
          <div 
            style={{ 
              transform: `scale(${scale})`, 
              transformOrigin: "center",
              transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)" 
            }}
            className="shrink-0"
          >
            <div ref={previewRef} className={`relative flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 select-none
               ${template === 'wristband' ? 'w-[140px] bg-white text-black min-h-[350px] border border-gray-300 rounded' : ''}
               ${template === 'phone lockscreen' ? 'w-[320px] h-[640px] bg-[#090b0e] text-white border-4 border-[#22252a] rounded-[2.5rem]' : ''}
               ${template === 'printable a4' ? 'w-[595px] min-h-[800px] bg-white text-black p-8 border border-gray-350' : ''}
            `}>
              
              {template === 'wristband' && (
                 <div className="w-full flex flex-col font-mono text-[10px] uppercase">
                   <div className="bg-black text-white text-center py-3.5 px-1 pb-2">
                     <div className="uppercase font-bold mb-1 opacity-80 text-[8px] tracking-wider">{formData.distanceChoice === 'Custom' ? 'Custom Dist' : formData.distanceChoice}</div>
                     <div className="text-xl font-black mb-1.5 leading-none">{(formData.hr.padStart(2, '0'))}:{(formData.min.padStart(2, '0'))}:{(formData.sec.padStart(2, '0'))}
        </div>
                     <div className="text-[8px] text-secondary-lime font-black">PACE {formatPace(avgPaceSecs)}</div>
                   </div>
                   <div className="flex border-b border-black text-center font-bold bg-gray-100 font-mono text-[9px] py-1">
                     <div className="w-1/3 border-r border-black">{unit.toUpperCase()}</div>
                     <div className="w-2/3">CUM TIME</div>
                   </div>
                   <div className="flex flex-col">
                     {splits.map((s, i) => (
                       <div key={i} className="flex border-b border-gray-200 text-center font-mono py-1">
                         <div className="w-1/3 border-r border-gray-200 font-black flex items-center justify-center text-gray-800">
                           {s.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(1)) : s.marker}
                         </div>
                         <div className={`w-2/3 flex items-center justify-center text-black font-medium ${i === splits.length - 1 ? 'text-primary-coral font-black' : ''}`}>
                           {formatTime(s.cumTime)}</div>
                       </div>
                     ))}
        </div>
                   <div className="py-2.5 text-center text-[7px] opacity-40 uppercase tracking-widest bg-gray-50 flex flex-col items-center justify-center pt-5 pb-3">
                     <span>Wristband</span>
                   </div>
                 </div>
                               )}

            {['wristband', 'phone lockscreen', 'printable a4'].includes(template) ? (
               <div className="absolute bottom-2 left-0 right-0 text-center font-mono text-[9px] tracking-[0.25em] uppercase opacity-40 text-gray-400">
                {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
              </div>
            ) : (
              <SharedTemplates template={template} formData={formData} componentName="PaceBandGenerator" extraData={{ splits: typeof calculateSplits === "function" ? calculateSplits() : undefined }} />
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
                      ? 'text-black font-extrabold' 
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

      {/* COLUMN 3: STYLE & CONTROLS */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] min-w-0">
        <div className="flex flex-col gap-0.5 px-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">STYLE CONTROLS</span>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Tweak appearance</p>
        </div>
        
        <TemplateSelector 
          activeTemplate={template}
          onSelectTemplate={setTemplate}
          localTemplates={[
            {
              "id": "wristband",
              "label": "Wristband"
            },
            {
              "id": "phone lockscreen",
              "label": "Phone Lockscreen"
            },
            {
              "id": "printable a4",
              "label": "Printable A4"
            }
          ]}
        />
      </div>
    </div>
  );
}