const fs = require('fs');
const path = require('path');

const dir = './app/studio/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Generator.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert getUnit function if it does not exist
  if (!content.includes('const getUnit = () => typeof window !== \'undefined\'')) {
    content = content.replace(
      /^export default function/m,
      `const getUnit = () => typeof window !== 'undefined' && window.localStorage.getItem('runcard-unit') === 'imperial' ? 'mi' : 'km';\n\nexport default function`
    );
  }

  // Insert const unit = getUnit(); inside component if not exists
  if (!content.includes('const unit = getUnit();')) {
    content = content.replace(
      /export default function (\w+)\([^)]*\) \{\n/,
      `export default function $1(props: any) {\n  const unit = getUnit();\n`
    );
    // Note: This regex might strip props, better do:
    content = content.replace(
      /(export default function [^{]+\{\n)/,
      `$1  const unit = getUnit();\n`
    );
  }

  // Replace specific placeholders that contain 'km' to use {unit}
  // For example: placeholder="32km" -> placeholder={\`32\${unit}\`}
  // placeholder="70 km" -> placeholder={\`70 \${unit}\`}
  // placeholder="6x1km @ 3:45" -> placeholder={\`6x1\${unit} @ 3:45\`}
  // placeholder="25km progression" -> placeholder={\`25\${unit} progression\`}
  // placeholder="Run 500km total" -> placeholder={\`Run 500\${unit} total\`}
  // placeholder="Caffeine at 30km mark." -> placeholder={\`Caffeine at 30\${unit} mark.\`}
  // placeholder="2km easy jog, dynamic drills, 3x100m strides" -> placeholder={\`2\${unit} easy jog, dynamic drills, 3x100m strides\`}
  // placeholder="1.5km recovery jog + light lower limb stretching" -> placeholder={\`1.5\${unit} recovery jog + light lower limb stretching\`}

  const placeholderReplacements = [
    { old: 'placeholder="32km"', new: 'placeholder={`32${unit}`}' },
    { old: 'placeholder="70 km"', new: 'placeholder={`70 ${unit}`}' },
    { old: 'placeholder="6x1km @ 3:45"', new: 'placeholder={`6x1${unit} @ 3:45`}' },
    { old: 'placeholder="25km progression"', new: 'placeholder={`25${unit} progression`}' },
    { old: 'placeholder="Run 500km total"', new: 'placeholder={`Run 500${unit} total`}' },
    { old: 'placeholder="Caffeine at 30km mark."', new: 'placeholder={`Caffeine at 30${unit} mark.`}' },
    { old: 'placeholder="2km easy jog, dynamic drills, 3x100m strides"', new: 'placeholder={`2${unit} easy jog, dynamic drills, 3x100m strides`}' },
    { old: 'placeholder="1.5km recovery jog + light lower limb stretching"', new: 'placeholder={`1.5${unit} recovery jog + light lower limb stretching`}' },
    { old: 'placeholder="e.g. The 100km Ultra Challenge"', new: 'placeholder={`e.g. The 100${unit} Ultra Challenge`}' }
  ];

  placeholderReplacements.forEach(repl => {
    content = content.replace(repl.old, repl.new);
  });

  // Replace specific labels that contain (km) to use ({unit})
  // Usually this is done in RunReceipt, but let's check for any missing.
  // Actually, RunReceipt already has ({unit}). I'll do a regex:
  // e.g. Distance (km) -> Distance ({unit})
  content = content.replace(/>Distance \(km\)<\/label>/g, '>Distance ({unit})</label>');
  content = content.replace(/\/km<\/span>/g, '/{unit}</span>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated units in ${file}`);
});
