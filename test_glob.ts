import * as path from 'path';
import * as fs from 'fs';

// Simulate what happens when running from src/db/cli.ts
const __dirname = path.resolve(process.cwd(), 'src/db');
const seedersDir = path.resolve(__dirname, '..', 'seeders');

console.log('__dirname:', __dirname);
console.log('seedersDir:', seedersDir);
console.log('seedersDir exists:', fs.existsSync(seedersDir));

if (fs.existsSync(seedersDir)) {
  const files = fs.readdirSync(seedersDir);
  console.log('Found files:');
  files.forEach(f => console.log(' -', f));
}
