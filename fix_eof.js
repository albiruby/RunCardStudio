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
  let cleanContent = content.substring(0, content.lastIndexOf('}')); // remove final }
  // some might be missing multiple closing divs.
  let suffixes = [
     '\n}',
     '\napp/studio/components/PaceBandGenerator.tsx\n}',
     '\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\n}',
     '\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\n}',
     '\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\n}',
     '\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\n}',
     '\n</>\n}',
     '\napp/studio/components/PaceBandGenerator.tsx\n</>\n}'
  ];
  let fixed = false;
  for (let suffix of suffixes) {
      let test = cleanContent + suffix;
      if (checkSyntax(test)) {
          fs.writeFileSync('app/studio/components/' + file, test);
          console.log('Fixed ' + file + ' with suffix matching');
          fixed = true;
          break;
      }
  }
  if (!fixed) {
      console.log('Failed ' + file);
  }
}
