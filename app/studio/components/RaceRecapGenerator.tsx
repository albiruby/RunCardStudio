/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector from './TemplateSelector';
import { Copy, Save, AlertCircle } from "lucide-react";

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
       return formData.avgPace || "4:38/{unit}";
    }

    const distStr = formData.distance || "42.2";
    const dist = parseFloat(distStr);
    const timeStr = formData.finishTime || "03:15:24";
    if (isNaN(dist) || dist <= 0 || !timeStr) return "4:38/{unit}";
    
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
    return `${mins}:${secs}/{unit}`;
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
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Race Data</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
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
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Distance</label>
               <input 
                 type="text" 
                 value={formData.distance}
                 onChange={e => handleChange("distance", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary outline-none transition-colors ${isDistanceInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="42.2 KM"
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
                placeholder="e.g. 4:38 /{unit}"
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

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopyRecap} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY RECAP
</button>
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
    "label": "Dark Carbon"
  },
  {
    "id": "white",
    "label": "Clean White"
  },
  {
    "id": "poster",
    "label": "Race Poster"
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
                ${template === 'carbon' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] p-8 rounded-lg' : ''}
                ${template === 'white' ? 'bg-[#fafafa] text-[#09090b] p-8 border border-[#e4e4e7] rounded-xl shadow-lg' : ''}
                ${template === 'poster' ? 'bg-primary-action text-white p-8 rounded-none' : ''}
              `}
            >
               <div className="mb-6 flex justify-between items-start">
                 <div>
                   <h1 className="text-3xl font-black uppercase tracking-tighter mb-1 leading-tight text-text-primary">{formData.raceName.trim() || 'CHICAGO MARATHON'}</h1>
                   <p className="font-mono text-xs opacity-75 uppercase tracking-widest text-[#ccff00]">
                     {[formData.date || new Date().toISOString().split('T')[0], formData.location.trim() || 'CHICAGO, IL'].filter(Boolean).join(' // ') || 'Date | Location'}
                   </p>
                 </div>
                 {(formData.rank.trim() || "PR (#246)") && (
                   <div className={`font-mono text-base font-black px-3 py-1 border rounded uppercase whitespace-nowrap transition-all
                      ${template === 'carbon' ? 'text-[#ccff00] border-[#ccff00] bg-surface bg-opacity-40' : ''}
                      ${template === 'white' ? 'bg-[#18181b] text-white border-[#18181b]' : ''}
                      ${template === 'poster' ? 'bg-white text-primary-action border-transparent font-black' : ''}
                   `}>
                     {formData.rank.trim() || 'PR (#246)'}
                               </div>
)}
               </div>

               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`p-4 border rounded flex flex-col items-center justify-center text-center transition-all
                    ${template === 'carbon' ? 'bg-[#1c1d22] border-[#22252a]' : ''}
                    ${template === 'white' ? 'bg-white border-[#e4e4e7] shadow-sm' : ''}
                    ${template === 'poster' ? 'bg-white/10 border-white/20' : ''}
                  `}>
                    <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest mb-1">Distance</p>
                    <p className={`font-mono text-3xl font-black uppercase ${template === 'carbon' ? 'text-text-primary' : template === 'white' ? 'text-black' : 'text-white'}`}>{formData.distance.trim() || '42.2 KM'}</p>
                  </div>
                  <div className={`p-4 border rounded flex flex-col items-center justify-center text-center transition-all
                    ${template === 'carbon' ? 'bg-[#1c1d22] border-[#22252a]' : ''}
                    ${template === 'white' ? 'bg-white border-[#e4e4e7] shadow-sm' : ''}
                    ${template === 'poster' ? 'bg-white/10 border-white/20' : ''}
                  `}>
                    <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest mb-1">Time</p>
                    <p className={`font-mono text-3xl font-black uppercase text-primary-coral`}>{formData.finishTime.trim() || '03:15:24'}</p>
                  </div>
                  <div className={`col-span-2 p-4 border rounded flex flex-col items-center justify-center text-center transition-all
                    ${template === 'carbon' ? 'bg-[#1c1d22] border-[#22252a]' : ''}
                    ${template === 'white' ? 'bg-white border-[#e4e4e7] shadow-sm' : ''}
                    ${template === 'poster' ? 'bg-white/10 border-white/20' : ''}
                  `}>
                    <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest mb-1">Avg Pace</p>
                    <p className={`font-mono text-3xl font-black uppercase ${template === 'carbon' ? 'text-[#ccff00]' : template === 'white' ? 'text-black' : 'text-white'}`}>{currentPace}</p>
                  </div>
               </div>

               {(formData.bestMoment.trim() || "CROWD YELLING AT MILE 20 GAVE ME A SECOND WIND.") && (
                 <div className={`mb-6 p-4 border-l-4 transition-all
                   ${template === 'carbon' ? 'border-[#ccff00] bg-[#181a1f]' : ''}
                   ${template === 'white' ? 'border-[#09090b] bg-[#f4f4f5]' : ''}
                   ${template === 'poster' ? 'border-white bg-white/10' : ''}
                 `}>
                   <p className="font-mono text-[10px] opacity-60 uppercase tracking-widest mb-1.5">Moment of the Match</p>
                   <p className="italic font-serif text-base leading-relaxed">&ldquo;{formData.bestMoment.trim() || 'CROWD YELLING AT MILE 20 GAVE ME A SECOND WIND.'}&rdquo;</p>
                             </div>
              )}
{(formData.nextTarget.trim() || "SUB 3:10 AT BOSTON") && (
                 <div className="flex justify-between items-center py-4 border-t border-b border-opacity-20 mb-8 font-mono text-xs uppercase tracking-wider">
                   <span className="opacity-60">Next Mission Target</span>
                   <span className="font-black text-primary-coral">{formData.nextTarget.trim() || 'SUB 3:10 AT BOSTON'}</span>
                             </div>
              )}

</div>
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
             <SharedTemplates template={template} formData={formData} componentName="RaceRecapGenerator"  />
           )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
