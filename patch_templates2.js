const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

const objAdditions = `,
              { id: 'carbon grid', label: 'Carbon Grid' },
              { id: 'race poster pro', label: 'Race Poster Pro' },
              { id: 'minimal white', label: 'Minimal White' },
              { id: 'split panel', label: 'Split Panel' },
              { id: 'neon edge', label: 'Neon Edge' },
              { id: 'print utility', label: 'Print Utility' },
              { id: 'compact story', label: 'Compact Story' }`;

const strAdditions = `,
              'carbon grid',
              'race poster pro',
              'minimal white',
              'split panel',
              'neon edge',
              'print utility',
              'compact story'`;

let allSuccess = true;

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  if (!content.includes('SharedTemplates')) {
    content = content.replace(/import {[^}]+} from "lucide-react";\n|import\s+[^;]+;\n/, match => {
       return `import SharedTemplates from './SharedTemplates';\n` + match;
    });
  }

  const mapMatch = content.match(/(\n\s*)]\.map\(\s*\(?t\s*(?:=>|=|{)/);
  if (mapMatch) {
    const isObject = content.slice(mapMatch.index - 100, mapMatch.index).includes('{ id:');
    const insertString = isObject ? objAdditions : strAdditions;
    
    // mapMatch[1] holds the newline + spaces + "]"
    const textBeforeBracket = mapMatch[1].slice(0, -1);
    
    // Replace the matched portion with: textBeforeBracket + insertString + "\n" + spaces + "].map("
    // Actually, just replace `mapMatch[1]` with `textBeforeBracket + insertString + textBeforeBracket + "]"`!
    const newPre = textBeforeBracket + insertString + textBeforeBracket + "]";
    
    content = content.slice(0, mapMatch.index) + newPre + content.slice(mapMatch.index + mapMatch[1].length);
  } else {
    console.log(file, 'could not find templates array!');
    allSuccess = false;
  }

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

  if (finalClose !== -1) {
    const componentName = file.replace('.tsx', '');
    const isPaceBand = componentName === 'PaceBandGenerator';
    const extraDataStr = isPaceBand ? 'extraData={{ splits: typeof calculateSplits === "function" ? calculateSplits() : undefined }}' : '';
    
    const injection = `
           {['carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (
             <SharedTemplates template={template} formData={formData} componentName="${componentName}" ${extraDataStr} />
           )}`;
           
    if (!lines[finalClose - 1].includes('SharedTemplates')) {
      lines.splice(finalClose, 0, injection);
    }
    fs.writeFileSync('app/studio/components/' + file, lines.join('\n'));
  } else {
    console.log(file, 'could not find previewRef end');
    allSuccess = false;
  }
}
console.log("Success:", allSuccess);
