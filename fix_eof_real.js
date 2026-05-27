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
  'PersonalBestGenerator.tsx'
];

for (let file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  let match = content.match(/(\s*\);\s*\n\s*\}.*)$/s);
  if (!match) continue;
  
  let core = content.substring(0, match.index);
  let tail = match[1];

  let fixed = false;
  let attempt = core;
  for (let i = 0; i < 15; i++) { // try up to 15 divs
      if (checkSyntax(attempt + tail)) {
          fs.writeFileSync('app/studio/components/' + file, attempt + tail);
          console.log('Fixed ' + file + ' with ' + i + ' missing divs');
          fixed = true;
          break;
      }
      attempt += '\napp/studio/components/PaceBandGenerator.tsx';
  }
  if (!fixed) {
      console.log('Failed ' + file);
  }
}
