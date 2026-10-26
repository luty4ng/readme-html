const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const next = process.argv[2];
assert.ok(next && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(next), 'Usage: npm run version:release -- 0.1.3');
const parts = next.split('.').map(Number);
assert.ok(parts.every((part) => part <= 65535), 'Chrome version components must be <= 65535');
const files = ['package.json', 'package-lock.json', 'extension/manifest.json'];
const values = files.map((file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')));
assert.ok(values.every((value) => value.version === values[0].version), 'Existing versions must match');
assert.equal(values[1].packages[''].version, values[0].version);
const current = values[0].version.split('.').map(Number);
const difference = parts.map((part, index) => part - current[index]).find((part) => part !== 0);
assert.ok(difference > 0, 'New version must be greater than the current version');
for (const [index, file] of files.entries()) {
  values[index].version = next;
  if (file === 'package-lock.json') values[index].packages[''].version = next;
  fs.writeFileSync(path.join(root, file), `${JSON.stringify(values[index], null, 2)}\n`);
}
console.log(`Version set to ${next}. Update release documentation, open a PR, and tag only after merging.`);
