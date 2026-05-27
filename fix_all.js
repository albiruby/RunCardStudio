const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');

  // Strip ALL injections so we have a clean slate to reason about
  content = content.replace(/\s*\{\['carbon grid'[\s\S]*?<SharedTemplates[\s\S]*?\/>\s*<\/div>\s*\)\}\s*/g, '\n');
  content = content.replace(/\s*\{\['carbon grid'[\s\S]*?<SharedTemplates[\s\S]*?\/>\s*\)\}\s*<\/div>\s*/g, '\n');
  content = content.replace(/\s*\{\['carbon grid'[\s\S]*?<SharedTemplates[\s\S]*?\/>\s*\)\}\s*/g, '\n');

  // The fundamental problem was that I replaced `app/studio/components/PaceBandGenerator.tsx\n)}` with `)}\napp/studio/components/PaceBandGenerator.tsx`
  // AND THEN replaced `)}\napp/studio/components/PaceBandGenerator.tsx` WITH `app/studio/components/PaceBandGenerator.tsx\n)}` in `revert_damage`.
  // So right now, all conditional templates are probably `app/studio/components/PaceBandGenerator.tsx\n)}`. Which is actually CORRECT!
  // Wait, if they are correct, why is there a syntax error?
  // Let's look at `ChallengeCardGenerator`:
  // Error: Expected '</', got '{' on line 391
  // `388 | <div ...>`
  // `389 | ... `
  // `390 | ... `
  // `391 | )}`
  // Wait! In `ChallengeCardGenerator` it said: `)}` with NO closing `app/studio/components/PaceBandGenerator.tsx`!
  // That means my `revert_damage.js` replaced `)}\n            app/studio/components/PaceBandGenerator.tsx\n` with `            app/studio/components/PaceBandGenerator.tsx\n              )}\n`.
  // Wait, what if the original was `<div ...> ... app/studio/components/PaceBandGenerator.tsx)}` (on the same line)?
  // I must be very careful.
  
  // Actually, I can just use a simple state machine to balance the divs and find out exactly what's missing, but that's hard.
  // Can I get the original source code? I have a backup of the source code? No.
  
  // Let's check `ChallengeCardGenerator` line 388-393
  // `388 |                      <div className="mt-4 pt-4 border-t border-gray-200 text-center">`
  // `389 |                        <div className="...">Rewardapp/studio/components/PaceBandGenerator.tsx`
  // `390 |                        <div className="...">{formData.reward}app/studio/components/PaceBandGenerator.tsx`
  // `391 |                      )}`
  // `392 |             app/studio/components/PaceBandGenerator.tsx`
  // `393 | </>`
  
  // Ah! Line 391 is `)}` but it NEVER CLOSED THE DIV FROM 388!
  // Because my script replaced `app/studio/components/PaceBandGenerator.tsx\n)}` with `)}\napp/studio/components/PaceBandGenerator.tsx`, and then swapped back?!
  // But line 391 `)}`, line 392 `app/studio/components/PaceBandGenerator.tsx`, so it's STILL swapped! `)}` is closing BEFORE `app/studio/components/PaceBandGenerator.tsx`!
  // Wait, why did `revert_damage.js` not fix it?
  // `revert_damage.js` searched for `\)\}\n            <\/div>\n`. (Exactly 12 spaces!).
  // But line 392 is `            app/studio/components/PaceBandGenerator.tsx` (12 spaces), and line 391 is `                     )}` (21 spaces).
  // So it matched `\)\}\n            <\/div>\n`? No, because of the 21 spaces before `)}`! It didn't match!
  
  const badOrder = /\)\}\s*<\/div>/g;
  content = content.replace(badOrder, 'app/studio/components/PaceBandGenerator.tsx\n              )}');

  // Now, what about the end of the `previewRef`?
  // The `previewRef` contains a bunch of `)}` and `app/studio/components/PaceBandGenerator.tsx`.
  // Usually it ends with `              )}\n            app/studio/components/PaceBandGenerator.tsx\n          app/studio/components/PaceBandGenerator.tsx`.
  // Let's do the indent trick again to insert the SharedTemplates.
  const lines = content.split('\n');
  let refLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('ref={previewRef}')) {
      refLine = i;
      break;
    }
  }

  let openingDivLine = refLine;
  while (openingDivLine >= 0 && !lines[openingDivLine].includes('<div')) {
    openingDivLine--;
  }
  const expectedIndentLength = lines[openingDivLine].search(/\S/);

  let finalClose = -1;
  let depth = 0;
  for (let i = openingDivLine; i < lines.length; i++) {
    const line = lines[i];
    const opens = (line.match(/<div/g) || []).length;
    const closes = (line.match(/<\/div>/g) || []).length;
    depth += opens;
    depth -= closes;
    if (depth === 0) {
      finalClose = i;
      break;
    }
  }

  if (finalClose !== -1) {
    const componentName = file.replace('.tsx', '');
    const isPaceBand = componentName === 'PaceBandGenerator';
    const extraDataStr = isPaceBand ? 'extraData={{ splits: typeof calculateSplits === "function" ? calculateSplits() : undefined }}' : '';
    
    // We insert BEFORE the finalClose app/studio/components/PaceBandGenerator.tsx.
    // If lines[finalClose] has `)}`, we'd better put it after the `)}`!
    if (lines[finalClose].includes(')}')) {
       let p = lines[finalClose].split('app/studio/components/PaceBandGenerator.tsx');
       // p[0] is `               )}`
       lines[finalClose] = p[0] + `\n           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (\n             <SharedTemplates template={template} formData={formData} componentName="${componentName}" ${extraDataStr} />\n           )}\n` + ' '.repeat(expectedIndentLength) + 'app/studio/components/PaceBandGenerator.tsx' + (p[1] || '');
    } else {
       lines.splice(finalClose, 0, `           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (\n             <SharedTemplates template={template} formData={formData} componentName="${componentName}" ${extraDataStr} />\n           )}`);
    }
    fs.writeFileSync('app/studio/components/' + file, lines.join('\n'));
    console.log('Fixed', file, 'finalClose at', finalClose);
  }
}
