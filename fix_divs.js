const fs = require('fs');

let c = fs.readFileSync('app/studio/components/ChallengeCardGenerator.tsx', 'utf8');
c = c.replace(/<\/div>\n<span className="block text-\[10px\] font-mono text-gray-400 uppercase tracking-widest mb-1">Target<\/span>/, '<span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Target</span>');
c = c.replace(/<span className="text-2xl font-black font-sans uppercase text-white">\{formData\.target \|\| '-'}<\/span>\s*<\/div>/, '<span className="text-2xl font-black font-sans uppercase text-white">{formData.target || \'-\'}</span>\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx'); // Double div if needed? Wait. Let's look at the original.
// Actually, earlier I said "inserted app/studio/components/PaceBandGenerator.tsx BEFORE the first span". Let's just fix it automatically.
