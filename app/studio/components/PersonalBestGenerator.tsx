import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy } from "lucide-react";

interface PersonalBestProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function PersonalBestGenerator({ previewRef, showToast }: PersonalBestProps) {
  const [formData, setFormData] = useState({
    athleteName: "",
    eventDistance: "",
    newPb: "",
    prevPb: "",
    date: "",
    location: "",
    feeling: "",
    nextTarget: ""
  });

  const [template, setTemplate] = useState("dark carbon");
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

  // Basic time parser HH:MM:SS or MM:SS
  const parseTimeStr = (t: string) => {
    if (!t) return null;
    const parts = t.split(":");
    if (parts.length === 3) {
      return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
    } else if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    } else if (parts.length === 1) {
      return parseInt(parts[0]);
    }
    return null;
  };

  const calculateImprovement = () => {
    const newSecs = parseTimeStr(formData.newPb);
    const prevSecs = parseTimeStr(formData.prevPb);

    if (newSecs && prevSecs && !isNaN(newSecs) && !isNaN(prevSecs)) {
      const diff = prevSecs - newSecs; // Positive if faster
      if (diff > 0) {
        const m = Math.floor(diff / 60);
        const s = Math.floor(diff % 60);
        if (m > 0) return `-${m}m ${s}s`;
        return `-${s}s`;
      } else if (diff === 0) {
        return "Matched PB";
      } else {
        const diffRev = newSecs - prevSecs;
        const m = Math.floor(diffRev / 60);
        const s = Math.floor(diffRev % 60);
        if (m > 0) return `+${m}m ${s}s`;
        return `+${s}s`;
      }
    }
    return "—";
  };

  const improvement = calculateImprovement();

  const handleCopy = () => {
    const lines = [
      "New PB unlocked.",
      `Event: ${formData.eventDistance}`,
      `Time: ${formData.newPb}`,
      `Previous: ${formData.prevPb || "—"}`,
      `Improvement: ${improvement}`,
      formData.nextTarget ? `Next: ${formData.nextTarget}` : "",
      "Made with RunCard Studio."
    ].filter(Boolean);

    navigator.clipboard.writeText(lines.join("\n"));
    showToast("PB text copied to clipboard");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* LEFT: FORM (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">PB Data</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Athlete Name (Opt)</label>
             <input 
               type="text" 
               value={formData.athleteName}
               onChange={e => handleChange("athleteName", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Alex"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Event / Distance</label>
             <input 
               type="text" 
               value={formData.eventDistance}
               onChange={e => handleChange("eventDistance", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Half Marathon"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-[11px] font-mono text-primary-coral uppercase tracking-wider mb-1 font-bold">New PB</label>
               <input 
                 type="text" 
                 value={formData.newPb}
                 onChange={e => handleChange("newPb", e.target.value)}
                 className="w-full bg-surface-lowest border border-primary-coral border-opacity-50 p-2 rounded text-sm font-mono text-text-primary outline-none focus:border-primary-coral transition-all"
                 placeholder="01:29:45"
               />
            </div>
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Previous PB</label>
               <input 
                 type="text" 
                 value={formData.prevPb}
                 onChange={e => handleChange("prevPb", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm font-mono text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="01:34:10"
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date</label>
               <input 
                 type="text" 
                 value={formData.date}
                 onChange={e => handleChange("date", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="OCT 2026"
               />
            </div>
            <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Location</label>
               <input 
                 type="text" 
                 value={formData.location}
                 onChange={e => handleChange("location", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
                 placeholder="CITY RUN"
               />
            </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Feeling / Short Note (Opt)</label>
             <input 
               type="text" 
               value={formData.feeling}
               onChange={e => handleChange("feeling", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Unreal."
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Next Target (Opt)</label>
             <input 
               type="text" 
               value={formData.nextTarget}
               onChange={e => handleChange("nextTarget", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary outline-none focus:border-secondary-lime transition-all"
               placeholder="Sub 1:25"
             />
          </div>

          <button onClick={handleCopy} className="w-full mt-2 py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Copy className="w-4 h-4 text-secondary-lime" /> Copy Caption
          </button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: 'dark carbon', label: 'PB Dark Carbon' },
              { id: 'record board', label: 'Record Board' },
              { id: 'clean white', label: 'Clean White' }
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
              className={`w-[440px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden
                ${template === 'dark carbon' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] p-8 rounded-lg' : ''}
                ${template === 'record board' ? 'bg-[#0f1012] border-t-[8px] border-secondary-lime text-white p-8 rounded font-mono' : ''}
                ${template === 'clean white' ? 'bg-[#fafafa] text-[#09090b] p-8 border border-[#e4e4e7] rounded-xl font-sans' : ''}
              `}
              style={{ minHeight: '440px' }}
            >
               
               {template === 'dark carbon' && (
                 <>
                   <div className="absolute top-0 right-0 py-2 px-3 bg-primary-coral text-white font-black uppercase text-[10px] tracking-widest rounded-bl-lg">PB Unlocked</div>
                   
                   <div className="mb-8">
                     {formData.athleteName && <p className="text-secondary-lime font-mono text-[10px] uppercase tracking-widest mb-1">{formData.athleteName}</p>}
                     <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{formData.eventDistance || 'EVENT'}</h1>
                     <p className="font-mono text-xs uppercase opacity-50 flex gap-2">
                       <span>{formData.date}</span>
                       {formData.location && <span>{`// ${formData.location}`}</span>}
                     </p>
                   </div>

                   <div className="flex-1 flex flex-col items-center justify-center bg-[#181a1f] border border-[#22252a] rounded-xl p-6 relative overflow-hidden mb-8">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-action/10 to-transparent pointer-events-none"></div>
                      <div className="font-mono text-[10px] uppercase opacity-70 tracking-widest mb-2 relative z-10">Official Time</div>
                      <div className="text-6xl font-black font-mono tracking-tighter text-white drop-shadow-sm relative z-10">{formData.newPb || '-'}</div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <div className="font-mono text-[10px] uppercase opacity-50 mb-1">Previous Best</div>
                       <div className="font-mono text-lg font-bold">{formData.prevPb || '—'}</div>
                     </div>
                     <div className="text-right">
                       <div className="font-mono text-[10px] uppercase opacity-50 mb-1">Improvement</div>
                       <div className="font-mono text-lg font-black text-secondary-lime">{improvement}</div>
                     </div>
                   </div>

                   {(formData.feeling || formData.nextTarget) && (
                     <div className="mt-6 pt-4 border-t border-[#22252a] flex justify-between items-end border-dashed">
                       {formData.feeling && <div className="italic text-sm text-gray-400 font-serif w-2/3">&quot;{formData.feeling}&quot;</div>}
                       {formData.nextTarget && (
                         <div className="text-right">
                           <div className="font-mono text-[8px] uppercase tracking-widest opacity-50">Next Target</div>
                           <div className="font-bold text-xs uppercase">{formData.nextTarget}</div>
                         </div>
                       )}
                     </div>
                   )}
                 </>
               )}

               {template === 'record board' && (
                 <>
                   <div className="flex justify-between items-start mb-10 pb-4 border-b border-gray-800">
                     <div>
                       <h1 className="text-2xl font-black uppercase tracking-widest text-secondary-lime mb-1">NEW RECORD</h1>
                       <div className="text-xs uppercase tracking-widest text-gray-500">{formData.eventDistance}</div>
                     </div>
                     <div className="text-right bg-[#1c1d22] border border-gray-800 px-3 py-1 rounded">
                       <div className="text-[10px] uppercase text-gray-500 tracking-wider">Date</div>
                       <div className="text-sm font-bold uppercase">{formData.date}</div>
                     </div>
                   </div>

                   <div className="flex-1 flex flex-col justify-center gap-6">
                      <div className="bg-black py-6 px-4 text-center border-l-4 border-secondary-lime">
                        <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Recorded Time</div>
                        <div className="text-5xl font-black text-white">{formData.newPb || '-'}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-px bg-gray-800">
                         <div className="bg-[#0f1012] p-4 text-center pb-5 border-r border-[#1c1d22]">
                            <div className="text-[9px] uppercase tracking-widest text-gray-600 mb-1">Previous</div>
                            <div className="text-xl font-bold text-gray-300">{formData.prevPb || '—'}</div>
                         </div>
                         <div className="bg-[#0f1012] p-4 text-center pb-5">
                            <div className="text-[9px] uppercase tracking-widest text-gray-600 mb-1">Delta</div>
                            <div className={`text-xl font-black ${improvement.includes('-') ? 'text-secondary-lime' : 'text-primary-coral'}`}>{improvement}</div>
                         </div>
                      </div>
                   </div>

                   <div className="mt-auto text-center pt-8 border-t border-gray-800">
                     <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Generated by RunCard Studio</span>
                   </div>
                 </>
               )}

               {template === 'clean white' && (
                 <div className="h-full flex flex-col">
                   <div className="flex justify-between items-end mb-6">
                     <h1 className="text-3xl font-extrabold uppercase tracking-tight">{formData.eventDistance}</h1>
                     <span className="font-mono text-xs uppercase px-2 py-1 bg-gray-100 font-bold border border-gray-200">Personal Best</span>
                   </div>

                   <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-gray-200">
                     <span className="text-7xl font-black tracking-tighter text-black">{formData.newPb || '-'}</span>
                   </div>

                   <div className="grid grid-cols-2 gap-8 mb-auto">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">History</p>
                        <p className="text-sm font-semibold text-gray-600">Prev: <span className="font-mono text-black">{formData.prevPb || '—'}</span></p>
                        <p className="text-sm font-semibold text-gray-600">Imp: <span className="font-mono text-black">{improvement}</span></p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Log Data</p>
                        <p className="text-sm font-medium">{formData.date}</p>
                        <p className="text-sm font-medium">{formData.location}</p>
                      </div>
                   </div>

                   {formData.feeling && (
                     <div className="mt-8 bg-gray-50 p-4 border-l-4 border-black text-sm font-serif italic text-gray-800">
                        &quot;{formData.feeling}&quot;
                     </div>
                   )}
                   
                   <div className="mt-6 text-left text-[9px] font-mono tracking-widest text-gray-400 uppercase">RunCard Studio</div>
                 </div>
               )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
