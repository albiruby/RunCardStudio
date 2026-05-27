const fs = require('fs');

// GoalCardGenerator
let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8');
gc = gc.replace(
`                          &quot;{formData.motivation}&quot;</div>)}
                   </>
                   
                 </div>
               )}`,
`                          &quot;{formData.motivation}&quot;</div>)}
                 </div>
               )}`);
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc);

// ChallengeCardGenerator
// EOF error. Let's add 2 more inner divs at the end.
let cc = fs.readFileSync('app/studio/components/ChallengeCardGenerator.tsx', 'utf8');
if (cc.match(/<\/div>\n    <\/div>\n  \);\n\}/)) {
    cc = cc.replace(/<\/div>\n    <\/div>\n  \);\n\}/, '</div>\n</div>\n</div>\n    </div>\n  );\n}');
}
fs.writeFileSync('app/studio/components/ChallengeCardGenerator.tsx', cc);

// FuelingPlanGenerator
let fp = fs.readFileSync('app/studio/components/FuelingPlanGenerator.tsx', 'utf8');
if (fp.match(/<\/div>\n    <\/div>\n  \);\n\}\n$/)) {
    fp = fp.replace(/<\/div>\n    <\/div>\n  \);\n\}\n$/, '</div>\n</div>\n</div>\n    </div>\n  );\n}\n');
}
fs.writeFileSync('app/studio/components/FuelingPlanGenerator.tsx', fp);

// PaceBandGenerator
let pace = fs.readFileSync('app/studio/components/PaceBandGenerator.tsx', 'utf8');
if (pace.match(/<\/div>\n    <\/div>\n  \);\n\}\n$/)) {
    pace = pace.replace(/<\/div>\n    <\/div>\n  \);\n\}\n$/, '</div>\n</div>\n</div>\n    </div>\n  );\n}\n');
}
fs.writeFileSync('app/studio/components/PaceBandGenerator.tsx', pace);

// PersonalBestGenerator
let pb = fs.readFileSync('app/studio/components/PersonalBestGenerator.tsx', 'utf8');
if (pb.match(/<\/div>\n    <\/div>\n  \);\n\}\n$/) || pb.match(/<\/div>\n    <\/div>\n  \);\n\}/)) {
    pb = pb.replace(/<\/div>\n    <\/div>\n  \);\n\}/, '</div>\n</div>\n</div>\n    </div>\n  );\n}');
    pb = pb.replace(/<\/div>\n    <\/div>\n  \);\n\}\n$/, '</div>\n</div>\n</div>\n    </div>\n  );\n}\n');
}
fs.writeFileSync('app/studio/components/PersonalBestGenerator.tsx', pb);
