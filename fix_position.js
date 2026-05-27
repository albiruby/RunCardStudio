const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  // 1. Remove the stranded template block at the bottom
  const strandedRegex = /\s*\{\['carbon grid'[\s\S]*?<SharedTemplates[\s\S]*?\/>\s*\)\}\n*$/;
  content = content.replace(strandedRegex, '');
  
  // But wait, what if it's not at the very end, what if it's before the last }?
  // Let's just remove ALL occurrences of the SharedTemplates injection block completely.
  const allInjectionsRegex = /\s*\{\['carbon grid'[\s\S]*?<SharedTemplates[\s\S]*?\/>\s*\)\}\n*/g;
  content = content.replace(allInjectionsRegex, '\n');

  // Now, inject it securely.
  // We want to put it right before the closing </div> of previewRef.
  // The most reliable way is: find the string `ref={previewRef}`.
  // Find the LAST `)}` after `ref={previewRef}` but before the component's final `return` closes.
  // A simple heuristic: find the last `)}` in the file.
  
  // Wait, some files have `{(formData.notes) && ( <div>...</div> )}` after the templates!
  // So the last `)}` inside `previewRef` might not be a template. BUT it's inside `previewRef`!
  // So if we just insert after the last `)}` that belongs to the previewRef content...
  // How to find the end of previewRef content?
  // Usually, the `previewRef` wraps all the templates.
  // `ref={previewRef}` is in a `<div`. We need its closing `</div>`.
  
  // Actually, we can use Babel, or we can just use the indentation!
  // Let's re-run the precise indentation calculation but properly this time.
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
  // Start from the bottom, find the first </div> with the exact expected indent.
  // Wait, if expectedIndentLength is 12, there might be OTHER </div> with 12 indent outside the previewRef?
  // Unlikely, but possible. Let's start from refLine and go FORWARD!
  // Keep track of <div and </div pairs!
  
  let depth = 0;
  for (let i = openingDivLine; i < lines.length; i++) {
    const line = lines[i];
    
    // count open divs in this line
    const opens = (line.match(/<div/g) || []).length;
    // count self-closing divs ? Rare in this codebase, but possible.
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
           
    lines.splice(finalClose, 0, injection);
    fs.writeFileSync('app/studio/components/' + file, lines.join('\n'));
    console.log('Fixed', file, 'injection at line', finalClose);
  } else {
    console.log('Failed to parse depth in', file);
  }
}
