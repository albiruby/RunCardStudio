const fs = require('fs');
const babel = require('@babel/parser');

let file = 'app/studio/components/GoalCardGenerator.tsx';
let content = fs.readFileSync(file, 'utf8');
let stIdx = content.indexOf('<SharedTemplates');
let closeIdx = content.indexOf(')}', stIdx); 
let core = content.substring(0, closeIdx + 2); // include )}
let attempt = core;
let tail = '\n  );\n}';

for (let i = 0; i < 15; i++) {
   try {
       babel.parse(attempt + tail, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
       console.log('Success with ' + i);
       break;
   } catch(e) {
       console.log('Error with ' + i + ' divs: ', e.message);
   }
   attempt += '\napp/studio/components/PaceBandGenerator.tsx';
}
