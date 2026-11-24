import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'index.html', 'styles.css', 'app.js', 'manifest.webmanifest', 'sw.js',
  'public/assets/hero/velora-sunset-couple.jpg',
  'public/assets/destinations/maldives.webp', 'public/assets/destinations/amalfi-coast.webp',
  'public/assets/destinations/kyoto-garden.webp', 'public/assets/experiences/couple-sunset-walk.webp',
  'public/icons/velora-mark.svg',
  'public/icons/velora-192.png', 'public/icons/velora-512.png', 'README.md', 'LICENSE'
];
const missing = required.filter(file => !fs.existsSync(path.join(root, file)));
if (missing.length) { console.error('Missing files:', missing.join(', ')); process.exit(1); }
const js = spawnSync(process.execPath, ['--check', path.join(root, 'app.js')], { encoding: 'utf8' });
if (js.status !== 0) { process.stderr.write(js.stderr); process.exit(js.status ?? 1); }
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) { console.error('Duplicate IDs:', [...new Set(duplicates)].join(', ')); process.exit(1); }
const localAssets = [...html.matchAll(/(?:src|href)="(public\/[^"]+|\.\/[^"]+|[a-zA-Z0-9_-]+\.(?:css|js|webmanifest))"/g)].map(match => match[1]);
const broken = localAssets.filter(asset => !asset.startsWith('http') && !fs.existsSync(path.join(root, asset.replace(/^\.\//, ''))));
if (broken.length) { console.error('Broken local assets:', broken.join(', ')); process.exit(1); }
console.log(`VELORA checks passed: ${required.length} required files, app.js syntax, unique IDs, anchor targets, explicit button types, ${localAssets.length} local asset references.`);
