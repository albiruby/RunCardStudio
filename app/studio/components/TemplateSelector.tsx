'use client';
import React, { useRef, useEffect, useState } from "react";
import { Star } from "lucide-react";

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

export default function TemplateSelector({
  activeTemplate,
  onSelectTemplate,
  localTemplates
}: TemplateSelectorProps) {
  const combined = EXPORT_TEMPLATES.map(t => ({ id: t.id, label: t.name }));
  const containerRef = useRef<HTMLDivElement>(null);
  const activeAccent = useTemplateAccent();

  const [favorites, setFavorites] = useState<string[]>(() => getSessionFavorites());
  const [recents, setRecents] = useState<string[]>(() => getSessionRecents());

  // Ensure activeTemplate has a valid fallback
  const validActiveTemplate = EXPORT_TEMPLATES.some(t => t.id === activeTemplate) ? activeTemplate : "original";

  // Map templates with metadata in stable order
  const templatesWithMeta = combined.map((t, index) => {
    const name = t.label;
    const numPrefix = String(index + 1).padStart(2, "0");
    return { ...t, name, numPrefix };
  });

  const sortedTemplates = [...templatesWithMeta].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return templatesWithMeta.indexOf(a) - templatesWithMeta.indexOf(b);
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
    // If template selected is sport/carbon/etc., or clicked e.g. for any template, use onClick={() => onSelectTemplate(id)}
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
    <div className="flex flex-col gap-2 w-full max-w-full overflow-hidden">
      <div 
        ref={containerRef}
        className="flex flex-row items-center gap-2 overflow-x-auto subtle-scrollbar w-full py-1.5 px-0.5 select-none whitespace-nowrap scroll-smooth"
      >
        {sortedTemplates.map((t) => {
          const isActive = validActiveTemplate === t.id;
          const isFav = favorites.includes(t.id);
          const fullLabel = `${t.numPrefix} ${t.name}`;

          return (
            <div 
              key={t.id}
              data-active={isActive ? "true" : "false"}
              className={`group flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-md border transition-all duration-200 shrink-0 select-none
                ${isActive 
                  ? "border-secondary-lime text-secondary-lime bg-secondary-lime/15 shadow-[0_0_12px_rgba(204,255,0,0.2)]" 
                  : "bg-surface-low/60 border-brand-border text-text-muted hover:border-[#ff3330] hover:text-text-primary hover:bg-surface/40"
                }`}
            >
              <button
                onClick={() => handleSelect(t.id)}
                className="text-[10px] sm:text-xs font-mono font-bold uppercase whitespace-nowrap cursor-pointer shrink-0 outline-none text-left"
              >
                {fullLabel}
              </button>

              <button
                onClick={(e) => toggleFavorite(t.id, e)}
                className="p-0.5 focus:outline-none transition-all duration-150 hover:scale-125 cursor-pointer flex items-center justify-center shrink-0"
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

      {/* Recents Row (shows only if there are recent templates in session) */}
      {recents.length > 0 && (
        <div className="flex flex-row items-center gap-2 w-full overflow-x-auto subtle-scrollbar py-0.5 select-none whitespace-nowrap scroll-smooth">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-text-muted shrink-0">Recent:</span>
          <div className="flex flex-row gap-1.5">
            {recents.map((id) => {
              const tMeta = templatesWithMeta.find(x => x.id === id);
              if (!tMeta) return null;
              const isActive = validActiveTemplate === id;
              return (
                <button
                  key={id}
                  onClick={() => handleSelect(id)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all duration-200 cursor-pointer shrink-0 outline-none border
                    ${isActive 
                      ? "border-secondary-lime text-secondary-lime bg-secondary-lime/10" 
                      : "bg-surface-lowest/45 border-brand-border text-text-muted hover:text-text-primary hover:border-[#ff3330]"
                    }`}
                >
                  {tMeta.numPrefix} {tMeta.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Accent Select Pills */}
      <div className="flex flex-row items-center gap-2 w-full overflow-x-auto subtle-scrollbar py-1 px-0.5 select-none whitespace-nowrap scroll-smooth">
        <span className="text-[9px] uppercase tracking-wider font-extrabold text-text-muted shrink-0">Accent Color:</span>
        <div className="flex flex-row gap-1.5">
          {ACCENTS.map((acc) => {
            const isActive = activeAccent === acc.id;
            return (
              <button
                key={acc.id}
                onClick={() => setTemplateAccent(acc.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all duration-200 cursor-pointer shrink-0 outline-none
                  ${isActive 
                    ? "border-secondary-lime text-white bg-surface-lowest/90 scale-[1.02] outline outline-2 outline-offset-1 outline-[#a0cc00]" 
                    : "bg-surface-lowest/30 border-brand-border text-text-muted hover:text-text-primary hover:border-brand-border-strong hover:outline hover:outline-2 hover:outline-offset-1 hover:outline-[#ff3330]"
                  }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: acc.hex }} />
                <span>{acc.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
