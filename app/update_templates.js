const fs = require('fs');
const path = require('path');

const dir = 'app/studio/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

const componentToTemplates = {
  'RunReceiptGenerator.tsx': [
    { id: 'thermal', label: 'Thermal Receipt' },
    { id: 'neon', label: 'Neon Sport' },
    { id: 'carbon', label: 'Dark Carbon Receipt' }
  ],
  'RaceRecapGenerator.tsx': [
    { id: 'carbon', label: 'Dark Carbon' },
    { id: 'white', label: 'Clean White' },
    { id: 'poster', label: 'Race Poster' }
  ],
  'WorkoutCardGenerator.tsx': [
    { id: 'coach', label: 'Coach Board' },
    { id: 'track', label: 'Track Session' },
    { id: 'minimal', label: 'Minimal Program' }
  ],
  'RaceSplitGenerator.tsx': [
    { id: 'table', label: 'Performance Table' },
    { id: 'plan', label: 'Race Plan' },
    { id: 'carbon', label: 'Dark Carbon' }
  ],
  'PaceBandGenerator.tsx': [
    { id: 'wristband', label: 'Wristband' },
    { id: 'lockscreen', label: 'Phone Lockscreen' },
    { id: 'printable', label: 'Printable A4' }
  ],
  'DamageReportGenerator.tsx': [
    { id: 'brutal', label: 'Brutal Report' },
    { id: 'receipt', label: 'Dark Receipt' },
    { id: 'neon', label: 'Neon Damage' }
  ],
  'RaceBibGenerator.tsx': [
    { id: 'classic', label: 'Classic Bib' },
    { id: 'elite', label: 'Elite Bib' },
    { id: 'minimal', label: 'Minimal Bib' }
  ],
  'RaceChecklistGenerator.tsx': [
    { id: 'raceday', label: 'Race Day' },
    { id: 'minimal', label: 'Minimal Packing' },
    { id: 'dark', label: 'Dark Utility' }
  ],
  'SportsCertificateGenerator.tsx': [
    { id: 'classic', label: 'Certificate Classic' },
    { id: 'survival', label: 'Survival Certificate' },
    { id: 'minimal', label: 'Minimal Award' }
  ],
  'PersonalBestGenerator.tsx': [
    { id: 'carbon', label: 'PB Dark Carbon' },
    { id: 'record', label: 'Record Board' },
    { id: 'white', label: 'Clean White' }
  ],
  'TrainingWeekGenerator.tsx': [
    { id: 'board', label: 'Weekly Board' },
    { id: 'log', label: 'Training Log' },
    { id: 'carbon', label: 'Dark Carbon Summary' }
  ],
  'GoalCardGenerator.tsx': [
    { id: 'target', label: 'Target Board' },
    { id: 'countdown', label: 'Countdown Card' },
    { id: 'minimal', label: 'Minimal Goal' }
  ],
  'ChallengeCardGenerator.tsx': [
    { id: 'community', label: 'Community Challenge' },
    { id: 'solo', label: 'Solo Mission' },
    { id: 'dark', label: 'Dark Challenge' }
  ],
  'FuelingPlanGenerator.tsx': [
    { id: 'race', label: 'Race Fuel Plan' },
    { id: 'bottle', label: 'Bottle Strategy' },
    { id: 'minimal', label: 'Minimal Nutrition' }
  ],
  'ShoeRotationGenerator.tsx': [
    { id: 'log', label: 'Shoe Log' },
    { id: 'board', label: 'Rotation Board' },
    { id: 'minimal', label: 'Minimal Gear' }
  ]
};

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let filename = path.basename(file);
  let templates = componentToTemplates[filename];
  
  if (templates) {
    // We need to replace the old template UI:
    // <div className="flex bg-surface border border-brand-border rounded overflow-hidden">
    //   {['t1', 't2', 't3'].map(t => (
    //     <button ...
    //   ))}
    // </div>
    
    // First, let's find the existing map array of strings
    const match = content.match(/\{\['[^']+',\s*'[^']+',\s*'[^']+'\]\.map\(t => \(/);
    const existingIds = match ? content.match(/\['([^']+)',\s*'([^']+)',\s*'([^']+)'\]/): null;
    
    // If the existing IDs are found, use them as the map for `templates` but with the labels.
    if (existingIds) {
      // Create the new JSX
      let newJSX = `          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
            {[
              { id: '${existingIds[1]}', label: '${templates[0].label}' },
              { id: '${existingIds[2]}', label: '${templates[1].label}' },
              { id: '${existingIds[3]}', label: '${templates[2].label}' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={\`px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap transition-colors cursor-pointer border rounded-full shrink-0
                  \${template === t.id ? 'border-secondary-lime text-secondary-lime bg-secondary-lime/10' : 'border-brand-border text-text-muted hover:border-primary-coral hover:text-text-primary'}\`}
              >
                {t.label}
              </button>
            ))}
          </div>`;

      // Replace the entire old div block
      content = content.replace(/<div className="flex bg-surface border border-brand-border rounded overflow-hidden">[\s\S]*?<\/button>\s*\)\)}\s*<\/div>/, newJSX);
    }
  }

  // Replace watermark
  content = content.replace(/RunCard Studio \/\/ stable-mvp/g, 'made with RunCard Studio');
  
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
