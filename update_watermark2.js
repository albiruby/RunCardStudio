const fs = require('fs');
const path = require('path');

const dir = 'app/studio/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.match(/>\s*[M|m]ade with RunCard Studio\s*</i)) {
    content = content.replace(
      />\s*[M|m]ade with RunCard Studio\s*</ig, 
      '>{typeof window !== \'undefined\' && window.localStorage.getItem(\'runcard-watermark\') === \'off\' ? \'\' : \'made with RunCard Studio\'}<'
    );
    fs.writeFileSync(file, content);
    console.log(`Updated watermark in ${file}`);
  }
});
