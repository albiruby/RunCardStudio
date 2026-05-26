const fs = require('fs');
const path = require('path');

const buttonNames = {
  'RunReceiptGenerator': 'COPY CAPTION',
  'RaceRecapGenerator': 'COPY RECAP',
  'WorkoutCardGenerator': 'COPY WORKOUT',
  'RaceSplitGenerator': 'COPY SPLITS',
  'PaceBandGenerator': 'COPY PACE BAND',
  'DamageReportGenerator': 'COPY REPORT',
  'RaceBibGenerator': 'COPY BIB',
  'RaceChecklistGenerator': 'COPY CHECKLIST',
  'SportsCertificateGenerator': 'COPY CERTIFICATE',
  'PersonalBestGenerator': 'COPY PB',
  'TrainingWeekGenerator': 'COPY WEEK',
  'GoalCardGenerator': 'COPY GOAL',
  'ChallengeCardGenerator': 'COPY CHALLENGE',
  'FuelingPlanGenerator': 'COPY FUEL PLAN',
  'ShoeRotationGenerator': 'COPY SHOE LOG'
};

const formatKeyName = (key) => {
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
};

const dir = 'app/studio/components/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx')).map(f => path.join(dir, f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let compName = path.basename(file, '.tsx');
  
  let formDataMatch = content.match(/const\s+\[formData,\s*setFormData\]\s*=\s*useState\(\{([\s\S]*?)\}\);/);
  if (!formDataMatch) {
    if (compName === 'PaceBandGenerator') {
      // it has it, but match might be weird? Wait, Paceband generator had it in previous script, let's just make sure regex is robust
    }
  }
  
  if (formDataMatch) {
    let properties = formDataMatch[1].split(',').map(s => {
      let m = s.match(/^\s*([a-zA-Z0-9_]+)\s*:/);
      if (m) return m[1];
      return null;
    }).filter(Boolean);
    
    let handlerName = content.match(/const\s+(handleCopy[a-zA-Z0-9_]*)\s*=\s*\(\)\s*=>\s*\{/) 
                      ? content.match(/const\s+(handleCopy[a-zA-Z0-9_]*)\s*=\s*\(\)\s*=>\s*\{/)[1] 
                      : 'handleCopy';
                      
    if (compName === 'PaceBandGenerator') handlerName = 'handleCopy';
    
    let btnName = buttonNames[compName] || "COPY";
    
    let linesPush = properties.map(p => {
      return `    if (formData.${p} !== undefined && formData.${p} !== null && (formData.${p} as any) !== false && (formData.${p} as any) !== "—" && (formData.${p} as any) !== "Input required" && String(formData.${p}).trim() !== "") {
      const val = typeof formData.${p} === 'boolean' ? 'Yes' : formData.${p};
      lines.push("${formatKeyName(p)}: " + val);
    }`;
    }).join('\n');
    
    let newHandler = `  const ${handlerName} = () => {
    const lines = [];
${linesPush}
    lines.push("");
    lines.push("Made with RunCard Studio");
    const textToCopy = lines.join("\\n");
    
    const fallbackCopy = (text: string) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        showToast("Copied to clipboard!");
      } catch (err) {
        showToast("Failed to copy.");
      }
      textArea.remove();
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => showToast("Copied to clipboard!"))
        .catch((err) => {
          fallbackCopy(textToCopy);
        });
    } else {
      fallbackCopy(textToCopy);
    }
  };`;

    let handlerDefRegex = new RegExp(`^\\s*const\\s+${handlerName}\\s*=\\s*\\(\\)\\s*=>\\s*\\{[\\s\\S]*?^\\s*\\};\\s*$`, 'm');
    
    // We already replaced it heavily in previous steps, so we just use a regex that matches the current block
    // It's safer to just replace from "const ${handlerName} = () => {" up to "fallbackCopy(textToCopy);\n    }\n  };" or similar.
    // Let's just match the whole existing block by bracing
    
    let lines = content.split('\n');
    let startIdx = -1;
    let endIdx = -1;
    let braceCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
       if (startIdx === -1 && lines[i].includes(`const ${handlerName} = () => {`)) {
          startIdx = i;
          braceCount = 0;
       }
       if (startIdx !== -1) {
          braceCount += (lines[i].match(/\{/g) || []).length;
          braceCount -= (lines[i].match(/\}/g) || []).length;
          if (braceCount === 0) {
             endIdx = i;
             break;
          }
       }
    }
    
    if (startIdx !== -1 && endIdx !== -1) {
       let before = lines.slice(0, startIdx).join('\n');
       let after = lines.slice(endIdx + 1).join('\n');
       content = before + '\n' + newHandler + '\n' + after;
       fs.writeFileSync(file, content);
       console.log("Updated", compName);
    }
  }
});
