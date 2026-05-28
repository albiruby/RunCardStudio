/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, Eye } from "lucide-react";

interface RaceBibProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';

export default function RaceBibGenerator({ previewRef, showToast }: RaceBibProps) {
  const unit = getUnit();
  const [formData, setFormData] = useState({
    runnerName: "",
    bibNumber: "",
    eventName: "",
    distance: "",
    targetTime: "",
    teamCountry: "",
    date: "",
    themeColor: "red"
  });

  const [template, setTemplate] = useState("classic");
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
    if (formData.runnerName !== undefined && formData.runnerName !== null && (formData.runnerName as any) !== false && (formData.runnerName as any) !== "—" && (formData.runnerName as any) !== "Input required" && String(formData.runnerName).trim() !== "") {
      const val = typeof formData.runnerName === 'boolean' ? 'Yes' : formData.runnerName;
      lines.push("Runner Name: " + val);
    }
    if (formData.bibNumber !== undefined && formData.bibNumber !== null && (formData.bibNumber as any) !== false && (formData.bibNumber as any) !== "—" && (formData.bibNumber as any) !== "Input required" && String(formData.bibNumber).trim() !== "") {
      const val = typeof formData.bibNumber === 'boolean' ? 'Yes' : formData.bibNumber;
      lines.push("Bib Number: " + val);
    }
    if (formData.eventName !== undefined && formData.eventName !== null && (formData.eventName as any) !== false && (formData.eventName as any) !== "—" && (formData.eventName as any) !== "Input required" && String(formData.eventName).trim() !== "") {
      const val = typeof formData.eventName === 'boolean' ? 'Yes' : formData.eventName;
      lines.push("Event Name: " + val);
    }
    if (formData.distance !== undefined && formData.distance !== null && (formData.distance as any) !== false && (formData.distance as any) !== "—" && (formData.distance as any) !== "Input required" && String(formData.distance).trim() !== "") {
      const val = typeof formData.distance === 'boolean' ? 'Yes' : formData.distance;
      lines.push("Distance: " + val);
    }
    if (formData.targetTime !== undefined && formData.targetTime !== null && (formData.targetTime as any) !== false && (formData.targetTime as any) !== "—" && (formData.targetTime as any) !== "Input required" && String(formData.targetTime).trim() !== "") {
      const val = typeof formData.targetTime === 'boolean' ? 'Yes' : formData.targetTime;
      lines.push("Target Time: " + val);
    }
    if (formData.teamCountry !== undefined && formData.teamCountry !== null && (formData.teamCountry as any) !== false && (formData.teamCountry as any) !== "—" && (formData.teamCountry as any) !== "Input required" && String(formData.teamCountry).trim() !== "") {
      const val = typeof formData.teamCountry === 'boolean' ? 'Yes' : formData.teamCountry;
      lines.push("Team Country: " + val);
    }
    if (formData.date !== undefined && formData.date !== null && (formData.date as any) !== false && (formData.date as any) !== "—" && (formData.date as any) !== "Input required" && String(formData.date).trim() !== "") {
      const val = typeof formData.date === 'boolean' ? 'Yes' : formData.date;
      lines.push("Date: " + val);
    }
    if (formData.themeColor !== undefined && formData.themeColor !== null && (formData.themeColor as any) !== false && (formData.themeColor as any) !== "—" && (formData.themeColor as any) !== "Input required" && String(formData.themeColor).trim() !== "") {
      const val = typeof formData.themeColor === 'boolean' ? 'Yes' : formData.themeColor;
      lines.push("Theme Color: " + val);
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

  const colorMap: Record<string, string> = {
    red: "bg-[#ff2020]",
    blue: "bg-[#2040ff]",
    green: "bg-[#20c040]",
    black: "bg-[#111111]",
    coral: "bg-primary-coral",
    lime: "bg-secondary-lime"
  };

  const borderMap: Record<string, string> = {
    red: "border-[#ff2020]",
    blue: "border-[#2040ff]",
    green: "border-[#20c040]",
    black: "border-[#111111]",
    coral: "border-primary-coral",
    lime: "border-secondary-lime"
  };

  const textMap: Record<string, string> = {
    red: "text-[#e01010]",
    blue: "text-[#1030e0]",
    green: "text-[#10a030]",
    black: "text-[#111111]",
    coral: "text-primary-coral",
    lime: "text-[#a0cc00]"
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
      cardType: "race-bib",
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
             if (draft && draft.cardType === "race-bib") {
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
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)_minmax(300px,380px)] gap-6 w-full">
      {/* COLUMN 1: CONFIGURATION */}
      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">BIB DATA</h2>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Log details</p>
          </div>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Runner Name</label>
             <input 
               type="text" 
               value={formData.runnerName}
               onChange={e => handleChange("runnerName", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="ALEX SMITH"
             />
          </div>
          
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Bib Number</label>
             <input 
               type="text" 
               value={formData.bibNumber}
               onChange={e => handleChange("bibNumber", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-2xl font-black font-mono text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="1337"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Event Name</label>
             <input 
               type="text" 
               value={formData.eventName}
               onChange={e => handleChange("eventName", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="CITY MARATHON"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Distance</label>
               <input 
                 type="text" 
                 value={formData.distance}
                 onChange={e => handleChange("distance", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="42.2K"
               />
            </div>
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Target</label>
               <input 
                 type="text" 
                 value={formData.targetTime}
                 onChange={e => handleChange("targetTime", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary font-mono outline-none focus:border-secondary-lime transition-all"
                 placeholder="2:59:59"
               />
            </div>
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Team / Country</label>
               <input 
                 type="text" 
                 value={formData.teamCountry}
                 onChange={e => handleChange("teamCountry", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="USA"
               />
            </div>
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date/Year</label>
               <input 
                 type="text" 
                 value={formData.date}
                 onChange={e => handleChange("date", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="2026"
               />
            </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Theme Color</label>
             <div className="flex gap-2">
               {['red', 'blue', 'green', 'black', 'coral', 'lime'].map(c => (
                 <button
                   key={c}
                   onClick={() => handleChange("themeColor", c)}
                   className={`w-8 h-8 rounded-full border-2 ${formData.themeColor === c ? 'border-white outline outline-2 outline-gray-500 scale-110' : 'border-transparent'} ${colorMap[c] || 'bg-gray-500'} transition-all`}
                 ></button>
               ))}
             </div>
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs tracking-wider font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2.5 bg-transparent border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:bg-gray-800" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-4 h-4 " style={{ color: activeAccent.hex }} /> COPY BIB</button>
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
              className={`${getExportSizeClasses(exportSize, template)}` + ` relative flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 select-none overflow-hidden
                ${template === 'classic' ? ' bg-[#f8f9fa] text-black rounded px-8 py-6 border-2 border-gray-300' : ''}
                ${template === 'elite' ? 'w-[480px] h-[380px] bg-white text-black p-0 rounded-md border border-gray-200' : ''}
                ${template === 'minimal' ? 'w-[440px] h-[440px] bg-[#121316] text-[#f2f4f7] rounded-xl border border-[#22252a] p-8' : ''}
              `}
            >
              {['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) ? (
                <SharedTemplates template={template} formData={formData} componentName="RaceBibGenerator" />
              ) : (
                <>
                  {template === 'classic' && (
                    <>
                      {/* Safety Pin Holes */}
                      <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-[#e2e4e7] shadow-inner inset-0 m-auto mt-1 ml-1" style={{ width: '12px', height: '12px', right: 'auto', bottom: 'auto' }}></div>
                      <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#e2e4e7] shadow-inner"></div>
                      <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-[#e2e4e7] shadow-inner"></div>
                      <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-[#e2e4e7] shadow-inner"></div>
                      
                      {/* Top Header */}
                      <div className={`w-full h-12 mb-4 flex items-center justify-between px-4 text-white font-black uppercase tracking-wider rounded-sm ${colorMap[formData.themeColor] || 'bg-[#2040ff]'}`}>
                        <span className="text-sm truncate mr-4">{formData.eventName || 'EVENT NAME'}</span>
                        <span className="text-xl font-mono shrink-0">{formData.date || '2026'}</span>
                      </div>

                      {/* Number Area */}
                      <div className="flex-1 flex flex-col items-center justify-center -mt-2">
                         <div className="text-[110px] font-black font-mono leading-none tracking-tighter text-black w-full text-center truncate px-4">
                           {formData.bibNumber || '0000'}
                         </div>
                      </div>

                      {/* Bottom Area */}
                      <div className={`w-full flex justify-between items-end border-t-4 pt-2 -mb-2 ${borderMap[formData.themeColor] || 'border-[#2040ff]'}`}>
                        <div>
                          <div className="font-extrabold text-2xl uppercase tracking-tighter leading-none mb-1">{formData.runnerName || 'NAME'}</div>
                          <div className="text-xs font-bold font-mono text-gray-500 uppercase">{formData.teamCountry || 'TEAM/COUNTRY'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-xl font-mono">{formData.distance || 'DIST'}</div>
                          {formData.targetTime && <div className="text-[10px] font-bold text-gray-400 uppercase">Target: {formData.targetTime}</div>}
                        </div>
                      </div>
                    </>
                  )}

                  {template === 'elite' && (
                    <>
                      {/* Safety Pin Holes */}
                      <div className="absolute top-3 left-3 w-4 h-4 rounded-full border-4 border-gray-200 bg-white"></div>
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full border-4 border-gray-200 bg-white"></div>
                      <div className="absolute bottom-3 left-3 w-4 h-4 rounded-full border-4 border-gray-200 bg-white"></div>
                      <div className="absolute bottom-3 right-3 w-4 h-4 rounded-full border-4 border-gray-200 bg-white"></div>

                      {/* Background Elements */}
                      <div className="absolute inset-0 opacity-[0.03] overflow-hidden pointer-events-none flex items-center justify-center">
                         <div className="w-[150%] h-[150%] flex flex-wrap -m-4">
                            {Array(100).fill(0).map((_, i) => (
                               <div key={i} className="text-9xl font-black leading-none transform -rotate-45">ELITE</div>
                            ))}
                         </div>
                      </div>

                      {/* Header Stripe */}
                      <div className={`absolute left-0 top-0 w-8 h-full ${colorMap[formData.themeColor] || 'bg-black'}`}></div>

                      <div className="pl-12 pr-6 py-6 h-full flex flex-col w-full relative z-10">
                        <div className="flex justify-between items-start mb-auto">
                           <div className={`font-black text-xl uppercase ${textMap[formData.themeColor] || 'text-black'} tracking-widest`}>{formData.eventName || 'EVENT NAME'} {formData.date}</div>
                           {(formData.distance || formData.targetTime) && (
                             <div className={`px-3 py-1 text-xs font-black uppercase text-white ${colorMap[formData.themeColor] || 'bg-black'} rounded-sm`}>
                               {formData.distance} {formData.targetTime && ` // ${formData.targetTime}`}
                             </div>
                           )}
                        </div>

                        <div className="flex flex-col items-center justify-center my-6">
                           <span className="text-[130px] leading-none font-black tracking-tighter text-black w-full text-center truncate">
                             {formData.bibNumber || '000'}
                           </span>
                        </div>

                        <div className="mt-auto border-t-2 border-dashed border-gray-300 pt-3 flex justify-between items-end">
                           <div className="text-4xl font-extrabold uppercase tracking-tight truncate max-w-[70%]">{formData.runnerName || 'NAME'}</div>
                           {formData.teamCountry && <div className="text-lg font-black uppercase bg-gray-100 px-3 py-1 border border-gray-300">{formData.teamCountry}</div>}
                        </div>
                      </div>
                    </>
                  )}

                  {template === 'minimal' && (
                    <>
                      {/* Safety Pin Holes */}
                      <div className="absolute top-4 left-4 w-2 h-2 rounded-full border border-[#22252a] bg-[#090a0c]"></div>
                      <div className="absolute top-4 right-4 w-2 h-2 rounded-full border border-[#22252a] bg-[#090a0c]"></div>
                      <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full border border-[#22252a] bg-[#090a0c]"></div>
                      <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full border border-[#22252a] bg-[#090a0c]"></div>

                      <div className="flex justify-between items-start mb-6">
                         <div>
                           <div className="text-white font-black text-2xl uppercase tracking-tighter">{formData.distance}</div>
                           <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Distance</div>
                         </div>
                         <div className={`text-right ${textMap[formData.themeColor] || 'text-white'}`}>
                           <div className="font-black text-2xl uppercase tracking-tighter">{formData.targetTime}</div>
                           <div className="text-[10px] font-mono uppercase tracking-widest opacity-60">Target Time</div>
                         </div>
                      </div>

                      <div className="flex flex-col items-center justify-center flex-1 my-4 bg-black/40 rounded-xl border border-white/5 py-4">
                         <div className={`text-[120px] font-mono font-black leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] w-full text-center truncate ${textMap[formData.themeColor] || 'text-white'}`}>
                            {formData.bibNumber || '-'}
                         </div>
                      </div>

                      <div className="mt-4">
                        <h2 className="text-3xl font-black text-white uppercase tracking-tight truncate leading-none mb-1">{formData.runnerName || 'NAME'}</h2>
                        <p className="font-mono text-xs uppercase opacity-50 flex items-center justify-between">
                          <span>{formData.eventName} {formData.date}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${colorMap[formData.themeColor] || 'bg-white'} text-black`}>{formData.teamCountry}</span>
                        </p>
                      </div>
                    </>               
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
              "id": "classic",
              "label": "Classic Bib"
            },
            {
              "id": "elite",
              "label": "Elite Bib"
            },
            {
              "id": "minimal",
              "label": "Minimal Bib"
            }
          ]}
        />
      </div>
    </div>
  );
}
