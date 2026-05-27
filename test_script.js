const fs = require('fs');

const file = 'app/studio/components/WorkoutCardGenerator.tsx';
let content = fs.readFileSync(file, 'utf8');

const tplMatch = content.match(/\{template === '([^']+)' && \([\s\S]*?\n\s*\)\}/g);
if (tplMatch) {
  console.log("Found " + tplMatch.length + " template blocks. First name:", tplMatch[0].match(/\{template === '([^']+)'/)[1]);
} else {
  console.log("Failed to match templates");
}
