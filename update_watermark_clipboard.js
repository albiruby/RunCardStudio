const fs = require('fs');
const path = require('path');

const dir = 'app/studio/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace watermark in clipboard copy array
  content = content.replace(/"Made with RunCard Studio\."/g, "(typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off') ? '' : 'Made with RunCard Studio.'");
  content = content.replace(/`\\nMade with RunCard Studio\.`/g, "(typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off') ? '' : '\\nMade with RunCard Studio.'");
  content = content.replace(/`Made with RunCard Studio\.`/g, "(typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off') ? '' : 'Made with RunCard Studio.'");

  fs.writeFileSync(file, content);
  console.log(`Processed ${file}`);
});
