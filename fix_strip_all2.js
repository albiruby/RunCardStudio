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

const files = [
  'ChallengeCardGenerator.tsx',
  'FuelingPlanGenerator.tsx',
  'GoalCardGenerator.tsx',
  'PaceBandGenerator.tsx',
  'PersonalBestGenerator.tsx' // let's run this one too just to be safe
];

for (let file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  let stIdx = content.indexOf('<SharedTemplates');
  if (stIdx === -1) { console.log('No SharedTemplates in ' + file); continue; }
  
  let closeIdx = content.indexOf(')}', stIdx); 
  if (closeIdx === -1) { console.log('No closing )} in ' + file); continue; }
  
  let core = content.substring(0, closeIdx + 2); // include )}
  let tail = '\n  );\n}';

  let fixed = false;
  let attempt = core;
  for (let i = 0; i < 15; i++) {
      if (checkSyntax(attempt + tail)) {
          fs.writeFileSync('app/studio/components/' + file, attempt + tail);
          console.log('Fixed ' + file + ' with ' + i + ' missing divs');
          fixed = true;
          break;
      }
      attempt += '\n</div>';
  }
  if (!fixed) {
      console.log('Failed ' + file + ' ...');
  }
}
