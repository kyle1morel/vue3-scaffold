import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const CHART_DIR = 'charts/vue3-scaffold';

const version = process.argv[2] ?? '';
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  process.stderr.write('Usage: npm run release -- <major.minor.patch>\n');
  process.exit(1);
}
const [major, minor] = version.split('.');

const run = (cmd: string, cwd = '.') => execSync(cmd, { cwd, stdio: 'inherit' });
const edit = (path: string, fn: (s: string) => string) => {
  const before = readFileSync(path, 'utf-8');
  const after = fn(before);
  if (after === before) throw new Error(`${path} was not changed; check its version pattern`);
  writeFileSync(path, after);
};

// Check before changing any file, so a missing tool can't leave a half-bumped branch.
try {
  execSync('helm-docs --version', { stdio: 'ignore' });
} catch {
  process.stderr.write('helm-docs is required: https://github.com/norwoodj/helm-docs#installation\n');
  process.exit(1);
}

run(`git switch -c chore/release-${version}`);

// npm version also keeps package-lock.json in sync.
run(`npm version ${version} --no-git-tag-version`, 'app');
run(`npm version ${version} --no-git-tag-version`, 'frontend');

edit(`${CHART_DIR}/Chart.yaml`, (s) =>
  s
    .replace(/^appVersion: ".*"$/m, `appVersion: "${version}"`)
    .replace(/^version: (\d+)\.(\d+)\.(\d+)$/m, (_, a, b, c) => `version: ${a}.${b}.${Number(c) + 1}`)
);
run('helm-docs', CHART_DIR);

edit('SECURITY.md', (s) =>
  s
    .replace(/\d+\.\d+\.\d+(?=\s+\| :white_check_mark:)/, version)
    .replace(/< \d+\.\d+\.x/, `< ${major}.${minor}.x`)
);

process.stdout.write(`
Release v${version} prepared on branch chore/release-${version}. Next:
  1. git commit -am "chore(release): v${version}" and open a pull request to main
  2. After it merges, run the "Draft Release" workflow
  3. Review and publish the draft release, which creates the v${version} tag
`);
