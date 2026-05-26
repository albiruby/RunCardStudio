const fs = require('fs');
const path = require('path');

const dir = 'app/studio/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace watermark if it's there
  if (content.includes('made with RunCard Studio')) {
    content = content.replace(
      />\s*made with RunCard Studio\s*</g, 
      '>{typeof window !== \'undefined\' && window.localStorage.getItem(\'runcard-watermark\') === \'off\' ? \'\' : \'made with RunCard Studio\'}<'
    );
    fs.writeFileSync(file, content);
    console.log(`Updated watermark in ${file}`);
  }
});
