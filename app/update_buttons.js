const fs = require('fs');
const path = require('path');

const dir = '/app/studio/components/';
const files = fs.readdirSync(dir).map(f => path.join(dir, f));

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace Copy button wrapper
    content = content.replace(/bg-surface-high hover:bg-surface-highest border border-brand-border text-text-primary/g, "bg-transparent hover:bg-secondary-lime/10 border border-secondary-lime text-secondary-lime");
    
    // Replace Copy icon color
    content = content.replace(/<Copy className="w-4 h-4 text-primary-coral" \/>/g, '<Copy className="w-4 h-4 text-secondary-lime" />');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
