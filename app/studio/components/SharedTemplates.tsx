/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useTemplateAccent } from './TemplateSelector';

export function useExportSize() {
  const [size, setSize] = useState("square");
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initial = localStorage.getItem('runcard-default-export-size') || "square";
    setSize(initial);
    const handler = (e: any) => {
      if (e.detail) setSize(e.detail);
    };
    window.addEventListener('export-size-changed', handler as any);
    return () => window.removeEventListener('export-size-changed', handler as any);
  }, []);
  return size;
}

export function getExportSizeClasses(exportSize: string, template: string) {
  const isShared = ['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template);

  switch (exportSize) {
    case "story":
      return `${isShared ? 'w-[400px] h-[711px] max-h-[711px] p-0 flex flex-col justify-between overflow-hidden gap-0' : 'w-[400px] h-[711px] max-h-[711px] p-6 md:p-8 flex flex-col justify-between overflow-hidden gap-y-4 gap-x-4'}
        [&_h1]:text-3xl [&_h1]:leading-tight [&_h1]:mb-1
        [&_h2]:text-xl [&_h2]:leading-snug
        [&_p]:text-sm [&_p]:leading-normal
        [&_span]:text-xs [&_span]:leading-normal
        [&_.grid]:grid-cols-1 md:[&_.grid]:grid-cols-2 [&_grid]:gap-3
        [&_flex]:gap-3 [&_.gap-6]:gap-4 [&_.mb-6]:mb-3 [&_.mb-8]:mb-4`;
    
    case "landscape":
      return `${isShared ? 'w-[640px] h-[360px] max-h-[360px] p-0 flex flex-col justify-between overflow-hidden gap-0' : 'w-[640px] h-[360px] max-h-[360px] p-5 md:p-6 flex flex-col justify-between overflow-hidden gap-y-2 gap-x-4'}
        [&_h1]:text-2xl [&_h1]:leading-none [&_h1]:mb-1
        [&_h2]:text-base [&_h2]:leading-none
        [&_p]:text-xs [&_p]:leading-tight
        [&_span]:text-[11px] [&_span]:leading-tight
        [&_.grid]:grid-cols-3 [&_grid]:gap-2
        [&_flex]:gap-2 [&_.gap-6]:gap-2 [&_.mb-6]:mb-1.5 [&_.mb-8]:mb-2`;
    
    case "compact":
      return `${isShared ? 'w-[540px] h-[283px] max-h-[283px] p-0 flex flex-col justify-between overflow-hidden gap-0 text-xs' : 'w-[540px] h-[283px] max-h-[283px] p-4 flex flex-col justify-between overflow-hidden gap-y-1.5 gap-x-3 text-xs'}
        [&_h1]:text-lg [&_h1]:leading-none [&_h1]:mb-0.5 [&_h1]:tracking-tight
        [&_h2]:text-sm [&_h2]:leading-none [&_h2]:mb-0.5 [&_h2]:tracking-tight
        [&_p]:text-[10px] [&_p]:leading-snug [&_p]:mb-0.5
        [&_span]:text-[9px] [&_span]:leading-snug [&_span]:mb-0.5
        [&_.grid]:grid-cols-3 [&_grid]:gap-1.5
        [&_flex]:gap-1.5 [&_.gap-4]:gap-1.5 [&_.gap-6]:gap-1.5 [&_.mb-4]:mb-1 [&_.mb-6]:mb-1 [&_.mb-8]:mb-1 [&_.p-6]:p-3 [&_.p-8]:p-3 [&_.p-5]:p-2.5`;
    
    case "printable":
      return `${isShared ? 'w-[595px] h-[842px] max-h-[842px] p-0 flex flex-col justify-between overflow-hidden gap-0' : 'w-[595px] h-[842px] max-h-[842px] p-10 flex flex-col justify-between overflow-hidden gap-y-6 gap-x-6'}
        [&_h1]:text-4xl [&_h1]:leading-tight [&_h1]:mb-2
        [&_h2]:text-2xl [&_h2]:leading-tight
        [&_p]:text-base [&_p]:leading-normal
        [&_span]:text-sm [&_span]:leading-normal`;
    
    case "square":
    default:
      return `${isShared ? 'w-[480px] h-[480px] max-h-[480px] p-0 flex flex-col justify-between overflow-hidden gap-0' : 'w-[480px] h-[480px] max-h-[480px] p-6 md:p-8 flex flex-col justify-between overflow-hidden gap-y-4 gap-x-4'}
        [&_h1]:text-2xl [&_h1]:leading-tight [&_h1]:mb-1
        [&_h2]:text-lg [&_h2]:leading-snug
        [&_p]:text-xs [&_p]:leading-normal
        [&_span]:text-[10px] [&_span]:leading-normal`;
  }
}

interface AccentConfig {
  hex: string;
  text: string;
  border: string;
  bg: string;
  bg10: string;
  bg15: string;
  bg30: string;
  bg50: string;
}

export function getAccentStyles(accentId: string): AccentConfig {
  switch (accentId) {
    case "neon-lime":
      return {
        hex: "#a0cc00",
        text: "text-[#a0cc00]",
        border: "border-[#a0cc00]",
        bg: "bg-[#a0cc00]",
        bg10: "bg-[#a0cc00]/10",
        bg15: "bg-[#a0cc00]/15",
        bg30: "bg-[#a0cc00]/30",
        bg50: "bg-[#a0cc00]/50"
      };
    case "cyan-edge":
      return {
        hex: "#00e5ff",
        text: "text-[#00e5ff]",
        border: "border-[#00e5ff]",
        bg: "bg-[#00e5ff]",
        bg10: "bg-[#00e5ff]/10",
        bg15: "bg-[#00e5ff]/15",
        bg30: "bg-[#00e5ff]/30",
        bg50: "bg-[#00e5ff]/50"
      };
    case "clean-white":
      return {
        hex: "#ffffff",
        text: "text-[#ffffff]",
        border: "border-[#ffffff]",
        bg: "bg-[#ffffff]",
        bg10: "bg-[#ffffff]/10",
        bg15: "bg-[#ffffff]/15",
        bg30: "bg-[#ffffff]/30",
        bg50: "bg-[#ffffff]/50"
      };
    case "carbon-gray":
      return {
        hex: "#71717a",
        text: "text-[#71717a]",
        border: "border-[#71717a]",
        bg: "bg-[#71717a]",
        bg10: "bg-[#71717a]/10",
        bg15: "bg-[#71717a]/15",
        bg30: "bg-[#71717a]/30",
        bg50: "bg-[#71717a]/50"
      };
    case "race-yellow":
      return {
        hex: "#facc15",
        text: "text-[#facc15]",
        border: "border-[#facc15]",
        bg: "bg-[#facc15]",
        bg10: "bg-[#facc15]/10",
        bg15: "bg-[#facc15]/15",
        bg30: "bg-[#facc15]/30",
        bg50: "bg-[#facc15]/50"
      };
    case "electric-blue":
      return {
        hex: "#2563eb",
        text: "text-[#2563eb]",
        border: "border-[#2563eb]",
        bg: "bg-[#2563eb]",
        bg10: "bg-[#2563eb]/10",
        bg15: "bg-[#2563eb]/15",
        bg30: "bg-[#2563eb]/30",
        bg50: "bg-[#2563eb]/50"
      };
    case "warm-sand":
      return {
        hex: "#d4b483",
        text: "text-[#d4b483]",
        border: "border-[#d4b483]",
        bg: "bg-[#d4b483]",
        bg10: "bg-[#d4b483]/10",
        bg15: "bg-[#d4b483]/15",
        bg30: "bg-[#d4b483]/30",
        bg50: "bg-[#d4b483]/50"
      };
    case "coral-red":
    default:
      return {
        hex: "#ff3330",
        text: "text-primary-coral",
        border: "border-primary-coral",
        bg: "bg-primary-coral",
        bg10: "bg-primary-coral/10",
        bg15: "bg-primary-coral/15",
        bg30: "bg-primary-coral/30",
        bg50: "bg-primary-coral/50"
      };
  }
}

interface SharedTemplatesProps {
  template: string;
  formData: any;
  componentName: string;
  extraData?: any;
}

export default function SharedTemplates({ template, formData, componentName, extraData }: SharedTemplatesProps) {
  const exportSize = useExportSize();
  const accentId = useTemplateAccent();
  const accent = getAccentStyles(accentId);

  // Title extraction logic
  const title = String(
    formData.title || formData.name || formData.athleteName || formData.raceName || formData.sessionName || formData.runnerName || formData.achievement || 'RUN SUMMARY'
  );
  
  const dateStr = String(formData.date || formData.targetDate || formData.dateRange || formData.location || '');
  
  // Collect grid items for normal cards
  const gridItems = Object.entries(formData).filter(([k, v]) => {
    if (!v || v === false || typeof v === 'boolean') return false;
    if (['title','name','athleteName','raceName','sessionName','runnerName','date','targetDate','location','achievement','dateRange','id','createdAt','updatedAt','version','exportSize','cardType','template'].includes(k)) return false;
    if (Array.isArray(v) || typeof v === 'object') return false;
    return true;
  });

  const getLabel = (k: string) => {
    if (k.toLowerCase() === 'rpe') return 'RPE';
    return k.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
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

  // Finds the most important metric (e.g., Distance, Duration, Pace, Time) to make it oversized.
  const getPrimaryMetric = () => {
    const distKey = gridItems.find(([k]) => k.toLowerCase().includes('distance') || k.toLowerCase().includes('dist'));
    if (distKey) return distKey;

    const paceKey = gridItems.find(([k]) => k.toLowerCase().includes('pace') || k.toLowerCase().includes('speed'));
    if (paceKey) return paceKey;

    const timeKey = gridItems.find(([k]) => k.toLowerCase().includes('duration') || k.toLowerCase().includes('time') || k.toLowerCase() === 'time');
    if (timeKey) return timeKey;

    return gridItems[0] || null;
  };

  const renderChecklist = () => {
    const items: string[] = [];
    if (formData.bib) items.push("Race Bib");
    if (formData.pins) items.push("Safety Pins/Magnets");
    if (formData.shoes) items.push("Running Shoes");
    if (formData.socks) items.push("Race Socks");
    if (formData.watch) items.push("GPS Watch (Charged)");
    if (formData.gel) items.push("Nutrition/Gels");
    if (formData.bottle) items.push("Water Bottle");
    if (formData.cap) items.push("Cap/Visor");
    if (formData.sunscreen) items.push("Sunscreen");
    if (formData.earbuds) items.push("Earbuds");
    if (formData.phone) items.push("Phone");
    if (formData.idcard) items.push("ID Card");
    if (formData.cash) items.push("Cash/Transport");
    if (formData.clothes) items.push("Dry Clothes");
    if (formData.towel) items.push("Small Towel");
    if (formData.custom1) items.push(formData.custom1);
    if (formData.custom2) items.push(formData.custom2);
    if (formData.custom3) items.push(formData.custom3);

    let maxItems = 10;
    if (exportSize === 'compact') maxItems = 6;
    else if (exportSize === 'landscape') maxItems = 6;
    else if (exportSize === 'story') maxItems = 12;

    const listToRender = items.slice(0, maxItems);

    if (listToRender.length === 0) {
      return (
        <div className="flex-grow flex items-center justify-center text-xs text-zinc-500 italic uppercase tracking-widest py-8">
          No Checklist Items Selected
        </div>
      );
    }

    if (template === 'carbon grid') {
      return (
        <div className="flex-1 grid grid-cols-2 gap-3 font-mono">
          {listToRender.map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2 bg-[#121316] border border-[#2d3139] relative">
              <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: accent.hex }}></div>
              <div className="w-4 h-4 shrink-0 border flex items-center justify-center" style={{ borderColor: accent.hex + '90', color: accent.hex }}>
                <span className="w-1.5 h-1.5 bg-current inline-block"></span>
              </div>
              <span className="text-[10.5px] font-bold text-white truncate uppercase tracking-tight">{it}</span>
            </div>
          ))}
        </div>
      );
    }

    if (template === 'race poster pro') {
      return (
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 font-sans text-white">
          {listToRender.map((it, i) => (
            <div key={i} className="flex items-center gap-3 py-2 px-3 border-l-3 bg-[#181a1f]" style={{ borderLeftColor: accent.hex }}>
              <div className="w-3.5 h-3.5 shrink-0 border border-white/55 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <span className="text-xs font-black uppercase tracking-tight truncate">{it}</span>
            </div>
          ))}
        </div>
      );
    }

    if (template === 'minimal white') {
      return (
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2.5 font-sans text-black">
          {listToRender.map((it, i) => (
            <div key={i} className="flex items-center gap-3 pb-1 border-b border-zinc-100">
              <div className="w-4 h-4 shrink-0 rounded border border-black flex items-center justify-center">
                <span className="text-[9px] font-black leading-none">✓</span>
              </div>
              <span className="text-xs font-bold text-zinc-900 truncate">{it}</span>
            </div>
          ))}
        </div>
      );
    }

    if (template === 'split panel') {
      return (
        <div className="flex-1 grid grid-cols-2 gap-2.5 font-mono">
          {listToRender.map((it, i) => (
            <div key={i} className="flex flex-col p-2.5 rounded-xl border border-[#22252a] bg-[#14151a]">
              <span className="text-[8px] uppercase tracking-wider font-bold mb-1" style={{ color: accent.hex }}>ITEM {String(i+1).padStart(2,'0')}</span>
              <span className="text-xs font-black text-white truncate">{it}</span>
            </div>
          ))}
        </div>
      );
    }

    if (template === 'neon edge') {
      return (
        <div className="flex-1 grid grid-cols-2 gap-3 font-mono text-white">
          {listToRender.map((it, i) => (
            <div key={i} className="flex items-center gap-3 p-2 border-l-2 bg-black/40" style={{ borderLeftColor: accent.hex }}>
              <div className="w-4 h-4 shrink-0 border flex items-center justify-center" style={{ borderColor: accent.hex, color: accent.hex }}>
                <span className="w-1.5 h-1.5 bg-current rounded-full" style={{ filter: `drop-shadow(0 0 2px ${accent.hex})` }}></span>
              </div>
              <span className="text-xs font-bold tracking-tight truncate">{it}</span>
            </div>
          ))}
        </div>
      );
    }

    if (template === 'print utility') {
      return (
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-black">
          {listToRender.map((it, i) => (
            <div key={i} className="flex items-center gap-3 py-1 border-b border-dashed border-gray-300">
              <div className="w-4 h-4 shrink-0 border border-zinc-400 flex items-center justify-center"></div>
              <span className="text-[11px] font-bold text-black truncate uppercase tracking-tight">{it}</span>
            </div>
          ))}
        </div>
      );
    }

    if (template === 'compact story') {
      return (
        <div className="flex-1 flex flex-col justify-center divide-y divide-[#22252a]/60 font-sans text-white">
          {listToRender.map((it, i) => (
            <div key={i} className="flex justify-between items-center py-2.5 px-2">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{it}</span>
              <span className="w-4 h-4 shrink-0 border flex items-center justify-center" style={{ borderColor: accent.hex, color: accent.hex }}>
                <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
              </span>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  const renderRoutePoster = () => {
    const isDark = (template !== 'print utility' && template !== 'minimal white');
    const showMap = !!extraData?.parsedData;
    
    const mapElement = showMap ? (
      <div className="flex-grow flex items-center justify-center p-1 w-full max-h-[175px] md:max-h-[220px] overflow-hidden">
        <svg viewBox="0 0 360 360" className="w-[180px] h-[180px] md:w-[245px] md:h-[245px] overflow-visible max-h-[165px] md:max-h-[210px]" style={{ stroke: accent.hex, filter: template === 'neon edge' ? `drop-shadow(0 0 4px ${accent.hex}aa)` : undefined }}>
          <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          {formData.showStartEnd && extraData.parsedData.points?.length > 0 && (
            <>
              <circle cx={extraData.parsedData.points[0].x} cy={extraData.parsedData.points[0].y} r="8" fill="#a0cc00" stroke={isDark ? "#000" : "#fff"} strokeWidth="3.5" />
              <circle cx={extraData.parsedData.points[extraData.parsedData.points.length-1].x} cy={extraData.parsedData.points[extraData.parsedData.points.length-1].y} r="8" fill="#ff3330" stroke={isDark ? "#000" : "#fff"} strokeWidth="3.5" />
            </>
          )}
        </svg>
      </div>
    ) : (
      <div className={`flex-grow flex items-center justify-center py-8 text-[10px] font-mono tracking-widest uppercase opacity-45 px-6 border border-dashed rounded ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-300 text-zinc-400'}`}>
        Upload GPX Map
      </div>
    );

    const statsElement = (
      <div className="w-full flex-shrink-0 mt-2">
        {formData.distance && (
          <div className="text-center mb-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">TOTAL DISTANCE</span>
            <div className="text-xl md:text-2xl font-black" style={{ color: accent.hex }}>{formData.distance}</div>
          </div>
        )}
        {formData.showElevation && extraData?.parsedData?.eleInfo?.valid && (
          <div className={`grid grid-cols-2 gap-4 text-center border-t py-2 text-[10px] ${isDark ? 'border-[#2d3139] text-zinc-400' : 'border-zinc-200 text-zinc-600'}`}>
            <div>
              <span className="uppercase text-[8px] opacity-60 tracking-wider">Elevation Min</span>
              <div className="font-extrabold text-xs text-white">{Math.round(extraData.parsedData.eleInfo.min)}m</div>
            </div>
            <div className={`border-l ${isDark ? 'border-[#2d3139]' : 'border-zinc-200'}`}>
              <span className="uppercase text-[8px] opacity-60 tracking-wider">Elevation Max</span>
              <div className="font-extrabold text-xs text-white">{Math.round(extraData.parsedData.eleInfo.max)}m</div>
            </div>
          </div>
        )}
      </div>
    );

    if (template === 'carbon grid') {
      return (
        <div className="flex-1 flex flex-col justify-between items-center w-full gap-2 p-3 border border-[#2d3139] bg-[#121316]/50 relative">
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l" style={{ borderColor: accent.hex }}></div>
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r" style={{ borderColor: accent.hex }}></div>
          {mapElement}
          {statsElement}
        </div>
      );
    }

    if (template === 'race poster pro') {
      return (
        <div className="flex-1 flex flex-col justify-between items-center w-full bg-[#181a1f]/60 border-l-4 p-3 gap-2" style={{ borderLeftColor: accent.hex }}>
          {mapElement}
          <div className="w-full h-[1px] bg-zinc-800" style={{ backgroundColor: accent.hex + '35' }}></div>
          {statsElement}
        </div>
      );
    }

    if (template === 'minimal white') {
      const darkStatsElement = (
        <div className="w-full flex-shrink-0 mt-2">
          {formData.distance && (
            <div className="text-center mb-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">TOTAL DISTANCE</span>
              <div className="text-xl md:text-2xl font-black text-black">{formData.distance}</div>
            </div>
          )}
          {formData.showElevation && extraData?.parsedData?.eleInfo?.valid && (
            <div className="grid grid-cols-2 gap-4 text-center border-t border-zinc-200 py-2 text-[10px] text-zinc-600">
              <div>
                <span className="uppercase text-[8px] opacity-60 tracking-wider">Elevation Min</span>
                <div className="font-extrabold text-xs text-black">{Math.round(extraData.parsedData.eleInfo.min)}m</div>
              </div>
              <div className="border-l border-zinc-200">
                <span className="uppercase text-[8px] opacity-60 tracking-wider">Elevation Max</span>
                <div className="font-extrabold text-xs text-black">{Math.round(extraData.parsedData.eleInfo.max)}m</div>
              </div>
            </div>
          )}
        </div>
      );
      return (
        <div className="flex-1 flex flex-col justify-between items-center w-full bg-white border border-zinc-200 p-3 gap-2">
          {mapElement}
          {darkStatsElement}
        </div>
      );
    }

    if (template === 'split panel') {
      return (
        <div className="flex-1 grid grid-cols-2 gap-3 w-full">
          <div className="rounded-xl border border-[#22252a] bg-[#14151a] p-3 flex items-center justify-center">
            {mapElement}
          </div>
          <div className="rounded-xl border border-[#22252a] bg-[#14151a] p-4 flex flex-col justify-center text-left">
            <span className="text-[8px] uppercase tracking-wider font-bold" style={{ color: accent.hex }}>METRICS</span>
            {formData.distance && (
              <div className="mt-1 text-lg font-black text-white">{formData.distance}</div>
            )}
            {formData.showElevation && extraData?.parsedData?.eleInfo?.valid && (
              <div className="mt-2 text-[10px] text-gray-400 border-t border-[#22252a] pt-2">
                <p>MIN: {Math.round(extraData.parsedData.eleInfo.min)}m</p>
                <p>MAX: {Math.round(extraData.parsedData.eleInfo.max)}m</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (template === 'neon edge') {
      return (
        <div className="flex-1 flex flex-col justify-between items-center w-full bg-[#0a0b0d]/85 p-4 border-l-[3px]" style={{ borderLeftColor: accent.hex }}>
          {mapElement}
          {statsElement}
        </div>
      );
    }

    if (template === 'print utility') {
      const darkStatsElementPrint = (
        <div className="w-full flex-shrink-0 mt-2">
          {formData.distance && (
            <div className="text-center mb-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">TOTAL DISTANCE</span>
              <div className="text-xl md:text-2xl font-black text-black">{formData.distance}</div>
            </div>
          )}
          {formData.showElevation && extraData?.parsedData?.eleInfo?.valid && (
            <div className="grid grid-cols-2 gap-4 text-center border-t border-zinc-300 py-2 text-[10px] text-zinc-600">
              <div>
                <span className="uppercase text-[8px] opacity-60 tracking-wider">Elevation Min</span>
                <div className="font-extrabold text-xs text-black">{Math.round(extraData.parsedData.eleInfo.min)}m</div>
              </div>
              <div className="border-l border-zinc-300">
                <span className="uppercase text-[8px] opacity-60 tracking-wider">Elevation Max</span>
                <div className="font-extrabold text-xs text-black">{Math.round(extraData.parsedData.eleInfo.max)}m</div>
              </div>
            </div>
          )}
        </div>
      );
      return (
        <div className="flex-1 flex flex-col justify-between items-center w-full bg-white border border-dashed border-zinc-300 p-2 gap-2 text-black">
          {mapElement}
          {darkStatsElementPrint}
        </div>
      );
    }

    if (template === 'compact story') {
      return (
        <div className="flex-1 flex flex-col justify-center items-center w-full gap-3">
          {mapElement}
          {statsElement}
        </div>
      );
    }

    return null;
  };

  const renderContent = (themeClasses: any) => {
    if (componentName === 'RaceChecklistGenerator') {
      return renderChecklist();
    }
    if (componentName === 'RoutePosterGenerator') {
      return renderRoutePoster();
    }

    let gridCols = "grid-cols-2";
    if (exportSize === "story") {
      gridCols = "grid-cols-1 md:grid-cols-2";
    } else if (exportSize === "landscape") {
      gridCols = gridItems.length > 4 ? "grid-cols-3" : "grid-cols-2";
    } else if (exportSize === "compact") {
      gridCols = "grid-cols-3";
    }

    let cardPadding = "p-3";
    let labelSize = "text-[9px]";
    let valueSize = "text-sm";
    let containerMinHeight = "min-h-[50px]";
    
    if (exportSize === "compact") {
      cardPadding = "p-2";
      labelSize = "text-[8px]";
      valueSize = "text-xs";
      containerMinHeight = "min-h-[40px]";
    }

    // --- TEMPLATE 09: PRINT UTILITY ---
    if (template === 'print utility') {
      if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
        const isWide = exportSize === 'landscape' || exportSize === 'compact';
        return (
          <div className="flex-1 w-full text-left font-mono text-black">
            <div className={`grid ${isWide ? 'grid-cols-3' : 'grid-cols-2'} text-[9px] uppercase font-bold tracking-widest pb-1 mb-2 border-b-2 border-black`}>
              {isWide ? (
                <>
                  <div>Split Marker</div><div>Split Time</div><div>Cumulative</div>
                </>
              ) : (
                <>
                  <div>Distance Unit</div><div>Cumulative Time</div>
                </>
              )}
            </div>
            <div className={`grid ${isWide ? 'grid-cols-3' : 'grid-cols-2'} gap-x-6 gap-y-1.5`}>
              {extraData.splits.map((s: any, i: number) => {
                const step = s.km ?? s.marker ?? '';
                const timeText = s.current ?? (s.cumTime ? formatTime(s.cumTime) : '');
                const suffix = s.total ? ` [${s.total}]` : '';
                return (
                  <div key={i} className="flex justify-between items-baseline py-1 border-b border-dashed border-gray-300">
                    <span className="font-bold text-[10px]">{step}</span>
                    <span className="flex-grow border-b border-dotted border-gray-300 mx-2"></span>
                    <span className="text-right text-[11px] font-bold">{timeText}<span className="text-[8px] opacity-60 font-medium">{suffix}</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      if (componentName === 'RaceSplitGenerator') {
        const splits = gridItems.filter(([k]) => k.startsWith('split'));
        const others = gridItems.filter(([k]) => !k.startsWith('split'));
        return (
          <div className="flex-1 w-full flex flex-col gap-4 font-mono text-black">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wide font-black border-b border-black pb-1 mb-2 text-gray-500">GENERAL STATS</div>
              {others.map(([k, v]) => (
                <div key={k} className="flex justify-between items-baseline py-1 border-b border-dashed border-gray-300">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500">{getLabel(k)}</span>
                  <span className="flex-grow border-b border-dotted border-gray-300 mx-2"></span>
                  <span className="text-[11px] font-bold text-black">{String(v)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wide font-black border-b border-black pb-1 mb-2 text-gray-500">RACE SPLITS</div>
              {splits.map(([k, v]) => (
                <div key={k} className="flex justify-between items-baseline py-1 border-b border-dashed border-gray-300">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400">{k.replace('split', 'SPLIT ')}</span>
                  <span className="flex-grow border-b border-dotted border-gray-300 mx-2"></span>
                  <span className="text-[11px] font-bold text-black">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div className="flex-1 flex flex-col justify-start w-full gap-1 font-mono text-black">
          <div className="text-[10px] uppercase tracking-widest font-black border-b-2 border-black pb-1 mb-2 text-black flex justify-between">
            <span>METRIC PROFILE</span>
            <span>VALUE</span>
          </div>
          {gridItems.map(([k, v]) => (
            <div key={k} className="flex justify-between items-baseline py-1.5 border-b border-dashed border-gray-300">
              <span className="text-[9px] uppercase tracking-wider text-gray-500">{getLabel(k)}</span>
              <span className="flex-grow border-b border-dotted border-gray-300 mx-2"></span>
              <span className="text-[11.5px] font-bold text-black truncate max-w-[50%]">{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    // --- TEMPLATE 06: MINIMAL WHITE ---
    if (template === 'minimal white') {
      if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
        const isWide = exportSize === 'landscape' || exportSize === 'compact';
        return (
          <div className="flex-1 w-full text-left font-sans text-black">
            <div className="grid grid-cols-2 border-b border-black pb-1 mb-2">
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Split</span>
              <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold text-right font-mono" style={{ color: accent.hex }}>Pace / Delta</span>
            </div>
            <div className={`grid ${isWide ? 'grid-cols-2' : 'grid-cols-1'} gap-x-8 gap-y-1`}>
              {extraData.splits.map((s: any, i: number) => {
                const step = s.km ?? s.marker ?? '';
                const timeText = s.current ?? (s.cumTime ? formatTime(s.cumTime) : '');
                const suffix = s.total ? ` (${s.total})` : '';
                return (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-zinc-100">
                    <span className="text-[11px] font-bold tracking-tight text-neutral-800">{step}</span>
                    <span className="text-[11px] text-right font-mono tracking-tighter text-black">{timeText}<span className="text-[9px] font-sans opacity-50 ml-1" style={{ color: accent.hex }}>{suffix}</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      if (componentName === 'RaceSplitGenerator') {
        const splits = gridItems.filter(([k]) => k.startsWith('split'));
        const others = gridItems.filter(([k]) => !k.startsWith('split'));
        return (
          <div className="flex-1 w-full flex flex-col gap-4 font-sans text-black">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {others.map(([k, v]) => (
                <div key={k} className="border-b border-zinc-200 pb-1.5">
                  <div className="text-[8px] uppercase tracking-widest font-bold mb-0.5" style={{ color: accent.hex }}>{getLabel(k)}</div>
                  <div className="text-xs font-bold text-black">{String(v)}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 border-t border-black pt-2">
              <div className="text-[9px] uppercase tracking-widest text-zinc-400 font-black mb-1.5">Splits Track</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                {splits.map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b border-zinc-100">
                    <span className="font-medium text-zinc-500">{k.replace('split', 'Split ')}</span>
                    <span className="font-mono font-bold text-black" style={{ color: accent.hex }}>{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="flex-1 flex flex-col justify-start w-full gap-1 font-sans text-black">
          {gridItems.map(([k, v]) => (
            <div key={k} className="flex justify-between items-baseline border-b border-zinc-200 py-2.5">
              <span className="text-[9.5px] font-sans font-semibold tracking-wider uppercase text-zinc-500">{getLabel(k)}</span>
              <span className="text-xs font-sans font-extrabold text-black text-right truncate max-w-[60%]" style={{ color: accent.hex }}>{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    // --- TEMPLATE 04: CARBON GRID ---
    if (template === 'carbon grid') {
      if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
        const isWide = exportSize === 'landscape' || exportSize === 'compact';
        return (
          <div className="flex-1 w-full text-center mt-1 pb-1 overflow-visible font-mono text-[#f2f4f7]">
            <div className="grid grid-cols-2 text-[9px] uppercase tracking-widest pb-1 mb-2 border-b border-[#2d3139]" style={{ color: accent.hex }}>
              <div>Target Marker</div><div>Technical Split</div>
            </div>
            <div className={`grid ${isWide ? 'grid-cols-2' : 'grid-cols-1'} gap-x-6 gap-y-2`}>
              {extraData.splits.map((s: any, i: number) => {
                const step = s.km ?? s.marker ?? '';
                const timeText = s.current ?? (s.cumTime ? formatTime(s.cumTime) : '');
                const suffix = s.total ? ` [${s.total}]` : '';
                return (
                  <div key={i} className="flex justify-between items-center p-2 rounded-none border border-[#2d3139]/40 bg-[#121316] relative">
                    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: accent.hex }}></div>
                    <span className="text-[10px] font-bold text-gray-400">{step}</span>
                    <span className="text-[11px] font-black text-white">{timeText}<span className="text-[8px] ml-1" style={{ color: accent.hex }}>{suffix}</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      if (componentName === 'RaceSplitGenerator') {
        const splits = gridItems.filter(([k]) => k.startsWith('split'));
        const others = gridItems.filter(([k]) => !k.startsWith('split'));
        return (
          <div className="flex-1 w-full flex flex-col gap-3 font-mono">
            <div className="grid grid-cols-3 gap-2">
              {others.map(([k, v]) => (
                <div key={k} className="flex flex-col justify-center p-2 border border-[#2d3139]/60 bg-[#111215] relative min-h-[44px]">
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: accent.hex + '80' }}></div>
                  <span className="text-[8px] uppercase font-bold mb-0.5" style={{ color: accent.hex }}>{getLabel(k)}</span>
                  <span className="text-[11px] font-black text-white truncate">{String(v)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#2d3139]/80 pt-2 text-[#f2f4f7]">
              <div className="text-[9px] uppercase tracking-widest mb-1.5" style={{ color: accent.hex }}>DATA ARRAYS</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                {splits.map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center p-1.5 border border-[#2d3139]/30 bg-[#121316]/50">
                    <span className="text-[9px]" style={{ color: accent.hex }}>{k.replace('split', 'SP ')}</span>
                    <span className="font-extrabold text-white">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      const primaryItem04 = getPrimaryMetric();
      const secondaryItems04 = primaryItem04 
        ? gridItems.filter(([k]) => k !== primaryItem04[0]) 
        : gridItems;

      return (
        <div className="flex-1 flex flex-col gap-3 font-mono text-[#f2f4f7]">
          {primaryItem04 && (
            <div className="flex flex-col justify-center p-3.5 bg-[#121316] border border-[#3a322d] relative overflow-hidden min-h-[64px]">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: accent.hex }}></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: accent.hex }}></div>
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 mb-0.5 font-bold">{getLabel(primaryItem04[0])}</span>
              <span className="text-2xl font-black tracking-tight text-white">{String(primaryItem04[1])}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {secondaryItems04.map(([k, v]) => {
              const label = getLabel(k);
              const isPaceTime = k.toLowerCase().includes('pace') || k.toLowerCase().includes('time') || k.toLowerCase().includes('duration') || k.toLowerCase().includes('target') || k.toLowerCase().includes('intensity');
              const isPositive = String(v).toLowerCase().includes('good') || String(v).toLowerCase().includes('excellent') || String(v).toLowerCase().includes('yes') || String(v).toLowerCase().includes('solid');
              const valColor = isPositive ? 'text-[#a0cc00]' : isPaceTime ? 'text-[#ff3330]' : 'text-white';
              return (
                <div key={k} className="flex flex-col justify-center p-2.5 bg-[#121316] border border-[#22252a]/80 relative min-h-[46px]">
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: accent.hex + '60' }}></div>
                  <span className="text-[8.5px] uppercase tracking-widest text-zinc-500 mb-0.5">{label}</span>
                  <span className={`text-[12px] font-black truncate ${valColor}`}>{String(v)}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // --- TEMPLATE 05: RACE POSTER ---
    if (template === 'race poster pro') {
      if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
        return (
          <div className="flex-1 w-full text-left font-sans text-white">
            <div className="pb-1 mb-2 border-b-2" style={{ borderColor: accent.hex }}>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-extrabold">ATHLETIC INTERVAL SPLITS</span>
            </div>
            <div className="space-y-1 max-h-[220px] overflow-visible">
              {extraData.splits.map((s: any, i: number) => {
                const step = s.km ?? s.marker ?? '';
                const timeText = s.current ?? (s.cumTime ? formatTime(s.cumTime) : '');
                const suffix = s.total ? ` [${s.total}]` : '';
                return (
                  <div key={i} className="flex justify-between items-center py-2 border-l-4 pl-3 bg-[#181a1f]" style={{ borderLeftColor: accent.hex }}>
                    <span className="text-[11px] font-black tracking-tight">{step}</span>
                    <span className="text-xs font-mono font-bold">{timeText}<span className="text-[9px] text-gray-400 ml-1">{suffix}</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      if (componentName === 'RaceSplitGenerator') {
        const splits = gridItems.filter(([k]) => k.startsWith('split'));
        const others = gridItems.filter(([k]) => !k.startsWith('split'));
        return (
          <div className="flex-1 w-full flex flex-col gap-3 font-sans">
            <div className="grid grid-cols-2 gap-2">
              {others.map(([k, v]) => (
                <div key={k} className="p-2.5 border-l-3 bg-[#181a1f]/80" style={{ borderLeftColor: accent.hex }}>
                  <div className="text-[8px] uppercase tracking-wider text-gray-400 font-extrabold mb-0.5">{getLabel(k)}</div>
                  <div className="text-xs font-black text-white truncate">{String(v)}</div>
                </div>
              ))}
            </div>
            <div className="mt-1 border-t pt-2" style={{ borderTopColor: accent.hex + '40' }}>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {splits.map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-1.5 px-2 border-b border-zinc-800">
                    <span className="font-extrabold text-gray-400 text-[10px] tracking-tight">{k.replace('split', 'RUN SPLIT ')}</span>
                    <span className="font-mono font-black text-white">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      const primaryItem05 = getPrimaryMetric();
      const secondaryItems05 = primaryItem05 
        ? gridItems.filter(([k]) => k !== primaryItem05[0]) 
        : gridItems;

      return (
        <div className="flex-1 flex flex-col justify-between font-sans text-white">
          {primaryItem05 ? (
            <div className="my-auto text-center flex flex-col justify-center py-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#71717a] font-extrabold mb-1">{getLabel(primaryItem05[0])}</span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter leading-none text-white uppercase">{String(primaryItem05[1])}</span>
              <div className="w-1/4 h-[2px] mx-auto mt-3" style={{ backgroundColor: accent.hex }}></div>
            </div>
          ) : (
            <div className="my-auto text-center py-4 text-zinc-500 italic uppercase text-[10px] tracking-widest">No metrics</div>
          )}
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pt-2 border-t border-zinc-900/40">
            {secondaryItems05.map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-1 border-b border-zinc-900/60">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#71717a]">{getLabel(k)}</span>
                <span className="text-[11px] font-black text-white truncate max-w-[65%]">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // --- TEMPLATE 07: SPLIT PANEL ---
    if (template === 'split panel') {
      if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
        return (
          <div className="flex-1 w-full text-left font-mono text-[#f2f4f7]">
            <div className="grid grid-cols-2 gap-2">
              {extraData.splits.map((s: any, i: number) => {
                const step = s.km ?? s.marker ?? '';
                const timeText = s.current ?? (s.cumTime ? formatTime(s.cumTime) : '');
                return (
                  <div key={i} className="flex flex-col p-3 rounded-xl border border-[#22252a] bg-[#14151a] shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                    <span className="text-[8px] uppercase tracking-wider font-bold" style={{ color: accent.hex }}>{step}</span>
                    <span className="text-xs font-black text-white truncate mt-1">{timeText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      const panels = gridItems.slice(0, 4);
      return (
        <div className="flex-1 grid gap-3 grid-cols-2 font-mono">
          {panels.map(([k, v], i) => {
            const isPrimary = i === 0;
            const highlightColor = isPrimary ? '#ff3330' : accent.hex;
            return (
              <div 
                key={k} 
                className="flex flex-col justify-center p-3 rounded-xl border border-[#22252a] bg-[#14151a] shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                style={{ borderTopWidth: '3px', borderTopColor: highlightColor }}
              >
                <span className="text-[8px] uppercase tracking-widest font-bold text-zinc-500 mb-0.5">{getLabel(k)}</span>
                <span className="text-xs font-black text-white truncate">{String(v)}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // --- TEMPLATE 08: NEON EDGE ---
    if (template === 'neon edge') {
      if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
        return (
          <div className="flex-1 w-full text-left font-mono text-white">
            <div className="grid grid-cols-1 gap-2">
              {extraData.splits.map((s: any, i: number) => {
                const step = s.km ?? s.marker ?? '';
                const timeText = s.current ?? (s.cumTime ? formatTime(s.cumTime) : '');
                const isLime = i % 2 === 0;
                return (
                  <div 
                    key={i} 
                    className="flex justify-between items-center px-3 py-2 border-l-2 bg-black/40"
                    style={{ 
                      borderLeftColor: isLime ? accent.hex : accent.hex + '99',
                      color: isLime ? accent.hex : '#ffffff' 
                    }}
                  >
                    <span className="text-[10px] uppercase font-bold text-gray-400">{step}</span>
                    <span className="text-[12px] font-black">{timeText}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      const primaryItem08 = getPrimaryMetric();
      const secondaryItems08 = primaryItem08 
        ? gridItems.filter(([k]) => k !== primaryItem08[0]) 
        : gridItems;
        
      return (
        <div className="flex-1 flex flex-col gap-2 p-1 font-mono text-white">
          {primaryItem08 && (
            <div className="flex flex-col justify-center p-2.5 bg-[#0a0b0d]/80 border-l-[3px] relative" style={{ borderLeftColor: '#ff3330', backgroundColor: '#ff333008' }}>
              <span className="text-[8.5px] uppercase tracking-wider text-zinc-500 mb-0.5 font-bold">{getLabel(primaryItem08[0])}</span>
              <span className="text-xl font-black text-[#ff3330] tracking-tight">{String(primaryItem08[1])}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            {secondaryItems08.map(([k, v]) => (
              <div 
                key={k} 
                className="flex flex-col justify-center p-2 px-2.5 bg-[#0a0b0d]/70 border-l-[2px]"
                style={{ borderLeftColor: accent.hex, backgroundColor: accent.hex + '04' }}
              >
                <span className="text-[8px] uppercase tracking-wider text-zinc-500 mb-0.5">{getLabel(k)}</span>
                <span className="text-xs font-black text-white truncate">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // --- TEMPLATE 10: COMPACT STORY ---
    if (template === 'compact story') {
      if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
        return (
          <div className="flex-1 w-full flex flex-col justify-center divide-y divide-[#22252a]/60 font-sans text-white">
            {extraData.splits.slice(0, 6).map((s: any, i: number) => {
              const step = s.km ?? s.marker ?? '';
              const timeText = s.current ?? (s.cumTime ? formatTime(s.cumTime) : '');
              return (
                <div key={i} className="flex justify-between items-center py-2.5 px-2">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">{step}</span>
                  <span className="text-xs font-black font-mono" style={{ color: accent.hex }}>{timeText}</span>
                </div>
              );
            })}
          </div>
        );
      }

      const primaryItem10 = getPrimaryMetric();
      const secondaryItems10 = primaryItem10 
        ? gridItems.filter(([k]) => k !== primaryItem10[0]) 
        : gridItems;

      return (
        <div className="flex-1 flex flex-col justify-between font-sans text-white">
          {primaryItem10 ? (
            <div className="my-auto text-center flex flex-col justify-center py-1">
              <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-bold mb-0.5">{getLabel(primaryItem10[0])}</span>
              <span className="text-2xl font-black uppercase tracking-tight" style={{ color: accent.hex }}>{String(primaryItem10[1])}</span>
            </div>
          ) : (
            <div className="my-auto text-center text-zinc-500 italic text-xs">No metrics</div>
          )}
          
          <div className="mt-auto space-y-0.5 divide-y divide-[#22252a]/40">
            {secondaryItems10.slice(0, 4).map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-2 px-1 text-xs border-[#22252a]/40">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">{getLabel(k)}</span>
                <span className="font-extrabold text-white truncate max-w-[65%]">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (componentName === 'PaceBandGenerator' && extraData && extraData.splits) {
       const isWide = exportSize === 'landscape' || exportSize === 'compact';
       return (
         <div className="flex-1 w-full text-center mt-1 pb-1 overflow-visible">
            <div className={`grid ${isWide ? 'grid-cols-3' : 'grid-cols-2'} text-[10px] uppercase font-bold tracking-widest pb-1 mb-1.5 border-b ${themeClasses.border}`}>
               {isWide ? (
                 <>
                   <div>Split 1</div><div>Split 2</div><div>Split 3</div>
                 </>
               ) : (
                 <>
                   <div>Units</div><div>Time / Cumulative</div>
                 </>
               )}
            </div>
            <div className={`grid ${isWide ? 'grid-cols-3' : 'grid-cols-2'} gap-x-4 gap-y-1.5 overflow-visible`}>
              {extraData.splits.map((s: any, i: number) => {
                const step = s.km ?? s.marker ?? '';
                const timeText = s.current ?? (s.cumTime ? formatTime(s.cumTime) : '');
                const suffix = s.total ? ` (${s.total})` : '';
                return (
                  <div key={i} className={`flex justify-between text-[11px] font-mono items-center pb-0.5 border-b border-dashed ${themeClasses.borderDashed}`}>
                    <span className="font-bold">{step}</span>
                    <span className="text-right">{timeText}<span className="opacity-50 text-[9px]">{suffix}</span></span>
                  </div>
                );
              })}
            </div>
         </div>
       );
    }
    
    if (componentName === 'RaceSplitGenerator') {
       // Only show populated splits
       const splits = gridItems.filter(([k]) => k.startsWith('split'));
       const others = gridItems.filter(([k]) => !k.startsWith('split'));
       const isWide = exportSize === 'landscape' || exportSize === 'compact';
       return (
         <div className="flex-1 w-full flex flex-col gap-2 overflow-visible">
            <div className={`grid gap-2 ${exportSize === 'compact' ? 'grid-cols-3 gap-1.5' : (template === 'split panel' || template === 'compact story') ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {others.map(([k, v]) => (
                <div key={k} className={`flex flex-col flex-1 justify-center p-2 rounded ${themeClasses.card} ${exportSize === 'compact' ? 'min-h-[40px]' : 'min-h-[50px]'}`}>
                  <span className={`text-[8px] uppercase tracking-widest font-bold mb-0.5 ${themeClasses.label}`}>{getLabel(k)}</span>
                  <span className={`text-xs font-bold truncate ${themeClasses.value}`}>{String(v)}</span>
                </div>
              ))}
            </div>
            
            <div className={`grid ${isWide ? 'grid-cols-3' : 'grid-cols-2'} gap-x-4 gap-y-1 mt-1`}>
              {splits.map(([k, v]) => (
                <div key={k} className={`flex justify-between items-center border-b pb-0.5 ${themeClasses.border} text-xs`}>
                  <span className={`text-[9px] uppercase font-bold ${themeClasses.label}`}>{k.replace('split', 'Split ')}</span>
                  <span className={`font-mono font-bold ${themeClasses.value}`}>{String(v)}</span>
                </div>
              ))}
            </div>
         </div>
       );
    }

    return (
      <div className={`flex-1 grid gap-2 overflow-visible ${template === 'compact story' ? 'grid-cols-1' : template === 'split panel' ? 'grid-cols-2' : gridCols}`}>
        {gridItems.map(([k, v], i) => (
          <div key={k} className={`flex flex-col flex-1 ${containerMinHeight} justify-center ${cardPadding} rounded ${themeClasses.card}`}>
            <span className={`${labelSize} uppercase tracking-widest font-bold mb-0.5 ${themeClasses.label}`}>{getLabel(k)}</span>
            <span className={`${valueSize} font-bold truncate ${themeClasses.value}`}>{String(v)}</span>
          </div>
        ))}
      </div>
    );
  };

  const watermark = <div className={`mt-auto text-right text-[8px] uppercase tracking-widest font-mono opacity-40 pt-4 ${(template === 'print utility' || template === 'minimal white') ? 'text-black' : 'text-white'}`}>{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}</div>;

  const getSizeStyles = (size: string) => {
    switch (size) {
      case "story":
        return {
          wrapper: "w-[400px] h-[711px] p-8",
          title: "text-3xl",
          subtitle: "text-[10px]",
          contentGap: "gap-6",
        };
      case "landscape":
        return {
          wrapper: "w-[640px] h-[360px] p-6",
          title: "text-2xl",
          subtitle: "text-[9px]",
          contentGap: "gap-4",
        };
      case "compact":
        return {
          wrapper: "w-[540px] h-[283px] p-4",
          title: "text-xl",
          subtitle: "text-[8px]",
          contentGap: "gap-2.5",
        };
      case "printable":
        return {
          wrapper: "w-[595px] h-[842px] p-8",
          title: "text-4xl",
          subtitle: "text-[11px]",
          contentGap: "gap-8",
        };
      case "square":
      default:
        return {
          wrapper: "w-[480px] h-[480px] p-8",
          title: "text-3xl",
          subtitle: "text-[10px]",
          contentGap: "gap-6",
        };
    }
  };

  const layout = getSizeStyles(exportSize);

  // 04 Carbon Grid
  if (template === 'carbon grid') {
    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#181a1f] border border-[#22252a] text-[#f2f4f7] font-mono`}>
         <div className="absolute inset-0 bg-[radial-gradient(#22252a_1px,transparent_1px)] [background-size:12px_12px] opacity-80 z-0"></div>
         <div className="relative z-10 p-1 flex flex-col h-full justify-between">
            <div className={`mb-4 pb-3 border-b border-[#22252a] ${exportSize === 'compact' ? 'mb-2 pb-1' : ''}`}>
              <h1 className={`${layout.title} font-black uppercase tracking-tighter leading-tight text-white mb-1 break-words`}>{title}</h1>
              <div className={`${layout.subtitle} uppercase tracking-widest font-bold`} style={{ color: accent.hex }}>{dateStr}</div>
            </div>
            {renderContent({
               card: 'border border-[#22252a] bg-[#121316]',
               label: 'text-primary-coral',
               value: 'text-white',
               border: 'border-[#22252a]',
               borderDashed: 'border-[#22252a]/50'
            })}
            {watermark}
         </div>
      </div>
    );
  }

  // 05 Race Poster Pro
  if (template === 'race poster pro') {
    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#0f1012] border-2 border-[#181a1f] text-white`}>
         <div className="h-2 w-full" style={{ backgroundColor: accent.hex }}></div>
         <div className="p-4 flex flex-col h-full font-sans justify-between">
            <div>
              <h1 className={`${layout.title} font-black uppercase tracking-tighter leading-none mb-1 break-words`}>{title}</h1>
              <div className={`${layout.subtitle} uppercase tracking-widest font-bold mb-4`} style={{ color: accent.hex }}>{dateStr}</div>
            </div>
            {renderContent({
               card: 'border-l-2 border-primary-coral pl-3 bg-[#181a1f]/50',
               label: 'text-gray-400',
               value: 'text-white font-bold',
               border: 'border-[#22252a]',
               borderDashed: 'border-[#22252a]/50'
            })}
            {watermark}
         </div>
      </div>
    );
  }

  // 06 Minimal White
  if (template === 'minimal white') {
    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#f4f4f5] border border-[#e4e4e7] text-[#18181b]`}>
         <div className="p-4 flex flex-col h-full font-sans justify-between">
            <div className={`mb-4 border-b-2 border-[#18181b] pb-3 ${exportSize === 'compact' ? 'mb-2 pb-1' : ''}`}>
              <h1 className={`${layout.title} font-black uppercase tracking-tight leading-tight text-black break-words`}>{title}</h1>
              <div className={`${layout.subtitle} uppercase tracking-widest font-bold mt-1`} style={{ color: accent.hex }}>{dateStr}</div>
            </div>
            {renderContent({
               card: 'border border-[#e4e4e7] bg-white',
               label: 'text-gray-500',
               value: 'text-black',
               border: 'border-[#e4e4e7]',
               borderDashed: 'border-[#e4e4e7]/50'
            })}
            {watermark}
         </div>
      </div>
    );
  }

  // 07 Split Panel
  if (template === 'split panel') {
    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#111316] text-[#f2f4f7] font-mono justify-between`}>
         <div className={`bg-[#181a1f] rounded text-center p-3 border border-[#22252a] mb-3 ${exportSize === 'compact' ? 'p-1.5 mb-1.5' : ''}`}>
           <h1 className={`${layout.title} font-black uppercase tracking-tighter leading-tight break-words`} style={{ color: accent.hex }}>{title}</h1>
           <div className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">{dateStr}</div>
         </div>
         <div className="flex-1 flex flex-col justify-center">
            {renderContent({
               card: 'border border-[#22252a] bg-[#181a1f]/50',
               label: 'text-primary-coral',
               value: 'text-white',
               border: 'border-[#22252a]',
               borderDashed: 'border-[#22252a]/50'
            })}
         </div>
         {watermark}
      </div>
    );
  }

  // 08 Neon Edge
  if (template === 'neon edge') {
    return (
      <div 
        className={`${layout.wrapper} flex flex-col relative transition-all duration-300 select-none overflow-hidden bg-[#0a0b0d] border text-white justify-between`}
        style={{ borderColor: accent.hex, boxShadow: `0 0 20px ${accent.hex}26` }}
      >
         <div className="absolute top-0 right-0 w-48 h-48 blur-3xl rounded-full pointer-events-none" style={{ backgroundColor: accent.hex + '1a' }}></div>
         <div className="absolute bottom-0 left-0 w-32 h-32 blur-3xl rounded-full pointer-events-none" style={{ backgroundColor: accent.hex + '0d' }}></div>
         <div className="flex flex-col h-full relative z-10 font-sans justify-between">
            <div className={`mb-4 ${exportSize === 'compact' ? 'mb-2' : ''}`}>
              <h1 className={`${layout.title} font-black uppercase tracking-tighter leading-tight mb-1 break-words`} style={{ color: accent.hex }}>{title}</h1>
              <div className={`${layout.subtitle} uppercase tracking-widest text-gray-300 border-l-2 pl-3`} style={{ borderLeftColor: accent.hex }}>{dateStr}</div>
            </div>
            {renderContent({
               card: 'border-l-2 border-secondary-lime bg-black/50',
               label: 'text-primary-coral',
               value: 'text-white',
               border: 'border-secondary-lime/30',
               borderDashed: 'border-secondary-lime/20'
            })}
            {watermark}
         </div>
      </div>
    );
  }

  // 09 Print Utility
  if (template === 'print utility') {
    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-white text-black border border-gray-300 font-sans justify-between`}>
         <div className="flex flex-col h-full justify-between">
            <div className={`mb-4 ${exportSize === 'compact' ? 'mb-2' : ''}`}>
              <h1 className={`${layout.title} font-bold uppercase tracking-tight text-black mb-0.5 break-words`}>{title}</h1>
              <div className={`${layout.subtitle} uppercase tracking-widest text-gray-600 border-b-2 border-black pb-1`}>{dateStr}</div>
            </div>
            <div className="flex-1 flex flex-col justify-center">
               {renderContent({
                  card: 'border-b border-gray-200 rounded-none bg-transparent',
                  label: 'text-gray-500',
                  value: 'text-black',
                  border: 'border-gray-200',
                  borderDashed: 'border-gray-200'
               })}
            </div>
            {watermark}
         </div>
      </div>
    );
  }

  // 10 Compact Story
  if (template === 'compact story') {
    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-gradient-to-b from-[#181a1f] to-[#07080a] border border-[#22252a] text-white font-sans justify-between`}>
         <div className="absolute top-0 right-0 w-full h-40 pointer-events-none" style={{ background: `linear-gradient(to bottom, ${accent.hex}1a, transparent)` }}></div>
         <div className="relative z-10 flex flex-col h-full justify-between">
            <div className={`mb-4 text-center ${exportSize === 'compact' ? 'mb-2' : ''}`}>
              <h1 className={`${layout.title} font-black uppercase tracking-tighter leading-none mb-1 break-words`} style={{ color: accent.hex }}>{title}</h1>
              <div className={`${layout.subtitle} uppercase tracking-widest text-gray-400 font-bold`}>{dateStr}</div>
            </div>
            
            <div className="bg-[#121316]/80 rounded-xl border border-[#22252a] p-4 flex-1 flex flex-col backdrop-blur-sm justify-center mb-2">
               {renderContent({
                  card: 'border-b border-[#22252a] bg-transparent',
                  label: 'text-secondary-lime',
                  value: 'text-white',
                  border: 'border-[#22252a]',
                  borderDashed: 'border-[#22252a]/50'
               })}
            </div>
            {watermark}
         </div>
      </div>
    );
  }

  return null;
}
