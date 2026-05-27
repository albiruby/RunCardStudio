const fs = require('fs');
const files = fs.readdirSync('app/studio/components').filter(f => f.endsWith('Generator.tsx') && f !== 'RoutePosterGenerator.tsx');

for (const file of files) {
  let content = fs.readFileSync('app/studio/components/' + file, 'utf8');

  // Fix object array duplicates
  // We look for any accidental `], { id:` ... `].map` or something.
  // Actually, let's just find the `].map` or `].map` and rebuild the array from the first 3 templates if we can?
  // No, the easiest is to just use a regex to clean up the duplicated templates.
  
  // We have something like:
  // { id: 'carbon grid', label: 'Carbon Grid' },
  // ...
  // { id: 'compact story', label: 'Compact Story' }
  // ], { id: 'carbon grid', label: 'Carbon Grid' }, { id: 'race poster pro', label: 'Race Poster Pro' }, { id: 'minimal white', label: 'Minimal White' }, { id: 'split panel', label: 'Split Panel' }, { id: 'neon edge', label: 'Neon Edge' }, { id: 'print utility', label: 'Print Utility' }, { id: 'compact story', label: 'Compact Story' }]
  
  // Let's replace the whole duplicated mess.
  const badObjStr = /], \{ id: 'carbon grid'[\s\S]*?'Compact Story' \}\]/;
  if (badObjStr.test(content)) {
     content = content.replace(badObjStr, ']');
  }
  
  const badStrStr = /],\s*'carbon grid', 'race poster pro'[\s\S]*?'compact story'\]/g;
  if (badStrStr.test(content)) {
     content = content.replace(badStrStr, ']');
  }

  // Also replace any other corrupted things
  // E.g., if there's "{ id: 'compact story', label: 'Compact Story' }\n           ], "
  const badStr3 = /\{ id: 'compact story', label: 'Compact Story' \}\s*\],\s*\{ id: 'carbon grid'/g;
  if (badStr3.test(content)) {
      content = content.replace(badStr3, "{ id: 'compact story', label: 'Compact Story' }");
  }

  const badStr4 = /'compact story'\s*\],\s*'carbon grid'/g;
  if (badStr4.test(content)) {
      content = content.replace(badStr4, "'compact story'");
  }
  
  fs.writeFileSync('app/studio/components/' + file, content);
}
