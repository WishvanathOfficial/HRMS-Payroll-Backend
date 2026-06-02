import * as path from 'path';
import { fileURLToPath } from 'url';
import { sync as globSync } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedersGlob = path.resolve(__dirname, 'src', 'seeders', '*.{js,ts}');

console.log('Glob pattern:', seedersGlob);
const files = globSync(seedersGlob);
console.log('Found files:');
files.forEach(f => console.log(' -', path.basename(f)));
console.log('Total:', files.length);
