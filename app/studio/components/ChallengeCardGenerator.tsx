import StudioPageShell from './StudioPageShell';
/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector from './TemplateSelector';
import { Copy, Save } from "lucide-react";

interface ChallengeCardProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function ChallengeCardGenerator({ previewRef, showToast }: ChallengeCardProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "Distance",
    target: "",
    startDate: "",
    endDate: "",
    rules: "",
    reward: "",
    community: "",
    difficulty: "Moderate"
  });

  const [template, setTemplate] = useState("community challenge");
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
        if (width < target) {
          setScale(width / target);
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
  const handleCopy = () => {
    const lines = [];
    if (formData.name !== undefined && formData.name !== null && (formData.name as any) !== false && (formData.name as any) !== "—" && (formData.name as any) !== "Input required" && String(formData.name).trim() !== "") {
      const val = typeof formData.name === 'boolean' ? 'Yes' : formData.name;
      lines.push("Name: " + val);
    }
    if (formData.type !== undefined && formData.type !== null && (formData.type as any) !== false && (formData.type as any) !== "—" && (formData.type as any) !== "Input required" && String(formData.type).trim() !== "") {
      const val = typeof formData.type === 'boolean' ? 'Yes' : formData.type;
      lines.push("Type: " + val);
    }
    if (formData.target !== undefined && formData.target !== null && (formData.target as any) !== false && (formData.target as any) !== "—" && (formData.target as any) !== "Input required" && String(formData.target).trim() !== "") {
      const val = typeof formData.target === 'boolean' ? 'Yes' : formData.target;
      lines.push("Target: " + val);
    }
    if (formData.startDate !== undefined && formData.startDate !== null && (formData.startDate as any) !== false && (formData.startDate as any) !== "—" && (formData.startDate as any) !== "Input required" && String(formData.startDate).trim() !== "") {
      const val = typeof formData.startDate === 'boolean' ? 'Yes' : formData.startDate;
      lines.push("Start Date: " + val);
    }
    if (formData.endDate !== undefined && formData.endDate !== null && (formData.endDate as any) !== false && (formData.endDate as any) !== "—" && (formData.endDate as any) !== "Input required" && String(formData.endDate).trim() !== "") {
      const val = typeof formData.endDate === 'boolean' ? 'Yes' : formData.endDate;
      lines.push("End Date: " + val);
    }
    if (formData.rules !== undefined && formData.rules !== null && (formData.rules as any) !== false && (formData.rules as any) !== "—" && (formData.rules as any) !== "Input required" && String(formData.rules).trim() !== "") {
      const val = typeof formData.rules === 'boolean' ? 'Yes' : formData.rules;
      lines.push("Rules: " + val);
    }
    if (formData.reward !== undefined && formData.reward !== null && (formData.reward as any) !== false && (formData.reward as any) !== "—" && (formData.reward as any) !== "Input required" && String(formData.reward).trim() !== "") {
      const val = typeof formData.reward === 'boolean' ? 'Yes' : formData.reward;
      lines.push("Reward: " + val);
    }
    if (formData.community !== undefined && formData.community !== null && (formData.community as any) !== false && (formData.community as any) !== "—" && (formData.community as any) !== "Input required" && String(formData.community).trim() !== "") {
      const val = typeof formData.community === 'boolean' ? 'Yes' : formData.community;
      lines.push("Community: " + val);
    }
    if (formData.difficulty !== undefined && formData.difficulty !== null && (formData.difficulty as any) !== false && (formData.difficulty as any) !== "—" && (formData.difficulty as any) !== "Input required" && String(formData.difficulty).trim() !== "") {
      const val = typeof formData.difficulty === 'boolean' ? 'Yes' : formData.difficulty;
      lines.push("Difficulty: " + val);
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
      cardType: "challenge-card",
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
             if (draft && draft.cardType === "challenge-card") {
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
    <StudioPageShell
      inputTitle="CHALLENGE DATA"
      inputSubtitle="Log details"
      inputContent={
        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Challenge Name</label>
             <input 
               type="text" 
               value={formData.name}
               onChange={e => handleChange("name", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="100 Days of Running"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Type</label>
               <select 
                 value={formData.type}
                 onChange={e => handleChange("type", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
               >
                 <option value="Distance">Distance</option>
                 <option value="Time">Time</option>
                 <option value="Streak">Streak</option>
                 <option value="Elevation">Elevation</option>
                 <option value="Workout">Workout</option>
                 <option value="Custom">Custom</option>
               </select>
            </div>
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Difficulty</label>
               <select 
                 value={formData.difficulty}
                 onChange={e => handleChange("difficulty", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
               >
                 <option value="Easy">Easy</option>
                 <option value="Moderate">Moderate</option>
                 <option value="Hard">Hard</option>
                 <option value="Brutal">Brutal</option>
               </select>
            </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-primary-coral font-bold uppercase tracking-wider mb-1">Target</label>
             <input 
               type="text" 
               value={formData.target}
               onChange={e => handleChange("target", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-primary-coral transition-all font-bold"
               placeholder="Run 500km total"
             />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Start Date</label>
               <input 
                 type="text" 
                 value={formData.startDate}
                 onChange={e => handleChange("startDate", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Jan 1"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">End Date</label>
               <input 
                 type="text" 
                 value={formData.endDate}
                 onChange={e => handleChange("endDate", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Apr 10"
               />
             </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Rules / Criteria</label>
             <textarea 
               value={formData.rules}
               onChange={e => handleChange("rules", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="Run every single day."
             ></textarea>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Reward (Opt)</label>
             <input 
               type="text" 
               value={formData.reward}
               onChange={e => handleChange("reward", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="New shoes"
             />
          </div>
          
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Community / Team (Opt)</label>
             <input 
               type="text" 
               value={formData.community}
               onChange={e => handleChange("community", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Track Club"
             />
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY CHALLENGE
</button>
        </div>
      }
      containerRef={containerRef}
      scale={scale}
      exportSize={exportSize}
      previewContent={
        <div
          ref={previewRef}
            className={`${getExportSizeClasses(exportSize, template)}` + `  flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden
              ${template === 'community challenge' ? 'bg-white border-2 border-[#121316] text-[#121316] p-8 font-sans' : ''}
              ${template === 'solo mission' ? 'bg-[#181a1f] border border-[#22252a] text-[#f2f4f7] rounded-xl p-8 font-mono' : ''}
              ${template === 'dark challenge' ? 'bg-[#0f1012] border border-[#ff0055]/30 text-white rounded-lg p-8' : ''}
            `}
            style={{ minHeight: '440px' }}
          >
             
             {template === 'community challenge' && (
               <>
                 <div className="text-center mb-6 border-b-2 border-black pb-4">
                   <span className="inline-block px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest mb-3">Community Challenge</span>
                   <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{formData.name || 'CHALLENGE NAME'}</h1>
                   {formData.community && <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hosted by {formData.community}</p>}
                 </div>

                 <div className="flex-1 flex flex-col">
                   <div className="bg-gray-100 p-4 border border-gray-200 mb-4 text-center">
                     <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Target</div>
                     <div className="text-2xl font-black uppercase">{formData.target || '-'}</div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="text-center py-2 border border-gray-200 border-dashed">
                       <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Type</div>
                       <div className="font-bold uppercase text-sm">{formData.type}</div>
                     </div>
                     <div className="text-center py-2 border border-gray-200 border-dashed">
                       <div className="text-[10px] uppercase text-gray-500 font-bold mb-1">Difficulty</div>
                       <div className="font-bold uppercase text-sm">{formData.difficulty}</div>
                     </div>
                   </div>

                   <div className="flex justify-between items-center bg-black text-white px-4 py-3 mb-6">
                      <div className="text-xs font-bold uppercase tracking-widest">Start: {formData.startDate || '-'}</div>
                      <div className="text-xs font-bold uppercase tracking-widest text-[#a0cc00]">End: {formData.endDate || '-'}</div>
                   </div>

                   <div className="mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1 border-b border-gray-200 pb-1">Rules</div>
                      <p className="text-sm font-medium text-gray-800 pt-1">{formData.rules || 'No rules defined.'}</p>
                   </div>
                 </div>

                 {formData.reward && (
                   <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                     <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Reward</div>
                     <div className="text-sm font-black uppercase text-[#1a56db]">{formData.reward}</div>
</div>
)}
</>
             )}

             {template === 'solo mission' && (
               <>
                 <div className="flex justify-between items-start mb-8">
                   <h1 className="text-2xl font-black uppercase leading-tight w-2/3">{formData.name || 'SOLO MISSION'}</h1>
                   <div className="text-right">
                     <div className="text-[10px] uppercase text-gray-500 opacity-60">Status</div>
                     <div className="text-xs font-bold uppercase text-secondary-lime">Accepted</div>
                   </div>
                 </div>

                 <div className="mb-8">
                   <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Parameters</div>
                   <div className="bg-[#111316] border border-[#22252a] p-4 flex flex-col gap-3">
                     <div className="flex justify-between border-b border-[#22252a] pb-2">
                       <span className="uppercase text-gray-400 text-xs">Target</span>
                       <span className="font-bold text-white text-sm truncate max-w-[60%] text-right">{formData.target || '-'}</span>
                     </div>
                     <div className="flex justify-between border-b border-[#22252a] pb-2">
                       <span className="uppercase text-gray-400 text-xs">Timeframe</span>
                       <span className="font-bold text-white text-sm">{formData.startDate || '-'} / {formData.endDate || '-'}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="uppercase text-gray-400 text-xs">Difficulty</span>
                       <span className="font-bold text-white text-sm">{formData.difficulty}</span>
                     </div>
                   </div>
                 </div>

                 <div className="flex-1 mb-6">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Directives</div>
                    <p className="text-sm leading-relaxed text-gray-300 border-l border-secondary-lime pl-3 whitespace-pre-wrap">{formData.rules || 'Execute mission.'}</p>
                 </div>

                 <div className="mt-auto border-t border-[#22252a] pt-4 flex justify-between items-end">
                   <div>
                     <div className="text-[9px] uppercase tracking-widest text-gray-600 mb-1">Type</div>
                     <div className="text-xs font-bold text-gray-400">{formData.type}</div>
                   </div>
                 </div>
               </>
             )}

             {template === 'dark challenge' && (
               <>
                 <div className="absolute top-0 right-0 bg-[#ff0055] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-opacity-80">Challenge</div>
                 
                 <div className="mb-6 pt-4">
                   <p className="text-[10px] font-mono text-[#ff0055] uppercase tracking-widest mb-1">{formData.type} {"//"} {formData.difficulty}</p>
                   <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">{formData.name || 'CHALLENGE'}</h1>
                 </div>

                 <div className="bg-[#181a1f] p-5 border border-[#22252a] rounded-md mb-6 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-[#ff0055]"></div>
                   <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Target</span>
                   <span className="text-2xl font-black font-sans uppercase text-white">{formData.target || '-'}</span>
                 </div>

                 <div className="flex gap-4 mb-6 text-sm font-mono border-b border-dashed border-[#22252a] pb-6">
                   <div className="flex-1">
                     <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">Start Date</span>
                     <span className="font-bold">{formData.startDate || '-'}</span>
                   </div>
                   <div className="flex-1">
                     <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1">End Date</span>
                     <span className="font-bold">{formData.endDate || '-'}</span>
                   </div>
                 </div>

                 <div className="flex-1 mb-6 text-sm">
                    <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Rules</span>
                    <p className="text-gray-300 font-sans">{formData.rules || 'None'}</p>
                 </div>

                 {formData.reward && (
                   <div className="mt-auto border border-[#22252a] bg-[#121316] p-3 text-center rounded">
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest">Reward</span>
                     <div className="font-bold text-secondary-lime text-sm uppercase">{formData.reward}</div>
                    </div>
                 )}
               </>
             )}

         {!['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) && (
  <div className={`mt-auto text-center font-mono text-[9px] tracking-[0.25em] uppercase pt-4 border-t ${
    ['community challenge', 'weekly board', 'clean white', 'minimal award', 'minimal nutrition', 'minimal gear', 'classic', 'elite', 'receipt', 'white', 'table', 'minimal'].includes(template) 
      ? 'border-dashed border-gray-400 text-gray-400' 
      : 'border-dashed border-brand-border opacity-40 text-white'
  }`}>
    {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
  </div>
)}

{['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) && (
           <SharedTemplates template={template} formData={formData} componentName="ChallengeCardGenerator"  />
         )}
          </div>
      }
      templateSelector={
        <TemplateSelector 
        activeTemplate={template}
        onSelectTemplate={setTemplate}
        localTemplates={[
          {
            "id": "community challenge",
            "label": "Community Challenge"
          },
          {
            "id": "solo mission",
            "label": "Solo Mission"
          },
          {
            "id": "dark challenge",
            "label": "Dark Challenge"
          }
        ]}
        />
      }
    />
  );
}