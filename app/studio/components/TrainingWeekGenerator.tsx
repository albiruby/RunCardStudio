/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, Calendar, Eye } from "lucide-react";

interface TrainingWeekProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function TrainingWeekGenerator({ previewRef, showToast }: TrainingWeekProps) {
  const [formData, setFormData] = useState({
    title: "",
    dateRange: "",
    totalDistance: "",
    totalDuration: "",
    sessions: "",
    keySession: "",
    longRun: "",
    strength: "",
    verdict: "Solid",
    note: ""
  });

  const [template, setTemplate] = useState("weekly board");
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
    if (formData.title !== undefined && formData.title !== null && (formData.title as any) !== false && (formData.title as any) !== "—" && (formData.title as any) !== "Input required" && String(formData.title).trim() !== "") {
      const val = typeof formData.title === 'boolean' ? 'Yes' : formData.title;
      lines.push("Title: " + val);
    }
    if (formData.dateRange !== undefined && formData.dateRange !== null && (formData.dateRange as any) !== false && (formData.dateRange as any) !== "—" && (formData.dateRange as any) !== "Input required" && String(formData.dateRange).trim() !== "") {
      const val = typeof formData.dateRange === 'boolean' ? 'Yes' : formData.dateRange;
      lines.push("Date Range: " + val);
    }
    if (formData.totalDistance !== undefined && formData.totalDistance !== null && (formData.totalDistance as any) !== false && (formData.totalDistance as any) !== "—" && (formData.totalDistance as any) !== "Input required" && String(formData.totalDistance).trim() !== "") {
      const val = typeof formData.totalDistance === 'boolean' ? 'Yes' : formData.totalDistance;
      lines.push("Total Distance: " + val);
    }
    if (formData.totalDuration !== undefined && formData.totalDuration !== null && (formData.totalDuration as any) !== false && (formData.totalDuration as any) !== "—" && (formData.totalDuration as any) !== "Input required" && String(formData.totalDuration).trim() !== "") {
      const val = typeof formData.totalDuration === 'boolean' ? 'Yes' : formData.totalDuration;
      lines.push("Total Duration: " + val);
    }
    if (formData.sessions !== undefined && formData.sessions !== null && (formData.sessions as any) !== false && (formData.sessions as any) !== "—" && (formData.sessions as any) !== "Input required" && String(formData.sessions).trim() !== "") {
      const val = typeof formData.sessions === 'boolean' ? 'Yes' : formData.sessions;
      lines.push("Sessions: " + val);
    }
    if (formData.keySession !== undefined && formData.keySession !== null && (formData.keySession as any) !== false && (formData.keySession as any) !== "—" && (formData.keySession as any) !== "Input required" && String(formData.keySession).trim() !== "") {
      const val = typeof formData.keySession === 'boolean' ? 'Yes' : formData.keySession;
      lines.push("Key Session: " + val);
    }
    if (formData.longRun !== undefined && formData.longRun !== null && (formData.longRun as any) !== false && (formData.longRun as any) !== "—" && (formData.longRun as any) !== "Input required" && String(formData.longRun).trim() !== "") {
      const val = typeof formData.longRun === 'boolean' ? 'Yes' : formData.longRun;
      lines.push("Long Run: " + val);
    }
    if (formData.strength !== undefined && formData.strength !== null && (formData.strength as any) !== false && (formData.strength as any) !== "—" && (formData.strength as any) !== "Input required" && String(formData.strength).trim() !== "") {
      const val = typeof formData.strength === 'boolean' ? 'Yes' : formData.strength;
      lines.push("Strength: " + val);
    }
    if (formData.verdict !== undefined && formData.verdict !== null && (formData.verdict as any) !== false && (formData.verdict as any) !== "—" && (formData.verdict as any) !== "Input required" && String(formData.verdict).trim() !== "") {
      const val = typeof formData.verdict === 'boolean' ? 'Yes' : formData.verdict;
      lines.push("Verdict: " + val);
    }
    if (formData.note !== undefined && formData.note !== null && (formData.note as any) !== false && (formData.note as any) !== "—" && (formData.note as any) !== "Input required" && String(formData.note).trim() !== "") {
      const val = typeof formData.note === 'boolean' ? 'Yes' : formData.note;
      lines.push("Note: " + val);
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
      cardType: "training-week",
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
             if (draft && draft.cardType === "training-week") {
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
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,380px)_1fr_minmax(280px,340px)] gap-6 w-full font-sans">
      {/* COLUMN 1: WEEK DATA */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2 px-1">
          <Calendar className="w-3.5 h-3.5 text-secondary-lime" style={{ color: activeAccent.hex }} />
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">WEEK DATA</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-xl flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Week Title</label>
             <input 
               type="text" 
               value={formData.title}
               onChange={e => handleChange("title", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Week 5"
             />
          </div>
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date Range</label>
             <input 
               type="text" 
               value={formData.dateRange}
               onChange={e => handleChange("dateRange", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Oct 12 - Oct 18"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Total Distance (Opt)</label>
               <input 
                 type="text" 
                 value={formData.totalDistance}
                 onChange={e => handleChange("totalDistance", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="70 km"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Total Duration (Opt)</label>
               <input 
                 type="text" 
                 value={formData.totalDuration}
                 onChange={e => handleChange("totalDuration", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="6h 30m"
               />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Num Sessions</label>
               <input 
                 type="text" 
                 value={formData.sessions}
                 onChange={e => handleChange("sessions", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all font-mono"
                 placeholder="6"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Week Verdict</label>
               <select 
                 value={formData.verdict}
                 onChange={e => handleChange("verdict", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
               >
                 <option value="Solid">Solid</option>
                 <option value="Tired">Tired</option>
                 <option value="Productive">Productive</option>
                 <option value="Recovery">Recovery</option>
                 <option value="Chaotic">Chaotic</option>
                 <option value="Peak week">Peak week</option>
               </select>
             </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Key Session</label>
             <input 
               type="text" 
               value={formData.keySession}
               onChange={e => handleChange("keySession", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="6x1km @ 3:45"
             />
          </div>
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Long Run</label>
             <input 
               type="text" 
               value={formData.longRun}
               onChange={e => handleChange("longRun", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="25km progression"
             />
          </div>
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Strength / Other (Opt)</label>
             <input 
               type="text" 
               value={formData.strength}
               onChange={e => handleChange("strength", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="2x gym"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Weekly Note (Opt)</label>
             <textarea 
               value={formData.note}
               onChange={e => handleChange("note", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="Felt strong but need more sleep."
             ></textarea>
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-3.5 h-3.5 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2.5 bg-transparent border hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} /> COPY WEEK</button>
        </div>
      </div>

      {/* COLUMN 2: LIVE PREVIEW */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] xl:self-start">
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-secondary-lime" style={{ color: activeAccent.hex }} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">LIVE PREVIEW</span>
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
              className={`${getExportSizeClasses(exportSize, template)}` + ` flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden
                ${template === 'weekly board' ? 'bg-[#fafafa] border-4 border-black p-8 text-black font-sans rounded-sm' : ''}
                ${template === 'training log' ? 'bg-[#18181b] text-white border border-[#27272a] p-8 rounded-xl font-mono' : ''}
                ${template === 'dark carbon' ? 'bg-[#121316] border border-[#22252a] p-8 text-[#f2f4f7] rounded-lg' : ''}
              `}
              style={{ minHeight: '520px' }}
            >
             
             {template === 'weekly board' && (
               <>
                 <div className="flex justify-between items-end mb-6 pb-4 border-b-4 border-black">
                   <div>
                     <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">{formData.title || 'WEEKLY SUMMARY'}</h1>
                     <div className="text-sm font-bold opacity-60 uppercase tracking-widest">{formData.dateRange || 'DATE RANGE'}</div>
                   </div>
                   <div className="bg-black text-white px-3 py-1 text-sm font-black uppercase tracking-widest">{formData.verdict || 'STATUS'}</div>
                 </div>

                 <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="flex flex-col text-center p-3 border-2 border-black rounded-sm">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Distance</span>
                      <span className="text-xl font-black">{formData.totalDistance || '-'}</span>
                    </div>
                    <div className="flex flex-col text-center p-3 border-2 border-black rounded-sm">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Time</span>
                      <span className="text-xl font-black">{formData.totalDuration || '-'}</span>
                    </div>
                    <div className="flex flex-col text-center p-3 border-2 border-black rounded-sm">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Sessions</span>
                      <span className="text-xl font-black">{formData.sessions || '-'}</span>
                    </div>
                 </div>

                 <div className="space-y-4 mb-8 flex-1">
                   <div className="bg-gray-100 p-3 rounded-sm border-l-4 border-black">
                     <span className="block text-[10px] font-bold uppercase opacity-50 mb-1">Key Session</span>
                     <span className="font-bold">{formData.keySession || '-'}</span>
                   </div>
                   <div className="bg-gray-100 p-3 rounded-sm border-l-4 border-black">
                     <span className="block text-[10px] font-bold uppercase opacity-50 mb-1">Long Run</span>
                     <span className="font-bold">{formData.longRun || '-'}</span>
                   </div>
                   {formData.strength && (
                     <div className="bg-gray-100 p-3 rounded-sm border-l-4 border-gray-400">
                       <span className="block text-[10px] font-bold uppercase opacity-50 mb-1">Strength / Other</span>
                       <span className="font-bold text-gray-700">{formData.strength}</span></div>)}</div>

                  {formData.note && (
                    <div className="italic text-sm text-gray-600 border-t border-gray-300 pt-4 mt-auto">
                      &quot;{formData.note}&quot;
                    </div>
                  )}
                </>
              )}

              {template === 'training log' && (
                <>
                  <div className="flex justify-between items-start mb-8 pb-4 border-b border-[#3f3f46]">
                    <div>
                      <div className="text-xs uppercase text-gray-400 tracking-widest mb-1">{formData.dateRange || 'DATE RANGE'}</div>
                      <h1 className="text-2xl font-bold uppercase leading-none">{formData.title || 'TRAINING LOG'}</h1>
                    </div>
                    <div className="border border-[#3f3f46] px-2 py-1 text-[10px] uppercase tracking-widest text-[#a0cc00]">VERDICT: {formData.verdict}</div>
                  </div>

                  <div className="flex gap-4 mb-8">
                    <div className="bg-black border border-[#3f3f46] flex-1 p-4 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">DIST</span>
                      <span className="text-xl font-bold text-white leading-none">{formData.totalDistance || '-'}</span>
                    </div>
                    <div className="bg-black border border-[#3f3f46] flex-1 p-4 flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">TIME</span>
                      <span className="text-xl font-bold text-white leading-none">{formData.totalDuration || '-'}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8 flex-1 font-mono">
                     <div className="flex items-center gap-4">
                       <div className="text-[10px] text-gray-500 uppercase tracking-widest w-24">Key Session</div>
                       <div className="flex-1 border-b border-[#27272a] pb-1 truncate">{formData.keySession || '-'}</div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="text-[10px] text-gray-500 uppercase tracking-widest w-24">Long Run</div>
                       <div className="flex-1 border-b border-[#27272a] pb-1 truncate">{formData.longRun || '-'}</div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="text-[10px] text-gray-500 uppercase tracking-widest w-24">Strength</div>
                       <div className="flex-1 border-b border-[#27272a] pb-1 truncate">{formData.strength || '-'}</div>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="text-[10px] text-gray-500 uppercase tracking-widest w-24">Sessions</div>
                       <div className="flex-1 border-b border-[#27272a] pb-1 truncate">{formData.sessions || '-'}</div>
                     </div>
                  </div>

                  {formData.note && (
                    <div className="italic text-sm text-gray-400 border-t border-[#27272a] pt-4 mt-auto">
                       &quot;{formData.note}&quot;
                    </div>
                  )}
                </>
              )}

              {template === 'dark carbon' && (
                <>
                  <div className="mb-8 border-l-2 border-primary-coral pl-4">
                    <p className="font-mono text-[10px] text-secondary-lime uppercase tracking-widest mb-1">{formData.dateRange || 'DATE RANGE'}</p>
                    <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{formData.title || 'TRAINING WEEK'}</h1>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 font-mono">
                     <div className="bg-[#181a1f] border border-[#22252a] p-4 rounded-lg flex flex-col justify-center">
                       <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Volume</span>
                       <span className="text-2xl font-black font-mono">{formData.totalDistance || '-'}</span>
                     </div>
                     <div className="bg-[#181a1f] border border-[#22252a] p-4 rounded-lg flex flex-col justify-center">
                       <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Time</span>
                       <span className="text-2xl font-black font-mono">{formData.totalDuration || '-'}</span>
                     </div>
                  </div>

                  <div className="space-y-3 mb-6 bg-[#16181c] border border-[#22252a] p-4 rounded-lg text-sm flex-1 font-mono">
                     <div className="flex justify-between border-b border-[#22252a] pb-2">
                       <span className="text-gray-500 uppercase text-xs">Sessions</span>
                       <span className="font-bold">{formData.sessions || '-'}</span>
                     </div>
                     <div className="flex flex-col border-b border-[#22252a] pb-2 pt-1">
                       <span className="text-gray-500 uppercase text-xs mb-1">Key Session</span>
                       <span className="font-bold">{formData.keySession || '-'}</span>
                     </div>
                     <div className="flex flex-col pb-1 pt-1">
                       <span className="text-gray-500 uppercase text-xs mb-1">Long Run</span>
                       <span className="font-bold">{formData.longRun || '-'}</span>
                     </div>
                  </div>

                  <div className="mt-auto border-t border-[#22252a] pt-4 flex gap-4">
                    <div className="flex-1">
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Verdict</span>
                      <div className="inline-block bg-[#22252a] px-2 py-1 text-xs font-bold uppercase rounded text-gray-300">{formData.verdict || '-'}</div>
                    </div>
                    {formData.note && (
                      <div className="flex-1 border-l border-[#22252a] pl-4 text-xs italic text-gray-400 font-serif overflow-hidden">
                        &quot;{formData.note}&quot;
                      </div>
                    )}
                  </div>
                  
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
           <SharedTemplates template={template} formData={formData} componentName="TrainingWeekGenerator"  />
         )}
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
          localTemplates={[
            {
              "id": "weekly board",
              "label": "Weekly Board"
            },
            {
              "id": "training log",
              "label": "Training Log"
            },
            {
              "id": "dark carbon",
              "label": "Dark Carbon Summary"
            }
          ]}
        />
      </div>
    </div>
  );
} 
