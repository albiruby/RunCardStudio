const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  // This script will just aggressively fix the specific corruption we saw.
  
  // We saw:
  //            )}
  //             app/studio/components/PaceBandGenerator.tsx              )}            
  //           app/studio/components/PaceBandGenerator.tsx
  
  // Actually, wait! In PaceBandGenerator:
  // 578:            )}
  // 579:             app/studio/components/PaceBandGenerator.tsx              )}            
  // 580:           app/studio/components/PaceBandGenerator.tsx
  
  // Let's replace any `app/studio/components/PaceBandGenerator.tsx\s*)}\s*` with `)}\n            app/studio/components/PaceBandGenerator.tsx\n`
  // Wait, no. If it's literally `            app/studio/components/PaceBandGenerator.tsx              )}            `
  const regex = /<\/div>\s*\)\}\s*/g;
  if(regex.test(content)) {
     content = content.replace(regex, ')}\n            app/studio/components/PaceBandGenerator.tsx\n');
  }

  // Next, we saw in ChallengeCardGenerator:
  // 476:                  </>
  // 477:            {['carbon grid'...
  // 478:              <... />
  // 479:            )}
  // 480:                )}            app/studio/components/PaceBandGenerator.tsx

  // Wait! In Challenge Card, we saw: `)}            app/studio/components/PaceBandGenerator.tsx`
  // But wait! ChallengeCard said `Expected '</', got '{'` on line 477.
  // Because my `fix_nesting.js` DID NOT CHANGE IT!
  // Why? Because in `fix_nesting.js`, I removed the injection IF it matched `brokenInjectionRegex`!
  // MAYBE `brokenInjectionRegex` FAILED TO MATCH in ChallengeCardGenerator?!
  // `/\s*\{\['carbon grid'[\s\S]*?<SharedTemplates[\s\S]*?\/>\s*\)\}\n*/g`
  // If `SharedTemplates` call was on ONE line (which it was), it matched.
  // Wait, why did it fail to match?

  // Let's just fix it fundamentally:
  // We want the end of `previewRef` to look like this:
  //               )}
  //            {['carbon grid'...]...}
  //               <SharedTemplates... />
  //            )}
  //            app/studio/components/PaceBandGenerator.tsx
  
  // Let's just use string replacement on EACH occurrence of the injection.
  // We find `{['carbon grid'...` up to its `)}`.
  // We remove it from WHEREVER it is.
  content = content.replace(/\s*\{\['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'\]\.includes\(template\) && \(\s*<SharedTemplates template=\{template\} formData=\{formData\} componentName="[^"]+"(?: extraData=\{[^}]+\})? \/>\s*\)\}\s*/g, '\n');

  // We find `app/studio/components/PaceBandGenerator.tsx` that closes `previewRef`. How?
  // We look for `ref={previewRef}` and rely on the same depth parser.
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
    const extraDataStr = isPaceBand ? 'extraData={{ splits: typeof calculateSplits === "function" ? calculateSplits() : undefined }} ' : '';
    
    // Check what is on finalClose line.
    // If it contains `)}`, we must separate them BEFORE we insert.
    let targetStr = lines[finalClose];
    if (targetStr.includes(')}')) {
       // example: `             )}            app/studio/components/PaceBandGenerator.tsx`
       // we want to transform this line into: `             )}`
       // and insert our block, and then append `            app/studio/components/PaceBandGenerator.tsx`
       lines[finalClose] = targetStr.replace('app/studio/components/PaceBandGenerator.tsx', '').trimEnd();
       const injection = `
           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="${componentName}" ${extraDataStr}/>
           )}
${' '.repeat(expectedIndentLength)}app/studio/components/PaceBandGenerator.tsx`;
       lines[finalClose] += injection;
    } else {
       const injection = `           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="${componentName}" ${extraDataStr}/>
           )}`;
       lines.splice(finalClose, 0, injection);
    }
    fs.writeFileSync('app/studio/components/' + file, lines.join('\n'));
    console.log('Fixed completely ' + file);
  }
}
