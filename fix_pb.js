const fs = require('fs');

let pb = fs.readFileSync('app/studio/components/PersonalBestGenerator.tsx', 'utf8');
pb = pb.replace(`                          <div className="font-bold text-xs uppercase">{formData.nextTarget}app/studio/components/PaceBandGenerator.tsx
                         app/studio/components/PaceBandGenerator.tsx
                       )}
                    app/studio/components/PaceBandGenerator.tsx
                 </>
               )}`,
`                          <div className="font-bold text-xs uppercase">{formData.nextTarget}app/studio/components/PaceBandGenerator.tsx
                         app/studio/components/PaceBandGenerator.tsx
                       )}
                    app/studio/components/PaceBandGenerator.tsx
                  )}
                 </>
               )}`);
fs.writeFileSync('app/studio/components/PersonalBestGenerator.tsx', pb);


let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8');
gc = gc.replace(`                          &quot;{formData.motivation}&quot;app/studio/components/PaceBandGenerator.tsx)}
                   </>
                   
                 app/studio/components/PaceBandGenerator.tsx
               )}`,
`                          &quot;{formData.motivation}&quot;app/studio/components/PaceBandGenerator.tsx)}
                 app/studio/components/PaceBandGenerator.tsx
               )}`);
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc);
