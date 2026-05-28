const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx') || f === 'StudioPageShell.tsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix draft exportSize
  const oldDraftExportSize = "exportSize: typeof window !== 'undefined' ? localStorage.getItem('runcard-default-export-size') || \"square\" : \"square\",";
  content = content.replace(oldDraftExportSize, "exportSize: typeof exportSize !== 'undefined' ? exportSize : \"square\",");

  // Fix ratio click saving to localStorage
  content = content.replace(/localStorage\.setItem\('runcard-default-export-size',\s*ratio\.id\);\n?/g, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated export size logic in ${file}`);
});
