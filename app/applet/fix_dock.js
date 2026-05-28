const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // We want to add `style={isActive ? { backgroundColor: activeAccent.hex } : undefined}` exactly on the <button key={ratio.id} ...> inside the ratio dock.
  // if it's missing.
  if (content.includes('localStorage.setItem(\'runcard-default-export-size\', ratio.id);')) {
    if (!content.includes('style={isActive ? { backgroundColor: activeAccent.hex } : undefined}')) {
      content = content.replace(
        /(<button[^>]*key=\{ratio\.id\}[^>]*)(>[\s\S]*?\{ratio\.label\})/,
        '$1 style={isActive ? { backgroundColor: activeAccent.hex } : undefined}$2'
      );
      changed = true;
    }
    
    // Fix font-extrabold font-extrabold
    content = content.replace(/font-extrabold font-extrabold/g, 'font-extrabold');
  }

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated dock style in ${file}`);
  }
});
console.log('Dock fix done!');
