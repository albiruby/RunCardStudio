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
  const combined = EXPORT_TEMPLATES.map(t => ({ id: t.id, label: t.name }));
  const containerRef = useRef<HTMLDivElement>(null);
  const activeAccent = useTemplateAccent();
  const activeExportSize = useInternalExportSize();

  const [favorites, setFavorites] = useState<string[]>(() => getSessionFavorites());
  const [recents, setRecents] = useState<string[]>(() => getSessionRecents());
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // Ensure activeTemplate has a valid fallback
  const validActiveTemplate = EXPORT_TEMPLATES.some(t => t.id === activeTemplate) ? activeTemplate : "original";

  // Map templates with metadata in stable order
  const templatesWithMeta = combined.map((t, index) => {
    const name = t.label;
    const numPrefix = String(index + 1).padStart(2, "0");
    return { ...t, name, numPrefix };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (activeBtn) {
       const containerRect = container.getBoundingClientRect();
       const activeRect = activeBtn.getBoundingClientRect();
       const scrollLeft = container.scrollLeft + (activeRect.left - containerRect.left) - (containerRect.width / 2) + (activeRect.width / 2);
       container.scrollTo({
         left: scrollLeft,
         behavior: 'smooth'
       });
    }
  }, [validActiveTemplate]);

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
    <div className="w-full bg-[#090b0e] border border-brand-border/60 rounded-xl p-4 md:p-6 flex flex-col gap-5 shadow-[0_8px_32px_rgba(0,0,0,0.55)] select-none">
      
      {/* 1. Template Selector Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-secondary-lime" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold text-text-primary">01. Select Template</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer outline-none focus:outline-none
                ${showHistoryPanel
                  ? "bg-[#ff3330]/10 border-[#ff3330] text-[#ff3330]"
                  : "bg-surface-lowest/40 border-brand-border text-text-muted hover:text-text-primary hover:border-brand-border-strong"
                }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History & Favs</span>
              {showHistoryPanel ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
            </button>

            <span className="text-[10px] font-mono text-secondary-lime font-bold uppercase bg-secondary-lime/10 px-2 py-0.5 rounded border border-secondary-lime/20">
              Active: {templatesWithMeta.find(t => t.id === validActiveTemplate)?.name || validActiveTemplate}
            </span>
          </div>
        </div>

        {/* Templates Scroll Row */}
        <div 
          ref={containerRef}
          className="flex flex-row items-center gap-2.5 overflow-x-auto subtle-scrollbar w-full py-1.5 px-0.5 whitespace-nowrap scroll-smooth"
        >
          {templatesWithMeta.map((t) => {
            const isActive = validActiveTemplate === t.id;
            const isFav = favorites.includes(t.id);
            const fullLabel = `${t.numPrefix} ${t.name}`;

            return (
              <div 
                key={t.id}
                data-active={isActive ? "true" : "false"}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-all duration-200 shrink-0 select-none cursor-pointer
                  ${isActive 
                    ? "border-secondary-lime text-secondary-lime bg-secondary-lime/15 shadow-[0_0_12px_rgba(204,255,0,0.15)]" 
                    : "bg-surface-low/30 border-brand-border text-text-muted hover:border-[#ff3330]/60 hover:text-text-primary hover:bg-surface/50"
                  }`}
                onClick={() => handleSelect(t.id)}
              >
                <span className="text-xs font-mono font-bold uppercase whitespace-nowrap cursor-pointer">
                  {fullLabel}
                </span>

                <button
                  onClick={(e) => toggleFavorite(t.id, e)}
                  className="p-1 focus:outline-none transition-all duration-150 hover:scale-125 cursor-pointer flex items-center justify-center shrink-0"
                  title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                >
                  <Star 
                    className={`w-3.5 h-3.5 transition-colors duration-150 ${
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

      {/* Expandable History & Favorites Section */}
      {showHistoryPanel && (
        <div className="bg-[#111317] border border-brand-border rounded-lg p-3.5 flex flex-col gap-3 animate-fade-in">
          {/* Favorites List */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-text-muted">
              <Star className="w-3.5 h-3.5 text-[#facc15] fill-[#facc15]" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Favorites</span>
            </div>
            {favorites.length === 0 ? (
              <div className="text-[10px] font-mono text-zinc-600 bg-surface-lowest/10 rounded-md p-2 border border-brand-border/40 border-dashed">
                No favorited templates yet. Star templates above to add them here.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {favorites.map((id) => {
                  const tMeta = templatesWithMeta.find(x => x.id === id);
                  if (!tMeta) return null;
                  const isActive = validActiveTemplate === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleSelect(id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all border cursor-pointer outline-none focus:outline-none
                        ${isActive
                          ? "border-secondary-lime text-secondary-lime bg-secondary-lime/10"
                          : "bg-surface-lowest/50 border-brand-border text-text-muted hover:text-[#f2f4f7] hover:border-brand-border-strong"
                        }`}
                    >
                      ★ {tMeta.numPrefix} {tMeta.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recents list */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 text-text-muted">
              <History className="w-3.5 h-3.5 text-secondary-lime" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Recent Runs</span>
            </div>
            {recents.length === 0 ? (
              <div className="text-[10px] font-mono text-zinc-600 bg-surface-lowest/10 rounded-md p-2 border border-brand-border/40 border-dashed">
                Select templates to populate session history.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recents.map((id) => {
                  const tMeta = templatesWithMeta.find(x => x.id === id);
                  if (!tMeta) return null;
                  const isActive = validActiveTemplate === id;
                  return (
                    <button
                      key={id}
                      onClick={() => handleSelect(id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all border cursor-pointer outline-none focus:outline-none
                        ${isActive
                          ? "border-secondary-lime text-secondary-lime bg-secondary-lime/10"
                          : "bg-surface-lowest/50 border-brand-border text-text-muted hover:text-[#f2f4f7] hover:border-[#ff3330]"
                        }`}
                    >
                      {tMeta.numPrefix} {tMeta.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-brand-border/40 w-full" />

      {/* 2 & 3: Accent Color and Format Ratio Side-by-Side or Stacked */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Accent Selector Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-secondary-lime" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold text-text-primary">02. Accent Color</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-0.5">
            {ACCENTS.map((acc) => {
              const isActive = activeAccent === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => setTemplateAccent(acc.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border transition-all duration-200 cursor-pointer outline-none focus:outline-none
                    ${isActive 
                      ? "border-secondary-lime text-text-primary bg-[#a0cc00]/10 scale-[1.03] shadow-[0_0_8px_rgba(204,255,0,0.15)]" 
                      : "bg-surface-lowest/30 border-brand-border text-text-muted hover:text-[#f2f4f7] hover:border-brand-border-strong"
                    }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/30" style={{ backgroundColor: acc.hex }} />
                  <span>{acc.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Export Ratio / Format Selection Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-secondary-lime invisible md:visible" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold text-text-primary">03. Format Ratio</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-1.5 mt-0.5">
            {RATIOS.map((ratio) => {
              const isActive = activeExportSize === ratio.id;
              return (
                <button
                  key={ratio.id}
                  onClick={() => setInternalExportSize(ratio.id)}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all duration-200 cursor-pointer outline-none focus:outline-none text-center
                    ${isActive 
                      ? "border-secondary-lime text-text-primary bg-secondary-lime/10 shadow-[0_0_8px_rgba(204,255,0,0.15)]" 
                      : "bg-surface-lowest/30 border-brand-border text-text-muted hover:text-[#f2f4f7] hover:border-brand-border-strong"
                    }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tight font-mono">{ratio.name}</span>
                  <span className="text-[8px] font-mono text-text-muted opacity-85 mt-0.5 leading-none">{ratio.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
