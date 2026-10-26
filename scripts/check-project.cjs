const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const pkg = read('package.json');
const lock = read('package-lock.json');
const manifest = read('extension/manifest.json');
assert.match(pkg.version, /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/);
assert.ok(pkg.version.split('.').every((part) => Number(part) <= 65535));
assert.notEqual(pkg.version, '0.0.0');
assert.equal(manifest.version, pkg.version, 'Manifest/package version mismatch');
assert.equal(lock.version, pkg.version, 'Lock/package version mismatch');
assert.equal(lock.packages[''].version, pkg.version, 'Lock root version mismatch');
if (process.env.GITHUB_REF?.startsWith('refs/tags/')) {
  assert.equal(process.env.GITHUB_REF, `refs/tags/v${pkg.version}`, 'Release tag must match the package version');
}
const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { cwd: root }).toString().split('\0').filter(Boolean);
for (const file of files.filter((name) => /\.(?:cjs|js)$/.test(name))) {
  execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });
}
execFileSync('git', ['diff', '--check'], { cwd: root, stdio: 'inherit' });
console.log(`PASS version ${pkg.version}, JavaScript syntax, and whitespace`);
