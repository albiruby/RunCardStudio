const fs = require('fs');

let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8').split('\n');
let watermarkLine = gc[441];
let divLine = gc[442];
gc[441] = divLine;
gc[442] = watermarkLine;
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc.join('\n'));

// Let's also check if I did this in PaceBand, ChallengeCard, etc.
// But they already passed! So maybe they were already wrapped in <>!
