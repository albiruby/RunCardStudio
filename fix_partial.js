const fs = require('fs');

function fixMap(content) {
  return content.replace(/\)<\/div>\s*\)\}/g, 'px-3 py-1.5 text-xs font-bold uppercase whitespace-nowrap transition-colors cursor-pointer border rounded-full shrink-0\n                  ${template === t.id ? \'border-secondary-lime text-secondary-lime bg-secondary-lime/10\' : \'border-brand-border text-text-muted hover:border-primary-coral hover:text-text-primary\'}`}\n              >\n                {t.label}\n              </button>\n            ))}');
}
function fixMapGeneric(content) {
   // actually, the broken part is just `)</div>\n              )}` 
   // It came from `))} \n </div>`.
   // Let's just fix the `)</div>\s*)}` globally:
   return content.replace(/\)<\/div>\s*\)\}/g, '))}\n        </div>');
}

let files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  
  // 1. Fix the .map array bug in ALL files
  content = fixMapGeneric(content);

  // 2. Fix DamageReportGenerator
  if (file === 'DamageReportGenerator.tsx') {
      content = content.replace(/&quot;\{formData\.notes\}&quot;\s*<\/div>\s*<\/div>\s*\)\}\s*\)\}/, '&quot;{formData.notes}&quot;</div>\n)}</div>\n)}');
  }
  
  // 3. Fix FuelingPlanGenerator
  if (file === 'FuelingPlanGenerator.tsx') {
      // Error was: `486: Unterminated regexp literal`
      // `485: <SharedTemplates... />`
      // `486:     </div>`
      // Wait, 486 in FuelingPlan of the build log was `</div>` !
      // In FuelingPlan it was actually: 
      // `376: ... {formData.preRace}</p>`
      // `377: )}`
      // `378: </div> </div>`
      // Let's see what's actually there. We will print the end of these files first.
  }

  // Actually, I can just fix the `.map` arrays and see what errors remain!
  fs.writeFileSync('app/studio/components/' + file, content);
}
console.log('Fixed maps');
