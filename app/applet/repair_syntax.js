const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the broken onClick signature
  content = content.replace(
    /onClick=\{\(\) = style=\{isActive \? \{ backgroundColor: activeAccent\.hex \} : undefined\}> \{/g,
    'onClick={() => {'
  );

  // Add style prop back properly if it's missing (it was removed by the above fix)
  if (content.includes('localStorage.setItem(\'runcard-default-export-size\', ratio.id);')) {
    if (!content.includes('style={isActive ? { backgroundColor: activeAccent.hex } : undefined}')) {
      content = content.replace(
        /(className=\{`px-2\.5 py-1 rounded-full[^`]*`\})/,
        '$1\n                  style={isActive ? { backgroundColor: activeAccent.hex } : undefined}'
      );
    }
  }

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Repaired syntax in ${file}`);
  }
});

console.log('Syntax repair done!');
