'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDrafts, deleteDraft, LocalDraft } from '../lib/drafts';
import { Activity, Trash2, Copy, FileEdit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<LocalDraft[]>([]);
  const router = useRouter();

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const handleOpen = (draft: LocalDraft) => {
    localStorage.setItem('runcard-draft-load', JSON.stringify(draft));
    router.push(`/studio?type=${draft.cardType}`);
  };

  const handleDuplicate = (draft: LocalDraft) => {
    const newDraft = {
      ...draft,
      id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
      title: draft.title + " (Copy)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const all = [...drafts, newDraft];
    localStorage.setItem('runcard-drafts', JSON.stringify(all));
    setDrafts(all);
  };

  const handleDelete = (id: string) => {
    deleteDraft(id);
    setDrafts(getDrafts());
  };

  const formatType = (type: string) => {
    return type.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-10 w-full animate-fade-in pb-24">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight text-text-primary mb-2 flex items-center justify-center md:justify-start gap-3">
          <Activity className="w-8 h-8 text-primary-action" /> My Drafts
        </h1>
        <p className="text-text-muted text-sm font-mono max-w-2xl">
          Saved designs. Stored locally in your browser.
        </p>
      </div>

      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-surface-lowest border border-brand-border border-dashed rounded-lg">
          <FileEdit className="w-12 h-12 text-text-muted mb-4" />
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">No drafts yet</h2>
          <p className="text-text-muted text-sm mt-2 mb-6">Create a card in the Studio and save it as a draft.</p>
          <Link href="/studio" className="px-6 py-3 bg-primary-action text-white rounded font-bold uppercase tracking-wider text-sm transition-colors hover:bg-opacity-90 shadow-[0_0_15px_rgba(255,84,81,0.2)]">
            Open Studio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map(draft => (
            <div key={draft.id} className="bg-surface-lowest border border-brand-border p-6 rounded flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary-lime">{formatType(draft.cardType)}</span>
                <h3 className="text-xl font-bold text-text-primary uppercase truncate">{draft.title}</h3>
                <span className="text-xs text-text-muted">Template: {draft.template} • Updated: {new Date(draft.updatedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 mt-auto pt-4 border-t border-brand-border">
                <button
                  onClick={() => handleOpen(draft)}
                  className="flex-1 py-2 bg-primary-action text-white text-xs font-bold uppercase rounded flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
                >
                  <FileEdit className="w-4 h-4" /> Open
                </button>
                <button
                  onClick={() => handleDuplicate(draft)}
                  className="p-2 border border-brand-border hover:bg-surface text-text-muted rounded transition-colors"
                  title="Duplicate Draft"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(draft.id)}
                  className="p-2 border border-brand-border hover:bg-[rgba(255,84,81,0.1)] text-primary-action hover:border-primary-action rounded transition-colors"
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
