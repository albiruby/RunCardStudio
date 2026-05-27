const fs = require('fs');
const babel = require('@babel/parser');

let file = 'app/studio/components/PersonalBestGenerator.tsx';
let content = fs.readFileSync(file, 'utf8');
let idx = content.lastIndexOf('           )}');
let core = content.substring(0, idx + 13);
let tail = '\n  );\n}';

function checkSyntax(code) {
    try {
        babel.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
        return true;
    } catch(e) {
        return false;
    }
}

let fixed = false;
let attempt = core;
for (let i = 0; i < 15; i++) {
    if (checkSyntax(attempt + tail)) {
        console.log('Fixed PB with ' + i + ' divs');
        fs.writeFileSync(file, attempt + tail);
        fixed = true;
        break;
    }
    attempt += '\napp/studio/components/PaceBandGenerator.tsx';
}
if (!fixed) console.log('Failed PB');
