import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy } from "lucide-react";

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

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const target = 520; 
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

  const handleCopy = () => {
    const lines = [
      "Training Week",
      `Date: ${formData.dateRange || "-"}`,
      `Distance: ${formData.totalDistance || "-"}`,
      `Duration: ${formData.totalDuration || "-"}`,
      `Sessions: ${formData.sessions || "-"}`,
      `Key Session: ${formData.keySession || "-"}`,
      `Long Run: ${formData.longRun || "-"}`,
      `Verdict: ${formData.verdict || "-"}`,
      "Made with RunCard Studio."
    ];

    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Training Week copied to clipboard");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Week Data</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Week Title</label>
             <input 
               type="text" 
               value={formData.title}
               onChange={e => handleChange("title", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Week 5"
             />
          </div>
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date Range</label>
             <input 
               type="text" 
               value={formData.dateRange}
               onChange={e => handleChange("dateRange", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
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
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="70 km"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Total Duration (Opt)</label>
               <input 
                 type="text" 
                 value={formData.totalDuration}
                 onChange={e => handleChange("totalDuration", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
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
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all font-mono"
                 placeholder="6"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Week Verdict</label>
               <select 
                 value={formData.verdict}
                 onChange={e => handleChange("verdict", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
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
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="6x1km @ 3:45"
             />
          </div>
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Long Run</label>
             <input 
               type="text" 
               value={formData.longRun}
               onChange={e => handleChange("longRun", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="25km progression"
             />
          </div>
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Strength / Other (Opt)</label>
             <input 
               type="text" 
               value={formData.strength}
               onChange={e => handleChange("strength", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="2x gym"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Weekly Note (Opt)</label>
             <textarea 
               value={formData.note}
               onChange={e => handleChange("note", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="Felt strong but need more sleep."
             ></textarea>
          </div>

          <button onClick={handleCopy} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Copy className="w-4 h-4 text-secondary-lime" /> Copy Caption
          </button>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: 'weekly board', label: 'Weekly Board' },
              { id: 'training log', label: 'Training Log' },
              { id: 'dark carbon', label: 'Dark Carbon Summary' }
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
              className={`w-[480px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none
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
                         <span className="font-bold text-gray-700">{formData.strength}</span>
                       </div>
                     )}
                   </div>

                   {formData.note && (
                     <div className="italic text-sm text-gray-600 border-t border-gray-300 pt-4 mt-auto">
                        &quot;{formData.note}&quot;
                     </div>
                   )}
                   <div className="mt-4 text-left text-[9px] font-black tracking-widest text-gray-400 uppercase border-t-2 border-black pt-2">RunCard Studio</div>
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

                   <div className="space-y-4 mb-8 flex-1">
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
                     <div className="bg-[#111113] p-4 text-sm text-gray-300 border-l border-gray-500 italic mt-auto">
                        &quot;{formData.note}&quot;
                     </div>
                   )}
                   <div className="mt-6 text-center text-[9px] uppercase tracking-[0.2em] text-[#3f3f46]">RunCard Studio</div>
                 </>
               )}

               {template === 'dark carbon' && (
                 <>
                   <div className="mb-8 border-l-2 border-primary-coral pl-4">
                     <p className="font-mono text-[10px] text-secondary-lime uppercase tracking-widest mb-1">{formData.dateRange || 'DATE RANGE'}</p>
                     <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">{formData.title || 'TRAINING WEEK'}</h1>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-[#181a1f] border border-[#22252a] p-4 rounded-lg flex flex-col justify-center">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Volume</span>
                        <span className="text-2xl font-black font-mono">{formData.totalDistance || '-'}</span>
                      </div>
                      <div className="bg-[#181a1f] border border-[#22252a] p-4 rounded-lg flex flex-col justify-center">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Time</span>
                        <span className="text-2xl font-black font-mono">{formData.totalDuration || '-'}</span>
                      </div>
                   </div>

                   <div className="space-y-3 mb-6 bg-[#16181c] border border-[#22252a] p-4 rounded-lg text-sm flex-1">
                      <div className="flex justify-between border-b border-[#22252a] pb-2 font-mono">
                        <span className="text-gray-500 uppercase text-xs">Sessions</span>
                        <span className="font-bold">{formData.sessions || '-'}</span>
                      </div>
                      <div className="flex flex-col border-b border-[#22252a] pb-2 pt-1 font-mono">
                        <span className="text-gray-500 uppercase text-xs mb-1">Key Session</span>
                        <span className="font-bold">{formData.keySession || '-'}</span>
                      </div>
                      <div className="flex flex-col pb-1 pt-1 font-mono">
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
                   
                   <div className="absolute top-8 right-8 text-[8px] font-mono tracking-widest text-[#22252a] uppercase">RunCard</div>
                 </>
               )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
