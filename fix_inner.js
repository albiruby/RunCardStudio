const fs = require('fs');

let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8');
gc = gc.replace(/<\/>\s*\n\s*<\/div>\s*\n\s*\)\}/, 'app/studio/components/PaceBandGenerator.tsx\n               )}');
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc);

let pb = fs.readFileSync('app/studio/components/PersonalBestGenerator.tsx', 'utf8');
pb = pb.replace(/<div className="mt-6 text-left text-\[9px\] font-mono tracking-widest text-gray-400 uppercase">\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/div>\s*<\/>\s*\)\}/, 
`<div className="mt-6 text-left text-[9px] font-mono tracking-widest text-gray-400 uppercase">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}app/studio/components/PaceBandGenerator.tsx
                 app/studio/components/PaceBandGenerator.tsx
               )}`);
fs.writeFileSync('app/studio/components/PersonalBestGenerator.tsx', pb);

