const fs = require('fs');
const path = require('path');

const dir = 'app/studio/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

const compKeyMap = {
  'RunReceiptGenerator': 'run-receipt',
  'RaceRecapGenerator': 'race-recap',
  'WorkoutCardGenerator': 'workout-card',
  'RaceSplitGenerator': 'race-split',
  'PaceBandGenerator': 'pace-band',
  'DamageReportGenerator': 'damage-report',
  'RaceBibGenerator': 'race-bib',
  'RaceChecklistGenerator': 'race-checklist',
  'SportsCertificateGenerator': 'sports-certificate',
  'PersonalBestGenerator': 'personal-best',
  'TrainingWeekGenerator': 'training-week',
  'GoalCardGenerator': 'goal-card',
  'ChallengeCardGenerator': 'challenge-card',
  'FuelingPlanGenerator': 'fueling-plan',
  'ShoeRotationGenerator': 'shoe-rotation'
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let compName = path.basename(file, '.tsx');
  let cKey = compKeyMap[compName];

  if (!cKey) return;

  // Add Save icon to import
  if (content.includes('import { Copy') && !content.includes('Save,')) {
    content = content.replace(/import\s+\{\s*Copy/, 'import { Copy, Save');
  } else if (!content.includes('Save')) {
    content = content.replace(/import\s+\{/, 'import { Save, ');
  }

  // Define new funcs
  const codeToInsert = `
  const getPlainFormDataForCurrentCard = () => {
    return { ...formData };
  };

  const saveCurrentDraft = () => {
    const plainData = getPlainFormDataForCurrentCard();
    for (const key in plainData) {
      const val = (plainData as any)[key];
      if (typeof HTMLElement !== "undefined" && val instanceof HTMLElement) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Node !== "undefined" && val instanceof Node) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Event !== "undefined" && val instanceof Event) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof File !== "undefined" && val instanceof File) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof Blob !== "undefined" && val instanceof Blob) { showToast("Draft contains unsafe data and was not saved."); return; }
      if (typeof val === "function") { showToast("Draft contains unsafe data and was not saved."); return; }
    }

    const title = plainData.name || plainData.title || plainData.athleteName || plainData.sessionName || plainData.runnerName || plainData.raceName || plainData.sessionType || plainData.distanceChoice || "Untitled Draft";

    const draft = {
      id: "draft_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
      cardType: "${cKey}",
      title: String(title),
      template: typeof template !== 'undefined' ? template : "default",
      exportSize: typeof window !== 'undefined' ? localStorage.getItem('runcard-default-export-size') || "square" : "square",
      formData: plainData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: "1.0"
    };

    try {
      const existingStr = localStorage.getItem('runcard-drafts');
      let drafts = [];
      if (existingStr) {
        drafts = JSON.parse(existingStr);
      }
      drafts.push(draft);
      localStorage.setItem('runcard-drafts', JSON.stringify(drafts));
      showToast("Draft saved!");
    } catch(err) {
      showToast("Failed to save draft.");
    }
  };

  useEffect(() => {
    try {
       if (typeof window !== 'undefined') {
          const loadStr = localStorage.getItem('runcard-draft-load');
          if (loadStr) {
             const draft = JSON.parse(loadStr);
             if (draft && draft.cardType === "${cKey}") {
                if (draft.formData) setFormData(draft.formData);
                // Template is loaded if the form has a template state.
                // We'll just check if setTemplate exists in this code.
             }
          }
       }
    } catch {}
  }, []);
`;
  
  if (content.includes('saveCurrentDraft')) {
     console.log('Skipping', compName);
  } else {
     // Find "return (" at the root level of the component.
     // Best is finding: "  return ("  or "  return(" right before the main container
     let idx = content.lastIndexOf('  return (');
     if (idx !== -1) {
       content = content.slice(0, idx) + codeToInsert + '\n' + content.slice(idx);
     }
  }

  // We need to also add template setting inside useEffect if setTemplate is defined.
  if (content.includes('const [template, setTemplate]')) {
    content = content.replace( // replace inside the effect we just added
      /if \(draft.formData\) setFormData\(draft.formData\);/g,
      'if (draft.formData) setFormData(draft.formData);\n                if (draft.template && typeof setTemplate === "function") setTemplate(draft.template);'
    );
  }

  // Insert the Draft button before the Copy button
  const buttonRegex = /(<button[^>]*onClick=\{handleCopy[^>]*>[\s\S]*?<\/button>)/;
  if (!content.match(buttonRegex)) {
     // Fallback for paceband maybe
     const paceRegex = /(<button[^>]*onClick=\{handleCopy\}[^>]*>[\s\S]*?<\/button>)/;
     if (content.match(paceRegex)) {
        content = content.replace(paceRegex, 
          '<button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>\n          $1'
        );
     }
  } else {
      content = content.replace(buttonRegex, 
        '<button onClick={() => saveCurrentDraft()} className="w-full mt-2 lg:mt-4 py-2 bg-transparent hover:bg-primary-action/10 border border-primary-action text-primary-action rounded text-sm font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"><Save className="w-4 h-4 text-primary-action" /> SAVE DRAFT</button>\n          $1'
      );
  }

  fs.writeFileSync(file, content);
  console.log('Updated ' + compName);
});
