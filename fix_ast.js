const fs = require('fs');
const babel = require('@babel/parser');

const filesToFix = [
  'ChallengeCardGenerator.tsx',
  'FuelingPlanGenerator.tsx',
  'GoalCardGenerator.tsx',
  'PaceBandGenerator.tsx',
  'PersonalBestGenerator.tsx'
];

const checkSyntax = (code) => {
    try {
        babel.parse(code, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });
        return true;
    } catch (e) {
        return false;
    }
}

const fixSuffixes = [
    '',
    '\napp/studio/components/PaceBandGenerator.tsx\n)}',
    '\n</>\n)}',
    '\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\n)}',
    '\napp/studio/components/PaceBandGenerator.tsx\n</>\n)}',
    '\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\n)}',
    '\n</>\napp/studio/components/PaceBandGenerator.tsx\n)}',
    '\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\n</>\n)}',
    '\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\napp/studio/components/PaceBandGenerator.tsx\n)}',
    '\n)}',
    '\napp/studio/components/PaceBandGenerator.tsx',
    '\n</>'
];

const postSuffix = '\n           {[' + "'carbon grid', 'race poster pro', 'minimal white', 'split panel', 'neon edge', 'print utility', 'compact story'].includes(template) && (\n             <SharedTemplates template={template} formData={formData} componentName=\"$$$NAME$$\" $$$EXTRA$$ />\n           )\n      }\n      app/studio/components/PaceBandGenerator.tsx\n    app/studio/components/PaceBandGenerator.tsx\n  );\n}";


for (const file of filesToFix) {
    let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
    let compName = file.replace('.tsx', '');
    
    // Find index of SharedTemplates
    let idx = content.lastIndexOf('SharedTemplates');
    if (idx === -1) idx = content.length;
    let lines = content.substring(0, idx).split('\n');
    let base = lines.slice(0, lines.length - 2).join('\n'); // drop the line containing the '{[carbon grid... it might be split
    let backupIdx = base.lastIndexOf(')}');
    if (backupIdx !== -1) {
        let cleanBase = base.substring(0, backupIdx);
        
        let extraData = '';
        if (content.includes('calculateSplits()')) {
            extraData = 'extraData={{ splits: typeof calculateSplits === "function" ? calculateSplits() : undefined }}';
        }
        
        let solved = false;
        for (let suffix of fixSuffixes) {
            let attempt = cleanBase + suffix + postSuffix.replace('$$$NAME$$', compName).replace('$$$EXTRA$$', extraData);
            if (checkSyntax(attempt)) {
                fs.writeFileSync('app/studio/components/' + file, attempt);
                console.log('Fixed ' + file + ' with suffix ' + suffix.replace(/\n/g, '\\n'));
                solved = true;
                break;
            }
        }
        if (!solved) {
            console.log('Could not solve ' + file);
        }
    }
}
