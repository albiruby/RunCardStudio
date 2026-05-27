const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  // 1. Remove the broken injection block
  const brokenInjectionRegex = /\s*\{\['carbon grid'[\s\S]*?<SharedTemplates[\s\S]*?\/>\s*\)\}\n*/g;
  content = content.replace(brokenInjectionRegex, '');

  const lines = content.split('\n');
  
  // The line we are looking for is `)}            </div>` or `              )}` followed by `            </div>`.
  // Because it was originally a clean file (since we removed the injection).
  
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
    
    const injection = `           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="${componentName}" ${extraDataStr} />
           )}`;
    
    // finalClose contains the `</div>`. Check if it also contains `)}`
    if (lines[finalClose].includes(')}')) {
       // e.g. `               )}            </div>`
       // We replace this line with `               )}\n` + injection + `\n            </div>`
       let parts = lines[finalClose].split('</div>');
       lines[finalClose] = parts[0].trimEnd() + '\n' + injection + '\n' + ' '.repeat(expectedIndentLength) + '</div>' + parts[1];
    } else {
       // it's just `</div>`. We can insert right before it.
       lines.splice(finalClose, 0, injection);
    }
    
    fs.writeFileSync('app/studio/components/' + file, lines.join('\n'));
    console.log('Fixed', file, 'injection at line', finalClose);
  } else {
    console.log('Failed to parse depth in', file);
  }
}
