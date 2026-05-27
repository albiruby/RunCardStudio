const { execSync } = require('child_process');

try {
  execSync('git restore app/studio/components/*.tsx', { stdio: 'inherit' });
  console.log('Restored correctly?');
} catch (e) {
  console.log(e.message);
}
