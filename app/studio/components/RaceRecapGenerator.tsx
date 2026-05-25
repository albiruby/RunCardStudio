import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, AlertCircle } from "lucide-react";

interface RaceRecapProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

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

  const [template, setTemplate] = useState("carbon");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const target = 512; // Card level width is 480px + margin
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

  // Validation
  const isDistanceInvalid = formData.distance !== "" && (isNaN(parseFloat(formData.distance)) || parseFloat(formData.distance) <= 0);
  const isDurationInvalid = formData.finishTime !== "" && !/^(?:(?:\d+:)?([0-5]?\d):)?([0-5]?\d)$/.test(formData.finishTime);

  const getPaceValue = () => {
    if (formData.manualPaceToggle) {
       return formData.avgPace || "4:38/km";
    }

    const distStr = formData.distance || "42.2";
    const dist = parseFloat(distStr);
    const timeStr = formData.finishTime || "03:15:24";
    if (isNaN(dist) || dist <= 0 || !timeStr) return "4:38/km";
    
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
    return `${mins}:${secs}/km`;
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyRecap = () => {
    const p = getPaceValue();
    const activeRace = formData.raceName || "CHICAGO MARATHON";
    const activeDist = formData.distance || "42.2 KM";
    const activeTime = formData.finishTime || "03:15:24";
    const lines = [];
    lines.push(`Race Recap: ${activeRace}`);
    lines.push(`${activeDist} done in ${activeTime}.`);
    lines.push(`Avg Pace: ${p}.`);
    if (formData.rank) lines.push(`Rank/Cat: ${formData.rank}.`);
    if (formData.bestMoment) lines.push(`Highlight: ${formData.bestMoment}`);
    lines.push(`Made with RunCard Studio.`);

    navigator.clipboard.writeText(lines.join(" "));
    showToast("Race recap copied");
  };

  const currentPace = getPaceValue();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: FORM (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
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
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
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
               {isDistanceInvalid && (
                 <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> Parseable number required
                 </p>
               )}
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Finish Time</label>
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
                className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none font-mono"
                placeholder="e.g. 4:38 /km"
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
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Location</label>
               <input 
                 type="text" 
                 value={formData.location}
                 onChange={e => handleChange("location", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
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
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
               placeholder="PR (#246)"
             />
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Best Moment</label>
             <textarea 
               value={formData.bestMoment}
               onChange={e => handleChange("bestMoment", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-16 transition-colors"
               placeholder="CROWD YELLING AT MILE 20 GAVE ME A SECOND WIND."
             ></textarea>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Next Target</label>
             <input 
               type="text" 
               value={formData.nextTarget}
               onChange={e => handleChange("nextTarget", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
               placeholder="SUB 3:10 AT BOSTON"
             />
          </div>

          <button onClick={handleCopyRecap} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Copy className="w-4 h-4 text-secondary-lime" /> Copy Recap
          </button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: 'carbon', label: 'Dark Carbon' },
              { id: 'white', label: 'Clean White' },
              { id: 'poster', label: 'Race Poster' }
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
              className={`w-[480px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none
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

               <div className="text-center font-mono text-[9px] tracking-[0.25em] uppercase mt-auto opacity-40 pt-4 border-t border-dashed border-brand-border">
                 made with RunCard Studio
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
