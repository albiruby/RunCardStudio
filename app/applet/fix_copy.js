const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix COPY * button
  content = content.replace(
    /<button([^>]*)onClick=\{handleCopy[A-Za-z0-9]*\}([^>]*)className="([^"]*)bg-transparent hover:bg-secondary-lime\/10 border border-secondary-lime text-secondary-lime([^"]*)"([^>]*)>/g,
    (match, p1, p2, p3, p4, p5) => {
      let newClass = `${p3.trim()} bg-transparent border hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${p4.trim()}`.replace(/\s+/g, ' ');
      if (!newClass.includes('rounded-lg')) {
        newClass = newClass.replace('rounded', 'rounded-lg');
      }
      if (!newClass.includes('py-2.5')) {
        newClass = newClass.replace('py-2', 'py-2.5');
      }
      newClass = newClass.replace('text-sm', 'text-xs tracking-wider');

      // extract the true onClick
      const onClickMatch = match.match(/onClick=\{([^\}]+)\}/);
      const onClickFn = onClickMatch ? onClickMatch[1] : 'handleCopy';

      return `<button${p1}onClick={${onClickFn}}${p2}className="${newClass}" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}${p5}>`;
    }
  );

  // Fix COPY * button (if duplicated classes happened like 'rounded-lg text-xs tracking-wider font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]'
  let cChanged = content.replace(/transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-\[0\.98\]/g, 'transition-all');
  // but wait we want one set. It's safe to just clean up the class string for all of them so it's neat.
  
  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated copy button in ${file}`);
  }
});

console.log('Copy button fix done!');
