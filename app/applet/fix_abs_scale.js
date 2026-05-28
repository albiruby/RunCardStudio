const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the wrapping div with scale
  // Match:
  // <div 
  //   style={{ 
  //     transform: `scale(${scale})`, 
  //     transformOrigin: "center",
  //     transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)" 
  //   }}
  //   className="shrink-0"
  // >
  
  const oldStr = /<div\s+style=\{\{\s*transform:\s*`scale\(\$\{scale\}\)`,\s*transformOrigin:\s*"center",\s*transition:\s*"transform 0\.15s cubic-bezier\(0\.16, 1, 0\.3, 1\)"\s*\}\}\s+className="shrink-0"\s*>/g;

  let newStr = `<div 
            style={{ 
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: \`translate(-50%, -50%) scale(\$\{scale\})\`, 
              transformOrigin: 'center center',
              transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)" 
            }}
          >`;

  let newContent = content.replace(oldStr, newStr);

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
