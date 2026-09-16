const { execSync } = require('child_process');
try {
  execSync('./node_modules/.bin/tsc --noEmit', { stdio: 'inherit', env: { ...process.env, NODE_OPTIONS: '' } });
} catch (e) {
  process.exit(1);
}
