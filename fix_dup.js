const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  // Find all occurrences of the injected block string
  const blockStartStr = "{['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (";
  
  const occurrences = content.split(blockStartStr).length - 1;
  
  if (occurrences > 1) {
    // Keep only the first occurrence, or just remove duplicates
    // We can do this by splitting the content using a regex that captures the whole block,
    // and then ensuring we only keep one.
    
    // The block is:
    //            {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
    //              <SharedTemplates template={template} formData={formData} componentName="XXX" [optional extraData] />
    //            )}
    
    // A robust regex to match the block:
    const regex = /\s*\{\['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'\]\.includes\(template\) && \(\s*<SharedTemplates template=\{template\} formData=\{formData\} componentName="[^"]+"[^>]*\/>\s*\)\}\n*/g;
    
    let matches = content.match(regex);
    if (matches && matches.length > 1) {
      // Remove ALL OF THEM
      content = content.replace(regex, '');
      // Insert one of them exactly where the first one was!
      // But we just removed them. Where do they go? Before the closing div
      // Let's use the code from patch3 to find the final closing div and insert it again safely.
      
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
      for (let i = lines.length - 1; i > refLine; i--) {
         if (lines[i].match(new RegExp('^ {' + expectedIndentLength + '}<\/div>'))) {
            finalClose = i;
            break;
         }
      }
      
      const componentName = file.replace('.tsx', '');
      const isPaceBand = componentName === 'PaceBandGenerator';
      const extraDataStr = isPaceBand ? 'extraData={{ splits: typeof calculateSplits === "function" ? calculateSplits() : undefined }}' : '';
      const injection = `
           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="${componentName}" ${extraDataStr} />
           )}`;
           
      lines.splice(finalClose, 0, injection);
      content = lines.join('\n');
      fs.writeFileSync('app/studio/components/' + file, content);
      console.log('Fixed duplicates in ' + file);
    }
  }
}
