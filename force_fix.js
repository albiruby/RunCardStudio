const fs = require('fs');

function forceReplaceEnd(file, matchUpTo, perfectEnding) {
    let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
    let idx = content.indexOf(matchUpTo);
    if (idx === -1) {
        console.log('Failed to find start in ' + file);
        return;
    }
    
    let endIdx = content.indexOf('SharedTemplates', idx);
    if (endIdx === -1) {
        console.log('Failed to find SharedTemplates in ' + file);
        return;
    }
    
    // We want to replace from exact match to exactly right before SharedTemplates line
    let replaceStart = idx + matchUpTo.length;
    let endLineStart = content.lastIndexOf('\n', endIdx) + 1; // Start of the line with SharedTemplates
    // Let's actually replace UP TO the `{['carbon grid'...` line
    let templatesLineMatch = content.substring(idx, endIdx).match(/\{\[\'carbon grid\'/);
    if (templatesLineMatch) {
       endLineStart = content.lastIndexOf('\n', idx + templatesLineMatch.index);
    }
    
    let before = content.substring(0, replaceStart);
    let after = content.substring(endLineStart);
    
    fs.writeFileSync('app/studio/components/' + file, before + perfectEnding + after);
    console.log('Successfully fixed ' + file);
}

// 1. ChallengeCardGenerator.tsx
forceReplaceEnd('ChallengeCardGenerator.tsx',
'<div className="font-bold text-[#secondary-lime] text-sm uppercase">{formData.reward}</div>',
`
                      </div>
                   )}
                 </>
               )}
`);

// 2. FuelingPlanGenerator.tsx
forceReplaceEnd('FuelingPlanGenerator.tsx',
'Manual plan only. Not medical or nutrition advice.<br/>{typeof window !== \'undefined\' && window.localStorage.getItem(\'runcard-watermark\') === \'off\' ? \'\' : \'RunCard Studio\'}</p>',
`
                   </div>
                 </>
               )}
`);

// 3. GoalCardGenerator.tsx
forceReplaceEnd('GoalCardGenerator.tsx',
'<div className="absolute bottom-4 right-10 text-[8px] font-mono tracking-widest text-gray-300 uppercase">{typeof window !== \'undefined\' && window.localStorage.getItem(\'runcard-watermark\') === \'off\' ? \'\' : \'RunCard Studio\'}</div>',
`
                 </>
               )}
`);

// 4. PaceBandGenerator.tsx
forceReplaceEnd('PaceBandGenerator.tsx',
'<span className="font-extrabold">{typeof window !== \'undefined\' && window.localStorage.getItem(\'runcard-watermark\') === \'off\' ? \'\' : \'RunCard Studio\'}</span>',
`
                   </div>
                 </div>
               )}
`);

// 5. PersonalBestGenerator.tsx
forceReplaceEnd('PersonalBestGenerator.tsx',
'<div className="mt-6 text-left text-[9px] font-mono tracking-widest text-gray-400 uppercase">{typeof window !== \'undefined\' && window.localStorage.getItem(\'runcard-watermark\') === \'off\' ? \'\' : \'RunCard Studio\'}</div>',
`
                 </>
               )}
`);

