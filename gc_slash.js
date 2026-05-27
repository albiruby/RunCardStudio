const fs = require('fs');
let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8').split('\n');
// At line 402, it says `                 app/studio/components/PaceBandGenerator.tsx` which should be `</>`
if (gc[401].includes('                 app/studio/components/PaceBandGenerator.tsx')) {
    gc[401] = '                 </>'; // array is 0-indexed
} else {
    // Just replace the first app/studio/components/PaceBandGenerator.tsx before )} that corresponds to line 402
    gc[401] = gc[401].replace('app/studio/components/PaceBandGenerator.tsx', '</>');
}
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc.join('\n'));

