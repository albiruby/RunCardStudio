const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the interface name first
  const interfaceRegex = /interface\s+(\w+Props)\s+\{/i;
  const match = content.match(interfaceRegex);

  if (match) {
    const propsType = match[1];
    const componentNameMatch = content.match(/export default function (\w+Generator)\s*\(/);
    if (componentNameMatch) {
      const componentName = componentNameMatch[1];
      
      content = content.replace(
        /export default function \w+Generator\(props: any\)\s*\{/g, 
        `export default function ${componentName}({ previewRef, showToast }: ${propsType}) {`
      );

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Restored props for ${file} using ${propsType}`);
    }
  } else {
    // some might not have interface, e.g. RunReceiptProps? 
    // Wait, all of them have an interface. Let's trace.
    console.log(`No interface found in ${file}`);
  }
});
