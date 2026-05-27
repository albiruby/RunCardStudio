const fs = require('fs');

let c = fs.readFileSync('app/studio/components/ChallengeCardGenerator.tsx', 'utf8');
c = c.replace(/<div className="absolute top-0 left-0 w-1 h-full bg-\[#ff0055\]"><\/div>\n                     <\/div>\n<span className="block text-\[10px\] font-mono text-gray-400 uppercase tracking-widest mb-1">Target<\/span>/, 
`<div className="absolute top-0 left-0 w-1 h-full bg-[#ff0055]">app/studio/components/PaceBandGenerator.tsx
                     <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Target</span>`);
fs.writeFileSync('app/studio/components/ChallengeCardGenerator.tsx', c);

let f = fs.readFileSync('app/studio/components/FuelingPlanGenerator.tsx', 'utf8');
// fuel plan had <div className="mt-auto border-t border-gray-200 pt-6"> I prepended app/studio/components/PaceBandGenerator.tsx
// let's check it manually before fixing.
