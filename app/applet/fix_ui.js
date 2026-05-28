const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add hook import if missing
  if (!content.includes('useTemplateAccent')) {
    content = content.replace(/import TemplateSelector.*?;/, "import TemplateSelector, { useTemplateAccent, ACCENTS } from './TemplateSelector';");
    changed = true;
  } else if (!content.includes('ACCENTS')) {
    content = content.replace(/useTemplateAccent(\s*\}?)/, "useTemplateAccent, ACCENTS$1");
    changed = true;
  }

  // 2. Add hook usage if missing
  if (!content.includes('const activeAccentId = useTemplateAccent();')) {
    content = content.replace(/const exportSize = useExportSize\(\);/,
      "const exportSize = useExportSize();\n  const activeAccentId = useTemplateAccent();\n  const activeAccent = ACCENTS.find(a => a.id === activeAccentId) || ACCENTS[0];");
    changed = true;
  }

  // 3. Fix left sidebar icons (Eye, FileText, etc. colored to activeAccent.hex if they were fixed to secondary-lime or coral depending)
  content = content.replace(/<([A-Za-z0-9]+)\s+className="([^"]*)text-secondary-lime([^"]*)"\s*\/>/g, '<$1 className="$2$3" style={{ color: activeAccent.hex }} />');
  content = content.replace(/<([A-Za-z0-9]+)\s+className="([^"]*)text-primary-coral([^"]*)"\s*\/>/g, '<$1 className="$2$3" style={{ color: activeAccent.hex }} />');


  // 4. Fix COPY button (often has text-secondary-lime, border-secondary-lime, hover:bg-secondary-lime/10)
  content = content.replace(
    /<button([^>]*)onClick=\{handleCopy(?:Caption)?\}([^>]*)className="([^"]*)bg-transparent hover:bg-(?:secondary-lime|primary-coral)\/10 border border-(?:secondary-lime|primary-coral) text-(?:secondary-lime|primary-coral)([^"]*)"([^>]*)>/g,
    (match, p1, p2, p3, p4, p5) => {
      // Find copy class inside it and fix it
      let newClass = `${p3.trim()} bg-transparent border hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${p4.trim()}`.replace(/\s+/g, ' ');
      if (!newClass.includes('rounded-lg')) {
        newClass = newClass.replace('rounded', 'rounded-lg');
      }
      if (!newClass.includes('py-2.5')) {
        newClass = newClass.replace('py-2', 'py-2.5');
      }
      newClass = newClass.replace('text-sm', 'text-xs tracking-wider');

      return `<button${p1}onClick={handleCopy${match.includes('handleCopyCaption') ? 'Caption' : ''}}${p2}className="${newClass}" style={{ borderColor: activeAccent.hex, color: activeAccent.hex }}${p5}>`;
    }
  );

  // same for SAVE DRAFT button to upgrade to match
  content = content.replace(
    /<button([^>]*)onClick=\{\(\) => saveCurrentDraft\(\)\}([^>]*)className="([^"]*)py-2([^"]*)rounded([^"]*)text-sm([^"]*)"/g,
    `<button$1onClick={() => saveCurrentDraft()}$2className="$3py-2.5$4rounded-lg$5text-xs tracking-wider$6"`
  );

  // 5. Fix Ratio Dock buttons
  if (content.includes('bg-secondary-lime text-black shadow-[0_0_8px_rgba(160,204,0,0.4)] font-extrabold') || content.includes('bg-primary-coral text-white shadow')) {
    // Check if it already has style={isActive ? { backgroundColor: activeAccent.hex } : undefined}
    if (!content.includes('style={isActive ? { backgroundColor: activeAccent.hex } : undefined}')) {
      content = content.replace(
        /className=\{`px-2\.5 py-1 rounded-full([^{]*)`\}/g,
        `className={\`px-2.5 py-1 rounded-full$1\`}\n                  style={isActive ? { backgroundColor: activeAccent.hex } : undefined}`
      );
      changed = true;
    }
  }
  
  if (content.includes('bg-secondary-lime')) {
    // replace `bg-secondary-lime text-black shadow-[0_0_8px_rgba(160,204,0,0.4)] font-extrabold`
    content = content.replace(/bg-secondary-lime text-black shadow-\[0_0_8px_rgba\(160,204,0,0\.4\)\] /g, 'text-black font-extrabold ');
    changed = true;
  }

  // Also catch occurrences where the icon inside COPY button was not matched
  content = content.replace(/<Copy className="([^"]*)text-(?:secondary-lime|primary-coral)([^"]*)" \/>/g, '<Copy className="$1$2" style={{ color: activeAccent.hex }} />');

  if (content !== fs.readFileSync(filePath, 'utf8')) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done!');
