const fs = require('fs');
let content = fs.readFileSync('app/studio/components/RoutePosterGenerator.tsx', 'utf8');
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\${/g, '${');
fs.writeFileSync('app/studio/components/RoutePosterGenerator.tsx', content);
console.log('Fixed backslashes');
