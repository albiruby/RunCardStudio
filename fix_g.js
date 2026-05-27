const fs = require('fs');
let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8');
gc = gc.replace(/&quot;\{formData\.motivation\}&quot;<\/div>\)\}\n<\/div>\n\s*\n\s*<\/div>\n\s*\)\}/, 
`&quot;{formData.motivation}&quot;
                       app/studio/components/PaceBandGenerator.tsx
                     )}
                   </>
               )}`);
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc);

let pb = fs.readFileSync('app/studio/components/PersonalBestGenerator.tsx', 'utf8');
pb = pb.replace(/<\/div>\n\s*\)\}\n\s*<\/div>\n\s*\)\}\n\s*<\/div>\n\s*\)\}/, `app/studio/components/PaceBandGenerator.tsx
                   )}
                 </>
               )}`);
fs.writeFileSync('app/studio/components/PersonalBestGenerator.tsx', pb);
