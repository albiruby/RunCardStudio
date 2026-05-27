/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector from './TemplateSelector';
import { Copy, Save, AlertCircle, Eye } from "lucide-react";

interface WorkoutCardProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function WorkoutCardGenerator({ previewRef, showToast }: WorkoutCardProps) {
  const [formData, setFormData] = useState({
    title: "",
    sport: "Running",
    warmup: "",
    mainSet: "",
    rest: "",
    cooldown: "",
    targetIntensity: "",
    notes: ""
  });

  const [template, setTemplate] = useState("original");
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


  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  const handleCopyWorkout = () => {
    const lines = [];
    if (formData.title !== undefined && formData.title !== null && (formData.title as any) !== false && (formData.title as any) !== "—" && (formData.title as any) !== "Input required" && String(formData.title).trim() !== "") {
      const val = typeof formData.title === 'boolean' ? 'Yes' : formData.title;
      lines.push("Title: " + val);
    }
    if (formData.sport !== undefined && formData.sport !== null && (formData.sport as any) !== false && (formData.sport as any) !== "—" && (formData.sport as any) !== "Input required" && String(formData.sport).trim() !== "") {
      const val = typeof formData.sport === 'boolean' ? 'Yes' : formData.sport;
      lines.push("Sport: " + val);
    }
    if (formData.warmup !== undefined && formData.warmup !== null && (formData.warmup as any) !== false && (formData.warmup as any) !== "—" && (formData.warmup as any) !== "Input required" && String(formData.warmup).trim() !== "") {
      const val = typeof formData.warmup === 'boolean' ? 'Yes' : formData.warmup;
      lines.push("Warmup: " + val);
    }
    if (formData.mainSet !== undefined && formData.mainSet !== null && (formData.mainSet as any) !== false && (formData.mainSet as any) !== "—" && (formData.mainSet as any) !== "Input required" && String(formData.mainSet).trim() !== "") {
      const val = typeof formData.mainSet === 'boolean' ? 'Yes' : formData.mainSet;
      lines.push("Main Set: " + val);
    }
    if (formData.rest !== undefined && formData.rest !== null && (formData.rest as any) !== false && (formData.rest as any) !== "—" && (formData.rest as any) !== "Input required" && String(formData.rest).trim() !== "") {
      const val = typeof formData.rest === 'boolean' ? 'Yes' : formData.rest;
      lines.push("Rest: " + val);
    }
    if (formData.cooldown !== undefined && formData.cooldown !== null && (formData.cooldown as any) !== false && (formData.cooldown as any) !== "—" && (formData.cooldown as any) !== "Input required" && String(formData.cooldown).trim() !== "") {
      const val = typeof formData.cooldown === 'boolean' ? 'Yes' : formData.cooldown;
      lines.push("Cooldown: " + val);
    }
    if (formData.targetIntensity !== undefined && formData.targetIntensity !== null && (formData.targetIntensity as any) !== false && (formData.targetIntensity as any) !== "—" && (formData.targetIntensity as any) !== "Input required" && String(formData.targetIntensity).trim() !== "") {
      const val = typeof formData.targetIntensity === 'boolean' ? 'Yes' : formData.targetIntensity;
      lines.push("Target Intensity: " + val);
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
      cardType: "workout-card",
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
             if (draft && draft.cardType === "workout-card") {
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
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,380px)_1fr_minmax(280px,340px)] gap-6 w-full">
      {/* COLUMN 1: INPUT */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">WORKOUT PLAN</h2>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Log details</p>
          </div>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Workout Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => handleChange("title", e.target.value)}
                  className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                  placeholder="5x1k VO2Max Intervals"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Sport Type</label>
                <select 
                  value={formData.sport}
                  onChange={e => handleChange("sport", e.target.value)}
                  className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none uppercase font-mono cursor-pointer"
                >
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Swimming">Swimming</option>
                  <option value="Gym">Gym</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="General Fitness">General Fitness</option>
                </select>
              </div>
           </div>

           <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Target Intensity / Goal</label>
              <input 
                type="text" 
                value={formData.targetIntensity}
                onChange={e => handleChange("targetIntensity", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
                placeholder="Zone 5 / VO2 Max"
              />
           </div>

           <div>
              <label className="block text-[11px] font-mono text-secondary-lime uppercase tracking-wider mb-1">Warm-up</label>
              <textarea 
                value={formData.warmup}
                onChange={e => handleChange("warmup", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
                placeholder="2km easy jog, dynamic drills, 3x100m strides"
              ></textarea>
           </div>

           <div>
              <label className="block text-[11px] font-mono text-primary-coral uppercase tracking-wider mb-1">Main Set</label>
              <textarea 
                value={formData.mainSet}
                onChange={e => handleChange("mainSet", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-24 transition-colors"
                placeholder="5 x 1000m @ 3:45 pace // 3 min active shuffle recovery"
              ></textarea>
           </div>
           
           <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Rest Protocol</label>
              <textarea 
                value={formData.rest}
                onChange={e => handleChange("rest", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
                placeholder="Walk 90s, stay hydrated"
              ></textarea>
           </div>

           <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Cooldown</label>
              <textarea 
                value={formData.cooldown}
                onChange={e => handleChange("cooldown", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
                placeholder="1.5km recovery jog + light lower limb stretching"
              ></textarea>
           </div>
           
           <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Notes</label>
              <textarea 
                value={formData.notes}
                onChange={e => handleChange("notes", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
                placeholder="Keep posture upright on last reps."
              ></textarea>
           </div>

           <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
           <button onClick={handleCopyWorkout} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY WORKOUT</button>
        </div>
      </div>

      {/* COLUMN 2: LIVE PREVIEW */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] xl:self-start">
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-1.5 animate-pulse">
            <Eye className="w-3.5 h-3.5 text-secondary-lime" />
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
                formData={formData} 
                componentName="WorkoutCardGenerator" 
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
                      ? 'bg-secondary-lime text-black shadow-[0_0_8px_rgba(160,204,0,0.4)] font-extrabold' 
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-lowest/50'}`}
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