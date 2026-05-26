const fs = require('fs');

const fixUnit = (file) => {
  let content = fs.readFileSync(file, 'utf8');

  // Replace >km< with >{unit}<
  // Replace >KM< with >{unit.toUpperCase()}<
  // Replace >km< with >{unit}<
  // Replace /km with /{unit}
  // Replace /KM with /{unit.toUpperCase()}

  // Let's just insert a helper at the top if it doesn't exist
  if (!content.includes('const unit =')) {
    content = content.replace(
      'export default function',
      'const getUnit = () => typeof window !== \'undefined\' && window.localStorage.getItem(\'runcard-unit\') === \'imperial\' ? \'mi\' : \'km\';\n\nexport default function'
    );
    content = content.replace(
      'const [template, setTemplate] = useState',
      'const unit = getUnit();\n  const [template, setTemplate] = useState'
    );
  }

  // Paceband specific
  content = content.replace(/1 km/g, '1 {unit}');
  content = content.replace(/5 km/g, '5 {unit}');
  content = content.replace(/\+ ' km'/g, '+ \' \' + unit');
  content = content.replace(/>km</g, '>{unit}<');
  content = content.replace(/>KM</g, '>{unit.toUpperCase()}<');
  content = content.replace(/\/km/g, '/{unit}');
  content = content.replace(/\/KM/g, '/{unit.toUpperCase()}');
  content = content.replace(/\(km\)/g, '({unit})');
  content = content.replace(/\(KM\)/g, '({unit.toUpperCase()})');
  content = content.replace(/' km'/g, '` ${unit}`');
  
  // also PaceBandGenerator specific fixes
  content = content.replace(/Custom Distance \(km\)/g, 'Custom Distance ({unit})');

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
};

['app/studio/components/PaceBandGenerator.tsx', 'app/studio/components/RaceRecapGenerator.tsx', 'app/studio/components/RaceSplitGenerator.tsx', 'app/studio/components/RunReceiptGenerator.tsx'].forEach(f => fixUnit(f));

