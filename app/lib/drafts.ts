export type CardType =
  | "run-receipt"
  | "race-recap"
  | "workout-card"
  | "race-split"
  | "pace-band"
  | "damage-report"
  | "race-bib"
  | "race-checklist"
  | "sports-certificate"
  | "personal-best"
  | "training-week"
  | "goal-card"
  | "challenge-card"
  | "fueling-plan"
  | "shoe-rotation"
  | "route-poster";

export type DraftFormData = Record<
  string,
  string | number | boolean | null | string[] | number[]
>;

export type LocalDraft = {
  id: string;
  cardType: string;
  title: string;
  template: string;
  accent: string;
  exportSize: string;
  formData: DraftFormData;
  createdAt: string;
  updatedAt: string;
  version: "1.0";
};

export function isUnsafeValue(value: unknown): boolean {
  if (value === null || value === undefined) return false;

  // Basic JS types
  if (typeof value === "function") return true;

  // Browser API types (Instance checks)
  if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) return true;
  if (typeof Node !== "undefined" && value instanceof Node) return true;
  if (typeof Event !== "undefined" && value instanceof Event) return true;
  if (typeof File !== "undefined" && value instanceof File) return true;
  if (typeof Blob !== "undefined" && value instanceof Blob) return true;

  if (typeof value === "object") {
    // Stringified prototype validation
    try {
      const protoStr = Object.prototype.toString.call(value);
      if (
        protoStr.includes("HTML") ||
        protoStr.includes("Element") ||
        protoStr.includes("Event") ||
        protoStr.includes("Node") ||
        protoStr.includes("File") ||
        protoStr.includes("Blob")
      ) {
        return true;
      }
    } catch {
      return true;
    }

    // Inspect object keys and nested properties
    try {
      const keys = Object.keys(value as object);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (k === "current") return true;
        if (k.startsWith("__reactFiber") || k.startsWith("__reactProps")) return true;

        if (isUnsafeValue((value as any)[k])) {
          return true;
        }
      }
    } catch {
      // If we cannot check keys, assume unsafe
      return true;
    }
  }

  return false;
}

export function saveDraft(draft: LocalDraft): boolean {
  if (!draft || !draft.formData) return false;

  // Check top level and recursive properties for unsafe fields
  for (const key in draft.formData) {
    if (isUnsafeValue(draft.formData[key])) {
      return false; // contains unsafe data
    }
  }

  try {
    const existingStr = localStorage.getItem('runcard-drafts');
    let drafts: LocalDraft[] = [];
    if (existingStr) {
      drafts = JSON.parse(existingStr);
    }
    
    const existingIdx = drafts.findIndex(d => d.id === draft.id);
    if (existingIdx >= 0) {
      drafts[existingIdx] = draft;
    } else {
      drafts.push(draft);
    }
    
    localStorage.setItem('runcard-drafts', JSON.stringify(drafts));
    return true;
  } catch {
    return false;
  }
}

export function getDrafts(): LocalDraft[] {
  try {
    const existingStr = localStorage.getItem('runcard-drafts');
    if (existingStr) {
      const drafts: LocalDraft[] = JSON.parse(existingStr);
      // Validate that each draft being retrieved is safe
      return drafts.filter(d => {
        if (!d || !d.formData) return false;
        for (const key in d.formData) {
          if (isUnsafeValue(d.formData[key])) {
            return false;
          }
        }
        return true;
      });
    }
    return [];
  } catch {
    return [];
  }
}

export function deleteDraft(id: string) {
  const drafts = getDrafts();
  const newDrafts = drafts.filter(d => d.id !== id);
  localStorage.setItem('runcard-drafts', JSON.stringify(newDrafts));
}
