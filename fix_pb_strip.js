const fs = require('fs');
const babel = require('@babel/parser');

function checkSyntax(code) {
    try {
        babel.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
        return true;
    } catch(e) {
        return false;
    }
}

let file = 'app/studio/components/PersonalBestGenerator.tsx';
let content = fs.readFileSync(file, 'utf8');

// Strip all ending divs
let match = content.match(/^([\s\S]*?)(\s*(<\/div>)*\s*\);\s*\n\s*\}.*)$/);
if (match) {
    let core = match[1];
    let tail = match[2].replace(/<\/div>/g, '');
    
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
} else {
    console.log('Regex match failed');
}
