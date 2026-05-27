/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { useTemplateAccent } from './TemplateSelector';
import { 
  Activity, 
  Map, 
  CheckSquare, 
  Square, 
  TrendingUp, 
  Zap, 
  Clock, 
  Dumbbell, 
  Award, 
  Printer, 
  Layers, 
  Compass, 
  FileText,
  Flame,
  Shield,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

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
  const norm = (template || '').toLowerCase().trim().replace(/\s+/g, '-');
  const isShared = ['carbon-grid', 'race-poster', 'minimal-white', 'split-panel', 'neon-edge', 'print-utility', 'compact-story'].includes(norm);

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

  // Normalize template ID to keep IDs consistent and support both hyphenated/spaced formats
  let normalizedTemplate = (template || 'original')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
  if (normalizedTemplate === 'race-poster-pro') {
    normalizedTemplate = 'race-poster';
  }

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
  const getPrimaryMetric = (): [string, any] | null => {
    const distKey = gridItems.find(([k]) => k.toLowerCase().includes('distance') || k.toLowerCase().includes('dist'));
    if (distKey) return distKey;

    const paceKey = gridItems.find(([k]) => k.toLowerCase().includes('pace') || k.toLowerCase().includes('speed'));
    if (paceKey) return paceKey;

    const timeKey = gridItems.find(([k]) => k.toLowerCase().includes('duration') || k.toLowerCase().includes('time') || k.toLowerCase() === 'time');
    if (timeKey) return timeKey;

    return gridItems[0] || null;
  };

  const primaryItem = getPrimaryMetric();
  const secondaryItems = primaryItem 
    ? gridItems.filter(([k]) => k !== primaryItem[0]) 
    : gridItems;

  const getLayoutClasses = (size: string) => {
    switch (size) {
      case "story":
        return {
          wrapper: "w-[400px] h-[711px] p-6 flex flex-col justify-between overflow-hidden",
          title: "text-2xl md:text-3xl leading-tight font-black",
          subtitle: "text-[10px] tracking-widest",
          contentGap: "gap-4",
          cardPadding: "p-3",
          labelSize: "text-[9px]",
          valueSize: "text-sm",
          containerMinHeight: "min-h-[50px]"
        };
      case "landscape":
        return {
          wrapper: "w-[640px] h-[360px] p-5 flex flex-col justify-between overflow-hidden",
          title: "text-xl md:text-2xl leading-none font-black",
          subtitle: "text-[9px] tracking-wider",
          contentGap: "gap-2.5",
          cardPadding: "p-2.5",
          labelSize: "text-[8px]",
          valueSize: "text-xs",
          containerMinHeight: "min-h-[44px]"
        };
      case "compact":
        return {
          wrapper: "w-[540px] h-[283px] p-4 flex flex-col justify-between overflow-hidden text-xs",
          title: "text-lg md:text-xl leading-none font-extrabold tracking-tight",
          subtitle: "text-[8px] tracking-wide",
          contentGap: "gap-2",
          cardPadding: "p-2",
          labelSize: "text-[8px]",
          valueSize: "text-xs",
          containerMinHeight: "min-h-[40px]"
        };
      case "printable":
        return {
          wrapper: "w-[595px] h-[842px] p-8 flex flex-col justify-between overflow-hidden",
          title: "text-3xl md:text-4xl leading-tight font-black",
          subtitle: "text-[11px] tracking-widest",
          contentGap: "gap-6",
          cardPadding: "p-4",
          labelSize: "text-[10px]",
          valueSize: "text-base",
          containerMinHeight: "min-h-[60px]"
        };
      case "square":
      default:
        return {
          wrapper: "w-[480px] h-[480px] p-6 md:p-8 flex flex-col justify-between overflow-hidden",
          title: "text-2xl md:text-3xl leading-tight font-black",
          subtitle: "text-[10px] tracking-widest",
          contentGap: "gap-4",
          cardPadding: "p-3.5",
          labelSize: "text-[9px]",
          valueSize: "text-sm",
          containerMinHeight: "min-h-[52px]"
        };
    }
  };

  const layout = getLayoutClasses(exportSize);

  // Extract checklist items
  const getChecklistItems = () => {
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

    return items.slice(0, maxItems);
  };

  const watermark = (
    <div className={`mt-auto text-right text-[8px] uppercase tracking-widest font-mono opacity-40 pt-4 ${(normalizedTemplate === 'print-utility' || normalizedTemplate === 'minimal-white') ? 'text-black' : 'text-white'}`}>
      {typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'made with RunCard Studio'}
    </div>
  );

  // ==========================================
  // TEMPLATE 01: ORIGINAL (Balanced default layout)
  // ==========================================
  const renderOriginalTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#121316] border border-[#22252a] text-[#f2f4f7] rounded-lg p-6 justify-between`}>
        <div className="flex flex-col h-full justify-between">
          {/* Header */}
          <div className="border-b border-[#22252a] pb-4 mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-mono font-bold text-lg uppercase tracking-tight text-white truncate max-w-[70%]">{title}</h3>
              <div className="text-right shrink-0">
                <p className="font-mono text-[8px] opacity-60 uppercase tracking-widest">DATE</p>
                <p className="font-mono text-xs font-bold uppercase" style={{ color: accent.hex }}>{dateStr || 'ORIGINAL'}</p>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow flex flex-col justify-center gap-3">
            {componentName === 'RaceChecklistGenerator' ? (
              <div className="grid grid-cols-2 gap-2 font-mono">
                {getChecklistItems().slice(0, 6).map((it, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 bg-zinc-900 border border-zinc-800 rounded">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent.hex }}></span>
                    <span className="text-[10px] font-bold text-zinc-300 truncate uppercase">{it}</span>
                  </div>
                ))}
              </div>
            ) : componentName === 'RoutePosterGenerator' ? (
              <div className="grid grid-cols-2 gap-3 items-stretch">
                <div className="bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 h-[100px] rounded overflow-hidden">
                  {showMap ? (
                    <svg viewBox="0 0 360 360" className="w-[85px] h-[85px] overflow-visible" style={{ stroke: accent.hex }}>
                      <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[8px] text-zinc-500">NO TRAIL GPX</span>
                  )}
                </div>
                <div className="flex flex-col justify-center text-left">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest">DISTANCE</span>
                  <div className="text-xl font-black" style={{ color: accent.hex }}>{formData.distance || '—'}</div>
                </div>
              </div>
            ) : componentName === 'PaceBandGenerator' && extraData && extraData.splits ? (
              <div className="grid grid-cols-2 gap-1.5 text-zinc-300">
                {extraData.splits.slice(0, 6).map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-zinc-900 border border-zinc-800 rounded text-[10px]">
                    <span className="text-zinc-550">{s.km ?? s.marker ?? ''}</span>
                    <span className="font-bold text-white">{s.current}</span>
                  </div>
                ))}
              </div>
            ) : componentName === 'RaceSplitGenerator' ? (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {gridItems.slice(0, 6).map(([k, v]) => (
                  <div key={k} className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                    <span className="text-[8px] text-zinc-500 block uppercase">{getLabel(k)}</span>
                    <span className="text-xs font-bold text-white truncate block mt-0.5">{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : primaryItem ? (
              <div>
                <div className="mb-4">
                  <span className="text-[8px] text-zinc-400 uppercase tracking-widest block mb-1">{getLabel(primaryItem[0])}</span>
                  <span className="text-4xl font-black tracking-tight" style={{ color: accent.hex }}>
                    {String(primaryItem[1])}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {secondaryItems.slice(0, 4).map(([k, v]) => (
                    <div key={k} className="p-2 bg-zinc-900/60 border border-zinc-850 rounded">
                      <span className="text-[8px] text-zinc-500 block uppercase">{getLabel(k)}</span>
                      <span className="text-xs font-bold text-white block mt-0.5 truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {gridItems.slice(0, 4).map(([k, v]) => (
                  <div key={k} className="p-2 bg-zinc-900 border border-zinc-800 rounded">
                    <span className="text-[8px] text-zinc-500 block uppercase">{getLabel(k)}</span>
                    <span className="text-xs font-bold text-white block mt-0.5 truncate">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer watermark */}
          <div className="flex items-center justify-between border-t border-[#22252a] pt-3 mt-4 text-[8px] text-zinc-500 tracking-wider font-mono">
            <span>ORIGINAL ATHLETIC DOCKET</span>
            {watermark}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 02: SPORT (Strong coral accent bar, bold athletic blocks)
  // ==========================================
  const renderSportTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#0c0d12] border-2 border-zinc-800 text-white justify-between`}>
        {/* Top Accent Coral Bar */}
        <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: accent.hex !== "#ffffff" ? accent.hex : '#ff3330' }}></div>

        <div className="flex-grow flex flex-col h-full justify-between pt-5 px-3 pb-3 gap-3">
          {/* Header */}
          <div className="flex justify-between items-baseline border-b border-zinc-800 pb-2">
            <h1 className="text-base md:text-lg font-black uppercase tracking-tighter text-white truncate max-w-[70%]">{title}</h1>
            <span className="text-[8px] font-bold tracking-widest uppercase border px-1.5 py-0.5 rounded shrink-0 font-mono" style={{ borderColor: accent.hex, color: accent.hex }}>
              {dateStr || 'SPORTS_RECD'}
            </span>
          </div>

          {/* Big Metric Strip / Focal point */}
          <div className="flex-grow flex flex-col justify-center gap-3">
            {componentName === 'RaceChecklistGenerator' ? (
              <div className="grid grid-cols-2 gap-2 text-white font-sans">
                {getChecklistItems().slice(0, 6).map((it, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 bg-zinc-900 border-l-4 rounded-r" style={{ borderLeftColor: accent.hex }}>
                    <span className="text-[10px] font-black uppercase text-zinc-200">{it}</span>
                  </div>
                ))}
              </div>
            ) : componentName === 'RoutePosterGenerator' ? (
              <div className="flex items-center justify-between gap-4 bg-zinc-900 p-3 rounded border border-zinc-800">
                <div className="h-[90px] w-[90px] flex items-center justify-center bg-black rounded overflow-hidden p-1">
                  {showMap ? (
                    <svg viewBox="0 0 360 360" className="w-[80px] h-[80px] overflow-visible animate-pulse" style={{ stroke: accent.hex }}>
                      <path d={extraData.parsedData.path} fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[8px] text-zinc-600">NO GPX</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest block font-black">OUTING LENGTH</span>
                  <span className="text-3xl font-black block mt-1" style={{ color: accent.hex }}>{formData.distance || '—'}</span>
                </div>
              </div>
            ) : componentName === 'PaceBandGenerator' && extraData && extraData.splits ? (
              <div className="grid grid-cols-3 gap-1.5 text-zinc-200">
                {extraData.splits.slice(0, 6).map((s: any, i: number) => (
                  <div key={i} className="p-2 bg-zinc-900 border border-zinc-800 rounded text-center">
                    <span className="text-[8px] text-zinc-500 block uppercase font-mono">{s.km ?? s.marker ?? ''}</span>
                    <span className="text-xs font-black" style={{ color: accent.hex }}>{s.current}</span>
                  </div>
                ))}
              </div>
            ) : primaryItem ? (
              <div>
                <div className="bg-zinc-900/90 border border-zinc-800 p-3 px-4 rounded mb-2.5 flex justify-between items-center shadow-lg">
                  <div>
                    <span className="text-[7px] text-zinc-500 uppercase tracking-[0.2em] font-black block">{getLabel(primaryItem[0])}</span>
                    <span className="text-3xl md:text-4xl font-extrabold tracking-tighter uppercase text-white mt-0.5 inline-block">
                      {String(primaryItem[1])}
                    </span>
                  </div>
                  <div className="w-1.5 h-10 rounded shrink-0 animate-pulse" style={{ backgroundColor: accent.hex }}></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {secondaryItems.slice(0, 4).map(([k, v]) => (
                    <div key={k} className="p-2 bg-zinc-900 border border-zinc-850 rounded">
                      <span className="text-[8px] text-zinc-500 block uppercase font-bold tracking-tight">{getLabel(k)}</span>
                      <span className="text-xs font-extrabold block mt-0.5 truncate text-zinc-300">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {gridItems.slice(0, 4).map(([k, v]) => (
                  <div key={k} className="p-2.5 bg-zinc-900 border border-zinc-800 rounded">
                    <span className="text-[8px] text-zinc-500 block uppercase font-extrabold tracking-tight">{getLabel(k)}</span>
                    <span className="text-xs font-black block mt-0.5 truncate text-zinc-200">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center border-t border-zinc-850 pt-2.5 mt-2 text-[8px] font-mono tracking-widest text-zinc-500 font-extrabold">
            <span>PERFORMANCE LAB SERIES // MODE_SPORT</span>
            {watermark}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 03: CARBON (Premium dark technical card with grid layout)
  // ==========================================
  const renderCarbonTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#07080a] border border-zinc-900 text-white justify-between`}>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[#0f1115]/30 bg-[linear-gradient(to_right,#14171d_1px,transparent_1px),linear-gradient(to_bottom,#14171d_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-0"></div>

        <div className="relative z-10 flex-grow flex flex-col h-full justify-between p-3.5 gap-2.5">
          {/* Technical Header */}
          <div className="border-b-2 border-zinc-850 pb-2 flex justify-between items-end">
            <div className="flex-1 min-w-0 pr-3">
              <span className="text-[6.5px] text-zinc-550 uppercase tracking-[0.25em] font-black block">TECHNICAL TELEMETRY DATABASE</span>
              <h1 className="text-xs md:text-sm uppercase font-mono tracking-wider font-extrabold truncate text-white mt-0.5">{title}</h1>
            </div>
            <span className="inline-block font-mono border-2 bg-black px-2 py-0.5 rounded text-[8px] font-black tracking-widest uppercase shrink-0" style={{ borderColor: accent.hex, color: accent.hex }}>
              {dateStr || 'RC_DATA_CRB'}
            </span>
          </div>

          {/* Main Data Panel & Dense Rows */}
          <div className="flex-grow flex flex-col justify-center gap-2">
            {componentName === 'RaceChecklistGenerator' ? (
              <div className="grid grid-cols-2 gap-2 font-mono">
                {getChecklistItems().slice(0, 6).map((it, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border border-zinc-850 bg-zinc-950/90 rounded relative">
                    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: accent.hex }}></div>
                    <span className="text-[9px] font-bold text-zinc-400 uppercase truncate">0{i+1} {"//"} {it}</span>
                    <span className="text-[7.5px] text-emerald-500 font-extrabold tracking-tighter uppercase">[OK]</span>
                  </div>
                ))}
              </div>
            ) : componentName === 'RoutePosterGenerator' ? (
              <div className="grid grid-cols-2 gap-2.5 items-stretch">
                <div className="rounded border border-zinc-850 bg-zinc-950 flex items-center justify-center p-2 min-h-[95px]">
                  {showMap ? (
                    <svg viewBox="0 0 360 360" className="w-[85px] h-[85px] overflow-visible" style={{ stroke: accent.hex, filter: `drop-shadow(0 0 4px ${accent.hex}aa)` }}>
                      <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[8px] text-zinc-750">NO TRACK LOG</span>
                  )}
                </div>
                <div className="flex flex-col justify-center border border-zinc-850 bg-zinc-950/80 p-2 text-left relative">
                  <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: accent.hex }}></div>
                  <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-bold font-mono">TOTAL DIST</span>
                  <div className="text-xl font-bold font-mono mt-1 text-white" style={{ color: accent.hex }}>{formData.distance || '—'}</div>
                </div>
              </div>
            ) : componentName === 'PaceBandGenerator' && extraData && extraData.splits ? (
              <div className="space-y-1 w-full text-zinc-300 font-mono">
                {extraData.splits.slice(0, 5).map((s: any, i: number) => (
                  <div key={i} className="flex justify-between py-1 px-1.5 border border-zinc-900 bg-zinc-950/65 text-[10px]">
                    <span className="text-zinc-550 font-bold">{s.km ?? s.marker ?? ''} MARK</span>
                    <span className="font-extrabold text-white" style={{ color: accent.hex }}>{s.current}</span>
                  </div>
                ))}
              </div>
            ) : primaryItem ? (
              <div>
                <div className="bg-zinc-950 border border-zinc-850 p-3 px-3.5 text-center relative mb-2 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l" style={{ borderColor: accent.hex }}></div>
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r" style={{ borderColor: accent.hex }}></div>
                  <span className="text-[6.5px] text-zinc-500 tracking-[0.2em] uppercase font-bold block">{getLabel(primaryItem[0])}</span>
                  <span className="text-2xl font-black mt-1 font-mono tracking-wide inline-block" style={{ color: accent.hex }}>
                    {String(primaryItem[1])}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {secondaryItems.slice(0, 4).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-baseline border-b border-zinc-850 pb-1 text-[10px] font-mono">
                      <span className="text-zinc-550 uppercase font-semibold text-[8px]">{getLabel(k)}</span>
                      <span className="font-extrabold text-zinc-350 text-right truncate max-w-[65%]">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {gridItems.slice(0, 5).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-baseline border-b border-zinc-850 pb-1 text-[10px] font-mono">
                    <span className="text-zinc-500 uppercase font-bold text-[8px]">{getLabel(k)}</span>
                    <span className="font-black text-white text-right truncate max-w-[65%]">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-850 text-[7px] text-zinc-650 font-mono tracking-widest uppercase">
            <span>RC_INTEGRAL_CARBON_SYS_ACTIVE</span>
            {watermark}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 04: CARBON GRID (Technical Panel/Grid Dashboard Style)
  // ==========================================
  const renderCarbonGridTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#090b0e] border-2 border-zinc-900 text-white font-mono justify-between`}>
        {/* Absolute Design Background Grid Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-55 pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111827_1px,transparent_1px),linear-gradient(to_bottom,#111827_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none z-0"></div>
        
        {/* Accent Top Border Indicator */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accent.hex }}></div>

        {/* Technical Subtext & Indicators */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-40 text-[7px] tracking-wider text-zinc-550">
          <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500"></span>
          <span>RC_SYS_ACTIVE // MODE_04</span>
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between gap-2.5 p-1 mt-1">
          {/* Header Dashboard Area */}
          <div className="border-b-2 border-zinc-800 pb-2.5 flex items-baseline justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-black block">ATHLETIC RECORD DATABASE</span>
              <h1 className="text-sm md:text-base uppercase tracking-tight text-white font-black break-words mt-0.5">{title}</h1>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-block font-mono border px-1.5 py-0.5 rounded text-[8px] tracking-tight font-extrabold uppercase text-neutral-300 bg-zinc-900/80" style={{ borderColor: accent.hex }}>
                {dateStr || 'GRID_MTRX'}
              </span>
            </div>
          </div>

          {/* Technical Grid Panels */}
          <div className="flex-grow flex flex-col justify-center gap-2">
            {componentName === 'RaceChecklistGenerator' ? (
              <div className="grid grid-cols-2 gap-2 font-mono">
                {getChecklistItems().slice(0, 6).map((it, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 bg-zinc-950/80 border border-zinc-850 relative shadow-sm">
                    {/* Small technical block highlight in corner */}
                    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: accent.hex }}></div>
                    <div className="w-3.5 h-3.5 shrink-0 border border-zinc-700 flex items-center justify-center bg-zinc-900">
                      <span className="w-1.5 h-1.5 bg-emerald-400 inline-block"></span>
                    </div>
                    <span className="text-[9px] font-bold text-zinc-300 truncate tracking-tight uppercase">{it}</span>
                  </div>
                ))}
              </div>
            ) : componentName === 'RoutePosterGenerator' ? (
              <div className="grid grid-cols-2 gap-2 items-stretch">
                <div className="bg-zinc-950/95 border border-zinc-800 flex items-center justify-center p-2 relative h-[110px] rounded shadow-md overflow-hidden animate-fade-in">
                  <div className="absolute top-1 left-2 text-[6px] text-zinc-600 tracking-wider">MAP_TRACKER</div>
                  {showMap ? (
                    <svg viewBox="0 0 360 360" className="w-[85px] h-[85px] overflow-visible" style={{ stroke: accent.hex }}>
                      <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[8px] text-zinc-650">NO GPX TRACK</span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 justify-center">
                  <div className="bg-zinc-950/80 border border-zinc-850 p-2 text-left relative">
                    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: accent.hex }}></div>
                    <div className="text-[7px] text-zinc-500 uppercase font-black tracking-widest">RECORD_DIS</div>
                    <div className="text-base font-black text-white font-mono mt-0.5" style={{ color: accent.hex }}>{formData.distance || '—'}</div>
                  </div>
                  {formData.showElevation && extraData?.parsedData?.eleInfo?.valid && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="p-1 px-1.5 bg-zinc-950/80 border border-zinc-850">
                        <span className="text-[6px] text-zinc-500 block font-semibold leading-none">E_MIN</span>
                        <span className="font-bold text-[9px] text-zinc-350 font-mono mt-0.5 inline-block">{Math.round(extraData.parsedData.eleInfo.min)}m</span>
                      </div>
                      <div className="p-1 px-1.5 bg-zinc-950/80 border border-zinc-850">
                        <span className="text-[6px] text-zinc-500 block font-semibold leading-none">E_MAX</span>
                        <span className="font-bold text-[9px] text-zinc-350 font-mono mt-0.5 inline-block">{Math.round(extraData.parsedData.eleInfo.max)}m</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : componentName === 'PaceBandGenerator' && extraData && extraData.splits ? (
              <div className="grid grid-cols-2 gap-1.5 text-zinc-300">
                {extraData.splits.slice(0, 6).map((s: any, i: number) => {
                  const isEven = i % 2 === 0;
                  return (
                    <div key={i} className={`flex justify-between items-center p-2 border border-zinc-850 bg-zinc-950/85 relative`}>
                      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: isEven ? accent.hex : '#f87171' }}></div>
                      <span className="text-[8px] text-zinc-550 font-extrabold">{s.km ?? s.marker ?? ''}</span>
                      <span className="text-[10px] font-bold text-white tracking-tight font-mono">{s.current ?? (s.cumTime ? formatTime(s.cumTime) : '')}</span>
                    </div>
                  );
                })}
              </div>
            ) : componentName === 'RaceSplitGenerator' ? (
              <div className="grid grid-cols-2 gap-2 text-white">
                {gridItems.slice(0, 6).map(([k, v]) => {
                  const isTime = k.toString().toLowerCase().includes('time') || k.toString().toLowerCase().includes('pace');
                  return (
                    <div key={k} className="p-2 bg-zinc-950/90 border border-zinc-850 relative rounded-sm">
                      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: isTime ? '#f87171' : accent.hex }}></div>
                      <span className="text-[7px] text-zinc-500 tracking-wider block uppercase">{getLabel(k)}</span>
                      <span className="text-xs font-bold font-mono tracking-tight text-white block mt-0.5 truncate">{String(v)}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-white">
                {gridItems.slice(0, 6).map(([k, v], i) => {
                  // Primary metric shown in lime positive, supporting details in deep red / coral
                  const isMainMetric = i === 0 || i === 1;
                  return (
                    <div key={k} className="flex flex-col justify-between p-2 bg-zinc-950/85 border border-zinc-850/80 relative min-h-[46px]">
                      <div className="absolute top-0 left-0 w-1 h-1 border-t border-l" style={{ borderColor: isMainMetric ? accent.hex : '#f43f5e' }}></div>
                      <span className="text-[7px] uppercase tracking-widest text-zinc-500">{getLabel(k)}</span>
                      <span className="text-xs font-black truncate font-mono text-right" style={{ color: isMainMetric ? '#a3e635' : '#f87171' }}>
                        {String(v)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-zinc-850 pt-2 pb-0.5 text-[8px] text-zinc-600 font-mono tracking-wider">
            <span>STABLE NETWORK DATA SOURCE // CLIENT LOAD</span>
            {watermark}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 05: RACE POSTER (Artistic Symmetrical Poster Series)
  // ==========================================
  const renderRacePosterTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#030303] border border-neutral-900 text-white justify-between pb-4`}>
        {/* Symmetrical fine details */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 shrink-0" style={{ backgroundColor: accent.hex }}></div>

        <div className="flex-grow flex flex-col justify-between pt-6 px-4 gap-3.5">
          {/* Symmetrical Editorial Header */}
          <div className="text-center font-sans">
            <span className="text-[7px] uppercase tracking-[0.3em] text-[#a1a1aa] font-medium mb-1 block">RUNCARD FINE ART POSTER SERIES</span>
            <h1 className="text-xl md:text-2xl uppercase tracking-[0.05em] font-black leading-none break-words text-white">{title}</h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="w-1.5 h-[1.5px]" style={{ backgroundColor: accent.hex }}></span>
              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-extrabold">{dateStr || 'ATHLETICS'}</span>
              <span className="w-1.5 h-[1.5px]" style={{ backgroundColor: accent.hex }}></span>
            </div>
          </div>

          {/* Symmetrical Hero Focal Area with One Massive Central Metric */}
          <div className="flex-1 flex flex-col justify-center items-center my-3">
            {componentName === 'RoutePosterGenerator' ? (
              <div className="flex-grow flex flex-col items-center justify-center w-full gap-2">
                <div className="h-[120px] flex items-center justify-center">
                  {showMap ? (
                    <svg viewBox="0 0 360 360" className="w-[120px] h-[120px] overflow-visible" style={{ stroke: accent.hex }}>
                      <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <Compass className="w-12 h-12 opacity-30 animate-pulse" />
                  )}
                </div>
                {formData.distance && (
                  <div className="text-center mt-2.5">
                    <span className="text-[8px] uppercase tracking-widest text-zinc-550 font-bold block">OUTING SCALE</span>
                    <span className="text-2xl font-extrabold" style={{ color: accent.hex }}>{formData.distance}</span>
                  </div>
                )}
              </div>
            ) : componentName === 'RaceChecklistGenerator' ? (
              <div className="w-[200px] border border-neutral-900 rounded-sm bg-neutral-950/60 p-2.5 flex flex-col gap-1.5">
                <span className="text-[7px] uppercase tracking-wider text-zinc-400 font-bold text-center border-b border-neutral-900 pb-1 mb-0.5">CORE SCHEDULES</span>
                {getChecklistItems().slice(0, 4).map((it, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1 text-center justify-center border-b border-neutral-900/40 last:border-0 last:pb-0">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: accent.hex }} />
                    <span className="text-[9px] font-extrabold uppercase tracking-tight text-neutral-300 truncate">{it}</span>
                  </div>
                ))}
              </div>
            ) : componentName === 'PaceBandGenerator' ? (
              <div className="text-center flex flex-col gap-1.5 bg-neutral-950/50 p-3 rounded border border-neutral-900 w-[200px]">
                <span className="text-[7px] text-zinc-400 uppercase font-bold tracking-[0.2em] mb-1.5 block">KEY METERS</span>
                {extraData.splits?.slice(0, 3).map((s: any, i: number) => (
                  <div key={i} className="flex justify-between items-baseline text-xs font-sans border-b border-neutral-900 last:border-0 pb-1 last:pb-0">
                    <span className="text-zinc-500 uppercase text-[9px] font-bold font-mono">{s.km ?? s.marker ?? ''}</span>
                    <span className="font-extrabold text-neutral-200">{s.current}</span>
                  </div>
                ))}
              </div>
            ) : primaryItem ? (
              <div className="text-center">
                <span className="text-[8px] uppercase tracking-[0.25em] text-[#a1a1aa] font-bold block mb-1">{getLabel(primaryItem[0])}</span>
                <span className="text-5xl md:text-6xl font-black tracking-tight leading-none text-white uppercase block mt-1">
                  {String(primaryItem[1])}
                </span>
                <div className="w-8 h-[2px] mx-auto mt-3" style={{ backgroundColor: accent.hex }}></div>
              </div>
            ) : (
              <span className="text-xs opacity-20">NO POSTER FOCAL METRIC</span>
            )}
          </div>

          {/* Compact visual rows of secondary specs at the botton */}
          {secondaryItems.length > 0 && componentName !== 'RoutePosterGenerator' && (
            <div className="flex flex-col gap-1.5 py-2.5 border-t border-b border-neutral-950">
              {secondaryItems.slice(0, 3).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-xs px-2">
                  <span className="text-[7px] uppercase tracking-wider text-neutral-400 font-black">{getLabel(k)}</span>
                  <span className="font-extrabold text-zinc-100 uppercase text-[10px]">{String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Absolute Fine Typography Footer */}
          <div className="flex flex-col items-center border-t border-neutral-950 pt-3 mt-auto">
            <span className="text-[7px] uppercase tracking-[0.3em] font-sans text-zinc-500 block mb-1">INTENDED EXCLUSIVELY FOR ATHLETE PRESERVATION</span>
            {watermark}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 06: MINIMAL WHITE (瑞士极简主义海报专版)
  // ==========================================
  const renderMinimalWhiteTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-white border border-zinc-200 text-zinc-900 font-sans justify-between p-2`}>
        
        {/* Subtle geometric structural marker */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-zinc-950"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-zinc-950"></div>

        <div className="flex-grow flex flex-col justify-between h-full py-2 px-1">
          {/* Header Block Minimalist */}
          <div className="border-b-[3px] border-zinc-950 pb-3 mb-2">
            <div className="flex justify-between items-baseline">
              <span className="text-[8px] font-mono tracking-widest text-zinc-400 uppercase">SWISS PRINT SPECIFIED // ATHLETIC REPORT</span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#71717a] font-black">{dateStr || 'DOC_MNM'}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-neutral-950 break-words mt-1.5 flex items-center gap-1.5">
              {title}
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: accent.hex }} />
            </h1>
          </div>

          {/* Structured Rows Layout Content */}
          <div className="flex-1 flex flex-col justify-center gap-2">
            {componentName === 'RaceChecklistGenerator' ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-zinc-900 font-sans">
                {getChecklistItems().slice(0, 8).map((it, i) => (
                  <div key={i} className="flex items-center gap-3 py-1 border-b border-zinc-100">
                    <span className="text-[9px] font-mono text-zinc-400 font-black">0{i+1}</span>
                    <span className="text-xs font-bold text-zinc-900 truncate uppercase">{it}</span>
                  </div>
                ))}
              </div>
            ) : componentName === 'RoutePosterGenerator' ? (
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="p-3 border border-zinc-200 bg-zinc-50/50 flex items-center justify-center shrink-0 w-[110px] h-[110px] rounded overflow-hidden">
                  {showMap ? (
                    <svg viewBox="0 0 360 360" className="w-[95px] h-[95px] overflow-visible" style={{ stroke: '#000000' }}>
                      <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-[8px] text-zinc-400 font-mono">NO TRACK GRAPH</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center text-left">
                  <span className="text-[8px] uppercase tracking-wider font-extrabold text-zinc-400">INDEX METRIC_06_DISTANCE</span>
                  <div className="text-2xl font-black text-zinc-950 mt-1 uppercase" style={{ color: accent.hex !== '#FFFFFF' && accent.hex !== 'clean white' ? accent.hex : '#000000' }}>{formData.distance || '—'}</div>
                  {formData.showElevation && extraData?.parsedData?.eleInfo?.valid && (
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-zinc-100 text-[10px]">
                      <div>
                        <span className="text-[7px] text-zinc-400 block font-bold">ALT_MIN</span>
                        <span className="font-extrabold text-zinc-900 font-mono">{Math.round(extraData.parsedData.eleInfo.min)}m</span>
                      </div>
                      <div>
                        <span className="text-[7px] text-zinc-400 block font-bold">ALT_MAX</span>
                        <span className="font-extrabold text-zinc-900 font-mono">{Math.round(extraData.parsedData.eleInfo.max)}m</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : componentName === 'PaceBandGenerator' && extraData && extraData.splits ? (
              <div className="space-y-1 w-full text-zinc-900">
                <div className="grid grid-cols-2 py-1 text-[8px] font-mono text-zinc-450 border-b border-zinc-200 uppercase font-black tracking-widest">
                  <span>KM MARKER</span>
                  <span className="text-right">INTERVAL SPLIT</span>
                </div>
                {extraData.splits.slice(0, 5).map((s: any, i: number) => (
                  <div key={i} className="flex justify-between py-1 border-b border-zinc-100 text-xs font-mono">
                    <span className="font-bold text-zinc-500">{(i + 1) + " - " + (s.km ?? s.marker ?? "")}</span>
                    <span className="font-extrabold text-zinc-955">{s.current}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5 w-full">
                {gridItems.slice(0, 5).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-baseline border-b border-zinc-100 py-1 text-xs text-zinc-900 font-sans">
                    <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider pr-4">{getLabel(k)}</span>
                    <span className="font-black text-zinc-950 text-right truncate max-w-[65%] uppercase font-mono">{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simple minimalist Swiss footer */}
          <div className="flex justify-between items-end border-t border-zinc-950 pt-2.5 text-[8px] text-zinc-400 mt-2">
            <span className="tracking-widest font-mono">PRINT FRIENDLY TIMING CARD SCHEMA // SWISS DESIGN</span>
            {watermark}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 07: SPLIT PANEL (Modular Bento Architecture)
  // ==========================================
  const renderSplitPanelTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#0a0c10] text-[#f2f4f7] font-mono justify-between p-2`}>
        {/* Bento modular clean wrapper */}
        <div className="flex-1 flex flex-col justify-between gap-2.5 h-full relative z-10">
          
          {/* Top Header Panel Block */}
          <div className="bg-[#12141c] rounded-xl p-3.5 border border-zinc-800 shadow-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[7.5px] uppercase tracking-widest text-[#71717a] font-extrabold block">BENTO ATHLETIC SYSTEM</span>
              <span className="text-[7.5px] px-1.5 py-0.5 rounded uppercase font-black tracking-tight" style={{ backgroundColor: accent.hex, color: accent.hex === '#FFFFFF' ? '#000000' : '#ffffff' }}>
                {dateStr || 'DATA_07'}
              </span>
            </div>
            <h1 className="text-sm md:text-base uppercase tracking-tight break-words font-black" style={{ color: accent.hex }}>{title}</h1>
          </div>

          {/* Bento Board Space Grid layout */}
          <div className="flex-grow flex flex-col justify-center gap-2">
            {componentName === 'RaceChecklistGenerator' ? (
              <div className="grid grid-cols-2 gap-2">
                {getChecklistItems().slice(0, 6).map((it, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg border border-zinc-850 bg-[#141620] relative shadow group">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: accent.hex }} />
                    <span className="text-[10px] font-black text-white truncate uppercase">{it}</span>
                  </div>
                ))}
              </div>
            ) : componentName === 'RoutePosterGenerator' ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-zinc-850 bg-[#141620] p-2 flex items-center justify-center min-h-[110px]">
                  {showMap ? (
                    <svg viewBox="0 0 360 360" className="w-[95px] h-[95px] overflow-visible" style={{ stroke: accent.hex }}>
                      <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <HelpCircle className="w-8 h-8 opacity-25" />
                  )}
                </div>
                <div className="rounded-xl border border-zinc-850 bg-[#141620] p-3 flex flex-col justify-center text-left">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-zinc-500">MAPPING_DIS</span>
                  <div className="mt-1 text-base font-black text-white" style={{ color: accent.hex }}>{formData.distance || '—'}</div>
                  {formData.showElevation && extraData?.parsedData?.eleInfo?.valid && (
                    <div className="mt-1.5 text-[8px] text-gray-500 border-t border-zinc-800 pt-1">
                      <p>H_MIN: {Math.round(extraData.parsedData.eleInfo.min)}m</p>
                      <p>H_MAX: {Math.round(extraData.parsedData.eleInfo.max)}m</p>
                    </div>
                  )}
                </div>
              </div>
            ) : componentName === 'PaceBandGenerator' ? (
              <div className="grid grid-cols-2 gap-2">
                {extraData.splits?.slice(0, 4).map((s: any, i: number) => (
                  <div key={i} className="flex flex-col p-2.5 rounded-lg border border-zinc-850 bg-[#141620] shadow">
                    <span className="text-[8px] uppercase tracking-wider font-bold" style={{ color: accent.hex }}>{s.km ?? s.marker ?? ''}</span>
                    <span className="text-xs font-black text-white truncate mt-1">{s.current}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {gridItems.slice(0, 4).map(([k, v], i) => {
                  const isPrimary = i === 0;
                  const highlightColor = isPrimary ? '#f43f5e' : accent.hex;
                  return (
                    <div 
                      key={k} 
                      className="flex flex-col justify-center p-3 rounded-xl border border-zinc-850 bg-[#141620] shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all duration-200"
                      style={{ borderTopWidth: '3.5px', borderTopColor: highlightColor }}
                    >
                      <span className="text-[8px] uppercase tracking-widest font-black text-zinc-550 mb-1 leading-none">{getLabel(k)}</span>
                      <span className="text-xs font-black text-white truncate">{String(v)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bento Footer Panel */}
          <div className="flex justify-between items-center border-t border-zinc-850 pt-2.5 mt-1">
            <span className="text-[8.5px] text-[#71717a] font-bold uppercase tracking-wider">MODULAR_GRID_07 // DIRECT RECORD</span>
            {watermark}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 08: NEON EDGE (Futuristic Cyberpunk Edge Rail Mode)
  // ==========================================
  const renderNeonEdgeTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div 
        className={`${layout.wrapper} flex flex-col relative transition-all duration-300 select-none overflow-hidden bg-[#03060a] border border-zinc-950 text-white justify-between`}
      >
        {/* Glowing cyber backdrops behind text */}
        <div className="absolute top-0 right-[-30px] w-48 h-48 blur-[80px] rounded-full opacity-35 pointer-events-none" style={{ backgroundColor: accent.hex }}></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-36 h-36 blur-[60px] rounded-full opacity-25 pointer-events-none" style={{ backgroundColor: accent.hex }}></div>

        {/* Asymmetrical Layout: Left Neon Edge Bar and right primary content area */}
        <div className="flex h-full w-full relative z-10 font-mono">
          {/* Active Vertical Glowing Neon Edge Rail */}
          <div className="w-[12px] md:w-[14px] shrink-0 h-full flex flex-col justify-between items-center py-3 relative border-r border-[#1a2230]" style={{ backgroundColor: '#070c14' }}>
            <div className="absolute top-0 bottom-0 left-[4px] w-[3px] shadow-[0_0_12px_rgba(255,255,255,0.8)] opacity-90 rounded" style={{ backgroundColor: accent.hex, boxShadow: `0 0 10px ${accent.hex}, 0 0 20px ${accent.hex}` }}></div>
            <span className="text-[6px] tracking-widest text-[#71717a] rotate-270 font-black whitespace-nowrap block mt-6">MODE_08 // ACTIVE</span>
            <span className="text-[6px] text-emerald-400 font-bold block mb-4 animate-ping">●</span>
          </div>

          {/* Right Primary Content (Asymmetric Layout) */}
          <div className="flex-1 flex flex-col justify-between p-3.5 pl-4 gap-3.5">
            {/* Header Area */}
            <div>
              <div className="flex justify-between items-baseline opacity-35 text-[7px] tracking-wider mb-0.5">
                <span>CYBER_RECORD_SYSTEM</span>
                <span>STATUS_STABLE_08</span>
              </div>
              <h1 className="text-sm md:text-base font-black uppercase tracking-tight text-white mb-1.5 break-words" style={{ textShadow: `0 0 8px ${accent.hex}40` }}>{title}</h1>
              <div className="inline-block text-[8px] uppercase tracking-widest font-black border-b pb-0.5" style={{ borderColor: accent.hex, color: accent.hex }}>
                {dateStr || 'ATHLETE_PORT'}
              </div>
            </div>

            {/* Content Body Area */}
            <div className="flex-grow flex flex-col justify-center">
              {componentName === 'RaceChecklistGenerator' ? (
                <div className="grid grid-cols-2 gap-2 text-white">
                  {getChecklistItems().slice(0, 6).map((it, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 bg-zinc-950/75 border border-zinc-900 rounded relative">
                      <div className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ backgroundColor: accent.hex }} />
                      <span className="text-[9px] font-bold tracking-tight truncate uppercase text-zinc-300">{it}</span>
                    </div>
                  ))}
                </div>
              ) : componentName === 'RoutePosterGenerator' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  <div className="p-2.5 bg-[#070c14]/90 border border-zinc-900 rounded flex items-center justify-center min-h-[120px] relative overflow-hidden">
                    {showMap ? (
                      <svg viewBox="0 0 360 360" className="w-[100px] h-[100px] overflow-visible" style={{ stroke: accent.hex, filter: `drop-shadow(0 0 6px ${accent.hex}cc)` }}>
                        <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <Compass className="w-8 h-8 opacity-25" style={{ color: accent.hex }} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-zinc-300">
                    <span className="text-[7px] text-zinc-550 uppercase tracking-widest">GPX VECTOR DIS</span>
                    <div className="text-xl font-black" style={{ color: accent.hex, textShadow: `0 0 10px ${accent.hex}80` }}>{formData.distance || '—'}</div>
                  </div>
                </div>
              ) : componentName === 'PaceBandGenerator' && extraData && extraData.splits ? (
                <div className="grid grid-cols-2 gap-1.5 font-mono text-zinc-300">
                  {extraData.splits?.slice(0, 6).map((s: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-[#070c14]/80 border border-zinc-900 rounded">
                      <span className="text-[8px] text-zinc-500 font-extrabold">{s.km ?? s.marker ?? ''}</span>
                      <span className="text-[10px] font-black" style={{ color: accent.hex }}>{s.current}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-white">
                  {gridItems.slice(0, 4).map(([k, v], i) => {
                    const isEven = i % 2 === 0;
                    return (
                      <div key={k} className="flex flex-col justify-center p-2.5 bg-zinc-950/80 border border-zinc-900 rounded relative shadow">
                        <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isEven ? accent.hex : '#f43f5e' }} />
                        <span className="text-[7px] uppercase tracking-wider text-zinc-500 font-black leading-none mb-1.5">{getLabel(k)}</span>
                        <span className="text-xs font-black truncate block text-neutral-250">{String(v)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Symmetrical Watermark */}
            <div className="flex justify-between items-center mt-auto border-t border-zinc-900 pt-2 text-[8px] text-zinc-650 tracking-wider font-semibold">
              <span>CYBER_EDGE_MODE_ACTIVE</span>
              {watermark}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 09: PRINT UTILITY (Classic Receipt timing spreadsheet format)
  // ==========================================
  const renderPrintUtilityTemplate = () => {
    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-[#fafafa] text-zinc-900 border-2 border-zinc-950 font-mono justify-between p-2.5`}>
        <div className="flex flex-col h-full justify-between">
          
          {/* Header Area Receipt Style */}
          <div className="border-b-2 border-zinc-950 pb-3 mb-2 flex justify-between items-baseline">
            <div className="flex-1 min-w-0 pr-3">
              <span className="text-[7px] text-zinc-400 block font-black uppercase tracking-widest">SYSTEM PRINTOUT TIMING SHEET</span>
              <h1 className="text-base md:text-lg font-black uppercase tracking-tight text-neutral-950 leading-none mt-1 break-words">{title}</h1>
            </div>
            <div className="shrink-0 text-right">
              <span className="inline-block px-1.5 py-0.5 border border-zinc-950 rounded text-[8px] font-black tracking-tighter uppercase text-zinc-850 bg-white shadow-sm">
                {dateStr || 'LOG_SYS_09'}
              </span>
            </div>
          </div>

          {/* Receipt Info Section */}
          <div className="grid grid-cols-2 text-[7px] border-b border-dashed border-zinc-300 py-2.5 text-zinc-400 gap-1 uppercase font-semibold">
            <div>DEVICE_MODEL_ID: RC_PRINT_D9</div>
            <div className="text-right">CALIBRATION_STANDARD: NIST_ATHL</div>
          </div>

          {/* Table list core area */}
          <div className="flex-grow flex flex-col justify-center text-xs py-3">
            {componentName === 'RaceChecklistGenerator' ? (
              <div className="w-full">
                <div className="grid grid-cols-3 border-b-2 border-zinc-950 pb-1 text-zinc-500 font-black text-[8px] uppercase tracking-wider">
                  <span className="col-span-2">DOCKET CHECKLIST ITEM</span>
                  <span className="text-right">STATUS</span>
                </div>
                <div className="divide-y divide-[#cfcfcf]/55 font-mono text-[10px] uppercase font-bold text-zinc-850">
                  {getChecklistItems().slice(0, 6).map((it, i) => (
                    <div key={i} className="grid grid-cols-3 py-2 items-baseline">
                      <span className="col-span-2 truncate pr-2">0{i+1} [X] {it}</span>
                      <span className="text-right text-emerald-600 font-extrabold">[PASS]</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : componentName === 'RoutePosterGenerator' ? (
              <div className="space-y-1">
                <div className="grid grid-cols-2 border-b-2 border-zinc-950 pb-1 font-black text-[#71717a] text-[8px] uppercase tracking-wider">
                  <span>GEOGRAPHIC PARAMETER</span>
                  <span className="text-right">MEASURED METRIC</span>
                </div>
                <div className="divide-y divide-[#cfcfcf]/55 font-mono text-[10px] uppercase font-bold text-zinc-850">
                  {formData.distance && (
                    <div className="flex justify-between py-2">
                      <span className="text-zinc-500">DISTANCE TRACKED</span>
                      <span className="font-black text-zinc-950" style={{ color: accent.hex !== '#FFFFFF' && accent.hex !== 'clean white' ? accent.hex : '#000000' }}>{formData.distance}</span>
                    </div>
                  )}
                  {formData.showElevation && extraData?.parsedData?.eleInfo?.valid && (
                    <>
                      <div className="flex justify-between py-2">
                        <span className="text-zinc-500">ALT_MIN_METERS</span>
                        <span className="font-extrabold text-zinc-900">{Math.round(extraData.parsedData.eleInfo.min)}m</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-zinc-500">ALT_MAX_METERS</span>
                        <span className="font-extrabold text-zinc-900">{Math.round(extraData.parsedData.eleInfo.max)}m</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : componentName === 'PaceBandGenerator' ? (
              <div className="w-full">
                <div className="grid grid-cols-3 border-b-2 border-zinc-950 pb-1 text-zinc-500 font-black text-[8px] uppercase tracking-widest">
                  <span>MARKER</span>
                  <span>LAP_PACE</span>
                  <span className="text-right">ACCUMULATIVE</span>
                </div>
                <div className="divide-y divide-dashed divide-[#cfcfcf]/55 font-mono text-[10px] text-zinc-850">
                  {extraData.splits?.slice(0, 5).map((s: any, i: number) => (
                    <div key={i} className="grid grid-cols-3 py-2 font-black">
                      <span className="text-zinc-500">0{i+1} MARKER</span>
                      <span className="text-zinc-900">{s.current}</span>
                      <span className="text-zinc-500 text-right">{(s.total) || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="grid grid-cols-2 border-b-2 border-zinc-950 pb-1 text-zinc-500 font-black text-[8px] uppercase tracking-wider">
                  <span>DOCKET METRIC</span>
                  <span className="text-right">CALIBRATED FIELD VALUE</span>
                </div>
                <div className="divide-y divide-dashed divide-[#cfcfcf]/60 mt-1 font-mono text-[10px] text-zinc-850 uppercase font-bold">
                  {gridItems.slice(0, 6).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-baseline py-2">
                      <span className="text-zinc-500">{getLabel(k)}</span>
                      <span className="font-black text-neutral-900 pr-1">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Print Watermark Footer */}
          <div className="flex justify-between items-end border-t-2 border-dashed border-zinc-950 pt-2.5 text-[7px] text-zinc-400 mt-2">
            <span>EXPORT REPLICABLE DOCUMENT CARD // SYSTEM DEVIATION 0.00ms</span>
            {watermark}
          </div>

        </div>
      </div>
    );
  };

  // ==========================================
  // TEMPLATE 10: COMPACT STORY (Mobile Portrait lockscreen storytelling perspective)
  // ==========================================
  const renderCompactStoryTemplate = () => {
    const showMap = componentName === 'RoutePosterGenerator' && !!extraData?.parsedData;

    return (
      <div className={`${layout.wrapper} flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 select-none overflow-hidden bg-gradient-to-b from-[#0b0c10] via-[#12141c] to-[#040507] border border-zinc-900 text-white font-sans justify-between p-3 pb-6`}>
        {/* Floating gradient highlights to enrich locked story style */}
        <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-48 h-36 pointer-events-none opacity-45 rounded-full blur-[40px]" style={{ background: `radial-gradient(ellipse at top, ${accent.hex}, transparent)` }}></div>
        <div className="absolute bottom-2 left-6 w-24 h-24 pointer-events-none opacity-15 rounded-full blur-[30px]" style={{ backgroundColor: accent.hex }}></div>

        {/* Story Status Indicators */}
        <div className="absolute top-3 left-4 right-4 flex justify-between items-center text-[7px] font-mono tracking-widest opacity-35 z-10 uppercase text-zinc-400">
          <span>STORY_SYS_10_ACTIVE</span>
          <span>9:16 LOCKSCREEN EXPORT</span>
        </div>

        <div className="relative z-10 flex flex-col h-full justify-between gap-2.5 mt-2.5">
          {/* Header layout aligned nicely */}
          <div className="text-center pt-3">
            <span className="text-[7.5px] uppercase tracking-[0.25em] text-[#71717a] font-extrabold block mb-1">RUNCARD STORY SERIES</span>
            <h1 className="text-base md:text-lg font-black uppercase tracking-tight text-white break-words px-1" style={{ textShadow: `0 0 12px ${accent.hex}40` }}>{title}</h1>
            <div className="inline-block px-2 py-0.5 mt-1 border border-zinc-800 rounded text-[7.5px] font-mono text-zinc-400 uppercase tracking-tight bg-zinc-950/70">
              {dateStr || 'ST_COMP_10'}
            </div>
          </div>

          {/* Focal Central Premium Card Container */}
          <div className="flex-1 flex flex-col justify-center items-center my-1.5">
            <div className="bg-[#10121a]/90 border border-zinc-850 p-4 rounded-2xl w-full max-w-[290px] flex flex-col justify-center shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: accent.hex }}></div>
              
              {componentName === 'RaceChecklistGenerator' ? (
                <div className="flex flex-col gap-2.5 py-1">
                  {getChecklistItems().slice(0, 4).map((it, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-zinc-900 pb-1.5 last:border-0 last:pb-0 font-sans">
                      <span className="text-[11px] font-bold text-zinc-350 uppercase tracking-tight">{it}</span>
                      <CheckCircle className="w-3.5 h-3.5" style={{ color: accent.hex }} />
                    </div>
                  ))}
                </div>
              ) : componentName === 'RoutePosterGenerator' ? (
                <div className="flex flex-col items-center justify-center gap-2.5 py-1">
                  <div className="h-[95px] flex items-center justify-center w-full relative overflow-hidden">
                    {showMap ? (
                      <svg viewBox="0 0 360 360" className="w-[85px] h-[85px] overflow-visible" style={{ stroke: accent.hex, filter: `drop-shadow(0 0 5px ${accent.hex}80)` }}>
                        <path d={extraData.parsedData.path} fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <Compass className="w-8 h-8 opacity-25" style={{ color: accent.hex }} />
                    )}
                  </div>
                  {formData.distance && (
                    <div className="text-center">
                      <span className="text-[7px] uppercase tracking-wider text-zinc-500 font-bold block leading-none">DISTANCE SPAN</span>
                      <span className="text-lg font-black block mt-0.5" style={{ color: accent.hex }}>{formData.distance}</span>
                    </div>
                  )}
                </div>
              ) : componentName === 'PaceBandGenerator' ? (
                <div className="flex flex-col gap-2 py-1">
                  {extraData.splits?.slice(0, 3).map((s: any, i: number) => (
                    <div key={i} className="flex justify-between text-[11px] font-mono border-b border-zinc-900 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-[#71717a] font-extrabold">LAP_0{i+1}</span>
                      <span className="font-black text-white">{s.current}</span>
                    </div>
                  ))}
                </div>
              ) : primaryItem ? (
                <div className="text-center py-2 relative">
                  <span className="text-[7.5px] uppercase tracking-[0.2em] text-[#71717a] font-black block leading-none mb-1">{getLabel(primaryItem[0])}</span>
                  <span className="text-2xl font-black uppercase tracking-tighter block" style={{ color: accent.hex, textShadow: `0 0 8px ${accent.hex}40` }}>{String(primaryItem[1])}</span>
                </div>
              ) : (
                <span className="text-[10px] opacity-20 text-center uppercase tracking-widest block py-2.5 font-mono">NO RECORDED VALUE</span>
              )}
            </div>
          </div>

          {/* Social Media Styled horizontal tags/capsules */}
          {secondaryItems.length > 0 && componentName !== 'RoutePosterGenerator' && (
            <div className="space-y-1.5 w-full max-w-[270px] mx-auto">
              {secondaryItems?.slice(0, 3).map(([k, v], idx) => {
                const isFirst = idx === 0;
                return (
                  <div key={k} className="flex justify-between items-center py-1 px-3.5 rounded-full bg-zinc-950/75 border border-zinc-850 text-xs text-white">
                    <span className="text-[7px] uppercase tracking-wider text-zinc-500 font-black">{getLabel(k)}</span>
                    <span className="font-extrabold truncate max-w-[65%]" style={{ color: isFirst ? accent.hex : '#f43f5e' }}>{String(v)}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Locked status social footprint row */}
          <div className="flex flex-col items-center border-t border-zinc-900 pt-2 text-[7.5px] font-mono uppercase tracking-widest text-[#52525b]">
            <span className="font-semibold block mb-0.5 text-center">MADE SPECIAL FOR DEPRESSION PRESERVATION</span>
            {watermark}
          </div>

        </div>
      </div>
    );
  };

  // Switch to correct template renderer representation
  switch (normalizedTemplate) {
    case 'original':
      return renderOriginalTemplate();
    case 'sport':
      return renderSportTemplate();
    case 'carbon':
      return renderCarbonTemplate();
    case 'carbon-grid':
      return renderCarbonGridTemplate();
    case 'race-poster':
      return renderRacePosterTemplate();
    case 'minimal-white':
      return renderMinimalWhiteTemplate();
    case 'split-panel':
      return renderSplitPanelTemplate();
    case 'neon-edge':
      return renderNeonEdgeTemplate();
    case 'print-utility':
      return renderPrintUtilityTemplate();
    case 'compact-story':
      return renderCompactStoryTemplate();
    default:
      return renderOriginalTemplate();
  }
}

// Implement and export the requested central TemplateRenderer component
export function TemplateRenderer({
  templateId,
  cardType,
  data,
  exportSize,
  accent,
  extraData
}: {
  templateId: string;
  cardType: string;
  data: any;
  exportSize: string;
  accent: string;
  extraData?: any;
}) {
  return (
    <SharedTemplates
      template={templateId}
      formData={data}
      componentName={cardType}
      extraData={extraData}
    />
  );
}
