import SharedTemplates from './SharedTemplates';
import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, Save } from "lucide-react";

interface RaceChecklistProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function RaceChecklistGenerator({ previewRef, showToast }: RaceChecklistProps) {
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
  
  // Split items into roughly two columns for rendering if there are many
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
             if (draft && draft.cardType === "race-checklist") {
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
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Checklist Configuration</h2>
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
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${formData[key] ? 'bg-secondary-lime border-secondary-lime' : 'bg-surface-lowest border-brand-border group-hover:border-text-muted'}`}>
                       {formData[key] && <div className="w-1.5 h-1.5 bg-[#0f1012] rounded-full"></div>}
</div>
                    <span className="text-[11px] font-mono text-text-primary uppercase tracking-wider">{key.replace('idcard', 'ID Card')}</span>
                  </label>
               ))}
        </div>
          </div>

          <div className="border-t border-brand-border pt-4">
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-2">Custom Items</label>
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

          <button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>
          <button onClick={handleCopy} className="w-full mt-2 py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Copy className="w-4 h-4 text-secondary-lime" /> COPY CHECKLIST
</button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 w-full md:w-auto pb-4 md:pb-2 border-b border-brand-border md:border-none">
            {[
              { id: 'race day', label: 'Race Day' },
              { id: 'minimal', label: 'Minimal Packing' },
              { id: 'dark utility', label: 'Dark Utility' }
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
              className={`w-[460px] flex shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden
                ${template === 'race day' ? 'bg-[#fafafa] flex-col text-black p-8 border-4 border-black font-sans' : ''}
                ${template === 'minimal' ? 'bg-white flex-col text-[#18181b] p-10 border border-gray-200 shadow-xl font-serif' : ''}
                ${template === 'dark utility' ? 'bg-[#0b0c0e] flex-col text-[#f2f4f7] border border-[#22252a] rounded-xl p-8 font-mono' : ''}
              `}
              style={{ minHeight: '500px' }}
            >
               {/* Header */}
               <div className={`mb-6 flex flex-col
                  ${template === 'race day' ? 'border-b-4 border-black pb-4' : ''}
                  ${template === 'minimal' ? 'border-b border-gray-200 pb-6 mb-8 text-center' : ''}
                  ${template === 'dark utility' ? 'border-b-2 border-primary-coral pb-4 border-dashed' : ''}
               `}>
                 <h1 className={`text-3xl font-black uppercase tracking-tighter leading-tight
                    ${template === 'dark utility' ? 'text-secondary-lime' : ''}
                    ${template === 'minimal' ? 'font-serif tracking-normal' : ''}
                 `}>
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
                          <div key={i} className="flex items-center gap-3 bg-[#111316] p-2.5 rounded border border-[#22252a]">
                            <div className="w-4 h-4 shrink-0 bg-[#0b0c0e] border border-[#22252a] flex items-center justify-center">
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
                   ${template === 'dark utility' ? 'border-t border-[#22252a] opacity-40' : ''}
               `}>
                 <span className={`text-[9px] uppercase tracking-widest ${template === 'minimal' ? 'font-sans' : 'font-mono uppercase font-bold'}`}>{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</span>
                 <span className={`text-[9px] uppercase tracking-widest ${template === 'minimal' ? 'font-sans' : 'font-mono uppercase'}`}>
                   Packing Protocol
                 </span>
               </div>
            </div>

           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="RaceChecklistGenerator"  />
           )}
            </div>
          </div>
        </div>
      </div>
  );
}
