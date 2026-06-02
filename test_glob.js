const path = require('path');
const glob = require('glob');

// Simulate what happens when running from src/db/cli.ts
const __dirname = path.resolve(process.cwd(), 'src/db');
const seedersGlob = path.resolve(__dirname, '..', 'seeders', '*.{js,ts}');

console.log('__dirname:', __dirname);
console.log('seedersGlob pattern:', seedersGlob);

glob.glob(seedersGlob, {}, (err, files) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Found files:');
    files.forEach(f => console.log(' -', path.basename(f)));
  }
});
