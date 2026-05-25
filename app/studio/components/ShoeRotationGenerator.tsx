import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy } from "lucide-react";

interface ShoeRotationProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function ShoeRotationGenerator({ previewRef, showToast }: ShoeRotationProps) {
  const [formData, setFormData] = useState({
    name: "",
    brandModel: "",
    currentDistance: "",
    maxDistance: "",
    primaryUse: "Easy run",
    feeling: "Good",
    lastNote: "",
    nextUse: ""
  });

  const [template, setTemplate] = useState("rotation board");
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

  const calculateUsage = () => {
    const cur = parseFloat(formData.currentDistance);
    const max = parseFloat(formData.maxDistance);
    if (!isNaN(cur) && !isNaN(max) && max > 0) {
      const pct = Math.min(100, Math.round((cur / max) * 100));
      return `${pct}%`;
    }
    return "—";
  };

  const usagePercent = calculateUsage();

  const handleCopy = () => {
    const lines = [
      "Shoe Rotation",
      `Shoe: ${formData.name || "-"} ${formData.brandModel ? `(${formData.brandModel})` : ""}`,
      `Use: ${formData.primaryUse || "-"}`,
      `Current Distance: ${formData.currentDistance || "-"}`,
      `Target Max: ${formData.maxDistance || "-"}`,
      `Usage: ${usagePercent}`,
      `Feeling: ${formData.feeling || "-"}`,
      "Made with RunCard Studio."
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Shoe Rotation copied to clipboard");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Shoe Data</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Shoe Nickname / Label</label>
             <input 
               type="text" 
               value={formData.name}
               onChange={e => handleChange("name", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Tempo Trainer"
             />
          </div>
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Brand & Model (Opt)</label>
             <input 
               type="text" 
               value={formData.brandModel}
               onChange={e => handleChange("brandModel", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="ZoomX Pro 2"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-primary-coral font-bold uppercase tracking-wider mb-1">Current Dist</label>
               <input 
                 type="text" 
                 value={formData.currentDistance}
                 onChange={e => handleChange("currentDistance", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-primary-coral transition-all"
                 placeholder="350"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Max Target (Opt)</label>
               <input 
                 type="text" 
                 value={formData.maxDistance}
                 onChange={e => handleChange("maxDistance", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="600"
               />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Primary Use</label>
               <select 
                 value={formData.primaryUse}
                 onChange={e => handleChange("primaryUse", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
               >
                 <option value="Easy run">Easy run</option>
                 <option value="Long run">Long run</option>
                 <option value="Workout">Workout</option>
                 <option value="Race">Race</option>
                 <option value="Trail">Trail</option>
                 <option value="Gym">Gym</option>
               </select>
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Feeling</label>
               <select 
                 value={formData.feeling}
                 onChange={e => handleChange("feeling", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
               >
                 <option value="Fresh">Fresh</option>
                 <option value="Good">Good</option>
                 <option value="Okay">Okay</option>
                 <option value="Worn">Worn</option>
                 <option value="Retire soon">Retire soon</option>
               </select>
             </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Next Intended Use (Opt)</label>
             <input 
               type="text" 
               value={formData.nextUse}
               onChange={e => handleChange("nextUse", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Sunday long run"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Recent Notes (Opt)</label>
             <input 
               type="text" 
               value={formData.lastNote}
               onChange={e => handleChange("lastNote", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Foam feels flat."
             />
          </div>

          <button onClick={handleCopy} className="w-full mt-2 py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Copy className="w-4 h-4 text-secondary-lime" /> Copy Stats
          </button>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: 'rotation board', label: 'Shoe Log' },
              { id: 'shoe log', label: 'Rotation Board' },
              { id: 'minimal gear', label: 'Minimal Gear' }
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
              className={`w-[440px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden
                ${template === 'rotation board' ? 'bg-[#0f1012] border border-[#22252a] text-[#f2f4f7] rounded-xl p-8 font-sans' : ''}
                ${template === 'shoe log' ? 'bg-[#181a1f] border border-[#22252a] text-white p-8 rounded-lg font-mono' : ''}
                ${template === 'minimal gear' ? 'bg-white border-2 border-black text-black p-8 px-10 rounded-sm font-mono' : ''}
              `}
              style={{ minHeight: '440px' }}
            >
               
               {template === 'rotation board' && (
                 <>
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-1">{formData.name || 'SHOE NAME'}</h1>
                       <div className="text-sm font-mono text-gray-500 uppercase tracking-widest">{formData.brandModel || 'BRAND / MODEL'}</div>
                     </div>
                     <div className="bg-[#22252a] text-secondary-lime px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm">{formData.primaryUse}</div>
                   </div>

                   <div className="bg-[#181a1f] border border-[#22252a] rounded-lg p-5 mb-6 text-center">
                     <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Current Mileage</span>
                     <div className="text-5xl font-black tracking-tighter text-white mb-2">{formData.currentDistance || '-'}</div>
                     
                     {/* Progress bar if max is set */}
                     {formData.maxDistance && (
                       <div className="w-full">
                         <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                           <span>0</span>
                           <span>{usagePercent} (Max: {formData.maxDistance})</span>
                         </div>
                         <div className="w-full h-1.5 bg-[#22252a] rounded-full overflow-hidden">
                           <div className="h-full bg-secondary-lime" style={{ width: usagePercent === '—' ? '0%' : usagePercent }}></div>
                         </div>
                       </div>
                     )}
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-6 flex-1">
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Status / Feel</span>
                        <div className="text-sm font-bold uppercase">{formData.feeling}</div>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Next Up</span>
                        <div className="text-sm font-bold uppercase truncate">{formData.nextUse || '-'}</div>
                      </div>
                   </div>

                   {formData.lastNote && (
                     <div className="mb-6 pt-4 border-t border-[#22252a] text-xs italic text-gray-400 font-serif">
                       &quot;{formData.lastNote}&quot;
                     </div>
                   )}

                   <div className="mt-auto text-[8px] font-mono tracking-widest text-[#22252a] uppercase text-right">RunCard Studio</div>
                 </>
               )}

               {template === 'shoe log' && (
                 <>
                   <div className="flex items-center justify-between border-b border-[#22252a] pb-4 mb-6">
                     <span className="text-[10px] uppercase tracking-widest opacity-50">GEAR LOG</span>
                     <span className="text-[10px] uppercase tracking-widest border border-[#22252a] px-2 py-0.5">{formData.primaryUse}</span>
                   </div>

                   <div className="mb-8">
                     <h1 className="text-2xl font-bold uppercase mb-2">{formData.name || 'SHOE'}</h1>
                     <div className="text-xs uppercase text-gray-400">{formData.brandModel || '-'}</div>
                   </div>

                   <div className="flex gap-4 mb-8">
                     <div className="bg-black border border-[#22252a] p-4 flex-1">
                       <span className="text-[10px] uppercase text-gray-500 mb-1 block">Distance</span>
                       <span className="text-2xl font-bold text-white">{formData.currentDistance || '-'}</span>
                     </div>
                     <div className="bg-black border border-[#22252a] p-4 flex-1">
                       <span className="text-[10px] uppercase text-gray-500 mb-1 block">Usage</span>
                       <span className="text-2xl font-bold text-white">{usagePercent}</span>
                     </div>
                   </div>

                   <div className="flex-1 space-y-3 mb-6 font-sans">
                     <div className="flex items-center">
                       <span className="w-24 text-[10px] font-mono uppercase text-gray-500">Feeling</span>
                       <span className="text-sm font-medium">{formData.feeling}</span>
                     </div>
                     <div className="flex items-center">
                       <span className="w-24 text-[10px] font-mono uppercase text-gray-500">Next Use</span>
                       <span className="text-sm font-medium truncate">{formData.nextUse || '-'}</span>
                     </div>
                   </div>

                   {formData.lastNote && (
                     <div className="mt-auto p-3 bg-[#111113] border-l-2 border-primary-coral text-xs text-gray-400">
                       {formData.lastNote}
                     </div>
                   )}

                   <div className="mt-6 text-center text-[9px] uppercase tracking-[0.2em] opacity-30">RunCard System</div>
                 </>
               )}

               {template === 'minimal gear' && (
                 <>
                   <div className="mb-10 text-center border-b-2 border-black pb-4">
                     <h1 className="text-2xl font-black uppercase tracking-tight mb-1">{formData.name || 'SHOE'}</h1>
                     <p className="text-[10px] uppercase tracking-widest text-gray-500">{formData.brandModel}</p>
                   </div>

                   <div className="flex-1 flex flex-col items-center justify-center gap-8 mb-10">
                     <div className="text-center">
                       <div className="text-[10px] uppercase tracking-widest font-bold mb-2 text-gray-400">Distance</div>
                       <div className="text-5xl font-black tracking-tighter">{formData.currentDistance || '-'}</div>
                     </div>

                     <div className="w-full max-w-[80%] flex justify-between items-center text-xs uppercase font-bold border-t border-b border-black py-2">
                       <span className="text-gray-500">Target</span>
                       <span>{formData.maxDistance || '-'}</span>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs font-sans mb-8">
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold mb-1">Primary</div>
                        <div className="font-semibold uppercase truncate">{formData.primaryUse}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold mb-1">Feeling</div>
                        <div className="font-semibold uppercase truncate">{formData.feeling}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[9px] font-mono uppercase tracking-widest text-gray-400 font-bold mb-1">Note</div>
                        <div className="font-semibold">{formData.lastNote || '-'}</div>
                      </div>
                   </div>

                   <div className="mt-auto text-center">
                     <span className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-30">RunCard Gear</span>
                   </div>
                 </>
               )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
