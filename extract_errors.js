const fs = require('fs');

const files = [
  'FuelingPlanGenerator.tsx',
  'GoalCardGenerator.tsx',
  'PaceBandGenerator.tsx',
  'PersonalBestGenerator.tsx',
  'RaceBibGenerator.tsx',
  'RaceChecklistGenerator.tsx',
  'RaceRecapGenerator.tsx',
  'RaceSplitGenerator.tsx',
  'RunReceiptGenerator.tsx',
  'ShoeRotationGenerator.tsx',
  'SportsCertificateGenerator.tsx',
  'TrainingWeekGenerator.tsx',
  'WorkoutCardGenerator.tsx'
];

for (const f of files) {
   const c = fs.readFileSync('app/studio/components/' + f, 'utf8');
   const lines = c.split('\n');
   // find consecutive `</div>` and `)}` issues
   // just print lines 360-400 roughly, we know the exact lines from lint!
   console.log('---', f, '---');
}
