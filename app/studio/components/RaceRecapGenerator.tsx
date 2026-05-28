/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, AlertCircle, Eye, FileText } from "lucide-react";

interface RaceRecapProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';

export default function RaceRecapGenerator({ previewRef, showToast }: RaceRecapProps) {
  const [formData, setFormData] = useState({
    raceName: "",
    distance: "",
    finishTime: "",
    manualPaceToggle: false,
    avgPace: "",
    date: "",
    location: "",
    rank: "",
    bestMoment: "",
    nextTarget: ""
  });

  const unit = getUnit();
  const [template, setTemplate] = useState("carbon");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const exportSize = useExportSize();
  const activeAccentId = useTemplateAccent();
  const activeAccent = ACCENTS.find(a => a.id === activeAccentId) || ACCENTS[0];

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

        // Apply scale with padding bounds
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

  // Validation
  const isDistanceInvalid = formData.distance !== "" && (isNaN(parseFloat(formData.distance)) || parseFloat(formData.distance) <= 0);
  const isDurationInvalid = formData.finishTime !== "" && !/^(?:(?:\d+:)?([0-5]?\d):)?([0-5]?\d)$/.test(formData.finishTime);

  const getPaceValue = () => {
    if (formData.manualPaceToggle) {
       return formData.avgPace || `4:38/${unit}`;
    }

    const distStr = formData.distance || "42.2";
    const dist = parseFloat(distStr);
    const timeStr = formData.finishTime || "03:15:24";
    if (isNaN(dist) || dist <= 0 || !timeStr) return `4:38/${unit}`;
    
    const parts = timeStr.split(":");
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
    return `${mins}:${secs}/${unit}`;
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyRecap = () => {
    const lines = [];
    if (formData.raceName !== undefined && formData.raceName !== null && (formData.raceName as any) !== false && (formData.raceName as any) !== "—" && (formData.raceName as any) !== "Input required" && String(formData.raceName).trim() !== "") {
      const val = typeof formData.raceName === 'boolean' ? 'Yes' : formData.raceName;
      lines.push("Race Name: " + val);
    }
    if (formData.distance !== undefined && formData.distance !== null && (formData.distance as any) !== false && (formData.distance as any) !== "—" && (formData.distance as any) !== "Input required" && String(formData.distance).trim() !== "") {
      const val = typeof formData.distance === 'boolean' ? 'Yes' : formData.distance;
      lines.push("Distance: " + val);
    }
    if (formData.finishTime !== undefined && formData.finishTime !== null && (formData.finishTime as any) !== false && (formData.finishTime as any) !== "—" && (formData.finishTime as any) !== "Input required" && String(formData.finishTime).trim() !== "") {
      const val = typeof formData.finishTime === 'boolean' ? 'Yes' : formData.finishTime;
      lines.push("Finish Time: " + val);
    }
    if (formData.manualPaceToggle !== undefined && formData.manualPaceToggle !== null && (formData.manualPaceToggle as any) !== false && (formData.manualPaceToggle as any) !== "—" && (formData.manualPaceToggle as any) !== "Input required" && String(formData.manualPaceToggle).trim() !== "") {
      const val = typeof formData.manualPaceToggle === 'boolean' ? 'Yes' : formData.manualPaceToggle;
      lines.push("Manual Pace Toggle: " + val);
    }
    if (formData.avgPace !== undefined && formData.avgPace !== null && (formData.avgPace as any) !== false && (formData.avgPace as any) !== "—" && (formData.avgPace as any) !== "Input required" && String(formData.avgPace).trim() !== "") {
      const val = typeof formData.avgPace === 'boolean' ? 'Yes' : formData.avgPace;
      lines.push("Avg Pace: " + val);
    }
    if (formData.date !== undefined && formData.date !== null && (formData.date as any) !== false && (formData.date as any) !== "—" && (formData.date as any) !== "Input required" && String(formData.date).trim() !== "") {
      const val = typeof formData.date === 'boolean' ? 'Yes' : formData.date;
      lines.push("Date: " + val);
    }
    if (formData.location !== undefined && formData.location !== null && (formData.location as any) !== false && (formData.location as any) !== "—" && (formData.location as any) !== "Input required" && String(formData.location).trim() !== "") {
      const val = typeof formData.location === 'boolean' ? 'Yes' : formData.location;
      lines.push("Location: " + val);
    }
    if (formData.rank !== undefined && formData.rank !== null && (formData.rank as any) !== false && (formData.rank as any) !== "—" && (formData.rank as any) !== "Input required" && String(formData.rank).trim() !== "") {
      const val = typeof formData.rank === 'boolean' ? 'Yes' : formData.rank;
      lines.push("Rank: " + val);
    }
    if (formData.bestMoment !== undefined && formData.bestMoment !== null && (formData.bestMoment as any) !== false && (formData.bestMoment as any) !== "—" && (formData.bestMoment as any) !== "Input required" && String(formData.bestMoment).trim() !== "") {
      const val = typeof formData.bestMoment === 'boolean' ? 'Yes' : formData.bestMoment;
      lines.push("Best Moment: " + val);
    }
    if (formData.nextTarget !== undefined && formData.nextTarget !== null && (formData.nextTarget as any) !== false && (formData.nextTarget as any) !== "—" && (formData.nextTarget as any) !== "Input required" && String(formData.nextTarget).trim() !== "") {
      const val = typeof formData.nextTarget === 'boolean' ? 'Yes' : formData.nextTarget;
      lines.push("Next Target: " + val);
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

  const currentPace = getPaceValue();

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
      cardType: "race-recap",
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
             if (draft && draft.cardType === "race-recap") {
                if (draft.formData) setFormData(draft.formData);
                if (draft.template && typeof setTemplate === "function") setTemplate(draft.template);
             }
          }
       }
    } catch {}
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,380px)_1fr_minmax(280px,340px)] gap-6 w-full">
      {/* COLUMN 1: INPUT */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2 px-1">
          <FileText className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">INPUT PARAMETERS</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-xl flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Race Name</label>
             <input 
               type="text" 
               value={formData.raceName}
               onChange={e => handleChange("raceName", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               placeholder="CHICAGO MARATHON"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Distance ({unit})</label>
               <input 
                 type="text" 
                 value={formData.distance}
                 onChange={e => handleChange("distance", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary outline-none transition-colors ${isDistanceInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="42.2"
               />
               {isDistanceInvalid && ( <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1"> <AlertCircle className="w-3 h-3" /> Parseable number required </p> )}
             </div>
             <div> <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Finish Time</label>
               <input 
                 type="text" 
                 value={formData.finishTime}
                 onChange={e => handleChange("finishTime", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary outline-none transition-colors ${isDurationInvalid ? 'border-primary-coral focus:border-primary-coral font-mono' : 'border-brand-border focus:border-secondary-lime font-mono'}`}
                 placeholder="03:15:24"
               />
               {isDurationInvalid && (
                 <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> MM:SS or HH:MM:SS
                 </p>
               )}
               </div>
          </div>

          <div className="border border-brand-border rounded p-3 bg-surface-lowest">
            <label className="flex items-center gap-2 mb-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={formData.manualPaceToggle}
                onChange={e => handleChange("manualPaceToggle", e.target.checked)}
                className="accent-secondary-lime w-4 h-4"
              />
              <span className="text-[11px] font-mono text-text-muted uppercase tracking-wider">Manual Pace Override</span>
            </label>
            {formData.manualPaceToggle && (
              <input 
                type="text" 
                value={formData.avgPace}
                onChange={e => handleChange("avgPace", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none font-mono"
                placeholder={`e.g. 4:38 /${unit}`}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date</label>
               <input 
                 type="date" 
                 value={formData.date}
                 onChange={e => handleChange("date", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Location</label>
               <input 
                 type="text" 
                 value={formData.location}
                 onChange={e => handleChange("location", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
                 placeholder="CHICAGO, IL"
               />
             </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Rank / Category</label>
             <input 
               type="text" 
               value={formData.rank}
               onChange={e => handleChange("rank", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
               placeholder="PR (#246)"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Best Moment</label>
             <textarea 
               value={formData.bestMoment}
               onChange={e => handleChange("bestMoment", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="CROWD YELLING AT MILE 20 GAVE ME A SECOND WIND."
             ></textarea>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Next Target</label>
             <input 
               type="text" 
               value={formData.nextTarget}
               onChange={e => handleChange("nextTarget", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
               placeholder="SUB 3:10 AT BOSTON"
             />
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs tracking-wider font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopyRecap} className="w-full py-2.5 bg-transparent border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:bg-gray-800" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-4 h-4 " style={{ color: activeAccent.hex }} /> COPY RECAP</button>
        </div>
      </div>

      {/* COLUMN 2: LIVE PREVIEW */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] xl:self-start">
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} />
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">LIVE PREVIEW</h2>
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
              className={`${getExportSizeClasses(exportSize, template)}`}
            >
              <SharedTemplates 
                template={template} 
                formData={{ 
                  ...formData, 
                  averagePace: currentPace, 
                  unit
                }}
                componentName="RaceRecapGenerator" 
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

      {/* COLUMN 3: STYLE CONTROLS */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px]">
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
