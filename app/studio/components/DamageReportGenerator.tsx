import SharedTemplates from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, Save } from "lucide-react";

interface DamageReportProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function DamageReportGenerator({ previewRef, showToast }: DamageReportProps) {
  const [formData, setFormData] = useState({
    sessionType: "",
    distance: "",
    duration: "",
    rpe: "",
    legStatus: "",
    breathingStatus: "",
    egoStatus: "",
    weatherExcuse: "",
    recoveryNeed: "",
    finalVerdict: "",
    notes: ""
  });

  const [template, setTemplate] = useState("brutal");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const target = 512;
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
  const handleCopy = () => {
    const lines = [];
    if (formData.sessionType !== undefined && formData.sessionType !== null && (formData.sessionType as any) !== false && (formData.sessionType as any) !== "—" && (formData.sessionType as any) !== "Input required" && String(formData.sessionType).trim() !== "") {
      const val = typeof formData.sessionType === 'boolean' ? 'Yes' : formData.sessionType;
      lines.push("Session Type: " + val);
    }
    if (formData.distance !== undefined && formData.distance !== null && (formData.distance as any) !== false && (formData.distance as any) !== "—" && (formData.distance as any) !== "Input required" && String(formData.distance).trim() !== "") {
      const val = typeof formData.distance === 'boolean' ? 'Yes' : formData.distance;
      lines.push("Distance: " + val);
    }
    if (formData.duration !== undefined && formData.duration !== null && (formData.duration as any) !== false && (formData.duration as any) !== "—" && (formData.duration as any) !== "Input required" && String(formData.duration).trim() !== "") {
      const val = typeof formData.duration === 'boolean' ? 'Yes' : formData.duration;
      lines.push("Duration: " + val);
    }
    if (formData.rpe !== undefined && formData.rpe !== null && (formData.rpe as any) !== false && (formData.rpe as any) !== "—" && (formData.rpe as any) !== "Input required" && String(formData.rpe).trim() !== "") {
      const val = typeof formData.rpe === 'boolean' ? 'Yes' : formData.rpe;
      lines.push("Rpe: " + val);
    }
    if (formData.legStatus !== undefined && formData.legStatus !== null && (formData.legStatus as any) !== false && (formData.legStatus as any) !== "—" && (formData.legStatus as any) !== "Input required" && String(formData.legStatus).trim() !== "") {
      const val = typeof formData.legStatus === 'boolean' ? 'Yes' : formData.legStatus;
      lines.push("Leg Status: " + val);
    }
    if (formData.breathingStatus !== undefined && formData.breathingStatus !== null && (formData.breathingStatus as any) !== false && (formData.breathingStatus as any) !== "—" && (formData.breathingStatus as any) !== "Input required" && String(formData.breathingStatus).trim() !== "") {
      const val = typeof formData.breathingStatus === 'boolean' ? 'Yes' : formData.breathingStatus;
      lines.push("Breathing Status: " + val);
    }
    if (formData.egoStatus !== undefined && formData.egoStatus !== null && (formData.egoStatus as any) !== false && (formData.egoStatus as any) !== "—" && (formData.egoStatus as any) !== "Input required" && String(formData.egoStatus).trim() !== "") {
      const val = typeof formData.egoStatus === 'boolean' ? 'Yes' : formData.egoStatus;
      lines.push("Ego Status: " + val);
    }
    if (formData.weatherExcuse !== undefined && formData.weatherExcuse !== null && (formData.weatherExcuse as any) !== false && (formData.weatherExcuse as any) !== "—" && (formData.weatherExcuse as any) !== "Input required" && String(formData.weatherExcuse).trim() !== "") {
      const val = typeof formData.weatherExcuse === 'boolean' ? 'Yes' : formData.weatherExcuse;
      lines.push("Weather Excuse: " + val);
    }
    if (formData.recoveryNeed !== undefined && formData.recoveryNeed !== null && (formData.recoveryNeed as any) !== false && (formData.recoveryNeed as any) !== "—" && (formData.recoveryNeed as any) !== "Input required" && String(formData.recoveryNeed).trim() !== "") {
      const val = typeof formData.recoveryNeed === 'boolean' ? 'Yes' : formData.recoveryNeed;
      lines.push("Recovery Need: " + val);
    }
    if (formData.finalVerdict !== undefined && formData.finalVerdict !== null && (formData.finalVerdict as any) !== false && (formData.finalVerdict as any) !== "—" && (formData.finalVerdict as any) !== "Input required" && String(formData.finalVerdict).trim() !== "") {
      const val = typeof formData.finalVerdict === 'boolean' ? 'Yes' : formData.finalVerdict;
      lines.push("Final Verdict: " + val);
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
      cardType: "damage-report",
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
             if (draft && draft.cardType === "damage-report") {
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
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Session Data</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Session Type</label>
               <input 
                 type="text" 
                 value={formData.sessionType}
                 onChange={e => handleChange("sessionType", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="e.g. Long Run"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Distance (Opt)</label>
               <input 
                 type="text" 
                 value={formData.distance}
                 onChange={e => handleChange("distance", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="32km"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Duration (Opt)</label>
               <input 
                 type="text" 
                 value={formData.duration}
                 onChange={e => handleChange("duration", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="2:45:00"
               />
             </div>
          </div>
          
          <div>
            <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">RPE / Effort Level (1-10)</label>
            <input 
              type="number"
              min="1" max="10" 
              value={formData.rpe}
              onChange={e => handleChange("rpe", e.target.value)}
              className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary font-mono outline-none focus:border-secondary-lime transition-all"
              placeholder="8"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Legs</label>
              <select 
                value={formData.legStatus}
                onChange={e => handleChange("legStatus", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
              >
                <option value="Fine">Fine</option>
                <option value="Heavy">Heavy</option>
                <option value="Destroyed">Destroyed</option>
                <option value="Questionable">Questionable</option>
                <option value="No Comment">No Comment</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Breathing</label>
              <select 
                value={formData.breathingStatus}
                onChange={e => handleChange("breathingStatus", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
              >
                <option value="Controlled">Controlled</option>
                <option value="Illegal">Illegal</option>
                <option value="Panic Mode">Panic Mode</option>
                <option value="Surprisingly Okay">Surprisingly Okay</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Ego Status</label>
              <select 
                value={formData.egoStatus}
                onChange={e => handleChange("egoStatus", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
              >
                <option value="Stable">Stable</option>
                <option value="Humbled">Humbled</option>
                <option value="Destroyed">Destroyed</option>
                <option value="Overconfident">Overconfident</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Recovery Need</label>
              <select 
                value={formData.recoveryNeed}
                onChange={e => handleChange("recoveryNeed", e.target.value)}
                className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
              >
                <option value="Easy jog">Easy jog</option>
                <option value="Sleep">Sleep</option>
                <option value="Food">Food</option>
                <option value="Ice bath">Ice bath</option>
                <option value="Full reset">Full reset</option>
              </select>
            </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Weather Excuse</label>
             <input 
               type="text" 
               value={formData.weatherExcuse}
               onChange={e => handleChange("weatherExcuse", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Too windy"
             />
          </div>
          
          <div>
             <label className="block text-[11px] font-mono text-primary-coral uppercase tracking-wider mb-1">Final Verdict</label>
             <input 
               type="text" 
               value={formData.finalVerdict}
               onChange={e => handleChange("finalVerdict", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-primary-coral transition-all"
               placeholder="Survived"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Notes (Opt)</label>
             <textarea 
               value={formData.notes}
               onChange={e => handleChange("notes", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="Mistakes were made."
             ></textarea>
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY REPORT
</button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-4 md:pb-2 border-b border-brand-border md:border-none">
            {[
              { id: 'brutal', label: 'Brutal Report' },
              { id: 'receipt', label: 'Dark Receipt' },
              { id: 'neon', label: 'Neon Damage' }
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
                ${template === 'brutal' ? 'bg-[#121316] border border-[#22252a] p-8 text-[#f2f4f7] rounded-lg' : ''}
                ${template === 'receipt' ? 'bg-[#fafafa] text-black border border-[#e4e4e7] p-8 rounded-none' : ''}
                ${template === 'neon' ? 'bg-[#020203] border border-[#ff0055]/30 p-8 text-[#fafafa] rounded-xl shadow-[0_0_30px_rgba(255,0,85,0.15)]' : ''}
              `}
            >
               {/* Header */}
               <div className={`mb-6 pb-4 border-b ${template === 'neon' ? 'border-[#ff0055]/30' : (template === 'receipt' ? 'border-dashed border-gray-400' : 'border-[#22252a]')}`}>
                  <h1 className={`text-3xl font-black uppercase tracking-tighter leading-none mb-1 ${template === 'neon' ? 'text-[#ff0055] drop-shadow-[0_0_8px_rgba(255,0,85,0.5)]' : ''}`}>Damage Report</h1>
                  <p className={`font-mono text-sm uppercase tracking-widest ${template === 'receipt' ? 'text-gray-500' : 'text-primary-coral'}`}>
                    {formData.sessionType || 'SESSION'} {formData.distance && `// ${formData.distance}`} {formData.duration && `// ${formData.duration}`}
                  </p>
               </div>

               {/* Metrics */}
               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className={`p-4 rounded-md border ${template === 'neon' ? 'bg-black border-[#ff0055]/20' : (template === 'receipt' ? 'border-gray-200' : 'bg-[#1c1d22] border-[#22252a]')}`}>
                    <div className="font-mono text-[10px] uppercase opacity-60 mb-1">Effort (RPE)</div>
                    <div className={`text-2xl font-black font-mono ${template === 'neon' ? 'text-white' : ''}`}>{formData.rpe}/10</div>
                 </div>
                 <div className={`p-4 rounded-md border ${template === 'neon' ? 'bg-black border-[#ff0055]/20' : (template === 'receipt' ? 'border-gray-200' : 'bg-[#1c1d22] border-[#22252a]')}`}>
                    <div className="font-mono text-[10px] uppercase opacity-60 mb-1">Ego Status</div>
                    <div className={`text-xl font-bold uppercase truncate ${template === 'neon' ? 'text-white' : ''}`}>{formData.egoStatus || '-'}</div>
                 </div>
               </div>

               {/* List */}
               <div className={`space-y-3 mb-6 p-4 rounded border ${template === 'neon' ? 'bg-[#ff0055]/5 border-[#ff0055]/20 text-[#ff0055]' : (template === 'receipt' ? 'border-gray-200 bg-gray-50' : 'bg-[#16181c] border-[#22252a] text-secondary-lime')}`}>
                 <div className="flex justify-between font-mono text-sm border-b border-opacity-20 pb-2 border-inherit">
                    <span className="uppercase opacity-70">Legs</span>
                    <span className="font-bold">{formData.legStatus || '-'}</span>
                 </div>
                 <div className="flex justify-between font-mono text-sm border-b border-opacity-20 pb-2 border-inherit">
                    <span className="uppercase opacity-70">Breathing</span>
                    <span className="font-bold">{formData.breathingStatus || '-'}</span>
                 </div>
                 <div className="flex justify-between font-mono text-sm border-b border-opacity-20 pb-2 border-inherit">
                    <span className="uppercase opacity-70">Weather</span>
                    <span className="font-bold">{formData.weatherExcuse || '-'}</span>
                 </div>
                 <div className="flex justify-between font-mono text-sm pt-1">
                    <span className="uppercase opacity-70">Recovery</span>
                    <span className="font-bold">{formData.recoveryNeed || '-'}</span>
                 </div>
               </div>

               {(formData.finalVerdict || formData.notes) && (
                 <>
                 <div className={`mb-6 p-4 rounded-md border ${template === 'neon' ? 'bg-black border-[#ff0055]/40 text-white' : (template === 'receipt' ? 'border-gray-300' : 'bg-[#1c1d22] border-primary-coral')}`}>
                   {formData.finalVerdict && (
                      <div className="mb-2">
                        <span className={`font-mono text-[10px] uppercase block mb-1 ${template === 'neon' ? 'text-[#ff0055]' : 'text-primary-coral'}`}>Final Verdict</span>
                        <span className="font-black text-xl uppercase tracking-wide">{formData.finalVerdict}</span>
                      </div>
                    )}
                    {formData.notes && (
                      <div className={`text-sm italic font-serif ${template === 'receipt' ? 'text-gray-600' : 'text-gray-400'}`}>&quot;{formData.notes}&quot;</div>
                    )}
                  </div>
                  <div className={`text-center font-mono text-[9px] tracking-[0.25em] uppercase mt-auto pt-4 border-t ${template === 'receipt' ? 'border-dashed border-gray-400 text-gray-400' : (template === 'neon' ? 'border-[#ff0055]/20 text-[#ff0055]/50' : 'border-dashed border-[#22252a] opacity-40')}`}>{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}</div>
                 </>
                )}
           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="DamageReportGenerator"  />
           )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}