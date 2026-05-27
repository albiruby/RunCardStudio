const fs = require('fs');

let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8');
gc = gc.replace(/<\/>\s*\n\s*\)\}\n\s*\{/, '</div>\n               )}\n\n           {'); // target board at 443! Wait. Line 443 is minimal goal.
// Let's just fix GoalCard 443 
gc = gc.replace(/<div className="absolute bottom-4 right-10[^>]+>\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/div>\s*<\/>\s*\)\}/, 
`<div className="absolute bottom-4 right-10 text-[8px] font-mono tracking-widest text-gray-300 uppercase">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</div>
                 </div>
               )}`);
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc);

// In PaceBandGenerator, something is missing. Let me find out exactly what.
let pace = fs.readFileSync('app/studio/components/PaceBandGenerator.tsx', 'utf8');
// Is the last template closed with )} ?
console.log('PaceBand end:');
console.log(pace.substring(pace.indexOf("{['carbon grid'") - 100, pace.indexOf("{['carbon grid'") + 20));

// FuelingPlan
let fuel = fs.readFileSync('app/studio/components/FuelingPlanGenerator.tsx', 'utf8');
console.log('FuelingPlan end:');
console.log(fuel.substring(fuel.indexOf("{['carbon grid'") - 100, fuel.indexOf("{['carbon grid'") + 20));


