const fs = require('fs');
let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8').split('\n');
// At line 402, it says `                 </div>` which should be `</>`
if (gc[401].includes('                 </div>')) {
    gc[401] = '                 </>'; // array is 0-indexed
} else {
    // Just replace the first </div> before )} that corresponds to line 402
    gc[401] = gc[401].replace('</div>', '</>');
}
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc.join('\n'));

