const fs = require('fs');

function repair(file, targetRegex, replacement) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');
  content = content.replace(targetRegex, replacement);
  fs.writeFileSync('app/studio/components/' + file, content);
}

// PaceBandGenerator.tsx #1
repair('PaceBandGenerator.tsx', /<span className="font-extrabold">\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/span>\s*<\/div>\s*\)\}/, 
`<span className="font-extrabold">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</span>
                   </div>
                 </div>
               )}`);

// PaceBandGenerator.tsx #2
repair('PaceBandGenerator.tsx', /<div className="absolute bottom-2 right-2 text-\[9px\] font-mono text-text-muted bg-surface-lowest px-2 py-1 rounded border border-brand-border z-15 pointer-events-none opacity-40 uppercase tracking-widest font-bold">\s*Scale: \{\(scale \* 100\)\.toFixed\(0\)\}\%\s*<\/div>\s*<\/div>\s*\{/g, 
`<div className="absolute bottom-2 right-2 text-[9px] font-mono text-text-muted bg-surface-lowest px-2 py-1 rounded border border-brand-border z-15 pointer-events-none opacity-40 uppercase tracking-widest font-bold">
             Scale: {(scale * 100).toFixed(0)}%
          </div>
        </div>
           {`);

// GoalCardGenerator.tsx
repair('GoalCardGenerator.tsx', /<div className="absolute bottom-4 right-10 text-\[8px\] font-mono tracking-widest text-gray-300 uppercase">\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/div>\s*<\/>\s*\)\}/,
`<div className="absolute bottom-4 right-10 text-[8px] font-mono tracking-widest text-gray-300 uppercase">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</div>
                 </>
               )}`);

// PersonalBestGenerator.tsx
repair('PersonalBestGenerator.tsx', /<div className="mt-6 text-left text-\[9px\] font-mono tracking-widest text-gray-400 uppercase">\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/div>\s*<\/>\s*\)\}/,
`<div className="mt-6 text-left text-[9px] font-mono tracking-widest text-gray-400 uppercase">{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</div>
                 </>
               )}`);

// FuelingPlanGenerator.tsx
repair('FuelingPlanGenerator.tsx', /Manual plan only\. Not medical or nutrition advice\.<br\/>\{typeof window !== 'undefined' && window\.localStorage\.getItem\('runcard-watermark'\) === 'off' \? '' : 'RunCard Studio'\}<\/p>\s*<\/div>\s*<\/>\s*\)\}/,
`Manual plan only. Not medical or nutrition advice.<br/>{typeof window !== 'undefined' && window.localStorage.getItem('runcard-watermark') === 'off' ? '' : 'RunCard Studio'}</p>
                   </div>
                 </>
               )}`);

// ChallengeCardGenerator.tsx
repair('ChallengeCardGenerator.tsx', /<div className="font-bold text-\[\#secondary-lime\] text-sm uppercase">\{formData\.reward\}<\/div>\s*<\/div>\s*<\/>\s*\)\}/,
`<div className="font-bold text-[#secondary-lime] text-sm uppercase">{formData.reward}</div>
                      </div>
                 </>
               )}`);
