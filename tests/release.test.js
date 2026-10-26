import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (directory, script, args = [], env = {}) => spawnSync(process.execPath,
  [path.join(directory, 'scripts', script), ...args], {
    cwd: directory, encoding: 'utf8', env: { ...process.env, GITHUB_OUTPUT: '', ...env },
  });

function fixture(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-html-release-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(directory, 'scripts'));
  fs.cpSync(path.join(root, 'extension'), path.join(directory, 'extension'), { recursive: true });
  for (const file of ['package.json', 'package-lock.json', 'LICENSE']) fs.copyFileSync(path.join(root, file), path.join(directory, file));
  for (const file of ['version.cjs', 'package.cjs', 'verify-package.cjs']) fs.copyFileSync(path.join(root, 'scripts', file), path.join(directory, 'scripts', file));
  return directory;
}

test('release version updates all manifests and rejects invalid/downgrade requests without changes', (t) => {
  const directory = fixture(t);
  const current = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'))).version;
  const next = `${Number(current.split('.')[0]) + 1}.0.0`;
  const valid = run(directory, 'version.cjs', [next]);
  assert.equal(valid.status, 0, valid.stderr);
  const files = ['package.json', 'package-lock.json', 'extension/manifest.json'];
  const before = files.map((file) => fs.readFileSync(path.join(directory, file), 'utf8'));
  for (const content of before) assert.equal(JSON.parse(content).version, next);
  assert.equal(JSON.parse(before[1]).packages[''].version, next);
  for (const input of [next, current, 'v1.2.3', '1.2.3-beta.1', '01.2.3', '65536.0.0']) {
    assert.notEqual(run(directory, 'version.cjs', [input]).status, 0, input);
    assert.deepEqual(files.map((file) => fs.readFileSync(path.join(directory, file), 'utf8')), before);
  }
});

test('package verification accepts the exact ZIP, rejects source drift and checksum corruption', (t) => {
  const directory = fixture(t);
  const env = { RHP_PACKAGE_OUTPUT: path.join(directory, 'candidate') };
  const packaged = run(directory, 'package.cjs', [], env);
  assert.equal(packaged.status, 0, packaged.stderr);
  const valid = run(directory, 'verify-package.cjs', [], env);
  assert.equal(valid.status, 0, valid.stderr);
  assert.equal(JSON.parse(valid.stdout).files, 11);
  const source = path.join(directory, 'extension/core.js');
  const original = fs.readFileSync(source);
  fs.appendFileSync(source, '\n// untested source change\n');
  const drift = run(directory, 'verify-package.cjs', [], env);
  assert.notEqual(drift.status, 0);
  assert.match(drift.stderr, /differs from source/);
  fs.writeFileSync(source, original);
  const { zip } = JSON.parse(packaged.stdout);
  fs.appendFileSync(zip, 'corruption');
  const corrupt = run(directory, 'verify-package.cjs', [], env);
  assert.notEqual(corrupt.status, 0);
  assert.match(corrupt.stderr, /ZIP checksum mismatch/);
});

test('release tag mismatch is rejected before packaging', () => {
  const result = run(root, 'check-project.cjs', [], { GITHUB_REF: 'refs/tags/v999.0.0' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Release tag must match/);
});
