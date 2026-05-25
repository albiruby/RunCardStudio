import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy } from "lucide-react";

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
    const items = getChecklistItems();
    const lines = [
      (formData.title || "CHECKLIST").toUpperCase(),
      "",
      ...items.map(item => `[ ] ${item}`),
      "",
      "Made with RunCard Studio."
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Checklist text copied to clipboard");
  };

  const itemsList = getChecklistItems();
  
  // Split items into roughly two columns for rendering if there are many
  const half = Math.ceil(itemsList.length / 2);
  const leftItems = itemsList.slice(0, half);
  const rightItems = itemsList.slice(half);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* LEFT: FORM (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
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
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Race Day Packing"
             />
          </div>

          <div className="border-t border-brand-border pt-4">
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-3">Standard Items</label>
             <div className="grid grid-cols-2 gap-y-3 gap-x-2">
               {(Object.keys(formData) as Array<keyof typeof formData>).filter(k => typeof formData[k] === 'boolean').map(key => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer select-none group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${formData[key] ? 'bg-secondary-lime border-secondary-lime' : 'bg-surface-lowest border-brand-border group-hover:border-text-muted'}`}>
                       {formData[key] && (
                         <div className="w-1.5 h-1.5 bg-[#0f1012] rounded-full"></div>
                       )}
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
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-xs text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Custom item 1..."
               />
               <input 
                 type="text" 
                 value={formData.custom2}
                 onChange={e => handleChange("custom2", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-xs text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Custom item 2..."
               />
               <input 
                 type="text" 
                 value={formData.custom3}
                 onChange={e => handleChange("custom3", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-xs text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="Custom item 3..."
               />
             </div>
          </div>

          <button onClick={handleCopy} className="w-full mt-2 py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Copy className="w-4 h-4 text-secondary-lime" /> Copy Text List
          </button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: 'race day', label: 'Race Day' },
              { id: 'minimal', label: 'Minimal Packing' },
              { id: 'dark utility', label: 'Dark Utility' }
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
                 <span className={`text-[9px] uppercase tracking-widest ${template === 'minimal' ? 'font-sans' : 'font-mono uppercase font-bold'}`}>
                   RunCard Studio
                 </span>
                 <span className={`text-[9px] uppercase tracking-widest ${template === 'minimal' ? 'font-sans' : 'font-mono uppercase'}`}>
                   Packing Protocol
                 </span>
               </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
