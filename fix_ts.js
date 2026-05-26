const fs = require('fs');
const path = require('path');

const dir = 'app/studio/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/const title = plainData\.name \|\| plainData\.title \|\| plainData\.athleteName \|\| plainData\.sessionName \|\| plainData\.runnerName \|\| plainData\.raceName \|\| plainData\.sessionType \|\| plainData\.distanceChoice \|\| "Untitled Draft";/g, 
    'const pd = plainData as any;\n    const title = pd.name || pd.title || pd.athleteName || pd.sessionName || pd.runnerName || pd.raceName || pd.sessionType || pd.distanceChoice || "Untitled Draft";');

  fs.writeFileSync(file, content);
});

console.log('Fixed TypeScript plainData accessor');
