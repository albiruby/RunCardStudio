const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace textToCopy generation
  // Old:
  // const textToCopy = lines.join("\n");
  // New:
  // if (!lines[lines.length - 1] === "") {
  //    lines.push("");
  // }
  // lines.push("Made with RunCard Studio");
  // const textToCopy = lines.join("\n");
  
  if (!content.includes('Made with RunCard Studio");\n    const textToCopy')) {
    content = content.replace(
      /const textToCopy = lines\.join\("\\n"\);/g,
      'lines.push("Made with RunCard Studio");\n    const textToCopy = lines.join("\\n");'
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated clipboard in ${file}`);
  }
});
