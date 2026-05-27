const fs = require('fs');

function replaceLine(filePath, lineNum, newText) {
    let lines = fs.readFileSync(filePath, 'utf8').split('\n');
    lines[lineNum - 1] = newText;
    fs.writeFileSync(filePath, lines.join('\n'));
}

replaceLine('app/studio/components/GoalCardGenerator.tsx', 361, '                         &quot;{formData.motivation}&quot;</div>)}');
replaceLine('app/studio/components/GoalCardGenerator.tsx', 362, '                   </>');

replaceLine('app/studio/components/PersonalBestGenerator.tsx', 409, '                         </div>');
replaceLine('app/studio/components/PersonalBestGenerator.tsx', 410, '                       )}');
replaceLine('app/studio/components/PersonalBestGenerator.tsx', 411, '                    </div>');
replaceLine('app/studio/components/PersonalBestGenerator.tsx', 412, '                 </>');
replaceLine('app/studio/components/PersonalBestGenerator.tsx', 413, '               )}');
replaceLine('app/studio/components/PersonalBestGenerator.tsx', 414, '');
