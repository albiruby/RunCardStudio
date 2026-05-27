'use client';
import React, { useRef, useEffect, useState } from "react";
import { Star, History, Palette, Layers, ChevronDown, ChevronUp } from "lucide-react";

interface TemplateItem {
  id: string;
  label: string;
}

interface TemplateSelectorProps {
  activeTemplate: string;
  onSelectTemplate: (id: string) => void;
  localTemplates: TemplateItem[];
}

export const ACCENTS = [
  { id: "coral-red", name: "Coral Red", hex: "#ff3330" },
  { id: "neon-lime", name: "Neon Lime", hex: "#a0cc00" },
  { id: "cyan-edge", name: "Cyan Edge", hex: "#00e5ff" },
  { id: "clean-white", name: "Clean White", hex: "#ffffff" },
  { id: "carbon-gray", name: "Carbon Gray", hex: "#71717a" },
  { id: "race-yellow", name: "Race Yellow", hex: "#facc15" },
  { id: "electric-blue", name: "Electric Blue", hex: "#2563eb" },
  { id: "warm-sand", name: "Warm Sand", hex: "#d4b483" }
];

export function useTemplateAccent() {
  const [accentId, setAccentId] = useState(() => {
    if (typeof window === 'undefined') return "coral-red";
    return localStorage.getItem('runcard-template-accent') || "coral-red";
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (e: any) => {
      if (e.detail) setAccentId(e.detail);
    };
    window.addEventListener('template-accent-changed', handler as any);
    return () => window.removeEventListener('template-accent-changed', handler as any);
  }, []);

  return accentId;
}

function setTemplateAccent(accentId: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('runcard-template-accent', accentId);
  window.dispatchEvent(new CustomEvent('template-accent-changed', { detail: accentId }));
}

// Inline replica of useExportSize to avoid circular import issues with SharedTemplates
function useInternalExportSize() {
  const [size, setSize] = useState(() => {
    if (typeof window === 'undefined') return "square";
    return localStorage.getItem('runcard-default-export-size') || "square";
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: any) => {
      if (e.detail) setSize(e.detail);
    };
    window.addEventListener('export-size-changed', handler as any);
    return () => window.removeEventListener('export-size-changed', handler as any);
  }, []);
  return size;
}

function setInternalExportSize(size: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('runcard-default-export-size', size);
  window.dispatchEvent(new CustomEvent('export-size-changed', { detail: size }));
}

// Global browser window helper functions to prevent variable reassignment warnings in linter rules
const getSessionFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  if (!(window as any)._sessionFavorites) {
    (window as any)._sessionFavorites = [];
  }
  return (window as any)._sessionFavorites;
};

const getSessionRecents = (): string[] => {
  if (typeof window === 'undefined') return [];
  if (!(window as any)._sessionRecents) {
    (window as any)._sessionRecents = [];
  }
  return (window as any)._sessionRecents;
};

const setSessionFavorites = (favs: string[]) => {
  if (typeof window === 'undefined') return;
  (window as any)._sessionFavorites = favs;
};

const setSessionRecents = (recents: string[]) => {
  if (typeof window === 'undefined') return;
  (window as any)._sessionRecents = recents;
};

export const EXPORT_TEMPLATES = [
  { id: "original", name: "Original" },
  { id: "sport", name: "Sport" },
  { id: "carbon", name: "Carbon" },
  { id: "carbon-grid", name: "Carbon Grid" },
  { id: "race-poster", name: "Race Poster" },
  { id: "minimal-white", name: "Minimal White" },
  { id: "split-panel", name: "Split Panel" },
  { id: "neon-edge", name: "Neon Edge" },
  { id: "print-utility", name: "Print Utility" },
  { id: "compact-story", name: "Compact Story" },
];

export const RATIOS = [
  { id: "square", name: "Square", sub: "1:1 Feed" },
  { id: "story", name: "Story", sub: "9:16 vertical" },
  { id: "landscape", name: "Landscape", sub: "16:9 classic" },
  { id: "compact", name: "Compact", sub: "1200x628 fit" },
  { id: "printable", name: "Printable", sub: "PDF Utility/A4" }
];

export default function TemplateSelector({
  activeTemplate,
  onSelectTemplate,
  localTemplates
}: TemplateSelectorProps) {
  const combined = localTemplates && localTemplates.length > 0 
    ? localTemplates.map(t => ({ id: t.id, label: t.label }))
    : EXPORT_TEMPLATES.map(t => ({ id: t.id, label: t.name }));
    
  const activeAccent = useTemplateAccent();
  const activeAccentObj = ACCENTS.find(a => a.id === activeAccent) || ACCENTS[0];
  const activeAccentHex = activeAccentObj.hex;

  const [favorites, setFavorites] = useState<string[]>(() => getSessionFavorites());
  const [recents, setRecents] = useState<string[]>(() => getSessionRecents());
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // Ensure activeTemplate has a valid fallback
  const validActiveTemplate = combined.some(t => t.id === activeTemplate) ? activeTemplate : (combined[0]?.id || "original");

  const TEMPLATE_DESCS: Record<string, string> = {
    "original": "Clean & bold classic summary",
    "sport": "Kinetic racing typography",
    "carbon": "Technical modern telemetry",
    "carbon-grid": "High-density metric matrix",
    "race-poster": "Elegant minimalist racer design",
    "minimal-white": "Sleek low-density high-contrast",
    "split-panel": "Side-by-side dashboard breakdown",
    "neon-edge": "Vibrant glowing ambient details",
    "print-utility": "Print-ready high contrast list",
    "compact-story": "Optimized tall visual card",
    "wristband": "Printable, wrap-around pacer strip",
    "phone lockscreen": "Tailored mobile phone overlay",
    "printable a4": "Perfect A4 scale running plan",
    "weekly board": "Compact weekly matrix layout",
    "training log": "Sleek workout record tracker",
    "dark carbon": "Carbon-textured daily recap",
    "rotation board": "Horizontal grid for active gear",
    "shoe log": "Detailed run-life shoe logging",
    "minimal gear": "Utterly clean simple layout",
    "target board": "Clear visual metric milestones",
    "countdown card": "Live countdown event marker",
    "minimal goal": "Simple text-led performance driver",
    "race fuel plan": "Smart workout fueling matrix",
    "bottle strategy": "Visual bottle fluid outline",
    "minimal nutrition": "Ultra-light hydration ledger",
    "community challenge": "Shared badge metric template",
    "solo mission": "Sleek single-racer objective",
    "dark challenge": "Vibrant futuristic quest card",
    "brutal": "Industrial brutalist damage report",
    "receipt": "High-contrast commercial style",
    "neon": "Vibrant electric neon theme",
  };

  const handleSelect = (id: string) => {
    onSelectTemplate(id);
    const prevRecents = getSessionRecents();
    const nextRecents = [id, ...prevRecents.filter(x => x !== id)].slice(0, 5);
    setSessionRecents(nextRecents);
    setRecents(nextRecents);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const prevFavs = getSessionFavorites();
    let nextFavs;
    if (prevFavs.includes(id)) {
      nextFavs = prevFavs.filter(x => x !== id);
    } else {
      nextFavs = [...prevFavs, id];
    }
    setSessionFavorites(nextFavs);
    setFavorites(nextFavs);
  };

  return (
    <div className="w-full bg-[#090b0e] border border-brand-border/60 rounded-xl p-4 md:p-5 flex flex-col gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.55)] select-none">
      
      {/* 1. Template Selector Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-secondary-lime" />
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-text-primary">SELECT TEMPLATE</span>
          </div>

          <button
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer outline-none focus:outline-none
              ${showHistoryPanel
                ? "bg-[#ff3330]/10 border-[#ff3330] text-[#ff3330]"
                : "bg-surface-lowest/40 border-brand-border text-text-muted hover:text-text-primary hover:border-brand-border-strong"
              }`}
          >
            <History className="w-3 h-3" />
            <span>Favs</span>
            {showHistoryPanel ? <ChevronUp className="w-2.5 h-2.5 ml-0.5" /> : <ChevronDown className="w-2.5 h-2.5 ml-0.5" />}
          </button>
        </div>

        {/* Expandable History & Favorites Section */}
        {showHistoryPanel && (
          <div className="bg-[#111317] border border-brand-border rounded-lg p-3 flex flex-col gap-2.5 animate-fade-in">
            {/* Favorites List */}
            <div>
              <div className="flex items-center gap-1 mb-1 text-text-muted">
                <Star className="w-3 h-3 text-[#facc15] fill-[#facc15]" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Favorites</span>
              </div>
              {favorites.length === 0 ? (
                <div className="text-[9px] font-mono text-zinc-600 bg-surface-lowest/10 rounded-md p-1.5 border border-brand-border/40 border-dashed">
                  No starred templates yet.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {favorites.map((id) => {
                    const tMeta = combined.find(x => x.id === id);
                    if (!tMeta) return null;
                    const isActive = validActiveTemplate === id;
                    return (
                      <button
                        key={id}
                        onClick={() => handleSelect(id)}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all border cursor-pointer outline-none focus:outline-none
                          ${isActive
                            ? "border-secondary-lime text-secondary-lime bg-secondary-lime/10"
                            : "bg-surface-lowest/50 border-brand-border text-text-muted hover:text-[#f2f4f7] hover:border-brand-border-strong"
                          }`}
                      >
                        ★ {tMeta.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recents list */}
            <div>
              <div className="flex items-center gap-1 mb-1 text-text-muted">
                <History className="w-3 h-3 text-secondary-lime" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider">Recent</span>
              </div>
              {recents.length === 0 ? (
                <div className="text-[9px] font-mono text-zinc-600 bg-surface-lowest/10 rounded-md p-1.5 border border-brand-border/40 border-dashed">
                  None.
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {recents.map((id) => {
                    const tMeta = combined.find(x => x.id === id);
                    if (!tMeta) return null;
                    const isActive = validActiveTemplate === id;
                    return (
                      <button
                        key={id}
                        onClick={() => handleSelect(id)}
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all border cursor-pointer outline-none focus:outline-none
                          ${isActive
                            ? "border-secondary-lime text-secondary-lime bg-secondary-lime/10"
                            : "bg-surface-lowest/50 border-brand-border text-text-muted hover:text-[#f2f4f7] hover:border-[#ff3330]"
                          }`}
                      >
                        {tMeta.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Templates Vertical Scroll List */}
        <div className="flex flex-col gap-2 max-h-[340px] overflow-y-auto subtle-scrollbar pr-1">
          {combined.map((t) => {
            const isSelected = validActiveTemplate === t.id;
            const isFav = favorites.includes(t.id);

            return (
              <div 
                key={t.id}
                onClick={() => handleSelect(t.id)}
                className={`group flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-200 cursor-pointer select-none relative
                  ${isSelected 
                    ? "border-secondary-lime bg-secondary-lime/5 text-[#f2f4f7] shadow-[0_0_15px_rgba(160,204,0,0.08)]" 
                    : "bg-surface-low/30 border-brand-border/60 text-text-muted hover:border-brand-border-strong hover:text-text-primary hover:bg-surface-lowest/40"}`}
              >
                {/* Mini card visual indicator */}
                <div className={`w-10 h-8 rounded border flex flex-col justify-between p-1 transition-all relative overflow-hidden bg-[#05070a] shrink-0
                  ${isSelected ? "border-secondary-lime/80 animate-pulse" : "border-brand-border/80 group-hover:border-brand-border-strong"}`}
                >
                  <div className="h-1 w-2/3 rounded-full bg-text-muted/40" style={isSelected ? { backgroundColor: activeAccentHex + "50" } : undefined} />
                  <div className="flex gap-0.5 items-end">
                    <div className="h-1.5 w-1/2 bg-text-muted/20" style={isSelected ? { backgroundColor: activeAccentHex + "30" } : undefined} />
                    <div className="h-2.5 w-1/2 bg-text-muted/25" style={isSelected ? { backgroundColor: activeAccentHex + "40" } : undefined} />
                  </div>
                  {isSelected && (
                    <div className="absolute right-0.5 top-0.5 w-1 h-1 rounded-full blinking" style={{ backgroundColor: activeAccentHex }} />
                  )}
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-tight text-text-primary truncate">
                    {t.label}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted truncate mt-0.5 leading-none">
                    {TEMPLATE_DESCS[t.id] || "Custom athletic layout"}
                  </span>
                </div>

                <button
                  onClick={(e) => toggleFavorite(t.id, e)}
                  className="p-1 focus:outline-none transition-all duration-150 hover:scale-125 cursor-pointer flex items-center justify-center shrink-0"
                  title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Star 
                    className={`w-3 h-3 transition-colors duration-150 ${
                      isFav 
                        ? "fill-[#facc15] text-[#facc15]" 
                        : "text-zinc-600 group-hover:text-[#ff3330]"
                    }`} 
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-brand-border/40 w-full" />

      {/* 2. ACCENT COLOR Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-secondary-lime" />
          <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-text-primary">ACCENT COLOR</span>
        </div>

        {/* Circular Color Swatches */}
        <div className="grid grid-cols-5 gap-2 px-1">
          {ACCENTS.map((acc) => {
            const isActive = activeAccent === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => setTemplateAccent(acc.id)}
                style={{ backgroundColor: acc.hex }}
                className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer outline-none focus:outline-none relative hover:scale-[1.15]
                  ${isActive 
                    ? "border-secondary-lime scale-[1.12] shadow-[0_0_12px_rgba(204,255,0,0.5)] ring-2 ring-secondary-lime/20" 
                    : "border-brand-border/70 hover:border-brand-border-strong"
                  }`}
                title={acc.name}
              >
                {isActive && (
                  <span className="w-2.5 h-2.5 rounded-full bg-black/80 flex items-center justify-center text-[8px] text-secondary-lime font-bold">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* PREVIEW ACCENT panel - Match mockup details! */}
        <div className="bg-[#111317]/60 border border-brand-border/60 rounded-lg p-3 flex flex-col gap-2 font-mono text-[9px] text-text-muted mt-1.5 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="tracking-wider">PREVIEW ACCENT</span>
            <span style={{ color: activeAccentHex }} className="font-bold uppercase">{activeAccentObj.name}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-lowest rounded-full overflow-hidden relative border border-brand-border/30">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: '85%', backgroundColor: activeAccentHex }} />
          </div>
          <div className="flex items-center justify-between text-[8px] mt-0.5 opacity-80">
            <span>MAY 17, 2025</span>
            <span style={{ color: activeAccentHex }} className="font-bold flex items-center gap-0.5">⚡ 4:51 /KM</span>
          </div>
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed font-mono opacity-80 px-1">
          Accent applies to headers, highlights, borders, and key athlete telemetry lines.
        </p>
      </div>

    </div>
  );
}
