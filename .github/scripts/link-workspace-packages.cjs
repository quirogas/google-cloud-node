// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');

function parseVersion(ver) {
  const m = /^(\d+)\.(\d+)\.(\d+)/.exec(String(ver).trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function cmpTuple(a, b) {
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return 0;
}

function satisfies(versionStr, rangeStr) {
  const v = parseVersion(versionStr);
  if (!v) return false;
  const s = String(rangeStr).trim();
  if (s === '*' || s === '' || s.startsWith('workspace:')) return true;
  if (s.startsWith('^')) {
    const r = parseVersion(s.slice(1));
    if (!r) return false;
    if (cmpTuple(v, r) < 0) return false;
    if (r[0] > 0) return v[0] === r[0];
    if (r[1] > 0) return v[0] === 0 && v[1] === r[1];
    return v[0] === 0 && v[1] === 0 && v[2] === r[2];
  }
  if (s.startsWith('~')) {
    const r = parseVersion(s.slice(1));
    if (!r) return false;
    return v[0] === r[0] && v[1] === r[1] && v[2] >= r[2];
  }
  if (s.startsWith('>=')) {
    const r = parseVersion(s.slice(2));
    if (!r) return false;
    return cmpTuple(v, r) >= 0;
  }
  const r = parseVersion(s);
  if (!r) return false;
  return cmpTuple(v, r) === 0;
}

function findInstalledProtoDir() {
  const direct = path.join(
    ROOT_DIR,
    'core/packages/gax/node_modules/google-proto-files'
  );
  if (fs.existsSync(path.join(direct, 'google'))) {
    return direct;
  }
  const pnpmStore = path.join(ROOT_DIR, 'node_modules/.pnpm');
  if (fs.existsSync(pnpmStore)) {
    for (const entry of fs.readdirSync(pnpmStore)) {
      if (entry.startsWith('google-proto-files@')) {
        const candidate = path.join(
          pnpmStore,
          entry,
          'node_modules/google-proto-files'
        );
        if (fs.existsSync(path.join(candidate, 'google'))) {
          return candidate;
        }
      }
    }
  }
  return null;
}

function populateProtoFiles() {
  const protoPkgDir = path.join(ROOT_DIR, 'core/packages/nodejs-proto-files');
  const installedProtoDir = findInstalledProtoDir();
  if (!installedProtoDir) return;
  for (const sub of ['google', 'gapic', 'grafeas']) {
    const src = path.join(installedProtoDir, sub);
    const dest = path.join(protoPkgDir, sub);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
      fs.cpSync(src, dest, {recursive: true});
    }
  }
}

function main() {
  populateProtoFiles();

  const npmrcPath = path.join(ROOT_DIR, '.npmrc');
  if (fs.existsSync(npmrcPath)) {
    const npmrc = fs.readFileSync(npmrcPath, 'utf8');
    fs.writeFileSync(
      npmrcPath,
      npmrc.replace(
        'link-workspace-packages=false',
        'link-workspace-packages=deep'
      )
    );
  }

  const lockfilePath = path.join(ROOT_DIR, 'pnpm-lock.yaml');
  const lines = fs.readFileSync(lockfilePath, 'utf8').split('\n');

  const importerDirs = [];
  let inImporters = false;
  for (const line of lines) {
    if (line === 'importers:') {
      inImporters = true;
      continue;
    }
    if (inImporters && /^[a-zA-Z]/.test(line)) {
      break;
    }
    if (inImporters) {
      const m = /^ {2}(\S[^:]*):$/.exec(line);
      if (m) {
        importerDirs.push(m[1].replace(/^'|'$/g, ''));
      }
    }
  }

  const workspacePackages = new Map();
  for (const relDir of importerDirs) {
    if (relDir === '.') continue;
    const pkgJsonPath = path.join(ROOT_DIR, relDir, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) continue;
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    if (pkgJson.name && pkgJson.version) {
      workspacePackages.set(pkgJson.name, {
        dir: relDir,
        version: pkgJson.version,
      });
    }
  }

  inImporters = false;
  let currentImporter = null;
  let currentDep = null;
  let currentSpecifier = null;
  let linkedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === 'importers:') {
      inImporters = true;
      continue;
    }
    if (inImporters && /^[a-zA-Z]/.test(line)) {
      inImporters = false;
      break;
    }
    if (!inImporters) continue;

    const impMatch = /^ {2}(\S[^:]*):$/.exec(line);
    if (impMatch) {
      currentImporter = impMatch[1].replace(/^'|'$/g, '');
      currentDep = null;
      currentSpecifier = null;
      continue;
    }

    const depMatch = /^ {6}(\S[^:]*):$/.exec(line);
    if (depMatch) {
      currentDep = depMatch[1].replace(/^'|'$/g, '');
      currentSpecifier = null;
      continue;
    }

    const specMatch = /^ {8}specifier: (.+)$/.exec(line);
    if (specMatch) {
      currentSpecifier = specMatch[1].replace(/^'|'$/g, '');
      continue;
    }

    const verMatch = /^ {8}version: (.+)$/.exec(line);
    if (verMatch && currentImporter && currentDep && currentSpecifier) {
      const target = workspacePackages.get(currentDep);
      if (target && satisfies(target.version, currentSpecifier)) {
        const fromAbs = path.join(ROOT_DIR, currentImporter);
        const toAbs = path.join(ROOT_DIR, target.dir);
        const relLink = path.posix.relative(
          fromAbs.split(path.sep).join('/'),
          toAbs.split(path.sep).join('/')
        );
        lines[i] = `        version: link:${relLink}`;
        linkedCount++;
      }
    }
  }

  fs.writeFileSync(lockfilePath, lines.join('\n'));
  console.log(
    `Linked ${linkedCount} workspace dependency edges across ${workspacePackages.size} workspace packages.`
  );
}

main();
