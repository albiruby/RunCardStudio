const fs = require('fs');
let c = fs.readFileSync('app/studio/components/ChallengeCardGenerator.tsx', 'utf8');
c = c.replace(/<span className="block text-\[10px\] font-mono text-gray-400 uppercase tracking-widest mb-1">Target<\/span>/, 'app/studio/components/PaceBandGenerator.tsx\n<span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Target</span>');
fs.writeFileSync('app/studio/components/ChallengeCardGenerator.tsx', c);

let f = fs.readFileSync('app/studio/components/FuelingPlanGenerator.tsx', 'utf8');
f = f.replace(/<div className="mt-auto border-t border-gray-200 pt-6">/, 'app/studio/components/PaceBandGenerator.tsx\n<div className="mt-auto border-t border-gray-200 pt-6">');
fs.writeFileSync('app/studio/components/FuelingPlanGenerator.tsx', f);
