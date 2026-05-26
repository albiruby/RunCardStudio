import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, Save } from "lucide-react";

interface GoalCardProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function GoalCardGenerator({ previewRef, showToast }: GoalCardProps) {
  const [formData, setFormData] = useState({
    title: "",
    targetEvent: "",
    targetTime: "",
    targetDate: "",
    currentBest: "",
    mainFocus: "",
    motivation: "",
    status: "Planning"
  });

  const [template, setTemplate] = useState("target board");
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
    if (formData.title !== undefined && formData.title !== null && (formData.title as any) !== false && (formData.title as any) !== "—" && (formData.title as any) !== "Input required" && String(formData.title).trim() !== "") {
      const val = typeof formData.title === 'boolean' ? 'Yes' : formData.title;
      lines.push("Title: " + val);
    }
    if (formData.targetEvent !== undefined && formData.targetEvent !== null && (formData.targetEvent as any) !== false && (formData.targetEvent as any) !== "—" && (formData.targetEvent as any) !== "Input required" && String(formData.targetEvent).trim() !== "") {
      const val = typeof formData.targetEvent === 'boolean' ? 'Yes' : formData.targetEvent;
      lines.push("Target Event: " + val);
    }
    if (formData.targetTime !== undefined && formData.targetTime !== null && (formData.targetTime as any) !== false && (formData.targetTime as any) !== "—" && (formData.targetTime as any) !== "Input required" && String(formData.targetTime).trim() !== "") {
      const val = typeof formData.targetTime === 'boolean' ? 'Yes' : formData.targetTime;
      lines.push("Target Time: " + val);
    }
    if (formData.targetDate !== undefined && formData.targetDate !== null && (formData.targetDate as any) !== false && (formData.targetDate as any) !== "—" && (formData.targetDate as any) !== "Input required" && String(formData.targetDate).trim() !== "") {
      const val = typeof formData.targetDate === 'boolean' ? 'Yes' : formData.targetDate;
      lines.push("Target Date: " + val);
    }
    if (formData.currentBest !== undefined && formData.currentBest !== null && (formData.currentBest as any) !== false && (formData.currentBest as any) !== "—" && (formData.currentBest as any) !== "Input required" && String(formData.currentBest).trim() !== "") {
      const val = typeof formData.currentBest === 'boolean' ? 'Yes' : formData.currentBest;
      lines.push("Current Best: " + val);
    }
    if (formData.mainFocus !== undefined && formData.mainFocus !== null && (formData.mainFocus as any) !== false && (formData.mainFocus as any) !== "—" && (formData.mainFocus as any) !== "Input required" && String(formData.mainFocus).trim() !== "") {
      const val = typeof formData.mainFocus === 'boolean' ? 'Yes' : formData.mainFocus;
      lines.push("Main Focus: " + val);
    }
    if (formData.motivation !== undefined && formData.motivation !== null && (formData.motivation as any) !== false && (formData.motivation as any) !== "—" && (formData.motivation as any) !== "Input required" && String(formData.motivation).trim() !== "") {
      const val = typeof formData.motivation === 'boolean' ? 'Yes' : formData.motivation;
      lines.push("Motivation: " + val);
    }
    if (formData.status !== undefined && formData.status !== null && (formData.status as any) !== false && (formData.status as any) !== "—" && (formData.status as any) !== "Input required" && String(formData.status).trim() !== "") {
      const val = typeof formData.status === 'boolean' ? 'Yes' : formData.status;
      lines.push("Status: " + val);
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
      cardType: "goal-card",
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
             if (draft && draft.cardType === "goal-card") {
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
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Goal Data</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Goal Title</label>
             <input 
               type="text" 
               value={formData.title}
               onChange={e => handleChange("title", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Sub 3 Project"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Target Event / Distance</label>
             <input 
               type="text" 
               value={formData.targetEvent}
               onChange={e => handleChange("targetEvent", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="City Marathon"
             />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Target Time (Opt)</label>
               <input 
                 type="text" 
                 value={formData.targetTime}
                 onChange={e => handleChange("targetTime", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="2:59:59"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Target Date</label>
               <input 
                 type="text" 
                 value={formData.targetDate}
                 onChange={e => handleChange("targetDate", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Nov 2026"
               />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Current Best (Opt)</label>
               <input 
                 type="text" 
                 value={formData.currentBest}
                 onChange={e => handleChange("currentBest", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="3:15:20"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Status</label>
               <select 
                 value={formData.status}
                 onChange={e => handleChange("status", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
               >
                 <option value="Planning">Planning</option>
                 <option value="Building">Building</option>
                 <option value="Peak phase">Peak phase</option>
                 <option value="Race ready">Race ready</option>
                 <option value="In progress">In progress</option>
               </select>
             </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Main Focus</label>
             <input 
               type="text" 
               value={formData.mainFocus}
               onChange={e => handleChange("mainFocus", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Consistency & mileage"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Motivation / Note (Opt)</label>
             <textarea 
               value={formData.motivation}
               onChange={e => handleChange("motivation", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="Unfinished business."
             ></textarea>
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY GOAL
</button>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-4 md:pb-2 border-b border-brand-border md:border-none">
            {[
              { id: 'target board', label: 'Target Board' },
              { id: 'countdown card', label: 'Countdown Card' },
              { id: 'minimal goal', label: 'Minimal Goal' }
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
              className={`w-[460px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden
                ${template === 'target board' ? 'bg-[#0f1012] border-t-8 border-secondary-lime text-white p-8 rounded font-mono' : ''}
                ${template === 'countdown card' ? 'bg-[#121316] border border-primary-coral p-8 text-[#f2f4f7] rounded-xl' : ''}
                ${template === 'minimal goal' ? 'bg-white border border-gray-200 text-black p-8 px-10 rounded-sm font-sans' : ''}
              `}
              style={{ minHeight: '440px' }}
            >
               
               {template === 'target board' && (
                 <>
                   <div className="flex justify-between items-start mb-6">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest px-2 py-1 bg-[#1a1c23]">{formData.status || 'STATUS'}</span>
                     <span className="text-[10px] text-secondary-lime uppercase tracking-widest">{formData.targetDate || 'DATE'}</span>
                   </div>
                   
                   <div className="mb-8">
                     <h1 className="text-3xl font-black uppercase tracking-widest mb-2 leading-tight text-white">{formData.title || 'GOAL TITLE'}</h1>
                     <div className="text-sm uppercase tracking-widest text-gray-400 border-b border-[#22252a] pb-4">{formData.targetEvent || 'EVENT'}</div>
                   </div>

                   <div className="flex-1 grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-black p-4 border border-[#22252a] flex flex-col justify-center text-center">
                        <span className="text-[10px] uppercase text-gray-500 mb-1">Target Time</span>
                        <span className="text-2xl font-black">{formData.targetTime || '-'}</span>
                      </div>
                      <div className="bg-black p-4 border border-[#22252a] flex flex-col justify-center text-center">
                        <span className="text-[10px] uppercase text-gray-500 mb-1">Current Best</span>
                        <span className="text-xl font-bold text-gray-300">{formData.currentBest || '-'}</span>
                      </div>
                   </div>

                   <div className="mt-auto">
                     <div className="mb-4">
                       <span className="text-[9px] uppercase tracking-widest text-gray-600 block mb-1">Primary Focus</span>
                       <span className="text-sm font-bold uppercase">{formData.mainFocus || '-'}</span>
                     </div>
                     {formData.motivation && (
                       <div className="text-xs italic text-gray-500 border-l-[3px] border-secondary-lime pl-3">
                         &quot;{formData.motivation}&quot;
                       </div>
                     )}
                   </div>
                   
                 </>
               )}

               {template === 'countdown card' && (
                 <>
                   <div className="absolute top-0 right-0 bg-primary-coral text-black font-black uppercase text-[10px] tracking-widest px-3 py-1 rounded-bl-xl">MISSION</div>
                   
                   <div className="mb-8 pt-4">
                     <div className="text-primary-coral font-mono text-[10px] uppercase tracking-widest mb-1">Target Set // {formData.status || 'STATUS'}</div>
                     <h1 className="text-5xl font-black uppercase tracking-tighter leading-none mb-4">{formData.title || 'GOAL'}</h1>
                     
                     <div className="bg-[#1c1d22] border border-[#2a2d35] p-3 rounded flex justify-between items-center font-mono">
                        <span className="text-xs uppercase text-gray-400">T-Date</span>
                        <span className="text-sm font-bold text-white">{formData.targetDate || '-'}</span>
                     </div>
                   </div>

                   <div className="flex-1 space-y-4 mb-8">
                     <div className="flex justify-between border-b border-[#22252a] pb-2">
                       <span className="font-mono text-[10px] uppercase text-gray-500">Event</span>
                       <span className="font-bold uppercase tracking-wide">{formData.targetEvent || '-'}</span>
                     </div>
                     <div className="flex justify-between border-b border-[#22252a] pb-2">
                       <span className="font-mono text-[10px] uppercase text-gray-500">Target Time</span>
                       <span className="font-bold font-mono text-lg text-primary-coral">{formData.targetTime || '-'}</span>
                     </div>
                     <div className="flex justify-between border-b border-[#22252a] pb-2">
                       <span className="font-mono text-[10px] uppercase text-gray-500">Focus</span>
                       <span className="font-bold uppercase text-sm truncate max-w-[60%]">{formData.mainFocus || '-'}</span>
                     </div>
                   </div>

                   <div className="mt-auto pt-4 flex items-end justify-between">
                     <div className="text-[8px] font-mono tracking-widest uppercase opacity-30">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</div>
                     {formData.motivation && (
                       <div className="text-xs italic text-gray-400 font-serif text-right max-w-[70%]">
                         &quot;{formData.motivation}&quot;
                       </div>
                     )}
                   </div>
                 </>
               )}

               {template === 'minimal goal' && (
                 <div className="h-full flex flex-col py-2">
                   <div className="flex justify-between items-baseline mb-8">
                     <h1 className="text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-2">{formData.title || 'GOAL'}</h1>
                     <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">{formData.targetDate}</span>
                   </div>

                   <div className="flex-1 flex flex-col justify-center gap-6">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Target Event</div>
                        <div className="text-xl font-bold text-black">{formData.targetEvent || '-'}</div>
                      </div>

                      <div className="flex gap-12">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Target Time</div>
                          <div className="text-3xl font-black tracking-tighter text-black">{formData.targetTime || '-'}</div>
                        </div>
                        {formData.currentBest && (
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Current Best</div>
                            <div className="text-xl font-semibold text-gray-600 mt-2">{formData.currentBest}</div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Focus & Status</div>
                        <div className="text-sm font-medium mb-1">{formData.mainFocus || '-'}</div>
                        <div className="inline-block px-2 py-0.5 bg-gray-100 text-[10px] uppercase tracking-widest font-bold mt-1 text-gray-600">{formData.status}</div>
                      </div>
                   </div>

                   {formData.motivation && (
                     <div className="mt-6 pt-6 border-t border-gray-200">
                       <p className="text-sm font-serif italic text-gray-700">&quot;{formData.motivation}&quot;</p>
                     </div>
                   )}
                   <div className="absolute bottom-4 right-10 text-[8px] font-mono tracking-widest text-gray-300 uppercase">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</div>
                 </div>
               )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
