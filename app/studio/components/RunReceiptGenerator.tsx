/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector from './TemplateSelector';
import { Copy, Save, AlertCircle } from "lucide-react";

interface RunReceiptProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';

export default function RunReceiptGenerator({ previewRef, showToast }: RunReceiptProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    distance: "",
    duration: "",
    location: "",
    rpe: "5",
    mood: "",
    weather: "",
    win: "",
    damage: "",
    notes: ""
  });

  const unit = getUnit();
  const [template, setTemplate] = useState("carbon");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const exportSize = useExportSize();


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

        // Apply scaling factor with a small padding allowance
        const boundsTarget = target + 16;
        if (width < boundsTarget) {
          setScale(width / boundsTarget);
        } else {
          setScale(1);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [exportSize]);

  // Validation helpers
  const isDistanceInvalid = formData.distance !== "" && (parseFloat(formData.distance) <= 0 || isNaN(parseFloat(formData.distance)));
  const isDurationInvalid = formData.duration !== "" && !/^(?:(?:\d+:)?([0-5]?\d):)?([0-5]?\d)$/.test(formData.duration);

  const getPaceValue = () => {
    const dist = parseFloat(formData.distance || "10.00");
    const dur = formData.duration || "00:48:30";
    if (isNaN(dist) || dist <= 0 || !dur) return "4:51";
    
    const parts = dur.split(":");
    let totalSeconds = 0;
    if (parts.length === 3) {
      totalSeconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    } else if (parts.length === 2) {
      totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 1) {
      totalSeconds = parseInt(parts[0]);
    } else {
      return "—";
    }

    if (isNaN(totalSeconds) || totalSeconds <= 0) return "—";

    const secondsPerKm = totalSeconds / dist;
    const mins = Math.floor(secondsPerKm / 60);
    const secs = Math.floor(secondsPerKm % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };
  const handleCopyCaption = () => {
    const lines = [];
    if (formData.name !== undefined && formData.name !== null && (formData.name as any) !== false && (formData.name as any) !== "—" && (formData.name as any) !== "Input required" && String(formData.name).trim() !== "") {
      const val = typeof formData.name === 'boolean' ? 'Yes' : formData.name;
      lines.push("Name: " + val);
    }
    if (formData.date !== undefined && formData.date !== null && (formData.date as any) !== false && (formData.date as any) !== "—" && (formData.date as any) !== "Input required" && String(formData.date).trim() !== "") {
      const val = typeof formData.date === 'boolean' ? 'Yes' : formData.date;
      lines.push("Date: " + val);
    }
    if (formData.distance !== undefined && formData.distance !== null && (formData.distance as any) !== false && (formData.distance as any) !== "—" && (formData.distance as any) !== "Input required" && String(formData.distance).trim() !== "") {
      const val = typeof formData.distance === 'boolean' ? 'Yes' : formData.distance;
      lines.push("Distance: " + val);
    }
    if (formData.duration !== undefined && formData.duration !== null && (formData.duration as any) !== false && (formData.duration as any) !== "—" && (formData.duration as any) !== "Input required" && String(formData.duration).trim() !== "") {
      const val = typeof formData.duration === 'boolean' ? 'Yes' : formData.duration;
      lines.push("Duration: " + val);
    }
    if (formData.location !== undefined && formData.location !== null && (formData.location as any) !== false && (formData.location as any) !== "—" && (formData.location as any) !== "Input required" && String(formData.location).trim() !== "") {
      const val = typeof formData.location === 'boolean' ? 'Yes' : formData.location;
      lines.push("Location: " + val);
    }
    if (formData.rpe !== undefined && formData.rpe !== null && (formData.rpe as any) !== false && (formData.rpe as any) !== "—" && (formData.rpe as any) !== "Input required" && String(formData.rpe).trim() !== "") {
      const val = typeof formData.rpe === 'boolean' ? 'Yes' : formData.rpe;
      lines.push("Rpe: " + val);
    }
    if (formData.mood !== undefined && formData.mood !== null && (formData.mood as any) !== false && (formData.mood as any) !== "—" && (formData.mood as any) !== "Input required" && String(formData.mood).trim() !== "") {
      const val = typeof formData.mood === 'boolean' ? 'Yes' : formData.mood;
      lines.push("Mood: " + val);
    }
    if (formData.weather !== undefined && formData.weather !== null && (formData.weather as any) !== false && (formData.weather as any) !== "—" && (formData.weather as any) !== "Input required" && String(formData.weather).trim() !== "") {
      const val = typeof formData.weather === 'boolean' ? 'Yes' : formData.weather;
      lines.push("Weather: " + val);
    }
    if (formData.win !== undefined && formData.win !== null && (formData.win as any) !== false && (formData.win as any) !== "—" && (formData.win as any) !== "Input required" && String(formData.win).trim() !== "") {
      const val = typeof formData.win === 'boolean' ? 'Yes' : formData.win;
      lines.push("Win: " + val);
    }
    if (formData.damage !== undefined && formData.damage !== null && (formData.damage as any) !== false && (formData.damage as any) !== "—" && (formData.damage as any) !== "Input required" && String(formData.damage).trim() !== "") {
      const val = typeof formData.damage === 'boolean' ? 'Yes' : formData.damage;
      lines.push("Damage: " + val);
    }
    if (formData.notes !== undefined && formData.notes !== null && (formData.notes as any) !== false && (formData.notes as any) !== "—" && (formData.notes as any) !== "Input required" && String(formData.notes).trim() !== "") {
      const val = typeof formData.notes === 'boolean' ? 'Yes' : formData.notes;
      lines.push("Notes: " + val);
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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pace = getPaceValue();


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
      cardType: "run-receipt",
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
             if (draft && draft.cardType === "run-receipt") {
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: FORM (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Run Parameters</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Runner Name</label>
               <input 
                 type="text" 
                 value={formData.name}
                 onChange={e => handleChange("name", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
                 placeholder="ATHLETE RUNNER"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date</label>
               <input 
                 type="date" 
                 value={formData.date}
                 onChange={e => handleChange("date", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Distance ({unit})</label>
               <input 
                 type="number" 
                 step="0.01"
                 value={formData.distance}
                 onChange={e => handleChange("distance", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary outline-none transition-colors ${isDistanceInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="10.00"
               />
               {isDistanceInvalid && (
                 <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> Positive number
 </p>
 )}
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Duration</label>
               <input 
                 type="text" 
                 value={formData.duration}
                 onChange={e => handleChange("duration", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors ${isDurationInvalid ? 'border-primary-coral focus:border-primary-coral font-mono' : 'border-brand-border focus:border-secondary-lime font-mono'}`}
                 placeholder="00:48:30"
               />
               {isDurationInvalid && ( <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1"> <AlertCircle className="w-3 h-3" /> MM:SS or HH:MM:SS </p> )}
          </div>
        </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Location</label>
             <input 
               type="text" 
               value={formData.location}
               onChange={e => handleChange("location", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               placeholder="OCEANFRONT PARKWAY"
             />
          </div>

          <div>
             <label className="flex justify-between items-end text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">
               <span>RPE (Effort Level)</span>
               <span className="text-secondary-lime font-bold">{formData.rpe} / 10</span>
             </label>
             <input 
               type="range" 
               min="1" max="10"
               value={formData.rpe}
               onChange={e => handleChange("rpe", e.target.value)}
               className="w-full accent-secondary-lime cursor-ew-resize py-1"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Mood</label>
               <select 
                 value={formData.mood}
                 onChange={e => handleChange("mood", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               >
                 <option value="">Smooth (Default)</option>
                 <option value="Strong">Strong</option>
                 <option value="Tired">Tired</option>
                 <option value="Smooth">Smooth</option>
                 <option value="Struggle">Struggle</option>
                 <option value="Zen">Zen</option>
               </select>
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Weather</label>
               <select 
                 value={formData.weather}
                 onChange={e => handleChange("weather", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               >
                 <option value="">Sunny (Default)</option>
                 <option value="Sunny">Sunny</option>
                 <option value="Cloudy">Cloudy</option>
                 <option value="Rain">Rain</option>
                 <option value="Windy">Windy</option>
                 <option value="Humid">Humid</option>
               </select>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Main Win</label>
               <input 
                 type="text" 
                 value={formData.win}
                 onChange={e => handleChange("win", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
                 placeholder="e.g. FAST FINAL KM"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Main Damage</label>
               <input 
                 type="text" 
                 value={formData.damage}
                 onChange={e => handleChange("damage", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
                 placeholder="e.g. NONE / ZERO"
               />
             </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Notes</label>
             <textarea 
               value={formData.notes}
               onChange={e => handleChange("notes", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-20 transition-colors"
               placeholder="PACE WAS SOLID. FELT VERY SMOOTH THROUGH THE HILLS."
             ></textarea>
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopyCaption} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY CAPTION
</button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6 lg:sticky lg:top-[128px] lg:self-start mb-24 lg:mb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#f2f4f7] shrink-0">Live Preview</h2>
          <TemplateSelector 
            activeTemplate={template}
            onSelectTemplate={setTemplate}
            localTemplates={[
  {
    "id": "carbon",
    "label": "Thermal Receipt"
  },
  {
    "id": "thermal",
    "label": "Neon Sport"
  },
  {
    "id": "neon",
    "label": "Dark Carbon Receipt"
  }
]}
          />
        </div>

        {/* Scalable Container for preview */}
        <div ref={containerRef} className="w-full bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:16px_16px] bg-[#07080a] border border-brand-border rounded-xl p-4 md:p-8 flex items-center justify-center min-h-[600px] overflow-hidden relative">
          {/* Card Component matching selected template */}
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
              className={`${getExportSizeClasses(exportSize, template)}` + `  flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none
                ${template === 'carbon' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] p-6 rounded-lg' : ''}
                ${template === 'thermal' ? 'bg-[#f4f4f5] text-[#18181b] p-8 border-t-8 border-[#18181b] shadow-none rounded-none' : ''}
                ${template === 'neon' ? 'bg-[#020203] text-[#fafafa] p-6 border-2 border-secondary-lime shadow-[0_0_40px_rgba(204,255,0,0.15)] rounded-md' : ''}
              `}
            >
              {/* Header */}
              <div className={`mb-6 pb-4 border-b ${template === 'carbon' ? 'border-[#22252a]' : template === 'thermal' ? 'border-[#d4d4d8]' : 'border-secondary-lime/30'}`}>
                 <div className="flex justify-between items-start mb-2">
                   <h3 className={`font-mono font-bold text-xl uppercase ${template === 'neon' ? 'text-secondary-lime' : ''}`}>
                     {formData.name.trim() || 'ATHLETE RUNNER'}
                   </h3>
                   <div className="text-right">
                     <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest">Date</p>
                     <p className="font-mono text-sm font-bold uppercase">{formData.date || new Date().toISOString().split('T')[0]}</p>
                   </div>
                 </div>
                 <div className="flex justify-between">
                   <div>
                     <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest">Location</p>
                     <p className="font-mono text-xs uppercase font-bold">{formData.location.trim() || 'OCEANFRONT PARKWAY'}</p>
                   </div>
                 </div>
              </div>

              {/* Main Stats */}
              <div className="mb-6">
                 <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest mb-1">Distance</p>
                 <h1 className={`font-mono text-6xl font-extrabold tracking-tighter mb-4 ${template === 'neon' ? 'text-secondary-lime' : template === 'carbon' ? 'text-text-primary' : 'text-black'}`}>
                   {formData.distance || '10.00'}<span className="text-lg opacity-60 ml-1.5 lowercase">{unit}</span>
                 </h1>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest mb-1">Time</p>
                     <p className="font-mono text-2xl font-black">{formData.duration || '00:48:30'}</p>
                   </div>
                   <div>
                     <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest mb-1">Avg Pace</p>
                     <p className="font-mono text-2xl font-black text-primary-coral">
                       {pace}<span className="text-xs opacity-60 font-medium ml-1">/{unit}</span>
                     </p>
                   </div>
                 </div>
              </div>

              {/* Additional Metrics */}
              <div className={`mb-6 py-4 border-y ${template === 'carbon' ? 'border-[#22252a]' : template === 'thermal' ? 'border-[#d4d4d8] border-dashed' : 'border-secondary-lime/30'}`}>
                 <div className="grid grid-cols-2 gap-y-3 font-mono text-xs">
                   <div className="flex justify-between col-span-2">
                     <span className="opacity-60 uppercase">RPE (EFFORT)</span>
                     <span className="font-black text-secondary-lime">{formData.rpe}/10</span>
                   </div>
                   <div className="flex justify-between col-span-2">
                     <span className="opacity-60 uppercase">Runner Mood</span>
                     <span className="font-bold uppercase text-primary-coral">{formData.mood || 'SMOOTH'}</span>
                   </div>
                   <div className="flex justify-between col-span-2">
                     <span className="opacity-60 uppercase">Weather</span>
                     <span className="font-bold uppercase">{formData.weather || 'SUNNY'}</span>
                   </div>
                 </div>
              </div>

              {/* Notes / Highlights */}
              <div className="mb-8 font-mono text-xs pb-4">
                <div className="grid grid-cols-2 gap-4 mb-4 uppercase">
                  <div>
                    <p className="opacity-60 mb-1 text-[9px] tracking-wider">Primary Win</p>
                    <p className="font-bold text-text-primary truncate">{formData.win.trim() || 'FAST FINAL KM'}</p>
                  </div>
                  <div>
                    <p className="opacity-60 mb-1 text-[9px] tracking-wider">Damage Report</p>
                    <p className="font-bold text-text-primary truncate">{formData.damage.trim() || 'NONE / ZERO'}</p>
                  </div>
                </div>
                <div className="uppercase">
                   <p className="opacity-60 mb-1 text-[9px] tracking-wider">Coach/Athlete Notes</p>
                   <p className="font-bold text-text-primary leading-relaxed text-[11px]">{formData.notes.trim() || 'PACE WAS SOLID. FELT VERY SMOOTH THROUGH THE HILLS.'}</p>
                </div>
              </div>

              {/* Footer / Watermark */}
              
              {/* Thermal bottom edge effect */}
              {template === 'thermal' && (
                <div className="absolute -bottom-2 left-0 right-0 h-4 bg-[#f4f4f5]" style={{ clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)' }}>
</div>
              )}
           {!['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
  <div className={`mt-auto text-center font-mono text-[9px] tracking-[0.25em] uppercase pt-4 border-t ${
    ['community challenge', 'weekly board', 'clean white', 'minimal award', 'minimal nutrition', 'minimal gear', 'classic', 'elite', 'receipt', 'white', 'table', 'minimal'].includes(template) 
      ? 'border-dashed border-gray-400 text-gray-400' 
      : 'border-dashed border-brand-border opacity-40 text-white'
  }`}>
    {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
  </div>
)}

{['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="RunReceiptGenerator"  />
           )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}