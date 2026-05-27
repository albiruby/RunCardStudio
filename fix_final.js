const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  // This script will just aggressively fix the specific corruption we saw.
  
  // We saw:
  //            )}
  //             </div>              )}            
  //           </div>
  
  // Actually, wait! In PaceBandGenerator:
  // 578:            )}
  // 579:             </div>              )}            
  // 580:           </div>
  
  // Let's replace any `</div>\s*)}\s*` with `)}\n            </div>\n`
  // Wait, no. If it's literally `            </div>              )}            `
  const regex = /<\/div>\s*\)\}\s*/g;
  if(regex.test(content)) {
     content = content.replace(regex, ')}\n            </div>\n');
  }

  // Next, we saw in ChallengeCardGenerator:
  // 476:                  </>
  // 477:            {['carbon grid'...
  // 478:              <... />
  // 479:            )}
  // 480:                )}            </div>

  // Wait! In Challenge Card, we saw: `)}            </div>`
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
  //            </div>
  
  // Let's just use string replacement on EACH occurrence of the injection.
  // We find `{['carbon grid'...` up to its `)}`.
  // We remove it from WHEREVER it is.
  content = content.replace(/\s*\{\['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'\]\.includes\(template\) && \(\s*<SharedTemplates template=\{template\} formData=\{formData\} componentName="[^"]+"(?: extraData=\{[^}]+\})? \/>\s*\)\}\s*/g, '\n');

  // We find `</div>` that closes `previewRef`. How?
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
       // example: `             )}            </div>`
       // we want to transform this line into: `             )}`
       // and insert our block, and then append `            </div>`
       lines[finalClose] = targetStr.replace('</div>', '').trimEnd();
       const injection = `
           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="${componentName}" ${extraDataStr}/>
           )}
${' '.repeat(expectedIndentLength)}</div>`;
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
