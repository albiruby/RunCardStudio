const fs = require('fs');

const fixFile = (file, compName, fixTailCallback) => {
    let lines = fs.readFileSync('app/studio/components/' + file, 'utf8').split('\n');
    let idx = lines.findIndex(l => l.includes('SharedTemplates template={template}'));
    if (idx === -1) {
        console.log('Could not find SharedTemplates in ' + file);
        return;
    }
    
    let validEnd = lines.slice(0, idx - 1).join('\n');
    validEnd = fixTailCallback(validEnd);
    
    let extraDataMatch = lines[idx].match(/extraData=\{.*\}/);
    let extraData = extraDataMatch ? ' ' + extraDataMatch[0] : '';
    
    let expected = validEnd + '\n' +
    '           {[\'carbon grid\', \'race poster pro\', \'minimal white\', \'split panel\', \'neon edge\', \'print utility\', \'compact story\'].includes(template) && (\n' +
    '             <SharedTemplates template={template} formData={formData} componentName=\"'+compName+'\"'+extraData+'  />\n' +
    '           )}\n' +
    '      </div>\n' +
    '    </div>\n' +
    '  );\n' +
    '}\n';
    fs.writeFileSync('app/studio/components/' + file, expected);
    console.log('Fixed ' + file);
}

fixFile('ChallengeCardGenerator.tsx', 'ChallengeCardGenerator', (text) => {
    return text.replace(/<\/>\s*\)\}\s*$/, '</div>\n)}').replace(/\)\}\s*$/, '</div>\n)}');
});
fixFile('FuelingPlanGenerator.tsx', 'FuelingPlanGenerator', (text) => {
    let t = text.replace(/<\/>\s*\)\}\s*$/, '</div>\n)}');
    t = t.replace(/<\/div>\s*\)\}\s*$/, '</>\n)}');
    return t;
});
fixFile('GoalCardGenerator.tsx', 'GoalCardGenerator', (text) => {
    let t = text.replace(/<\/>\s*\)\}\s*$/, '');
    t = t.replace(/\)\}\s*$/, '');
    t = t.trim();
    if (!t.endsWith('</div>')) t += '\n</div>';
    t += '\n)}';
    return t;
});
fixFile('PaceBandGenerator.tsx', 'PaceBandGenerator', (text) => {
    let lines = text.split('\n');
    let scaleLineIdx = lines.findIndex(l => l.includes('Scale: '));
    if (scaleLineIdx !== -1) {
        let snippet = lines.slice(0, scaleLineIdx - 1).join('\n');
        snippet = snippet.replace(/\)\}\s*$/, '</div>\n)}');
        
        let scaleDiv = lines.slice(scaleLineIdx - 1).join('\n');
        scaleDiv = scaleDiv.replace(/<\/div>\s*<\/div>\s*\}\)\s*$/, '</div>');
        scaleDiv = scaleDiv.replace(/\)\}\s*$/, '');
        
        return snippet + '\n' + scaleDiv;
    }
    return text;
});
fixFile('PersonalBestGenerator.tsx', 'PersonalBestGenerator', (text) => {
    let t = text.trim();
    if (t.endsWith(')}')) {
        t = t.substring(0, t.lastIndexOf(')}')).trim();
    }
    if (t.endsWith('</div>')) {
        t = t.substring(0, t.lastIndexOf('</div>')).trim();
    }
    return t + '\n</div>\n)}';
});
