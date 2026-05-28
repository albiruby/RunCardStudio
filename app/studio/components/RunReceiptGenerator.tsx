/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, AlertCircle, Eye, FileText } from "lucide-react";

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
  const [template, setTemplate] = useState("original");
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
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)_minmax(300px,380px)] gap-6 w-full">
      {/* COLUMN 1: INPUT */}
      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="flex items-center gap-2 px-1">
          <FileText className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">INPUT PARAMETERS</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-xl flex flex-col gap-4 shadow-xl">
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

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs tracking-wider font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopyCaption} className="w-full py-2.5 bg-transparent border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:bg-gray-800" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-4 h-4 " style={{ color: activeAccent.hex }} /> COPY CAPTION</button>
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
              className={`${getExportSizeClasses(exportSize, template)}`}
            >
              <SharedTemplates 
                template={template} 
                formData={{ ...formData, pace, unit }} 
                componentName="RunReceiptGenerator" 
              />
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
          localTemplates={[]}
        />
      </div>
    </div>
  );
}