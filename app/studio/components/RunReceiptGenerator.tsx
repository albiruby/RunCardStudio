import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, AlertCircle } from "lucide-react";

interface RunReceiptProps {
  previewRef: MutableRefObject<HTMLDivElement | null>;
  showToast: (msg: string) => void;
}

export default function RunReceiptGenerator({ previewRef, showToast }: RunReceiptProps) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    distance: "",
    duration: "",
    location: "",
    rpe: "5",
    mood: "",
    weather: "",
    win: "",
    damage: "",
    notes: ""
  });

  const [template, setTemplate] = useState("carbon");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const target = 432; // Card width 400px + some horizontal padding safety
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

  // Validation helpers
  const isDistanceInvalid = formData.distance !== "" && (parseFloat(formData.distance) <= 0 || isNaN(parseFloat(formData.distance)));
  const isDurationInvalid = formData.duration !== "" && !/^(?:(?:\d+:)?([0-5]?\d):)?([0-5]?\d)$/.test(formData.duration);

  const getPaceValue = () => {
    const dist = parseFloat(formData.distance || "10.00");
    const dur = formData.duration || "00:48:30";
    if (isNaN(dist) || dist <= 0 || !dur) return "4:51";
    
    const parts = dur.split(":");
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
    return `${mins}:${secs}`;
  };

  const handleCopyCaption = () => {
    const p = getPaceValue();
    const activeDist = formData.distance || "10.00";
    const activeDur = formData.duration || "00:48:30";
    const lines = [];
    lines.push(`${activeDist} km done in ${activeDur}.`);
    if (p !== "—") lines.push(`Pace: ${p}/km.`);
    lines.push(`RPE: ${formData.rpe}/10.`);
    if (formData.mood || formData.weather) {
      lines.push(`Mood: ${formData.mood || "Smooth"} | Weather: ${formData.weather || "Sunny"}.`);
    }
    lines.push(`Made with RunCard Studio.`);

    navigator.clipboard.writeText(lines.join(" "));
    showToast("Caption copied");
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pace = getPaceValue();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* LEFT: FORM (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Run Parameters</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Runner Name</label>
               <input 
                 type="text" 
                 value={formData.name}
                 onChange={e => handleChange("name", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
                 placeholder="ATHLETE RUNNER"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Date</label>
               <input 
                 type="date" 
                 value={formData.date}
                 onChange={e => handleChange("date", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               />
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Distance (km)</label>
               <input 
                 type="number" 
                 step="0.01"
                 value={formData.distance}
                 onChange={e => handleChange("distance", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary outline-none transition-colors ${isDistanceInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="10.00"
               />
               {isDistanceInvalid && (
                 <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> Positive number
                 </p>
               )}
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Duration</label>
               <input 
                 type="text" 
                 value={formData.duration}
                 onChange={e => handleChange("duration", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors ${isDurationInvalid ? 'border-primary-coral focus:border-primary-coral font-mono' : 'border-brand-border focus:border-secondary-lime font-mono'}`}
                 placeholder="00:48:30"
               />
               {isDurationInvalid && (
                 <p className="text-primary-coral text-[10px] font-mono mt-1 flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> MM:SS or HH:MM:SS
                 </p>
               )}
             </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Location</label>
             <input 
               type="text" 
               value={formData.location}
               onChange={e => handleChange("location", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               placeholder="OCEANFRONT PARKWAY"
             />
          </div>

          <div>
             <label className="flex justify-between items-end text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">
               <span>RPE (Effort Level)</span>
               <span className="text-secondary-lime font-bold">{formData.rpe} / 10</span>
             </label>
             <input 
               type="range" 
               min="1" max="10"
               value={formData.rpe}
               onChange={e => handleChange("rpe", e.target.value)}
               className="w-full accent-secondary-lime cursor-ew-resize py-1"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Mood</label>
               <select 
                 value={formData.mood}
                 onChange={e => handleChange("mood", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               >
                 <option value="">Smooth (Default)</option>
                 <option value="Strong">Strong</option>
                 <option value="Tired">Tired</option>
                 <option value="Smooth">Smooth</option>
                 <option value="Struggle">Struggle</option>
                 <option value="Zen">Zen</option>
               </select>
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Weather</label>
               <select 
                 value={formData.weather}
                 onChange={e => handleChange("weather", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
               >
                 <option value="">Sunny (Default)</option>
                 <option value="Sunny">Sunny</option>
                 <option value="Cloudy">Cloudy</option>
                 <option value="Rain">Rain</option>
                 <option value="Windy">Windy</option>
                 <option value="Humid">Humid</option>
               </select>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Main Win</label>
               <input 
                 type="text" 
                 value={formData.win}
                 onChange={e => handleChange("win", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none transition-colors"
                 placeholder="e.g. FAST FINAL KM"
               />
             </div>
             <div>
               <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Main Damage</label>
               <input 
                 type="text" 
                 value={formData.damage}
                 onChange={e => handleChange("damage", e.target.value)}
                 className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none"
                 placeholder="e.g. NONE / ZERO"
               />
             </div>
          </div>

          <div>
             <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Notes</label>
             <textarea 
               value={formData.notes}
               onChange={e => handleChange("notes", e.target.value)}
               className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none resize-none h-20 transition-colors"
               placeholder="PACE WAS SOLID. FELT VERY SMOOTH THROUGH THE HILLS."
             ></textarea>
          </div>

          <button onClick={handleCopyCaption} className="w-full py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Copy className="w-4 h-4 text-secondary-lime" /> Copy Caption
          </button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: 'carbon', label: 'Thermal Receipt' },
              { id: 'thermal', label: 'Neon Sport' },
              { id: 'neon', label: 'Dark Carbon Receipt' }
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
              className={`w-[400px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none
                ${template === 'carbon' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] p-6 rounded-lg' : ''}
                ${template === 'thermal' ? 'bg-[#f4f4f5] text-[#18181b] p-8 border-t-8 border-[#18181b] shadow-none rounded-none' : ''}
                ${template === 'neon' ? 'bg-[#020203] text-[#fafafa] p-6 border-2 border-secondary-lime shadow-[0_0_40px_rgba(204,255,0,0.15)] rounded-md' : ''}
              `}
            >
              {/* Header */}
              <div className={`mb-6 pb-4 border-b ${template === 'carbon' ? 'border-[#22252a]' : template === 'thermal' ? 'border-[#d4d4d8]' : 'border-secondary-lime/30'}`}>
                 <div className="flex justify-between items-start mb-2">
                   <h3 className={`font-mono font-bold text-xl uppercase ${template === 'neon' ? 'text-secondary-lime' : ''}`}>
                     {formData.name.trim() || 'ATHLETE RUNNER'}
                   </h3>
                   <div className="text-right">
                     <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest">Date</p>
                     <p className="font-mono text-sm font-bold uppercase">{formData.date || new Date().toISOString().split('T')[0]}</p>
                   </div>
                 </div>
                 <div className="flex justify-between">
                   <div>
                     <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest">Location</p>
                     <p className="font-mono text-xs uppercase font-bold">{formData.location.trim() || 'OCEANFRONT PARKWAY'}</p>
                   </div>
                 </div>
              </div>

              {/* Main Stats */}
              <div className="mb-6">
                 <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest mb-1">Distance</p>
                 <h1 className={`font-mono text-6xl font-extrabold tracking-tighter mb-4 ${template === 'neon' ? 'text-secondary-lime' : template === 'carbon' ? 'text-text-primary' : 'text-black'}`}>
                   {formData.distance || '10.00'}<span className="text-lg opacity-60 ml-1.5 lowercase">km</span>
                 </h1>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest mb-1">Time</p>
                     <p className="font-mono text-2xl font-black">{formData.duration || '00:48:30'}</p>
                   </div>
                   <div>
                     <p className="font-mono text-[9px] opacity-60 uppercase tracking-widest mb-1">Avg Pace</p>
                     <p className="font-mono text-2xl font-black text-primary-coral">
                       {pace}<span className="text-xs opacity-60 font-medium ml-1">/km</span>
                     </p>
                   </div>
                 </div>
              </div>

              {/* Additional Metrics */}
              <div className={`mb-6 py-4 border-y ${template === 'carbon' ? 'border-[#22252a]' : template === 'thermal' ? 'border-[#d4d4d8] border-dashed' : 'border-secondary-lime/30'}`}>
                 <div className="grid grid-cols-2 gap-y-3 font-mono text-xs">
                   <div className="flex justify-between col-span-2">
                     <span className="opacity-60 uppercase">RPE (EFFORT)</span>
                     <span className="font-black text-secondary-lime">{formData.rpe}/10</span>
                   </div>
                   <div className="flex justify-between col-span-2">
                     <span className="opacity-60 uppercase">Runner Mood</span>
                     <span className="font-bold uppercase text-primary-coral">{formData.mood || 'SMOOTH'}</span>
                   </div>
                   <div className="flex justify-between col-span-2">
                     <span className="opacity-60 uppercase">Weather</span>
                     <span className="font-bold uppercase">{formData.weather || 'SUNNY'}</span>
                   </div>
                 </div>
              </div>

              {/* Notes / Highlights */}
              <div className="mb-8 font-mono text-xs pb-4">
                <div className="grid grid-cols-2 gap-4 mb-4 uppercase">
                  <div>
                    <p className="opacity-60 mb-1 text-[9px] tracking-wider">Primary Win</p>
                    <p className="font-bold text-text-primary truncate">{formData.win.trim() || 'FAST FINAL KM'}</p>
                  </div>
                  <div>
                    <p className="opacity-60 mb-1 text-[9px] tracking-wider">Damage Report</p>
                    <p className="font-bold text-text-primary truncate">{formData.damage.trim() || 'NONE / ZERO'}</p>
                  </div>
                </div>
                <div className="uppercase">
                   <p className="opacity-60 mb-1 text-[9px] tracking-wider">Coach/Athlete Notes</p>
                   <p className="font-bold text-text-primary leading-relaxed text-[11px]">{formData.notes.trim() || 'PACE WAS SOLID. FELT VERY SMOOTH THROUGH THE HILLS.'}</p>
                </div>
              </div>

              {/* Footer / Watermark */}
              <div className="mt-auto text-center font-mono opacity-40 text-[9px] uppercase tracking-[0.2em] pt-4 border-t border-dashed border-brand-border">
                made with RunCard Studio
              </div>
              
              {/* Thermal bottom edge effect */}
              {template === 'thermal' && (
                <div className="absolute -bottom-2 left-0 right-0 h-4 bg-[#f4f4f5]" style={{ clipPath: 'polygon(0 0, 5% 100%, 10% 0, 15% 100%, 20% 0, 25% 100%, 30% 0, 35% 100%, 40% 0, 45% 100%, 50% 0, 55% 100%, 60% 0, 65% 100%, 70% 0, 75% 100%, 80% 0, 85% 100%, 90% 0, 95% 100%, 100% 0)' }}></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
