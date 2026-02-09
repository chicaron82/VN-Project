import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();

const TARGET_DIRS = ['v2', 'showcase', 'shared', 'shell'];

const INCLUDE_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const EXCLUDE_DIR_NAMES = new Set([
  'node_modules',
  'dist',
  'coverage',
  '.git',
  '.vite',
]);

const EXCLUDE_PATH_PARTS = [
  `${path.sep}__tests__${path.sep}`,
  `${path.sep}tests${path.sep}`,
];

const EXCLUDE_FILE_PATTERNS = [
  /\.test\.[cm]?[jt]sx?$/i,
  /\.spec\.[cm]?[jt]sx?$/i,
];

const CONSOLE_REGEX = /\bconsole\.(log|warn|error|info|debug|group|groupCollapsed|groupEnd)\b/g;

const DEFAULT_ALLOWLIST = new Set([
  // Logger legitimately uses console.* internally
  path.normalize('v2/utils/Logger.ts'),

  // Intentionally overrides console.* for DevSuite capture
  path.normalize('v2/systems/devsuite/ConsoleInterceptor.ts'),
]);

function isExcludedFile(filePath) {
  const normalized = path.normalize(filePath);
  return EXCLUDE_FILE_PATTERNS.some((re) => re.test(normalized));
}

function isInExcludedPath(filePath) {
  const normalized = path.normalize(filePath);
  return EXCLUDE_PATH_PARTS.some((part) => normalized.includes(path.normalize(part)));
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIR_NAMES.has(entry.name)) continue;
      yield* walk(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function countMatches(text) {
  let count = 0;
  CONSOLE_REGEX.lastIndex = 0;
  while (CONSOLE_REGEX.exec(text)) count++;
  return count;
}

async function main() {
  const allowlist = new Set(DEFAULT_ALLOWLIST);

  const results = [];
  let total = 0;

  for (const dirName of TARGET_DIRS) {
    const dirPath = path.join(ROOT_DIR, dirName);
    try {
      const stat = await fs.stat(dirPath);
      if (!stat.isDirectory()) continue;
    } catch {
      continue;
    }

    for await (const filePath of walk(dirPath)) {
      const ext = path.extname(filePath);
      if (!INCLUDE_EXTS.has(ext)) continue;
      if (isExcludedFile(filePath)) continue;
      if (isInExcludedPath(filePath)) continue;

      const rel = path.relative(ROOT_DIR, filePath);
      if (allowlist.has(path.normalize(rel))) continue;

      const text = await fs.readFile(filePath, 'utf8');
      const count = countMatches(text);
      if (count === 0) continue;

      total += count;
      results.push({ file: rel.replaceAll('\\', '/'), count });
    }
  }

  results.sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));

  const report = {
    generatedAt: new Date().toISOString(),
    totalMatches: total,
    scannedDirs: TARGET_DIRS,
    excludes: {
      testFiles: true,
      testsDirs: ['__tests__', 'tests'],
      allowlist: [...allowlist].map((p) => p.replaceAll('\\', '/')),
    },
    top: results.slice(0, 50),
    byFile: results,
  };

  const outPath = path.join(ROOT_DIR, '.console-audit.json');
  await fs.writeFile(outPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

  // Human-friendly summary
  const top10 = report.top.slice(0, 10);
  console.log(`Console audit complete.`);
  console.log(`Total matches (runtime code, excluding tests): ${report.totalMatches}`);
  console.log(`Top offenders:`);
  for (const item of top10) {
    console.log(`  ${String(item.count).padStart(4, ' ')}  ${item.file}`);
  }
  console.log(`\nWrote ${path.relative(ROOT_DIR, outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
