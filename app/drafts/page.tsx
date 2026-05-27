/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getDrafts, deleteDraft, LocalDraft, isUnsafeValue } from '../lib/drafts';
import { Activity, Trash2, Copy, FileEdit, Download, Upload, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleOpen = (draft: LocalDraft) => {
    localStorage.setItem('runcard-draft-load', JSON.stringify(draft));
    router.push(`/studio?type=${draft.cardType}`);
  };

  const handleDuplicate = (draft: LocalDraft) => {
    const newDraft: LocalDraft = {
      ...draft,
      id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
      title: draft.title + " (Copy)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const all = [...drafts, newDraft];
    localStorage.setItem('runcard-drafts', JSON.stringify(all));
    setDrafts(all);
    showToast("Draft duplicated!");
  };

  const handleDelete = (id: string) => {
    deleteDraft(id);
    setDrafts(getDrafts());
    showToast("Draft deleted.");
  };

  const handleClearAll = () => {
    const confirmed = window.confirm("Are you sure you want to permanently delete all drafts? This action cannot be undone.");
    if (confirmed) {
      localStorage.setItem('runcard-drafts', JSON.stringify([]));
      setDrafts([]);
      showToast("All drafts permanently deleted.");
    }
  };

  // Safe import validation helper
  const isValidDraft = (obj: any): obj is LocalDraft => {
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.id !== 'string') return false;
    if (typeof obj.cardType !== 'string') return false;

    const VALID_TYPES = [
      "run-receipt",
      "race-recap",
      "workout-card",
      "race-split",
      "pace-band",
      "damage-report",
      "race-bib",
      "race-checklist",
      "sports-certificate",
      "personal-best",
      "training-week",
      "goal-card",
      "challenge-card",
      "fueling-plan",
      "shoe-rotation",
      "route-poster"
    ];
    if (!VALID_TYPES.includes(obj.cardType)) return false;

    if (typeof obj.title !== 'string') return false;
    if (typeof obj.template !== 'string') return false;
    if (typeof obj.accent !== 'string') return false;
    if (typeof obj.exportSize !== 'string') return false;
    if (obj.version !== "1.0") return false;
    if (typeof obj.createdAt !== 'string') return false;
    if (typeof obj.updatedAt !== 'string') return false;

    if (!obj.formData || typeof obj.formData !== 'object') return false;

    // Validate formData keys and values recursively
    for (const key in obj.formData) {
      const val = obj.formData[key];
      if (isUnsafeValue(val)) return false;

      if (val !== null) {
        if (Array.isArray(val)) {
          for (const item of val) {
            if (typeof item !== 'string' && typeof item !== 'number') return false;
          }
        } else {
          const t = typeof val;
          if (t !== 'string' && t !== 'number' && t !== 'boolean') return false;
        }
      }
    }

    return true;
  };

  const handleExportSingle = (draft: LocalDraft) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draft, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `runcard-draft-${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-backup.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("Draft JSON backup exported!");
    } catch (e) {
      showToast("Failed to export draft.");
    }
  };

  const handleExportAll = () => {
    if (drafts.length === 0) return;
    try {
      const backupData = {
        type: "runcard-all-drafts-backup",
        version: "1.0",
        drafts: drafts
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `runcard-drafts-backup.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast("All drafts exported as backup!");
    } catch (e) {
      showToast("Failed to export drafts backup.");
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        let importedDrafts: LocalDraft[] = [];

        const validateAndAdd = (d: any) => {
          if (isValidDraft(d)) {
            const freshDraft: LocalDraft = {
              ...d,
              id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
              updatedAt: new Date().toISOString()
            };
            importedDrafts.push(freshDraft);
          }
        };

        if (Array.isArray(parsed)) {
          parsed.forEach(validateAndAdd);
        } else if (parsed && typeof parsed === 'object') {
          if (parsed.type === "runcard-all-drafts-backup" && Array.isArray(parsed.drafts)) {
            parsed.drafts.forEach(validateAndAdd);
          } else {
            validateAndAdd(parsed);
          }
        }

        if (importedDrafts.length === 0) {
          showToast("Failed to import. Backup contains no valid or safe draft data.");
          return;
        }

        const current = getDrafts();
        const merged = [...current, ...importedDrafts];
        localStorage.setItem('runcard-drafts', JSON.stringify(merged));
        setDrafts(merged);
        showToast(`Successfully imported ${importedDrafts.length} draft(s)!`);
      } catch (err) {
        showToast("Import failed. Invalid file or unsafe data.");
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const formatType = (type: string) => {
    return type.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 w-full animate-fade-in pb-24 relative">
      {/* Visual Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-brand-border-strong border-2 border-secondary-lime text-white px-4 py-3 rounded-lg shadow-xl z-50 text-xs font-mono uppercase tracking-wider animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-brand-border">
        <div className="text-center md:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight text-text-primary mb-2 flex items-center justify-center md:justify-start gap-3">
            <Activity className="w-8 h-8 text-primary-action" /> My Drafts
          </h1>
          <p className="text-text-muted text-sm font-mono max-w-2xl">
            Saved designs. Stored locally in your browser.
          </p>
          <div className="mt-2 flex items-center justify-center md:justify-start gap-1.5 text-xs text-text-muted font-mono uppercase tracking-wide">
            <Info className="w-3.5 h-3.5 text-primary-coral" />
            <span>Only import draft files created by RunCard Studio.</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-surface hover:bg-brand-border/20 border border-brand-border text-text-primary rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Upload className="w-4 h-4 text-secondary-lime" /> Import JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json"
            className="hidden"
          />

          {drafts.length > 0 && (
            <>
              <button
                onClick={handleExportAll}
                className="px-4 py-2 bg-surface hover:bg-brand-border/20 border border-brand-border text-text-primary rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-primary-action" /> Export JSON
              </button>
              <button
                id="clear-all-drafts-btn"
                onClick={handleClearAll}
                className="px-4 py-2 border border-primary-action text-primary-action hover:bg-primary-action/15 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4" /> Clear All Drafts
              </button>
            </>
          )}
        </div>
      </div>

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-lowest border border-brand-border border-dashed rounded-lg">
          <FileEdit className="w-12 h-12 text-text-muted mb-4" />
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">No drafts yet</h2>
          <p className="text-text-muted text-sm mt-2 mb-6 font-mono">Create a card in the Studio and save it as a draft.</p>
          <Link 
            id="open-studio-link-empty"
            href="/studio" 
            className="px-6 py-3 bg-primary-action text-white rounded font-bold uppercase tracking-wider text-sm transition-colors hover:bg-opacity-90 shadow-[0_0_15px_rgba(255,84,81,0.2)]"
          >
            Open Studio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft, idx) => (
            <div 
              key={draft.id} 
              id={`draft-card-${draft.id}`}
              className="bg-surface-lowest border border-brand-border p-6 rounded flex flex-col gap-4 shadow-xl transition-all duration-300 hover:border-text-primary"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-lime">{formatType(draft.cardType)}</span>
                <h3 className="text-xl font-bold text-text-primary uppercase truncate">{draft.title}</h3>
                <span className="text-xs text-text-muted">Template: {draft.template} • Updated: {new Date(draft.updatedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-brand-border">
                <button
                  id={`open-draft-btn-${draft.id}`}
                  onClick={() => handleOpen(draft)}
                  className="flex-1 py-2 bg-primary-action text-white text-xs font-bold uppercase rounded flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors cursor-pointer"
                >
                  <FileEdit className="w-4 h-4" /> Open
                </button>
                <button
                  onClick={() => handleExportSingle(draft)}
                  className="p-2 border border-brand-border hover:bg-surface text-text-primary rounded transition-colors cursor-pointer"
                  title="Export Backup File"
                >
                  <Download className="w-4 h-4 text-primary-action" />
                </button>
                <button
                  id={`duplicate-draft-btn-${draft.id}`}
                  onClick={() => handleDuplicate(draft)}
                  className="p-2 border border-brand-border hover:bg-surface text-text-muted rounded transition-colors cursor-pointer"
                  title="Duplicate Draft"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  id={`delete-draft-btn-${draft.id}`}
                  onClick={() => handleDelete(draft.id)}
                  className="p-2 border border-brand-border hover:bg-[rgba(255,84,81,0.1)] text-primary-action hover:border-primary-action rounded transition-colors cursor-pointer"
                  title="Delete Draft"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

