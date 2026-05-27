'use client';
import { useEffect } from 'react';
import { isUnsafeValue } from '../../lib/drafts';

export default function DraftSafeGuard() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalSetItem = window.localStorage.setItem;
    
    window.localStorage.setItem = function (key: string, value: string) {
      if (key === 'runcard-drafts') {
        try {
          const drafts = JSON.parse(value);
          if (Array.isArray(drafts)) {
            let hasUnsafe = false;
            for (const draft of drafts) {
              if (draft && draft.formData) {
                for (const fKey in draft.formData) {
                  if (isUnsafeValue(draft.formData[fKey])) {
                    hasUnsafe = true;
                    break;
                  }
                }
              }
              if (hasUnsafe) break;
            }

            if (hasUnsafe) {
              // Block next toasts from overriding
              (window as any)._unsafeDraftBlocking = true;
              setTimeout(() => {
                (window as any)._unsafeDraftBlocking = false;
              }, 800);

              window.dispatchEvent(new CustomEvent('runcard-unsafe-draft-detected'));
              throw new Error('Draft contains unsafe data and was not saved.');
            }

            // Fill empty accent field in existing and incoming drafts
            const currentAccent = window.localStorage.getItem('runcard-template-accent') || 'coral-red';
            for (const draft of drafts) {
              if (draft && !draft.accent) {
                draft.accent = currentAccent;
              }
            }
            
            value = JSON.stringify(drafts);
          }
        } catch (err: any) {
          if (err.message && err.message.includes('unsafe data')) {
            throw err;
          }
        }
      }
      
      return originalSetItem.apply(this, [key, value]);
    };

    return () => {
      window.localStorage.setItem = originalSetItem;
    };
  }, []);

  return null;
}
