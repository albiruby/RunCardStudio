import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, Save, AlertCircle } from "lucide-react";

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

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        let target = 360; // default for phone lockscreen
        if (template === 'wristband') {
          target = 160;
        } else if (template === 'printable a4') {
          target = 630;
        }
        if (width < target) {
          setScale(width / target);
        } else {
          setScale(1);
        }
      }
    });
    observer.observe(containerRef.current);
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
    lines.push("Made with RunCard Studio");
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
  return () => observer.disconnect();
  }, [template]);

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
    lines.push("Made with RunCard Studio");
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* LEFT: FORM (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full">
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
          
          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full mt-2 py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY PACE BAND
</button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-0 pb-20">
        <div className="flex items-center justify-start border-b border-brand-border mb-4 overflow-x-auto no-scrollbar">
            {['wristband', 'phone lockscreen', 'printable a4'].map(t => (
              <button 
                key={t}
                onClick={() => setTemplate(t)}
                className={`py-3 px-4 text-xs font-bold font-mono uppercase whitespace-nowrap transition-all border-b-2 cursor-pointer
                  ${template === t ? 'border-primary-coral text-text-primary' : 'border-transparent text-text-muted hover:text-text-primary hover:bg-surface-lowest'}`}
              >
                {t}
              </button>
            ))}
        </div>

        {/* Scalable Container for preview */}
        <div ref={containerRef} className="w-full bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:16px_16px] bg-[#07080a] border border-brand-border rounded-xl p-4 md:p-8 flex items-center justify-center min-h-[600px] overflow-hidden relative">
          
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
                     <div className="text-xl font-black mb-1.5 leading-none">{(formData.hr.padStart(2, '0'))}:{(formData.min.padStart(2, '0'))}:{(formData.sec.padStart(2, '0'))}</div>
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
                           {formatTime(s.cumTime)}
                         </div>
                       </div>
                     ))}
                   </div>
                   <div className="py-2.5 text-center text-[7px] opacity-40 uppercase tracking-widest bg-gray-50 flex flex-col items-center justify-center pt-5 pb-3">
                     <span>Wristband</span>
                     <span className="font-extrabold">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</span>
                   </div>
                 </div>
              )}

              {template === 'phone lockscreen' && (
                 <div className="w-full h-full flex flex-col font-sans relative p-6">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#1a2f4c]/20 to-transparent pointer-events-none"></div>
                    
                    {/* Simulated visual clock on phone lockscreen top area */}
                    <div className="h-28 flex flex-col items-center justify-center border-b border-white/5 pb-2">
                      <p className="text-xs uppercase tracking-widest text-white/40 font-mono">Simulated Lockscreen</p>
                      <p className="text-2xl font-black tracking-tight text-white/90">05:08 AM</p>
                    </div>

                    <div className="flex-1 flex flex-col pt-4">
                       <div className="mb-6">
                         <h1 className="text-secondary-lime font-mono text-[10px] uppercase tracking-[0.2em] mb-1 font-bold">Planned Target: {formatPace(avgPaceSecs)}/{unit.toUpperCase()}</h1>
                         <div className="text-3xl font-black font-mono text-white mb-0.5 leading-none shadow-sm pb-1 border-b border-white/10 flex justify-between items-baseline">
                           <span>{(formData.hr.padStart(2, '0'))}:{(formData.min.padStart(2, '0'))}:{(formData.sec.padStart(2, '0'))}</span>
                           <span className="text-sm uppercase text-primary-coral tracking-[0.1em] font-sans font-bold">{formData.distanceChoice === 'Custom' ? (formData.customDistance || '21.1') + 'KM' : formData.distanceChoice}</span>
                         </div>
                       </div>
                       
                       <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex-1 flex flex-col min-h-[300px]">
                         <div className="grid grid-cols-2 bg-white/5 py-2.5 px-4 text-[9px] font-mono text-white/50 uppercase tracking-widest border-b border-white/10">
                           <div>Distance</div>
                           <div className="text-right">Split Time</div>
                         </div>
                         <div className="overflow-y-auto flex-1 px-4 pb-4 pt-1 space-y-0.5 no-scrollbar">
                           {splits.filter((s,i) => formData.interval === '1' ? (i % 5 === 4 || i === splits.length - 1) : true).map((s, i) => (
                             <div key={i} className="flex justify-between items-center py-2.5 text-white font-mono border-b border-white/5 last:border-0">
                                <span className="font-extrabold text-[#f3f4f6] text-sm">
                                  {s.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(1)) : s.marker} 
                                  <span className="text-[10px] opacity-40 font-normal ml-0.5">{unit}</span>
                                </span>
                                <span className={`text-base font-black text-white ${s.marker === dist ? 'text-secondary-lime' : ''}`}>{formatTime(s.cumTime)}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                    </div>

                    <div className="mt-4 text-center text-[7px] font-mono uppercase tracking-[0.25em] opacity-30 pb-1">
                       {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}
                    </div>
                 </div>
              )}

              {template === 'printable a4' && (
                 <div className="w-full flex flex-col font-sans text-black">
                   <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-8">
                     <div>
                       <h1 className="text-4xl font-extrabold uppercase tracking-tighter leading-none">{formData.distanceChoice === 'Custom' ? (formData.customDistance || '21.1') + ' ' + unit : formData.distanceChoice}</h1>
                       <p className="text-base uppercase opacity-70 tracking-widest mt-1.5 font-semibold">Pace Band Chart // Target Goal</p>
                     </div>
                     <div className="text-right">
                       <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Target Pace</p>
                       <p className="font-mono text-2xl font-black bg-black text-white px-3 py-1.5 inline-block mt-1">{formatPace(avgPaceSecs)}/{unit}</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8">
                     <div className="w-full font-mono text-xs">
                        <div className="flex bg-black text-white font-black mb-2 py-2 px-3 text-[10px] tracking-wider">
                          <div className="w-1/2">DISTANCE ({unit.toUpperCase()})</div>
                          <div className="w-1/2 text-right font-black">TARGET TIME</div>
                        </div>
                        
                        {splits.slice(0, Math.ceil(splits.length / 2)).map((s, i) => (
                          <div key={i} className={`flex border-b border-gray-300 py-1.5 ${s.marker === dist ? 'bg-gray-100 font-bold border-b-2 border-black' : ''}`}>
                            <div className="w-1/2 px-3 font-semibold">{s.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(1)) : s.marker}</div>
                            <div className="w-1/2 px-3 text-right">{formatTime(s.cumTime)}</div>
                          </div>
                        ))}
                     </div>
                     
                     {splits.length > 0 && (
                       <div className="w-full font-mono text-xs">
                          <div className="flex bg-black text-white font-black mb-2 py-2 px-3 text-[10px] tracking-wider font-mono">
                            <div className="w-1/2">DISTANCE ({unit.toUpperCase()})</div>
                            <div className="w-1/2 text-right">TARGET TIME</div>
                          </div>
                          
                          {splits.slice(Math.ceil(splits.length / 2)).map((s, i) => (
                            <div key={i} className={`flex border-b border-gray-300 py-1.5 ${s.marker === dist ? 'bg-gray-100 font-bold border-b-2 border-black' : ''}`}>
                              <div className="w-1/2 px-3 font-semibold">{s.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(1)) : s.marker}</div>
                              <div className="w-1/2 px-3 text-right">{formatTime(s.cumTime)}</div>
                            </div>
                          ))}
                       </div>
                     )}
                   </div>

                   <div className="mt-16 text-center text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 pt-6 border-t border-dashed border-gray-300">
                     {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'Generated by RunCard Studio - runcard.studio'}
                   </div>
                 </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-text-muted bg-surface-lowest px-2 py-1 rounded border border-brand-border z-15 pointer-events-none opacity-40 uppercase tracking-widest font-bold">
             Scale: {(scale * 100).toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
