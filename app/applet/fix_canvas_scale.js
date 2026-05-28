const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Fix grid columns layout:
  // Using \`grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)_minmax(300px,380px)]\`
  content = content.replace(
    /className="grid grid-cols-1 xl:grid-cols-\[[a-zA-Z0-9_,\(\)\-]+\]/g,
    'className="grid grid-cols-1 xl:grid-cols-[minmax(320px,420px)_minmax(0,1fr)_minmax(300px,380px)]'
  );

  // 2. Fix the flex wrapper of COLUMN 2 to fill height
  // Make sure it doesn't already have min-h-[calc(100vh
  if (!content.includes('min-h-[calc(100vh-140px)]')) {
    content = content.replace(
      /\{\/\* COLUMN 2: LIVE PREVIEW \*\/}\s*<div className="flex flex-col gap-4([^"]*)">/g,
      '{/* COLUMN 2: LIVE PREVIEW */}\n      <div className="flex flex-col gap-4$1 min-h-[calc(100vh-140px)]">'
    );
  }

  // 3. Fix the container to have flex-1
  if (!content.includes('flex-1 min-h-[500px] xl:min-h-[600px]')) {
    content = content.replace(
      /min-h-\[500px\] xl:min-h-\[550px\]/g,
      'flex-1 min-h-[500px] xl:min-h-[600px]'
    );
  }

  // 4. Overhaul the ResizeObserver
  const obsStart = 'const observer = new ResizeObserver((entries) => {';
  const obsEnd = '    observer.observe(containerRef.current);';
  
  if (content.indexOf(obsStart) !== -1 && content.indexOf(obsEnd) !== -1) {
    const beforeStr = content.substring(0, content.indexOf(obsStart));
    const afterStr = content.substring(content.indexOf(obsEnd));
    
    const newObserver = `const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        let targetW = 480;
        let targetH = 480;
        if (exportSize === "story") { targetW = 400; targetH = 711; }
        else if (exportSize === "landscape") { targetW = 640; targetH = 360; }
        else if (exportSize === "compact") { targetW = 540; targetH = 283; }
        else if (exportSize === "printable") { targetW = 595; targetH = 842; }

        // We leave 48px horizontal padding, and 100px vertical padding (for the ratio dock and top spacing)
        const scaleW = width / (targetW + 48);
        const scaleH = height / (targetH + 110);
        const newScale = Math.min(scaleW, scaleH, 1); // Cap at 1
        
        setScale(newScale);
      }
    });
`;
    content = beforeStr + newObserver + afterStr;
  }

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
console.log('Script done');
