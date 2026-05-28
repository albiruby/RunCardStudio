const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/const unit = getUnit\(\);\n\s*const unit = getUnit\(\);/g, 'const unit = getUnit();');

  fs.writeFileSync(filePath, content, 'utf8');
});
