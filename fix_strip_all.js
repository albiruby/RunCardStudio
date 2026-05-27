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
  let idx = content.lastIndexOf('           )}');
  if (idx === -1) {
      console.log('Could not find marker in ' + file);
      // Wait, some might have extra spaces. Let's find SharedTemplates
      let stIdx = content.indexOf('<SharedTemplates');
      if (stIdx !== -1) {
          idx = content.indexOf(')}', stIdx); // find the closing )} after SharedTemplates
      } else {
          continue;
      }
  }
  let core = content.substring(0, idx + 2); // include )}
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
      attempt += '\napp/studio/components/PaceBandGenerator.tsx';
  }
  if (!fixed) {
      console.log('Failed ' + file + ' ... let us try adding fragments?');
  }
}
