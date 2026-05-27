const fs = require('fs');

function checkTags(file) {
  const content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  const lines = content.split('\n');
  const stack = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // extremely naive but helpful approach
    let match;
    const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
    
    // Ignore self-closing tags and tags without attributes just ending in /> 
    // And standard html self closing
    const selfClosing = ['input', 'img', 'hr', 'br', 'Path', 'circle', 'svg'];
    
    while ((match = tagRegex.exec(line)) !== null) {
      if (match[0].endsWith('/>')) continue;
      
      const tagName = match[1];
      if (selfClosing.includes(tagName)) continue;
      
      const isClosing = match[0].startsWith('</');
      
      if (!isClosing) {
         stack.push({ tag: tagName, line: i + 1 });
      } else {
         if (stack.length === 0) {
            console.log(file, 'Unexpected closing tag', match[0], 'at line', i + 1);
            return;
         }
         const last = stack.pop();
         if (last.tag !== tagName) {
            console.log(file, 'Mismatched closing tag', match[0], 'Expected </' + last.tag + '>. Opened at line', last.line, 'Closed at', i+1);
            // return;
         }
      }
    }
    
    // also track Fragments
    const fragMatches = line.match(/<\/?\>/g) || [];
    // wait, <> is /<>/, </> is /<\/>/
    const opens = (line.match(/<>/g) || []).length;
    const closes = (line.match(/<\/>/g) || []).length;
    for(let j=0; j<opens; j++) stack.push({ tag: 'Fragment', line: i+1 });
    for(let j=0; j<closes; j++) {
       if (stack.length > 0 && stack[stack.length-1].tag === 'Fragment') stack.pop();
       else console.log(file, 'Mismatched fragment close at', i+1);
    }
  }
  
  if (stack.length > 0) {
    console.log(file, 'Unclosed tags:', stack.map(s => s.tag + ' at ' + s.line));
  }
}

const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');
for (const f of files) checkTags(f);
