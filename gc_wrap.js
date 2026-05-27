const fs = require('fs');

let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8').split('\n');
// We need to add `<>` after line 405 (which is `{template === 'minimal goal' && (` )
// And replace line 444 with `</>)}`
gc[405] = `            {template === 'minimal goal' && (<>`;
gc[443] = gc[443] + '\n</>';
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc.join('\n'));
