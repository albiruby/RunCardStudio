const fs = require('fs');

let cc = fs.readFileSync('app/studio/components/ChallengeCardGenerator.tsx', 'utf8');
cc = cc.replace(
`                      <div className="absolute top-0 left-0 w-1 h-full bg-[#ff0055]"></div>
                     <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Target</span>
                     <span className="text-2xl font-black font-sans uppercase text-white">{formData.target || '-'}</span>
                   </div>`,
`                      <div className="absolute top-0 left-0 w-1 h-full bg-[#ff0055]"></div>
                     </div>
                     <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Target</span>
                     <span className="text-2xl font-black font-sans uppercase text-white">{formData.target || '-'}</span>
                   </div>`);
fs.writeFileSync('app/studio/components/ChallengeCardGenerator.tsx', cc);


let gc = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8');
gc = gc.replace(/<\/>\s*\)\}/, '</div>\n               )}');
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', gc);

let pb = fs.readFileSync('app/studio/components/PersonalBestGenerator.tsx', 'utf8');
pb = pb.replace(/<\/>\s*\)\}/, '</div>\n               )}');
fs.writeFileSync('app/studio/components/PersonalBestGenerator.tsx', pb);


let fp = fs.readFileSync('app/studio/components/FuelingPlanGenerator.tsx', 'utf8');
// FuelingPlan had </div> at 473 and <div ... pt-6> at 474.
// AND it started with `<>` !
// Wait, `FuelingPlanGenerator` said `Unexpected eof` at the VERY end.
// That means we are missing a `</div>` at the very end of the file.
let parts = fp.split('           )}');
if (parts.length === 2) {
    let tail = parts[1];
    if (tail.match(/<\/div>/g).length < 4) { // usually 4 divs at the end!
       fp = parts[0] + '           )}' + '\n      </div>' + tail;
    }
}
fs.writeFileSync('app/studio/components/FuelingPlanGenerator.tsx', fp);

let paceBand = fs.readFileSync('app/studio/components/PaceBandGenerator.tsx', 'utf8');
let partsPB = paceBand.split('           )}');
if (partsPB.length === 2 && partsPB[1].match(/<\/div>/g).length < 4) {
    paceBand = partsPB[0] + '           )}' + '\n      </div>' + partsPB[1];
}
fs.writeFileSync('app/studio/components/PaceBandGenerator.tsx', paceBand);

