import { useState, MutableRefObject, useRef, useEffect } from "react";
import { Copy, AlertCircle } from "lucide-react";

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

  const [template, setTemplate] = useState("table");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const target = 530; // Target width (max 500px + padding bounds)
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
         splitPace: thisSplitSeconds / interval, // seconds per km
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
         splitPace: finalSplitSeconds / remainingDist, // seconds per km
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
    if (splits.length === 0) return;
    const lines = [];
    lines.push(`Race Plan: ${formData.distanceChoice === "Custom" ? (formData.customDistance || "0") + "km" : formData.distanceChoice}`);
    lines.push(`Target: ${formData.hr}:${formData.min}:${formData.sec}`);
    lines.push(`Strategy: ${formData.strategy}`);
    lines.push(`\nKM\tPACE\tTIME`);
    splits.forEach(s => {
      lines.push(`${s.marker.toFixed(1)}\t${formatPace(s.splitPace)}\t${formatTime(s.cumTime)}`);
    });
    navigator.clipboard.writeText(lines.join("\n"));
    showToast("Splits copied");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* LEFT: FORM (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Race Configuration</h2>
        </div>

        <div className="bg-surface border border-brand-border p-5 rounded-lg flex flex-col gap-4 shadow-xl">
          <div>
            <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Race Distance</label>
            <select 
              value={formData.distanceChoice}
              onChange={e => handleChange("distanceChoice", e.target.value)}
              className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer transition-colors"
            >
              <option value="5K">5K</option>
              <option value="10K">10K</option>
              <option value="Half Marathon">Half Marathon</option>
              <option value="Marathon">Marathon</option>
              <option value="Custom">Custom (km)</option>
            </select>
          </div>

          {formData.distanceChoice === "Custom" && (
            <div>
              <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Custom Distance (km)</label>
              <input 
                type="number" 
                step="0.1"
                value={formData.customDistance}
                onChange={e => handleChange("customDistance", e.target.value)}
                className={`w-full bg-surface-lowest border p-2 rounded text-sm text-text-primary outline-none transition-colors border-brand-border focus:border-secondary-lime`}
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
                 className={`w-full bg-surface-lowest border p-2 rounded text-center font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="01"
               />
               <span className="font-bold">:</span>
               <input 
                 type="text" 
                 maxLength={2}
                 value={formData.min}
                 onChange={e => handleChange("min", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-center font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
                 placeholder="45"
               />
               <span className="font-bold">:</span>
               <input 
                 type="text" 
                 maxLength={2}
                 value={formData.sec}
                 onChange={e => handleChange("sec", e.target.value)}
                 className={`w-full bg-surface-lowest border p-2 rounded text-center font-mono outline-none transition-colors ${isTimeInvalid ? 'border-primary-coral focus:border-primary-coral' : 'border-brand-border focus:border-secondary-lime'}`}
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
                  className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
                >
                  <option value="1">1 km</option>
                  <option value="5">5 km</option>
                </select>
             </div>
             <div>
                <label className="block text-[11px] font-mono text-text-muted uppercase tracking-wider mb-1">Strategy</label>
                <select 
                  value={formData.strategy}
                  onChange={e => handleChange("strategy", e.target.value)}
                  className="w-full bg-surface-lowest border border-brand-border p-2 rounded text-sm text-text-primary focus:border-secondary-lime outline-none cursor-pointer"
                >
                  <option value="Even Split">Even Split</option>
                  <option value="Negative Split">Negative Split</option>
                  <option value="Conservative Start">Conservative</option>
                  <option value="Aggressive Start">Aggressive</option>
                </select>
             </div>
          </div>

          <button onClick={handleCopySplits} className="w-full mt-4 py-2 bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
            <Copy className="w-4 h-4 text-secondary-lime" /> Copy Splits
          </button>
        </div>
      </div>

      {/* RIGHT: PREVIEW (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6 pb-20 animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">Live Preview</h2>
                    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: 'table', label: 'Performance Table' },
              { id: 'plan', label: 'Race Plan' },
              { id: 'carbon', label: 'Dark Carbon' }
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
              className={`w-[480px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none
                ${template === 'carbon' ? 'bg-[#121316] border border-[#22252a] text-[#f2f4f7] p-6 rounded-lg' : ''}
                ${template === 'table' ? 'bg-[#0f1012] border border-[#22252a] p-0 rounded-lg overflow-hidden' : ''}
                ${template === 'plan' ? 'bg-[#fafafa] text-black p-8 font-sans border border-[#e4e4e7] rounded-xl' : ''}
              `}
            >
               {/* Header */}
               <div className={`${template === 'table' ? 'bg-[#16181c] p-6 border-b border-[#22252a]' : (template === 'carbon' ? 'mb-6 pb-4 border-b border-[#22252a]' : 'mb-6 pb-4 border-b border-[#e4e4e7]')}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className={`text-2xl font-black uppercase tracking-tight leading-tight ${template === 'plan' ? 'text-black' : 'text-text-primary'}`}>
                        {formData.distanceChoice === 'Custom' ? (formData.customDistance || '21.1') + ' km' : formData.distanceChoice}
                      </h1>
                      <p className={`font-mono text-xs uppercase tracking-widest ${template === 'plan' ? 'text-[#71717a]' : 'text-secondary-lime'}`}>
                        {formData.strategy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-xs uppercase tracking-widest ${template === 'plan' ? 'text-[#71717a]' : 'opacity-70'}`}>Target Time</p>
                      <p className={`font-mono text-xl font-black uppercase ${template === 'plan' ? 'text-black' : 'text-primary-coral'}`}>
                        {(formData.hr.padStart(2, '0'))}:{(formData.min.padStart(2, '0'))}:{(formData.sec.padStart(2, '0'))}
                      </p>
                    </div>
                  </div>
               </div>

               {/* Table Content */}
               <div className={`flex flex-col ${template === 'table' ? 'p-0' : ''}`}>
                  <div className={`grid grid-cols-3 gap-2 px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest border-b ${template === 'plan' ? 'border-[#e4e4e7] opacity-60' : 'border-[#22252a] opacity-70'}`}>
                    <div>Marker (KM)</div>
                    <div className="text-center">Interval Pace</div>
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
                            <div className={`text-center font-bold
                              ${template === 'plan' ? 'text-black' : (isFaster ? 'text-secondary-lime' : isSlower ? 'text-primary-coral font-black' : 'text-text-primary')}
                            `}>
                              {formatPace(split.splitPace)}
                            </div>
                            <div className={`text-right font-black ${template === 'plan' ? 'text-[#18181b]' : (i === splits.length - 1 ? 'text-secondary-lime font-black' : 'text-text-primary')}`}>
                              {formatTime(split.cumTime)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
               </div>

               {/* Footer */}
               <div className={`mt-4 ${template === 'table' ? 'bg-[#121316] p-4 border-t border-[#22252a]' : 'px-6 pt-4'} flex justify-between font-mono text-[9px] tracking-widest uppercase opacity-50`}>
                  <span>Avg Pace: {formatPace(avgPaceSecs)}/km</span>
                  <span>made with RunCard Studio</span>
               </div>
               
               {template === 'table' && (
                 <div className="h-1 w-full flex">
                    <div className="h-full bg-primary-coral flex-1"></div>
                    <div className="h-full bg-secondary-lime flex-1"></div>
                    <div className="h-full bg-[#00f0ff] flex-1"></div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
