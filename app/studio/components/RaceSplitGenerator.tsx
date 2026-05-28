/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, AlertCircle, Eye } from "lucide-react";

interface RaceSplitProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

const DISTANCES = {
  "5K": 5,
  "10K": 10,
  "Half Marathon": 21.0975,
  "Marathon": 42.195,
  "Custom": 0,
};

const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';

export default function RaceSplitGenerator({ previewRef, showToast }: RaceSplitProps) {
  const [formData, setFormData] = useState({
    distanceChoice: "Half Marathon",
    customDistance: "",
    hr: "",
    min: "",
    sec: "",
    interval: "5",
    strategy: "Even Split"
  });

  const unit = getUnit();
  const [template, setTemplate] = useState("table");
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

  const getDistance = () => {
    if (formData.distanceChoice === "Custom") {
      return parseFloat(formData.customDistance) || 0;
    }
    return DISTANCES[formData.distanceChoice as keyof typeof DISTANCES] || 0;
  };

  // Validation
  const hrVal = parseInt(formData.hr);
  const minVal = parseInt(formData.min);
  const secVal = parseInt(formData.sec);
  const isTimeInvalid = isNaN(hrVal) || isNaN(minVal) || isNaN(secVal) || hrVal < 0 || minVal < 0 || minVal >= 60 || secVal < 0 || secVal >= 60;
  
  const calculateSplits = () => {
    const dist = getDistance();
    const h = isNaN(hrVal) ? 0 : hrVal;
    const m = isNaN(minVal) ? 0 : minVal;
    const s = isNaN(secVal) ? 0 : secVal;
    const totalSeconds = h * 3600 + m * 60 + s;
    const interval = parseFloat(formData.interval) || 5;

    if (dist <= 0 || totalSeconds <= 0 || interval <= 0) return [];

    const splits = [];
    const avgSecondsPerKm = totalSeconds / dist;
    let currentCumulativeSeconds = 0;

    let currentMarker = interval;
    while (currentMarker < dist) {
       let thisSplitSeconds = interval * avgSecondsPerKm;

       // Strategy modifiers
       if (formData.strategy === "Negative Split") {
          // first half 2% slower, second half 2% faster (approx)
          if (currentMarker <= dist / 2) {
             thisSplitSeconds *= 1.02;
          } else {
             thisSplitSeconds *= 0.98;
          }
       } else if (formData.strategy === "Conservative Start") {
          // first 20% slower
          if (currentMarker <= dist * 0.2) {
             thisSplitSeconds *= 1.04;
          } else if (currentMarker >= dist * 0.8) {
             thisSplitSeconds *= 0.96;
          }
       } else if (formData.strategy === "Aggressive Start") {
          if (currentMarker <= dist * 0.2) {
             thisSplitSeconds *= 0.96;
          } else {
             thisSplitSeconds *= 1.02;
          }
       }

       currentCumulativeSeconds += thisSplitSeconds;

       splits.push({
         marker: currentMarker,
         splitPace: thisSplitSeconds / interval, // seconds per km/mi
         cumTime: currentCumulativeSeconds
       });
       currentMarker += interval;
    }

    // Final split (remaining fraction)
    const remainingDist = dist - (currentMarker - interval);
    if (remainingDist > 0.01) {
       const finalSplitSeconds = totalSeconds - currentCumulativeSeconds;
       splits.push({
         marker: dist,
         splitPace: finalSplitSeconds / remainingDist, // seconds per km/mi
         cumTime: totalSeconds
       });
    } else if (splits.length > 0) {
      // Adjustment to ensure exact target time
      splits[splits.length - 1].marker = dist;
      splits[splits.length - 1].cumTime = totalSeconds;
    }

    return splits;
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "—";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatPace = (secsPerKm: number) => {
    if (isNaN(secsPerKm) || secsPerKm <= 0) return "—";
    const m = Math.floor(secsPerKm / 60);
    const s = Math.floor(secsPerKm % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const splits = calculateSplits();

  // Highlight logic for pacing
  const dist = getDistance();
  const rawSecs = (parseInt(formData.hr) || 0) * 3600 + (parseInt(formData.min) || 0) * 60 + (parseInt(formData.sec) || 0);
  const avgPaceSecs = dist > 0 ? rawSecs / dist : 0;
  const handleCopySplits = () => {
    const lines = [];
    if (formData.distanceChoice !== undefined && formData.distanceChoice !== null && (formData.distanceChoice as any) !== false && (formData.distanceChoice as any) !== "—" && (formData.distanceChoice as any) !== "Input required" && String(formData.distanceChoice).trim() !== "") {
      const val = typeof formData.distanceChoice === 'boolean' ? 'Yes' : formData.distanceChoice;
      lines.push("Distance Choice: " + val);
    }
    if (formData.customDistance !== undefined && formData.customDistance !== null && (formData.customDistance as any) !== false && (formData.customDistance as any) !== "—" && (formData.customDistance as any) !== "Input required" && String(formData.customDistance).trim() !== "") {
      const val = typeof formData.customDistance === 'boolean' ? 'Yes' : formData.customDistance;
      lines.push("Custom Distance: " + val);
    }
    if (formData.hr !== undefined && formData.hr !== null && (formData.hr as any) !== false && (formData.hr as any) !== "—" && (formData.hr as any) !== "Input required" && String(formData.hr).trim() !== "") {
      const val = typeof formData.hr === 'boolean' ? 'Yes' : formData.hr;
      lines.push("Hr: " + val);
    }
    if (formData.min !== undefined && formData.min !== null && (formData.min as any) !== false && (formData.min as any) !== "—" && (formData.min as any) !== "Input required" && String(formData.min).trim() !== "") {
      const val = typeof formData.min === 'boolean' ? 'Yes' : formData.min;
      lines.push("Min: " + val);
    }
    if (formData.sec !== undefined && formData.sec !== null && (formData.sec as any) !== false && (formData.sec as any) !== "—" && (formData.sec as any) !== "Input required" && String(formData.sec).trim() !== "") {
      const val = typeof formData.sec === 'boolean' ? 'Yes' : formData.sec;
      lines.push("Sec: " + val);
    }
    if (formData.interval !== undefined && formData.interval !== null && (formData.interval as any) !== false && (formData.interval as any) !== "—" && (formData.interval as any) !== "Input required" && String(formData.interval).trim() !== "") {
      const val = typeof formData.interval === 'boolean' ? 'Yes' : formData.interval;
      lines.push("Interval: " + val);
    }
    if (formData.strategy !== undefined && formData.strategy !== null && (formData.strategy as any) !== false && (formData.strategy as any) !== "—" && (formData.strategy as any) !== "Input required" && String(formData.strategy).trim() !== "") {
      const val = typeof formData.strategy === 'boolean' ? 'Yes' : formData.strategy;
      lines.push("Strategy: " + val);
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
      cardType: "race-split",
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
             if (draft && draft.cardType === "race-split") {
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
            <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">RACE CONFIGURATION</h2>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Log details</p>
          </div>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
            <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Race Distance</label>
            <select 
              value={formData.distanceChoice}
              onChange={e => handleChange("distanceChoice", e.target.value)}
              className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer transition-colors"
            >
              <option value="5K">5K</option>
              <option value="10K">10K</option>
              <option value="Half Marathon">Half Marathon</option>
              <option value="Marathon">Marathon</option>
              <option value="Custom">Custom ({unit})</option>
            </select>
          </div>

          {formData.distanceChoice === "Custom" && (
            <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Custom Distance ({unit})</label>
              <input 
                type="number" 
                step="0.1"
                value={formData.customDistance}
                onChange={e => handleChange("customDistance", e.target.value)}
                className="w-full bg-surface-lowest border p-2.5 rounded text-sm text-text-primary outline-none transition-colors border-brand-border focus:border-secondary-lime"
                placeholder="e.g. 15.0"
              />
            </div>
          )}

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Target Finish Time (HH:MM:SS)</label>
             <div className="flex items-center gap-2">
               <input 
                 type="text" 
                 maxLength={2}
                 value={formData.hr}
                 onChange={e => handleChange("hr", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2.5 rounded text-center font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="01"
               />
               <span className="font-bold">:</span>
               <input 
                 type="text" 
                 maxLength={2}
                 value={formData.min}
                 onChange={e => handleChange("min", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2.5 rounded text-center font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="45"
               />
               <span className="font-bold">:</span>
               <input 
                 type="text" 
                 maxLength={2}
                 value={formData.sec}
                 onChange={e => handleChange("sec", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2.5 rounded text-center font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="00"
               />
             </div>
             {isTimeInvalid && (
               <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                 <AlertCircle className="w-3 h-3" /> Valid HH:MM:SS format required
               </p>
             )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Split Interval</label>
                <select 
                  value={formData.interval}
                  onChange={e => handleChange("interval", e.target.value)}
                  className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
                >
                  <option value="1">1 {unit}</option>
                  <option value="5">5 {unit}</option>
                </select>
             </div>
             <div>
                <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Strategy</label>
                <select 
                  value={formData.strategy}
                  onChange={e => handleChange("strategy", e.target.value)}
                  className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
                >
                  <option value="Even Split">Even Split</option>
                  <option value="Negative Split">Negative Split</option>
                  <option value="Conservative Start">Conservative</option>
                  <option value="Aggressive Start">Aggressive</option>
                </select>
             </div>
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs tracking-wider font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopySplits} className="w-full py-2.5 bg-transparent border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:bg-gray-800" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-4 h-4 " style={{ color: activeAccent.hex }} /> COPY SPLITS</button>
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
                ${template === 'carbon' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] p-6 rounded-lg' : ''}
                ${template === 'table' ? 'bg-[#0f1012] border border-[#22252a] p-0 rounded-lg overflow-hidden' : ''}
                ${template === 'plan' ? 'bg-[#fafafa] text-black p-8 font-sans border border-[#e4e4e7] rounded-xl' : ''}
              `}
            >
              {['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) ? (
                <SharedTemplates template={template} formData={formData} componentName="RaceSplitGenerator" />
              ) : (
                <>
                  {/* Header */}
                  <div className={`${template === 'table' ? 'bg-[#16181c] p-6 border-b border-[#22252a]' : (template === 'carbon' ? 'mb-6 pb-4 border-b border-[#22252a]' : 'mb-6 pb-4 border-b border-[#e4e4e7]')}`}>
                     <div className="flex justify-between items-start">
                       <div>
                         <h1 className={`text-2xl font-black uppercase tracking-tight leading-tight ${template === 'plan' ? 'text-black' : 'text-text-primary'}`}>
                           {formData.distanceChoice === 'Custom' ? (formData.customDistance || '21.1') + ' ' + unit : formData.distanceChoice}
                         </h1>
                         <p 
                           className={`font-mono text-xs uppercase tracking-widest ${template === 'plan' ? 'text-[#71717a]' : ''}`}
                           style={template !== 'plan' ? { color: activeAccent.hex } : undefined}
                         >
                           {formData.strategy}
                         </p>
                       </div>
                       <div className="text-right">
                         <p className={`font-mono text-xs uppercase tracking-widest ${template === 'plan' ? 'text-[#71717a]' : 'opacity-70'}`}>Target Time</p>
                         <p 
                           className={`font-mono text-xl font-black uppercase ${template === 'plan' ? 'text-black' : ''}`}
                           style={template !== 'plan' ? { color: activeAccent.hex } : undefined}
                         >
                           {(formData.hr.padStart(2, '0'))}:{(formData.min.padStart(2, '0'))}:{(formData.sec.padStart(2, '0'))}
                         </p>
                       </div>
                     </div>
                  </div>

                  {/* Table Content */}
                  <div className={`flex flex-col ${template === 'table' ? 'p-0' : ''}`}>
                     <div className={`grid grid-cols-3 gap-2 px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest border-b ${template === 'plan' ? 'border-[#e4e4e7] opacity-60' : 'border-[#22252a] opacity-70'}`}>
                       <div>Marker ({unit.toUpperCase()})</div>
                       <div className="text-center font-bold">Interval Pace</div>
                       <div className="text-right">Cumulative</div>
                     </div>

                     {splits.length === 0 ? (
                       <div className="p-6 text-center font-mono text-sm opacity-50">Invalid Inputs</div>
                     ) : (
                       <div className="flex flex-col">
                         {splits.map((split, i) => {
                           const isFaster = split.splitPace < avgPaceSecs - 2; // threshold for visual highlight
                           const isSlower = split.splitPace > avgPaceSecs + 2;

                           return (
                             <div key={i} className={`grid grid-cols-3 gap-2 px-6 py-3.2 font-mono text-sm border-b transition-colors ${template === 'plan' ? 'border-[#e4e4e7]' : 'border-[#22252a] border-opacity-30'}`}>
                               <div className={`font-black ${template === 'plan' ? 'text-black' : 'text-text-primary'}`}>
                                 {split.marker === dist ? (Number.isInteger(dist) ? dist : dist.toFixed(2)) : split.marker}
                               </div>
                               <div 
                                 className="text-center font-bold"
                                 style={template !== 'plan' ? (isFaster ? { color: activeAccent.hex } : isSlower ? { color: '#ff3330' } : { color: '#f2f4f7' }) : undefined}
                               >
                                 {formatPace(split.splitPace)}
                               </div>
                               <div 
                                 className={`text-right font-black ${template === 'plan' ? 'text-[#18181b]' : ''}`}
                                 style={template !== 'plan' && i === splits.length - 1 ? { color: activeAccent.hex } : undefined}
                               >
                                 {formatTime(split.cumTime)}
                               </div>
                             </div>
                           );
                         })}
                       </div>
                     )}
                  </div>

                  {/* Footer */}
                  <div className={`mt-4 ${template === 'table' ? 'bg-[#121316] p-4 border-t border-[#22252a]' : 'px-6 pt-4'} flex justify-between font-mono text-[9px] tracking-widest uppercase opacity-50`}>
                     <span>Avg Pace: {formatPace(avgPaceSecs)}/{unit}</span>
                  </div>
                  
                  {template === 'table' && (
                    <div className="h-1 w-full flex">
                       <div className="h-full flex-1" style={{ backgroundColor: activeAccent.hex }}></div>
                       <div className="h-full bg-secondary-lime flex-1" style={{ opacity: 0.8 }}></div>
                       <div className="h-full bg-[#00f0ff] flex-1" style={{ opacity: 0.6 }}></div>
                    </div>
                  )}

                  <div className={`mt-auto text-center font-mono text-[9px] tracking-[0.25em] uppercase pt-4 border-t ${
                    ['community challenge', 'weekly board', 'clean white', 'minimal award', 'minimal nutrition', 'minimal gear', 'classic', 'elite', 'receipt', 'white', 'table', 'minimal'].includes(template) 
                      ? 'border-dashed border-gray-400 text-gray-400' 
                      : 'border-dashed border-brand-border opacity-40 text-white'
                  }`}>
                    {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
                  </div>
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
              "id": "table",
              "label": "Performance Table"
            },
            {
              "id": "plan",
              "label": "Race Plan"
            },
            {
              "id": "carbon",
              "label": "Dark Carbon"
            }
          ]}
        />
      </div>
    </div>
  );
}
