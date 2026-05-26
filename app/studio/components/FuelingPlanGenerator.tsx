import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, Save } from "lucide-react";

interface FuelingPlanProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function FuelingPlanGenerator({ previewRef, showToast }: FuelingPlanProps) {
  const [formData, setFormData] = useState({
    sessionName: "",
    duration: "",
    carbs: "",
    fluid: "",
    sodium: "",
    gelPlan: "",
    bottlePlan: "",
    preRace: "",
    note: ""
  });

  const [template, setTemplate] = useState("race fuel plan");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const target = 480; 
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
    if (formData.sessionName !== undefined && formData.sessionName !== null && (formData.sessionName as any) !== false && (formData.sessionName as any) !== "—" && (formData.sessionName as any) !== "Input required" && String(formData.sessionName).trim() !== "") {
      const val = typeof formData.sessionName === 'boolean' ? 'Yes' : formData.sessionName;
      lines.push("Session Name: " + val);
    }
    if (formData.duration !== undefined && formData.duration !== null && (formData.duration as any) !== false && (formData.duration as any) !== "—" && (formData.duration as any) !== "Input required" && String(formData.duration).trim() !== "") {
      const val = typeof formData.duration === 'boolean' ? 'Yes' : formData.duration;
      lines.push("Duration: " + val);
    }
    if (formData.carbs !== undefined && formData.carbs !== null && (formData.carbs as any) !== false && (formData.carbs as any) !== "—" && (formData.carbs as any) !== "Input required" && String(formData.carbs).trim() !== "") {
      const val = typeof formData.carbs === 'boolean' ? 'Yes' : formData.carbs;
      lines.push("Carbs: " + val);
    }
    if (formData.fluid !== undefined && formData.fluid !== null && (formData.fluid as any) !== false && (formData.fluid as any) !== "—" && (formData.fluid as any) !== "Input required" && String(formData.fluid).trim() !== "") {
      const val = typeof formData.fluid === 'boolean' ? 'Yes' : formData.fluid;
      lines.push("Fluid: " + val);
    }
    if (formData.sodium !== undefined && formData.sodium !== null && (formData.sodium as any) !== false && (formData.sodium as any) !== "—" && (formData.sodium as any) !== "Input required" && String(formData.sodium).trim() !== "") {
      const val = typeof formData.sodium === 'boolean' ? 'Yes' : formData.sodium;
      lines.push("Sodium: " + val);
    }
    if (formData.gelPlan !== undefined && formData.gelPlan !== null && (formData.gelPlan as any) !== false && (formData.gelPlan as any) !== "—" && (formData.gelPlan as any) !== "Input required" && String(formData.gelPlan).trim() !== "") {
      const val = typeof formData.gelPlan === 'boolean' ? 'Yes' : formData.gelPlan;
      lines.push("Gel Plan: " + val);
    }
    if (formData.bottlePlan !== undefined && formData.bottlePlan !== null && (formData.bottlePlan as any) !== false && (formData.bottlePlan as any) !== "—" && (formData.bottlePlan as any) !== "Input required" && String(formData.bottlePlan).trim() !== "") {
      const val = typeof formData.bottlePlan === 'boolean' ? 'Yes' : formData.bottlePlan;
      lines.push("Bottle Plan: " + val);
    }
    if (formData.preRace !== undefined && formData.preRace !== null && (formData.preRace as any) !== false && (formData.preRace as any) !== "—" && (formData.preRace as any) !== "Input required" && String(formData.preRace).trim() !== "") {
      const val = typeof formData.preRace === 'boolean' ? 'Yes' : formData.preRace;
      lines.push("Pre Race: " + val);
    }
    if (formData.note !== undefined && formData.note !== null && (formData.note as any) !== false && (formData.note as any) !== "—" && (formData.note as any) !== "Input required" && String(formData.note).trim() !== "") {
      const val = typeof formData.note === 'boolean' ? 'Yes' : formData.note;
      lines.push("Note: " + val);
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
      cardType: "fueling-plan",
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
             if (draft && draft.cardType === "fueling-plan") {
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
      <div className="lg:col-span-4 flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Nutrition Data</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div className="bg-surface-high border-l-4 border-primary-coral p-3 text-xs text-text-muted mb-2">
            <strong className="text-text-primary">Disclaimer:</strong> This is a manual visual formatter. Not medical advice. Input your own strategy.
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Session / Event</label>
               <input 
                 type="text" 
                 value={formData.sessionName}
                 onChange={e => handleChange("sessionName", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="City Marathon"
               />
             </div>
             <div className="col-span-2">
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Estimated Duration</label>
               <input 
                 type="text" 
                 value={formData.duration}
                 onChange={e => handleChange("duration", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="3h 15m"
               />
             </div>
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-brand-border pt-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Carbs / Hr</label>
               <input 
                 type="text" 
                 value={formData.carbs}
                 onChange={e => handleChange("carbs", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm font-bold text-text-primary outline-none focus:border-secondary-lime transition-all text-center"
                 placeholder="60g"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Fluid / Hr</label>
               <input 
                 type="text" 
                 value={formData.fluid}
                 onChange={e => handleChange("fluid", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm font-bold text-text-primary outline-none focus:border-secondary-lime transition-all text-center"
                 placeholder="500ml"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Sodium / Hr</label>
               <input 
                 type="text" 
                 value={formData.sodium}
                 onChange={e => handleChange("sodium", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm font-bold text-text-primary outline-none focus:border-secondary-lime transition-all text-center"
                 placeholder="400mg"
               />
             </div>
          </div>

          <div className="border-t border-brand-border pt-4">
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Gel Strategy</label>
             <input 
               type="text" 
               value={formData.gelPlan}
               onChange={e => handleChange("gelPlan", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all mb-3"
               placeholder="1 gel every 30 mins"
             />

             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Bottle / Hydration Strategy</label>
             <input 
               type="text" 
               value={formData.bottlePlan}
               onChange={e => handleChange("bottlePlan", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Sip every 15 mins"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Pre-race Meal / Timing (Opt)</label>
             <input 
               type="text" 
               value={formData.preRace}
               onChange={e => handleChange("preRace", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all mb-3"
               placeholder="Oatmeal 3 hours before"
             />
             
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Notes (Opt)</label>
             <textarea 
               value={formData.note}
               onChange={e => handleChange("note", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="Caffeine at 30km mark."
             ></textarea>
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY FUEL PLAN
</button>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-4 md:pb-2 border-b border-brand-border md:border-none">
            {[
              { id: 'race fuel plan', label: 'Race Fuel Plan' },
              { id: 'bottle strategy', label: 'Bottle Strategy' },
              { id: 'minimal nutrition', label: 'Minimal Nutrition' }
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
              className={`w-[440px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden
                ${template === 'race fuel plan' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] rounded-xl p-8 font-sans' : ''}
                ${template === 'bottle strategy' ? 'bg-[#0f1012] border-l-8 border-tertiary-cyan text-white p-8 rounded font-mono' : ''}
                ${template === 'minimal nutrition' ? 'bg-[#fafafa] border border-gray-200 text-black p-8 font-mono rounded-sm' : ''}
              `}
              style={{ minHeight: '500px' }}
            >
               
               {template === 'race fuel plan' && (
                 <>
                   <div className="text-center border-b border-[#22252a] pb-6 mb-6">
                     <h1 className="text-2xl font-black uppercase tracking-tight mb-1 text-white">{formData.sessionName || 'FUELING PLAN'}</h1>
                     <p className="text-xs uppercase tracking-widest text-gray-500 font-mono">Est. Duration: {formData.duration || '-'}</p>
                   </div>

                   <div className="grid grid-cols-3 gap-2 mb-8 border border-[#22252a] rounded overflow-hidden">
                     <div className="bg-[#181a1f] p-3 text-center">
                       <span className="block text-[9px] uppercase tracking-widest text-[#a0cc00] mb-1 font-mono">Carbs/hr</span>
                       <span className="text-xl font-bold">{formData.carbs || '-'}</span>
                     </div>
                     <div className="bg-[#181a1f] p-3 text-center border-l border-[#22252a]">
                       <span className="block text-[9px] uppercase tracking-widest text-tertiary-cyan mb-1 font-mono">Fluid/hr</span>
                       <span className="text-xl font-bold">{formData.fluid || '-'}</span>
                     </div>
                     <div className="bg-[#181a1f] p-3 text-center border-l border-[#22252a]">
                       <span className="block text-[9px] uppercase tracking-widest text-gray-400 mb-1 font-mono">Sodium/hr</span>
                       <span className="text-xl font-bold">{formData.sodium || '-'}</span>
                     </div>
                   </div>

                   <div className="space-y-4 flex-1">
                     <div>
                       <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2 border-b border-[#22252a] pb-1">Gel Strategy</h3>
                       <p className="text-sm font-medium bg-[#16181c] p-3 rounded">{formData.gelPlan || '-'}</p>
                     </div>
                     <div>
                       <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2 border-b border-[#22252a] pb-1">Hydration Strategy</h3>
                       <p className="text-sm font-medium bg-[#16181c] p-3 rounded">{formData.bottlePlan || '-'}</p>
                     </div>
                     {formData.preRace && (
                       <div>
                         <h3 className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-2 border-b border-[#22252a] pb-1">Pre-Race</h3>
                         <p className="text-sm font-medium bg-[#16181c] p-3 rounded">{formData.preRace}</p>
                       </div>
                     )}
                   </div>

                   <div className="mt-8 text-center opacity-40 flex flex-col justify-center items-center">
                     <span className="text-[7px] uppercase tracking-widest font-mono mb-1">Manual plan only. Not medical advice.</span>
                     <span className="text-[9px] uppercase tracking-[0.2em] font-sans font-bold">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</span>
                   </div>
                 </>
               )}

               {template === 'bottle strategy' && (
                 <>
                   <div className="mb-8">
                     <span className="text-tertiary-cyan text-[10px] uppercase tracking-widest bg-tertiary-cyan/10 px-2 py-1">NUTRITION LOG</span>
                     <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mt-3 mb-2">{formData.sessionName || 'SESSION'}</h1>
                     <div className="text-xs uppercase text-gray-400 tracking-widest">Time block: {formData.duration || '-'}</div>
                   </div>

                   <div className="mb-8">
                     <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Hourly Targets</div>
                     <div className="flex flex-col gap-2">
                       <div className="flex justify-between items-center bg-[#181a1f] p-3 border border-[#22252a]">
                         <span className="text-xs text-gray-300 uppercase">Carbs</span>
                         <span className="font-bold text-white">{formData.carbs || '-'}</span>
                       </div>
                       <div className="flex justify-between items-center bg-[#181a1f] p-3 border border-[#22252a]">
                         <span className="text-xs text-gray-300 uppercase">Fluid</span>
                         <span className="font-bold text-white">{formData.fluid || '-'}</span>
                       </div>
                       <div className="flex justify-between items-center bg-[#181a1f] p-3 border border-[#22252a]">
                         <span className="text-xs text-gray-300 uppercase">Sodium</span>
                         <span className="font-bold text-white">{formData.sodium || '-'}</span>
                       </div>
                     </div>
                   </div>

                   <div className="flex-1 space-y-4">
                     <div className="border-l border-gray-600 pl-3">
                       <div className="text-[10px] uppercase text-gray-500 mb-1">Strategy: Gels</div>
                       <div className="text-sm font-bold truncate">{formData.gelPlan || '-'}</div>
                     </div>
                     <div className="border-l border-gray-600 pl-3">
                       <div className="text-[10px] uppercase text-gray-500 mb-1">Strategy: Bottles</div>
                       <div className="text-sm font-bold truncate">{formData.bottlePlan || '-'}</div>
                     </div>
                   </div>

                   {formData.note && (
                     <div className="mt-4 p-3 bg-[#111113] border border-[#22252a] text-xs text-gray-400 italic">
                       {"//"} {formData.note}
                     </div>
                   )}

                   <div className="mt-8 pt-4 border-t border-[#22252a] text-[8px] uppercase tracking-widest text-gray-600 flex justify-between">
                     <span>Not medical advice</span>
                     <span>RCS</span>
                   </div>
                 </>
               )}

               {template === 'minimal nutrition' && (
                 <>
                   <div className="text-center mb-8 border-b-2 border-black pb-4">
                     <h1 className="text-xl font-bold uppercase tracking-widest mb-1">{formData.sessionName || 'FUELING PLAN'}</h1>
                     <p className="text-xs uppercase tracking-widest text-gray-500">{formData.duration}</p>
                   </div>

                   <div className="flex justify-around mb-8 px-4">
                      <div className="text-center">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 border-b border-gray-300 pb-1">Carbs</div>
                        <div className="text-lg font-black">{formData.carbs || '-'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 border-b border-gray-300 pb-1">Fluid</div>
                        <div className="text-lg font-black">{formData.fluid || '-'}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 border-b border-gray-300 pb-1">Sodium</div>
                        <div className="text-lg font-black">{formData.sodium || '-'}</div>
                      </div>
                   </div>

                   <div className="flex-1 space-y-4 text-sm font-sans mb-6">
                      <div className="flex items-start gap-4">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold min-w-16 pt-1">Gels</div>
                        <div className="font-medium bg-gray-100 px-3 py-2 flex-1 rounded-sm">{formData.gelPlan || '-'}</div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold min-w-16 pt-1">Hydrate</div>
                        <div className="font-medium bg-gray-100 px-3 py-2 flex-1 rounded-sm">{formData.bottlePlan || '-'}</div>
                      </div>
                      {formData.preRace && (
                        <div className="flex items-start gap-4">
                          <div className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold min-w-16 pt-1">Pre-run</div>
                          <div className="font-medium px-3 py-2 flex-1">{formData.preRace}</div>
                        </div>
                      )}
                   </div>

                   <div className="mt-auto border-t border-gray-200 pt-6">
                     <p className="text-[8px] uppercase tracking-widest text-center text-gray-400 font-bold leading-tight">
                       Manual plan only. Not medical or nutrition advice.<br/>{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</p>
                   </div>
                 </>
               )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
