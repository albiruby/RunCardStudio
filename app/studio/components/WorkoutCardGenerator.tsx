import SharedTemplates from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, Save, AlertCircle } from "lucide-react";

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

  const [template, setTemplate] = useState("coach");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const target = 512; // Card width 480px + boundary allowance
        if (width < target) {
          setScale(width / target);
        } else {
          setScale(1);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: FORM (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Workout Plan</h2>
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
             <label className="block text-[11px] font-mono text-tertiary-cyan uppercase tracking-wider mb-1">Rest Protocol</label>
             <textarea 
               value={formData.rest}
               onChange={e => handleChange("rest", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-tertiary-cyan outline-none resize-none h-16 transition-colors"
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
          <button onClick={handleCopyWorkout} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY WORKOUT
</button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6 lg:sticky lg:top-[128px] lg:self-start mb-24 lg:mb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-4 md:pb-2 border-b border-brand-border md:border-none">
            {[
              { id: 'coach', label: 'Coach Board' },
              { id: 'track', label: 'Track Session' },
              { id: 'minimal', label: 'Minimal Program' }
           ,
              { id: 'carbon grid', label: 'Carbon Grid' },
              { id: 'race poster pro', label: 'Race Poster Pro' },
              { id: 'minimal white', label: 'Minimal White' },
              { id: 'split panel', label: 'Split Panel' },
              { id: 'neon edge', label: 'Neon Edge' },
              { id: 'print utility', label: 'Print Utility' },
              { id: 'compact story', label: 'Compact Story' }
           ].map(t => (
              <button 
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap transition-colors cursor-pointer border rounded-full shrink-0
                  ${template === t.id ? 'border-secondary-lime text-secondary-lime bg-secondary-lime/10' : 'border-brand-border text-text-muted hover:border-primary-coral hover:text-text-primary'}`}
              >
                {t.label}
              </button>
            ))}
        </div>
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
              className={`w-[480px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none
                ${template === 'coach' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] p-8 rounded-lg font-mono' : ''}
                ${template === 'track' ? 'bg-primary-action text-white p-8 rounded-none' : ''}
                ${template === 'minimal' ? 'bg-[#020203] border border-[#22252a] p-8 text-[#fafafa] rounded-md font-sans' : ''}
              `}
            >
               {/* Header */}
               <div className={`mb-6 pb-4 border-b ${template === 'track' ? 'border-white/30' : 'border-brand-border'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h1 className={`text-2xl font-black uppercase tracking-tight leading-tight ${template === 'coach' ? 'text-secondary-lime' : 'text-text-primary'}`}>
                      {formData.title.trim() || '5X1K VO2MAX INTERVALS'}
                    </h1>
                  </div>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold opacity-80 mt-2">
                    <span className="text-secondary-lime">{formData.sport}</span>
                    <span className={`px-2 py-1 rounded transition-colors ${template === 'coach' ? 'bg-surface border border-brand-border text-primary-coral' : template === 'track' ? 'bg-black text-white' : 'bg-surface-high border border-brand-border text-secondary-lime'}`}>
                      Target: {formData.targetIntensity.trim() || 'ZONE 5 / VO2 MAX'}
                    </span>
                  </div>
               </div>

               {/* Sections */}
               <div className="space-y-4 mb-8">
                 <div className={`p-4 rounded transition-all ${template === 'coach' ? 'bg-white/5 border border-white/10' : template === 'track' ? 'bg-black/10' : 'bg-[#121316] border border-[#22252a]'}`}>
                    <h3 className={`text-[10px] uppercase font-bold tracking-widest mb-1.5 ${template === 'coach' ? 'text-[#ccff00]' : 'text-secondary-lime'}`}>Warm-up Run</h3>
                    <p className={`text-sm ${template === 'coach' ? 'leading-relaxed' : 'font-mono uppercase leading-relaxed text-[13px] text-text-primary'}`}>
                      {formData.warmup.trim() || '2km easy conversation-pace jog, dynamic leg swings, 3x100m strides'}
                    </p>
                 </div>
                 <div className={`p-4 rounded transition-all ${template === 'coach' ? 'bg-[#ff5451]/10 border border-[#ff5451]/30' : template === 'track' ? 'bg-black/20 font-bold border border-black/10' : 'bg-[#121316] border-2 border-primary-coral shadow-[0_0_15px_rgba(255,84,81,0.1)]'}`}>
                    <h3 className={`text-[10px] uppercase font-bold tracking-widest mb-1.5 ${template === 'coach' ? 'text-[#ff5451]' : 'text-primary-coral'}`}>Main Activity Set</h3>
                    <p className={`text-sm leading-relaxed ${template === 'coach' ? 'text-[#f2f4f7]' : 'font-mono uppercase leading-relaxed text-[13px] text-text-primary'}`}>
                      {formData.mainSet.trim() || '5 x 1000m @ 3:45 pace // 3 min active shuffle-recovery'}
                    </p>
                 </div>
                 <div className={`p-4 rounded transition-all ${template === 'coach' ? 'bg-[#00f0ff]/10 border border-[#00f0ff]/30' : template === 'track' ? 'bg-black/5' : 'bg-[#121316] border border-[#22252a]'}`}>
                    <h3 className={`text-[10px] uppercase font-bold tracking-widest mb-1.5 ${template === 'coach' ? 'text-[#00f0ff]' : 'text-tertiary-cyan'}`}>Rest & Recovery</h3>
                    <p className={`text-sm ${template === 'coach' ? 'leading-relaxed' : 'font-mono uppercase leading-relaxed text-[13px] text-text-primary'}`}>
                      {formData.rest.trim() || 'Walk the first 90s, stay hydrated, then light trot transition'}
                    </p>
                 </div>
                 <div className={`p-4 rounded transition-all ${template === 'coach' ? 'bg-white/5 border border-white/10' : template === 'track' ? 'bg-black/10' : 'bg-[#121316] border border-[#22252a]'}`}>
                    <h3 className="text-[10px] uppercase font-bold tracking-widest mb-1.5 opacity-70">Cooldown</h3>
                    <p className={`text-sm ${template === 'coach' ? 'leading-relaxed' : 'font-mono uppercase leading-relaxed text-[13px] text-text-primary'}`}>
                      {formData.cooldown.trim() || '1.5km recovery jog + light lower limb stretching'}
                    </p>
                 </div>
               </div>

               {/* Notes */}
               {(formData.notes.trim() || "Postural focus, bicycle stride on final intervals.") && (
                 <div className="mb-6 text-xs leading-relaxed border-t border-brand-border pt-4">
                   <p className="uppercase font-mono text-[9px] opacity-60 tracking-widest mb-1">Special Notes & Stratems</p>
                   <p className="italic text-text-primary text-[11px]">{formData.notes.trim() || 'Postural focus, bicycle stride on final intervals.'}</p></div>)}
</div>
<div className="text-center font-mono text-[9px] tracking-[0.25em] uppercase mt-auto opacity-40 pt-4 border-t border-dashed border-brand-border">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}

</div>
           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="WorkoutCardGenerator"  />
           )}
       </div>
     </div>
      </div>
    </div>
  );
}