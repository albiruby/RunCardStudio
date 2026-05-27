const fs = require('fs');

const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

let allGood = true;

for (const file of files) {
  const content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  const lines = content.split('\n');
  
  let refLine = -1;
  let refIndent = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('ref={previewRef}')) {
      refLine = i;
      refIndent = lines[i].search(/\S/);
      break;
    }
  }

  if (refLine === -1) {
    console.log(file, 'no previewRef');
    allGood = false;
    continue;
  }

  // usually it's <div ref={previewRef} ... OR it's <div
  //  ref={previewRef}
  // Let's find the closing div with exact same indent
  // Wait, if it's `<div` on line x, and `ref={previewRef}` on line x+1, the indent of `<div` is what matters.
  // We can just find `<div` immediately before or on the same line.
  
  let openingDivLine = refLine;
  while (openingDivLine >= 0 && !lines[openingDivLine].includes('<div')) {
    openingDivLine--;
  }
  const expectedIndent = lines[openingDivLine].search(/\S/);

  let closingLine = -1;
  for (let i = refLine; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(new RegExp('^ {' + expectedIndent + '}<\/div>'))) {
      closingLine = i;
      // Keep going to find the Last one, or break? 
      // Wait, there might be nested elements with the same indent? Unlikely if properly formatted, but possible.
      // Actually, we should count open/close divs roughly? No, let's just find the first matching indent closing tag.
      // Or just look from the bottom up! The first app/studio/components/PaceBandGenerator.tsx with that indent is probably it if it's well-formatted. Let's look bottom up.
    }
  }

  let finalClose = -1;
  for (let i = lines.length - 1; i > refLine; i--) {
     if (lines[i].match(new RegExp('^ {' + expectedIndent + '}<\/div>'))) {
        finalClose = i;
        break;
     }
  }

  console.log(file, 'expected indent:', expectedIndent, 'final closing tag at line:', finalClose);
  if (finalClose === -1) allGood = false;
}
console.log("All good?", allGood);
