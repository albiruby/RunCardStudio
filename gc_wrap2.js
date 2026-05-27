const fs = require('fs');
let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8').split('\n');

gc[405] = `                  <div className="h-full flex flex-col py-2">`;
gc[404] = `            {template === 'minimal goal' && (<>`;

fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc.join('\n'));
