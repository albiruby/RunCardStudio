"use client";
import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";

export default function Settings() {
  const [theme, setTheme] = useState("Dark");
  const [unit, setUnit] = useState("Metric");
  const [exportSize, setExportSize] = useState("Square 1:1");
  const [watermark, setWatermark] = useState(true);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-text-primary mb-2">Settings</h1>
        <p className="text-text-muted mb-8 text-sm">Configure your studio preferences.</p>

        <div className="bg-surface-low border border-brand-border p-4 rounded mb-8 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-primary-action shrink-0 mt-0.5" />
          <div className="text-sm text-text-muted">
            <strong className="text-text-primary uppercase tracking-wide block mb-1">Local-First Storage</strong>
            Settings persistence (saving these preferences for your next visit) will be added after the stable MVP. Right now, these are session-only.
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <div className="border-b border-brand-border pb-6">
            <label className="block text-sm font-mono text-text-muted uppercase mb-3">Theme</label>
            <div className="flex flex-wrap gap-3">
              {['Dark', 'Light', 'System'].map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
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
              {['Metric', 'Imperial'].map(u => (
                <button
                  key={u}
                  onClick={() => setUnit(u)}
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
              {['Square 1:1', 'Story 9:16', 'Landscape 16:9'].map(s => (
                <button
                  key={s}
                  onClick={() => setExportSize(s)}
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
                  onClick={() => setWatermark(true)}
                  className={`px-4 py-2 border rounded font-semibold uppercase text-sm transition-colors
                    ${watermark ? 'border-primary-action text-primary-action bg-surface-high' : 'border-brand-border text-text-muted hover:border-text-muted'}`}
                >
                  On
                </button>
                <button
                  onClick={() => setWatermark(false)}
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
      </div>
    </div>
  );
}
