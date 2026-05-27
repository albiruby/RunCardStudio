const fs = require('fs');

// Challenge: Stray app/studio/components/PaceBandGenerator.tsx at 450
function fixChallenge() {
    let lines = fs.readFileSync('app/studio/components/ChallengeCardGenerator.tsx', 'utf8').split('\n');
    let idx = lines.findIndex(l => l.includes('<span className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Target</span>'));
    if (idx !== -1 && lines[idx - 1].trim() === 'app/studio/components/PaceBandGenerator.tsx') {
        lines.splice(idx - 1, 1);
    }
    fs.writeFileSync('app/studio/components/ChallengeCardGenerator.tsx', lines.join('\n'));
}

fixChallenge();
