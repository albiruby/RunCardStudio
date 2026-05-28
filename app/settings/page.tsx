"use client";
import { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  const [unit, setUnit] = useState("metric");
  const [exportSize, setExportSize] = useState("square");
  const [watermark, setWatermark] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    setTimeout(() => {
      setTheme(localStorage.getItem('runcard-theme') || 'dark');
      setUnit(localStorage.getItem('runcard-unit') || 'metric');
      setExportSize(localStorage.getItem('runcard-default-export-size') || 'square');
      setWatermark(localStorage.getItem('runcard-watermark') !== 'off');
    }, 0);
  }, []);

  const resetSettings = () => {
    setTheme('dark');
    setUnit('metric');
    setExportSize('square');
    setWatermark(true);
    localStorage.setItem('runcard-theme', 'dark');
    localStorage.setItem('runcard-unit', 'metric');
    localStorage.setItem('runcard-default-export-size', 'square');
    localStorage.setItem('runcard-watermark', 'on');
    document.documentElement.classList.remove('light');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-text-primary mb-2">Settings</h1>
        <p className="text-text-muted mb-8 text-sm">Configure your studio preferences.</p>

        <div className="bg-surface-low border border-brand-border p-4 rounded mb-8 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-primary-action shrink-0 mt-0.5" />
          <div className="text-sm text-text-muted">
            <strong className="text-text-primary uppercase tracking-wide block mb-1">Local-First Storage</strong>
            Preferences are saved to your browser automatically.
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div className="border-b border-brand-border pb-6">
            <label className="block text-sm font-mono text-text-muted uppercase mb-3">Theme</label>
            <div className="flex flex-wrap gap-3">
              {['dark', 'light', 'system'].map(t => (
                <button
                  key={t}
                  onClick={() => {
                    setTheme(t);
                    localStorage.setItem('runcard-theme', t);
                    if (t === 'light') document.documentElement.classList.add('light');
                    else if (t === 'dark') document.documentElement.classList.remove('light');
                    else {
                      if (window.matchMedia('(prefers-color-scheme: light)').matches) document.documentElement.classList.add('light');
                      else document.documentElement.classList.remove('light');
                    }
                  }}
                  className={`px-4 py-2 border rounded font-semibold uppercase text-sm transition-colors
                    ${theme === t ? 'border-primary-action text-primary-action bg-surface-high' : 'border-brand-border text-text-muted hover:border-text-muted'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Units */}
          <div className="border-b border-brand-border pb-6">
            <label className="block text-sm font-mono text-text-muted uppercase mb-3">Unit System</label>
            <div className="flex flex-wrap gap-3">
              {['metric', 'imperial'].map(u => (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                    localStorage.setItem('runcard-unit', u);
                  }}
                  className={`px-4 py-2 border rounded font-semibold uppercase text-sm transition-colors
                    ${unit === u ? 'border-primary-action text-primary-action bg-surface-high' : 'border-brand-border text-text-muted hover:border-text-muted'}`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Export Size */}
          <div className="border-b border-brand-border pb-6">
            <label className="block text-sm font-mono text-text-muted uppercase mb-3">Default Export Size</label>
            <div className="flex flex-wrap gap-3">
              {['square', 'story', 'landscape', 'compact'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setExportSize(s);
                    localStorage.setItem('runcard-default-export-size', s);
                  }}
                  className={`px-4 py-2 border rounded font-semibold uppercase text-sm transition-colors
                    ${exportSize === s ? 'border-primary-action text-primary-action bg-surface-high' : 'border-brand-border text-text-muted hover:border-text-muted'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

           {/* Watermark */}
           <div className="border-b border-brand-border pb-6">
            <label className="block text-sm font-mono text-text-muted uppercase mb-3">Watermark</label>
            <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setWatermark(true);
                    localStorage.setItem('runcard-watermark', 'on');
                  }}
                  className={`px-4 py-2 border rounded font-semibold uppercase text-sm transition-colors
                    ${watermark ? 'border-primary-action text-primary-action bg-surface-high' : 'border-brand-border text-text-muted hover:border-text-muted'}`}
                >
                  On
                </button>
                <button
                  onClick={() => {
                    setWatermark(false);
                    localStorage.setItem('runcard-watermark', 'off');
                  }}
                  className={`px-4 py-2 border rounded font-semibold uppercase text-sm transition-colors
                    ${!watermark ? 'border-primary-action text-primary-action bg-surface-high' : 'border-brand-border text-text-muted hover:border-text-muted'}`}
                >
                  Off
                </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-sm text-text-muted bg-surface p-4 border border-brand-border rounded">
           <strong className="text-text-primary mb-2 block uppercase">Privacy Note</strong>
           All data stays in your browser. RunCard Studio does not use login, database, backend, cloud storage, tracking, or AI.
        </div>
        
        <div className="mt-8">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all local data, including drafts and settings?")) {
                Object.keys(localStorage).forEach(key => {
                  if (key.startsWith('runcard-')) {
                    localStorage.removeItem(key);
                  }
                });
                resetSettings();
                showToast("Local RunCard data cleared.");
              }
            }}
            className="px-4 py-2 border border-brand-border text-text-muted hover:text-primary-coral hover:border-primary-coral rounded font-semibold uppercase text-sm transition-colors"
          >
            Clear Local Data
          </button>
        </div>
      </div>
      
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-brand-border text-text-primary px-4 py-2 rounded shadow-2xl z-50 text-sm font-mono flex items-center gap-2">
          <Save className="w-4 h-4 text-secondary-lime" />
          {toast}
        </div>
      )}
    </div>
  );
}
