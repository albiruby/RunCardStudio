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
  cardType: CardType;
  title: string;
  template: string;
  exportSize: string;
  formData: DraftFormData;
  createdAt: string;
  updatedAt: string;
  version: "1.0";
};

export function isUnsafeValue(value: unknown): boolean {
  if (typeof HTMLElement !== "undefined" && value instanceof HTMLElement) return true;
  if (typeof Node !== "undefined" && value instanceof Node) return true;
  if (typeof Event !== "undefined" && value instanceof Event) return true;
  if (typeof File !== "undefined" && value instanceof File) return true;
  if (typeof Blob !== "undefined" && value instanceof Blob) return true;
  if (typeof value === "function") return true;
  return false;
}

export function saveDraft(draft: LocalDraft): boolean {
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
    
    // We don't overwrite by id currently unless we have true draft loading returning identical IDs.
    // However, for pure safety, let's just always push a new one or if ID matches, replace.
    const existingIdx = drafts.findIndex(d => d.id === draft.id);
    if (existingIdx >= 0) {
      drafts[existingIdx] = draft;
    } else {
      drafts.push(draft);
    }
    
    localStorage.setItem('runcard-drafts', JSON.stringify(drafts));
    return true;
  } catch (err) {
    return false;
  }
}

export function getDrafts(): LocalDraft[] {
  try {
    const existingStr = localStorage.getItem('runcard-drafts');
    if (existingStr) {
      return JSON.parse(existingStr);
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
