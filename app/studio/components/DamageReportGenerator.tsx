/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, Eye } from "lucide-react";

interface DamageReportProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';

export default function DamageReportGenerator({ previewRef, showToast }: DamageReportProps) {
  const unit = getUnit();
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
      exportSize: typeof exportSize !== 'undefined' ? exportSize : "square",
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
             }
          }
       }
    } catch {}
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)_minmax(300px,380px)] gap-6 w-full">
      {/* COLUMN 1: CONFIGURATION */}
      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">SESSION DATA</h2>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Log details</p>
          </div>
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
                 placeholder={`32${unit}`}
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

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs tracking-wider font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2.5 bg-transparent border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:bg-gray-800" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-4 h-4 " style={{ color: activeAccent.hex }} /> COPY REPORT</button>
        </div>
      </div>

      {/* COLUMN 2: LIVE PREVIEW */}
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] xl:self-start min-h-[calc(100vh-140px)] min-w-0">
        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-center gap-1.5 animate-pulse">
            <Eye className="w-3.5 h-3.5 " style={{ color: activeAccent.hex }} />
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">LIVE PREVIEW</h2>
          </div>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">REPRESENTS COMPLETED CANVAS</p>
        </div>

        {/* Scalable Container for preview */}
        <div ref={containerRef} className="w-full bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:16px_16px] bg-[#07080a] border border-brand-border rounded-xl p-4 md:p-8 flex items-center justify-center flex-1 min-h-[500px] xl:min-h-[600px] relative shadow-inner overflow-clip">
          <div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) scale(${scale})`, 
              transformOrigin: 'center center',
              transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)" 
            }}
          >
            <div
              ref={previewRef}
              className={`${getExportSizeClasses(exportSize, template)}` + `  flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none
                ${template === 'brutal' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] p-8 rounded-lg' : ''}
                ${template === 'receipt' ? 'bg-[#fafafa] text-black border border-[#e4e4e7] p-8 rounded-none' : ''}
                ${template === 'neon' ? 'bg-[#020203] border p-8 text-[#fafafa] rounded-xl shadow-[0_0_30px_rgba(255,0,85,0.15)]' : ''}
              `}
              style={template === 'neon' ? { borderColor: `${activeAccent.hex}4d`, boxShadow: `0 0 30px ${activeAccent.hex}26` } : undefined}
            >
              {['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) ? (
                <SharedTemplates template={template} formData={formData} componentName="DamageReportGenerator" />
              ) : (
                <>
                  {/* Header */}
                  <div className={`mb-6 pb-4 border-b ${template === 'neon' ? '' : (template === 'receipt' ? 'border-dashed border-gray-400' : 'border-[#22252a]')}`} style={template === 'neon' ? { borderColor: `${activeAccent.hex}4d` } : undefined}>
                     <h1 
                       className={`text-3xl font-black uppercase tracking-tighter leading-none mb-1`}
                       style={template === 'neon' ? { color: activeAccent.hex, filter: `drop-shadow(0 0 8px ${activeAccent.hex}80)` } : undefined}
                     >
                       Damage Report
                     </h1>
                     <p 
                       className={`font-mono text-sm uppercase tracking-widest ${template === 'receipt' ? 'text-gray-500' : ''}`}
                       style={template !== 'receipt' ? { color: activeAccent.hex } : undefined}
                     >
                       {formData.sessionType || 'SESSION'} {formData.distance && `// ${formData.distance}`} {formData.duration && `// ${formData.duration}`}
                     </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`p-4 rounded-md border ${template === 'neon' ? 'bg-black' : (template === 'receipt' ? 'border-gray-200' : 'bg-[#1c1d22] border-[#22252a]')}`} style={template === 'neon' ? { borderColor: `${activeAccent.hex}33` } : undefined}>
                       <div className="font-mono text-[10px] uppercase opacity-60 mb-1">Effort (RPE)</div>
                       <div className={`text-2xl font-black font-mono ${template === 'neon' ? 'text-white' : ''}`}>{formData.rpe}/10</div>
                    </div>
                    <div className={`p-4 rounded-md border ${template === 'neon' ? 'bg-black' : (template === 'receipt' ? 'border-gray-200' : 'bg-[#1c1d22] border-[#22252a]')}`} style={template === 'neon' ? { borderColor: `${activeAccent.hex}33` } : undefined}>
                       <div className="font-mono text-[10px] uppercase opacity-60 mb-1">Ego Status</div>
                       <div className={`text-xl font-bold uppercase truncate ${template === 'neon' ? 'text-white' : ''}`}>{formData.egoStatus || '-'}</div>
                    </div>
                  </div>

                  {/* List */}
                  <div 
                    className={`space-y-3 mb-6 p-4 rounded border ${template === 'receipt' ? 'border-gray-200 bg-gray-50' : 'bg-[#16181c] border-[#22252a]'}`}
                    style={
                      template === 'neon' 
                        ? { backgroundColor: `${activeAccent.hex}0d`, borderColor: `${activeAccent.hex}33`, color: activeAccent.hex } 
                        : template === 'receipt' 
                          ? undefined 
                          : { color: activeAccent.hex }
                    }
                  >
                    <div className="flex justify-between font-mono text-sm border-b border-opacity-20 pb-2 border-inherit">
                       <span className="uppercase opacity-70">Legs</span>
                       <span className="font-bold text-text-primary" style={template !== 'receipt' ? { color: '#ffffff' } : undefined}>{formData.legStatus || '-'}</span>
                    </div>
                    <div className="flex justify-between font-mono text-sm border-b border-opacity-20 pb-2 border-inherit">
                       <span className="uppercase opacity-70">Breathing</span>
                       <span className="font-bold text-text-primary" style={template !== 'receipt' ? { color: '#ffffff' } : undefined}>{formData.breathingStatus || '-'}</span>
                    </div>
                    <div className="flex justify-between font-mono text-sm border-b border-opacity-20 pb-2 border-inherit">
                       <span className="uppercase opacity-70">Weather</span>
                       <span className="font-bold text-text-primary" style={template !== 'receipt' ? { color: '#ffffff' } : undefined}>{formData.weatherExcuse || '-'}</span>
                    </div>
                    <div className="flex justify-between font-mono text-sm pt-1">
                       <span className="uppercase opacity-70">Recovery</span>
                       <span className="font-bold text-text-primary" style={template !== 'receipt' ? { color: '#ffffff' } : undefined}>{formData.recoveryNeed || '-'}</span>
                    </div>
                  </div>

                  {(formData.finalVerdict || formData.notes) && (
                    <div className={`mb-6 p-4 rounded-md border ${template === 'neon' ? 'bg-black text-white' : (template === 'receipt' ? 'border-gray-300' : 'bg-[#1c1d22] border-primary-coral')}`} style={template === 'neon' ? { borderColor: `${activeAccent.hex}66` } : undefined}>
                      {formData.finalVerdict && (
                         <div className="mb-2">
                           <span className={`font-mono text-[10px] uppercase block mb-1`} style={template !== 'receipt' ? { color: activeAccent.hex } : undefined}>Final Verdict</span>
                           <span className="font-black text-xl uppercase tracking-wide">{formData.finalVerdict}</span>
                         </div>
                       )}
                       {formData.notes && (
                         <div className={`text-sm italic font-serif ${template === 'receipt' ? 'text-gray-600' : 'text-gray-400'}`}>&quot;{formData.notes}&quot;</div>
                       )}
                    </div>
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
                </>
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
      <div className="flex flex-col gap-4 xl:sticky xl:top-[128px] min-w-0">
        <div className="flex flex-col gap-0.5 px-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#f2f4f7] font-mono">STYLE CONTROLS</span>
          <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">Tweak appearance</p>
        </div>
        
        <TemplateSelector 
          activeTemplate={template}
          onSelectTemplate={setTemplate}
          localTemplates={[
            {
              "id": "brutal",
              "label": "Brutal Report"
            },
            {
              "id": "receipt",
              "label": "Dark Receipt"
            },
            {
              "id": "neon",
              "label": "Neon Damage"
            }
          ]}
        />
      </div>
    </div>
  );
}