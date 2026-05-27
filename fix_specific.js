const fs = require('fs');
let c = fs.readFileSync('app/studio/components/ChallengeCardGenerator.tsx', 'utf8');
c = c.replace(/\{formData\.reward\s*&&\s*\(\s*<div className="mt-auto border border\[#22252a\] bg\[#121316\] p-3 text-center rounded">\s*<span className="text-\[10px\] text-gray-500 uppercase tracking-widest">Reward<\/span>\s*<div className="font-bold text-\[\#secondary-lime\] text-sm uppercase">\{formData\.reward\}<\/div>\s*<\/div>\s*<\/>\s*\)\}/g,
`{formData.reward && (
                     <div className="mt-auto border border-[#22252a] bg-[#121316] p-3 text-center rounded">
                       <span className="text-[10px] text-gray-500 uppercase tracking-widest">Reward</span>
                       <div className="font-bold text-[#secondary-lime] text-sm uppercase">{formData.reward}</div>
                      </div>
                   )}
                 </>
               )}`);
fs.writeFileSync('app/studio/components/ChallengeCardGenerator.tsx', c);

let f = fs.readFileSync('app/studio/components/FuelingPlanGenerator.tsx', 'utf8');
let fTarget = /<p className="text-\[8px\] uppercase tracking-widest text-center text-gray-400 font-bold leading-tight">\s*Manual plan only\. Not medical or nutrition advice\.<br\/>\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/p>\s*<\/div>\s*<\/>\s*\)\}/;
f = f.replace(fTarget, `<p className="text-[8px] uppercase tracking-widest text-center text-gray-400 font-bold leading-tight">
                       Manual plan only. Not medical or nutrition advice.<br/>{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</p>
                   </div>
                 </>
               )}`);
fs.writeFileSync('app/studio/components/FuelingPlanGenerator.tsx', f);

let g = fs.readFileSync('app/studio/components/GoalCardGenerator.tsx', 'utf8');
let gTarget = /<div className="absolute bottom-4 right-10 text-\[8px\] font-mono tracking-widest text-gray-300 uppercase">\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/div>\s*<\/>\s*\)\}/;
g = g.replace(gTarget, `<div className="absolute bottom-4 right-10 text-[8px] font-mono tracking-widest text-gray-300 uppercase">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</div>
                 </>
               )}`);
fs.writeFileSync('app/studio/components/GoalCardGenerator.tsx', g);

let pb = fs.readFileSync('app/studio/components/PersonalBestGenerator.tsx', 'utf8');
let pbTarget = /<div className="mt-6 text-left text-\[9px\] font-mono tracking-widest text-gray-400 uppercase">\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/div>\s*<\/>\s*\)\}/;
pb = pb.replace(pbTarget, `<div className="mt-6 text-left text-[9px] font-mono tracking-widest text-gray-400 uppercase">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</div>
                 </>
               )}`);
fs.writeFileSync('app/studio/components/PersonalBestGenerator.tsx', pb);
