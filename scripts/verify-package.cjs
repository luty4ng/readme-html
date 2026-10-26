// Verify the actual archive before loading it in the browser or publishing it.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json'), 'utf8'));
const output = process.env.RHP_PACKAGE_OUTPUT ? path.resolve(process.env.RHP_PACKAGE_OUTPUT) : path.join(root, 'dist');
const zip = path.join(output, `readme-html-v${manifest.version}.zip`);
const hash = createHash('sha256').update(fs.readFileSync(zip)).digest('hex');
assert.equal(fs.readFileSync(`${zip}.sha256`, 'utf8').trim(), `${hash}  ${path.basename(zip)}`, 'ZIP checksum mismatch');
const extracted = fs.mkdtempSync(path.join(output, 'verified-'));
if (process.platform === 'win32') {
  execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
    'Expand-Archive -LiteralPath $env:RHP_VERIFY_ZIP -DestinationPath $env:RHP_VERIFY_DIRECTORY'],
    { env: { ...process.env, RHP_VERIFY_ZIP: zip, RHP_VERIFY_DIRECTORY: extracted }, stdio: 'inherit' });
} else {
  execFileSync('unzip', ['-q', zip, '-d', extracted], { stdio: 'inherit' });
}
const walk = (directory, prefix = '') => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  assert.ok(!entry.isSymbolicLink(), 'Archive must not contain symlinks');
  const name = prefix + entry.name;
  return entry.isDirectory() ? walk(path.join(directory, entry.name), name + '/') : [name];
});
const expected = ['manifest.json', 'core.js', 'background.js', 'content.js', 'viewer.html', 'viewer.js', ...Object.values(manifest.icons), 'LICENSE'].sort();
assert.deepEqual(walk(extracted).sort(), expected, 'Unexpected or missing files in installation ZIP');
for (const file of expected) {
  assert.deepEqual(fs.readFileSync(path.join(extracted, file)), fs.readFileSync(path.join(root, file === 'LICENSE' ? file : `extension/${file}`)), `${file} differs from source`);
}
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `extension-path=${extracted}\n`);
console.log(JSON.stringify({ version: manifest.version, sha256: hash, files: expected.length, extracted }, null, 2));
