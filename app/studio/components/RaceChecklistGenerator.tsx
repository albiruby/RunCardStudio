/* eslint-disable react-hooks/set-state-in-effect */
import SharedTemplates, { useExportSize, getExportSizeClasses } from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';
import { Copy, Save, Eye } from "lucide-react";

interface RaceChecklistProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';

export default function RaceChecklistGenerator({ previewRef, showToast }: RaceChecklistProps) {
  const unit = getUnit();
  const [formData, setFormData] = useState({
    title: "",
    shoes: false,
    socks: false,
    bib: false,
    watch: false,
    gel: false,
    bottle: false,
    cap: false,
    sunscreen: false,
    pins: false,
    clothes: false,
    towel: false,
    idcard: false,
    phone: false,
    cash: false,
    earbuds: false,
    custom1: "",
    custom2: "",
    custom3: ""
  });

  const [template, setTemplate] = useState("race day");
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

  const handleToggle = (field: keyof typeof formData) => {
    if (typeof formData[field] === 'boolean') {
      setFormData(prev => ({ ...prev, [field]: !prev[field] }));
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getChecklistItems = () => {
    const items = [];
    if (formData.bib) items.push("Race Bib");
    if (formData.pins) items.push("Safety Pins / Magnets");
    if (formData.shoes) items.push("Running Shoes");
    if (formData.socks) items.push("Race Socks");
    if (formData.watch) items.push("GPS Watch (Fully Charged)");
    if (formData.gel) items.push("Nutrition / Gels");
    if (formData.bottle) items.push("Water Bottle / Flask");
    if (formData.cap) items.push("Cap / Visor");
    if (formData.sunscreen) items.push("Sunscreen");
    if (formData.earbuds) items.push("Headphones / Earbuds");
    if (formData.phone) items.push("Phone");
    if (formData.idcard) items.push("ID Card / Medical Info");
    if (formData.cash) items.push("Cash / Public Transport Card");
    if (formData.clothes) items.push("Dry Clothes for After");
    if (formData.towel) items.push("Small Towel");
    if (formData.custom1) items.push(formData.custom1);
    if (formData.custom2) items.push(formData.custom2);
    if (formData.custom3) items.push(formData.custom3);
    return items;
  };

  const handleCopy = () => {
    const lines = [];
    if (formData.title !== undefined && formData.title !== null && (formData.title as any) !== false && (formData.title as any) !== "—" && (formData.title as any) !== "Input required" && String(formData.title).trim() !== "") {
      const val = typeof formData.title === 'boolean' ? 'Yes' : formData.title;
      lines.push("Title: " + val);
    }
    if (formData.shoes !== undefined && formData.shoes !== null && (formData.shoes as any) !== false && (formData.shoes as any) !== "—" && (formData.shoes as any) !== "Input required" && String(formData.shoes).trim() !== "") {
      const val = typeof formData.shoes === 'boolean' ? 'Yes' : formData.shoes;
      lines.push("Shoes: " + val);
    }
    if (formData.socks !== undefined && formData.socks !== null && (formData.socks as any) !== false && (formData.socks as any) !== "—" && (formData.socks as any) !== "Input required" && String(formData.socks).trim() !== "") {
      const val = typeof formData.socks === 'boolean' ? 'Yes' : formData.socks;
      lines.push("Socks: " + val);
    }
    if (formData.bib !== undefined && formData.bib !== null && (formData.bib as any) !== false && (formData.bib as any) !== "—" && (formData.bib as any) !== "Input required" && String(formData.bib).trim() !== "") {
      const val = typeof formData.bib === 'boolean' ? 'Yes' : formData.bib;
      lines.push("Bib: " + val);
    }
    if (formData.watch !== undefined && formData.watch !== null && (formData.watch as any) !== false && (formData.watch as any) !== "—" && (formData.watch as any) !== "Input required" && String(formData.watch).trim() !== "") {
      const val = typeof formData.watch === 'boolean' ? 'Yes' : formData.watch;
      lines.push("Watch: " + val);
    }
    if (formData.gel !== undefined && formData.gel !== null && (formData.gel as any) !== false && (formData.gel as any) !== "—" && (formData.gel as any) !== "Input required" && String(formData.gel).trim() !== "") {
      const val = typeof formData.gel === 'boolean' ? 'Yes' : formData.gel;
      lines.push("Gel: " + val);
    }
    if (formData.bottle !== undefined && formData.bottle !== null && (formData.bottle as any) !== false && (formData.bottle as any) !== "—" && (formData.bottle as any) !== "Input required" && String(formData.bottle).trim() !== "") {
      const val = typeof formData.bottle === 'boolean' ? 'Yes' : formData.bottle;
      lines.push("Bottle: " + val);
    }
    if (formData.cap !== undefined && formData.cap !== null && (formData.cap as any) !== false && (formData.cap as any) !== "—" && (formData.cap as any) !== "Input required" && String(formData.cap).trim() !== "") {
      const val = typeof formData.cap === 'boolean' ? 'Yes' : formData.cap;
      lines.push("Cap: " + val);
    }
    if (formData.sunscreen !== undefined && formData.sunscreen !== null && (formData.sunscreen as any) !== false && (formData.sunscreen as any) !== "—" && (formData.sunscreen as any) !== "Input required" && String(formData.sunscreen).trim() !== "") {
      const val = typeof formData.sunscreen === 'boolean' ? 'Yes' : formData.sunscreen;
      lines.push("Sunscreen: " + val);
    }
    if (formData.pins !== undefined && formData.pins !== null && (formData.pins as any) !== false && (formData.pins as any) !== "—" && (formData.pins as any) !== "Input required" && String(formData.pins).trim() !== "") {
      const val = typeof formData.pins === 'boolean' ? 'Yes' : formData.pins;
      lines.push("Pins: " + val);
    }
    if (formData.clothes !== undefined && formData.clothes !== null && (formData.clothes as any) !== false && (formData.clothes as any) !== "—" && (formData.clothes as any) !== "Input required" && String(formData.clothes).trim() !== "") {
      const val = typeof formData.clothes === 'boolean' ? 'Yes' : formData.clothes;
      lines.push("Clothes: " + val);
    }
    if (formData.towel !== undefined && formData.towel !== null && (formData.towel as any) !== false && (formData.towel as any) !== "—" && (formData.towel as any) !== "Input required" && String(formData.towel).trim() !== "") {
      const val = typeof formData.towel === 'boolean' ? 'Yes' : formData.towel;
      lines.push("Towel: " + val);
    }
    if (formData.idcard !== undefined && formData.idcard !== null && (formData.idcard as any) !== false && (formData.idcard as any) !== "—" && (formData.idcard as any) !== "Input required" && String(formData.idcard).trim() !== "") {
      const val = typeof formData.idcard === 'boolean' ? 'Yes' : formData.idcard;
      lines.push("Idcard: " + val);
    }
    if (formData.phone !== undefined && formData.phone !== null && (formData.phone as any) !== false && (formData.phone as any) !== "—" && (formData.phone as any) !== "Input required" && String(formData.phone).trim() !== "") {
      const val = typeof formData.phone === 'boolean' ? 'Yes' : formData.phone;
      lines.push("Phone: " + val);
    }
    if (formData.cash !== undefined && formData.cash !== null && (formData.cash as any) !== false && (formData.cash as any) !== "—" && (formData.cash as any) !== "Input required" && String(formData.cash).trim() !== "") {
      const val = typeof formData.cash === 'boolean' ? 'Yes' : formData.cash;
      lines.push("Cash: " + val);
    }
    if (formData.earbuds !== undefined && formData.earbuds !== null && (formData.earbuds as any) !== false && (formData.earbuds as any) !== "—" && (formData.earbuds as any) !== "Input required" && String(formData.earbuds).trim() !== "") {
      const val = typeof formData.earbuds === 'boolean' ? 'Yes' : formData.earbuds;
      lines.push("Earbuds: " + val);
    }
    if (formData.custom1 !== undefined && formData.custom1 !== null && (formData.custom1 as any) !== false && (formData.custom1 as any) !== "—" && (formData.custom1 as any) !== "Input required" && String(formData.custom1).trim() !== "") {
      const val = typeof formData.custom1 === 'boolean' ? 'Yes' : formData.custom1;
      lines.push("Custom1: " + val);
    }
    if (formData.custom2 !== undefined && formData.custom2 !== null && (formData.custom2 as any) !== false && (formData.custom2 as any) !== "—" && (formData.custom2 as any) !== "Input required" && String(formData.custom2).trim() !== "") {
      const val = typeof formData.custom2 === 'boolean' ? 'Yes' : formData.custom2;
      lines.push("Custom2: " + val);
    }
    if (formData.custom3 !== undefined && formData.custom3 !== null && (formData.custom3 as any) !== false && (formData.custom3 as any) !== "—" && (formData.custom3 as any) !== "Input required" && String(formData.custom3).trim() !== "") {
      const val = typeof formData.custom3 === 'boolean' ? 'Yes' : formData.custom3;
      lines.push("Custom3: " + val);
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

  const itemsList = getChecklistItems();
  const half = Math.ceil(itemsList.length / 2);
  const leftItems = itemsList.slice(0, half);
  const rightItems = itemsList.slice(half);

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
      cardType: "race-checklist",
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
             if (draft && draft.cardType === "race-checklist") {
                if (draft.formData) setFormData(draft.formData);
                if (draft.template && typeof setTemplate === "function") setTemplate(draft.template);
             }
          }
       }
    } catch {}
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)_minmax(300px,380px)] gap-6 w-full font-sans">
      {/* COLUMN 1: CONFIGURATION */}
      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#f2f4f7]">CHECKLIST CONFIGURATION</h2>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider">Log details</p>
          </div>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Checklist Title</label>
             <input 
               type="text" 
               value={formData.title}
               onChange={e => handleChange("title", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Race Day Packing"
             />
          </div>

          <div className="border-t border-brand-border pt-4">
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-3">Standard Items</label>
             <div className="grid grid-cols-2 gap-y-3 gap-x-2">
               {(Object.keys(formData) as Array<keyof typeof formData>).filter(k => typeof formData[k] === 'boolean').map(key => (
                  <label 
                    key={key} 
                    onClick={() => handleToggle(key)}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${formData[key] ? 'bg-secondary-lime border-secondary-lime' : 'bg-surface-lowest border-brand-border group-hover:border-text-muted'}`}>
                       {formData[key] && <div className="w-1.5 h-1.5 bg-[#0f1012] rounded-full"></div>}
                    </div>
                    <span className="text-[11px] font-mono text-text-primary uppercase tracking-wider">{key.replace('idcard', 'ID Card')}</span>
                  </label>
               ))}
             </div>
          </div>

          <div className="border-t border-brand-border pt-4">
             <label className="block text-[11px] font-mono text-[#a1a1aa] uppercase tracking-wider mb-2">Custom Items</label>
             <div className="space-y-2">
               <input 
                 type="text" 
                 value={formData.custom1}
                 onChange={e => handleChange("custom1", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-xs text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Custom item 1..."
               />
               <input 
                 type="text" 
                 value={formData.custom2}
                 onChange={e => handleChange("custom2", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-xs text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Custom item 2..."
               />
               <input 
                 type="text" 
                 value={formData.custom3}
                 onChange={e => handleChange("custom3", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border px-3 py-3 min-h-[44px] rounded text-xs text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Custom item 3..."
               />
             </div>
          </div>

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2.5 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded-lg text-xs tracking-wider font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full py-2.5 bg-transparent border rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] hover:bg-gray-800" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}><Copy className="w-4 h-4 " style={{ color: activeAccent.hex }} /> COPY CHECKLIST</button>
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
                ${template === 'race day' ? ' bg-white text-black rounded px-8 py-6 border border-gray-200' : ''}
                ${template === 'minimal' ? ' bg-[#faf9f6] text-black p-8 rounded-none border border-stone-200/60' : ''}
                ${template === 'dark utility' ? ' bg-[#121316] text-[#f2f4f7] rounded-xl border border-[#22252a] p-8' : ''}
              `}
            >
              {['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(template) ? (
                <SharedTemplates template={template} formData={formData} componentName="RaceChecklistGenerator" />
              ) : (
                <>
                  {/* Header */}
                  <div className={`mb-6 flex flex-col
                     ${template === 'race day' ? 'border-b-4 border-black pb-4' : ''}
                     ${template === 'minimal' ? 'border-b border-gray-200 pb-6 mb-8 text-center' : ''}
                     ${template === 'dark utility' ? 'pb-4 border-dashed border-b-2' : ''}
                  `}
                  style={template === 'dark utility' ? { borderColor: `${activeAccent.hex}4d` } : undefined}
                  >
                    <h1 
                      className={`text-3xl font-black uppercase tracking-tighter leading-tight
                         ${template === 'minimal' ? 'font-serif tracking-normal' : ''}
                      `}
                      style={template === 'dark utility' ? { color: activeAccent.hex } : undefined}
                    >
                      {formData.title.trim() || 'CHECKLIST'}
                    </h1>
                    {template === 'dark utility' && <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">Status: Pending Verification</p>}
                  </div>

                  {/* Checklist Items Area */}
                  <div className={`flex-1 ${template === 'race day' ? 'grid grid-cols-2 gap-x-6 gap-y-1' : 'flex flex-col gap-4'}`}>
                     {template === 'race day' ? (
                        <>
                           <div className="flex flex-col gap-3">
                              {leftItems.map((item, i) => (
                                <div key={`l-${i}`} className="flex items-start gap-3">
                                  <div className="w-5 h-5 shrink-0 border-2 border-black rounded-sm mt-0.5"></div>
                                  <span className="font-bold uppercase text-sm leading-tight pt-0.5">{item}</span>
                                </div>
                              ))}
                           </div>
                           <div className="flex flex-col gap-3">
                              {rightItems.map((item, i) => (
                                <div key={`r-${i}`} className="flex items-start gap-3">
                                  <div className="w-5 h-5 shrink-0 border-2 border-black rounded-sm mt-0.5"></div>
                                  <span className="font-bold uppercase text-sm leading-tight pt-0.5">{item}</span>
                                </div>
                              ))}
                           </div>
                        </>
                     ) : template === 'minimal' ? (
                        <div className="flex flex-col gap-4 px-2">
                           {itemsList.map((item, i) => (
                             <div key={i} className="flex items-center gap-4">
                               <div className="w-3 h-3 shrink-0 rounded-full border border-gray-400"></div>
                               <span className="text-sm border-b border-gray-200 border-dotted flex-1 pb-1">{item}</span>
                             </div>
                           ))}
                        </div>
                     ) : (
                        // Dark Utility
                        <div className="flex flex-col gap-2">
                           {itemsList.map((item, i) => (
                             <div key={i} className="flex items-center gap-3 bg-[#111316] p-2.5 rounded border border-[#22252a]" style={{ borderColor: `${activeAccent.hex}22` }}>
                               <div className="w-4 h-4 shrink-0 bg-[#0b0c0e] border border-[#22252a] flex items-center justify-center" style={{ borderColor: `${activeAccent.hex}33` }}>
                                 {/* Empty box */}
                               </div>
                               <span className="text-xs uppercase tracking-wider text-gray-300 truncate">{item}</span>
                             </div>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Footer */}
                  <div className={`mt-8 pt-4 flex justify-between items-end
                      ${template === 'race day' ? 'border-t-4 border-black' : ''}
                      ${template === 'minimal' ? 'border-t border-gray-200 opacity-50' : ''}
                      ${template === 'dark utility' ? 'border-t opacity-40' : ''}
                  `}
                  style={template === 'dark utility' ? { borderColor: `${activeAccent.hex}4d` } : undefined}
                  >
                    <span 
                      className={`text-[9px] uppercase tracking-widest ${template === 'minimal' ? 'font-sans' : 'font-mono'}`}
                      style={template === 'dark utility' ? { color: activeAccent.hex } : undefined}
                    >
                      Packing Protocol
                    </span>
                  </div>

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
              "id": "race day",
              "label": "Race Day Pack"
            },
            {
              "id": "minimal",
              "label": "Minimal List"
            },
            {
              "id": "dark utility",
              "label": "Dark Utility"
          }
        ]}
      />
    </div>
  </div>
  );
}
