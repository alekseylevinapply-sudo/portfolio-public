import { readFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles } from './public-files.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const allowed = new Set(publicFiles);
const files = await readdir(output);
if (files.length !== allowed.size || files.some((file) => !allowed.has(file))) throw new Error('dist differs from the reviewed allowlist.');
const contents = new Map();
const pages = new Map();
const externalLinks = new Set([
  'https://github.com/alekseylevinapply-sudo',
  'https://github.com/alekseylevinapply-sudo/portfolio-public',
  'https://github.com/alekseylevinapply-sudo/wordpress-site-leads',
  'https://github.com/alekseylevinapply-sudo/jhipster-leads',
  'https://t.me/aleksey_y_levin',
  'https://commons.wikimedia.org/wiki/File:HVAC_Air_Handler_Unit,_pic1.JPG',
  'https://creativecommons.org/publicdomain/zero/1.0/',
  'https://wordpress.org/about/license/',
]);
const patterns = [
  /@example\.(com|org)|YOUR_|TODO|TBD/,
  /gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/,
  /\b\d{8,12}:[A-Za-z0-9_-]{30,}\b/,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
];
for (const file of files) {
  if (!(await lstat(path.join(root, file))).isFile() || !(await lstat(path.join(output, file))).isFile()) throw new Error('Expected regular public file: ' + file);
  const bytes = await readFile(path.join(output, file));
  if (!bytes.equals(await readFile(path.join(root, file)))) throw new Error('Stale build: ' + file);
  if (file.endsWith('.png')) {
    if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error('Invalid PNG: ' + file);
    continue;
  }
  const text = bytes.toString('utf8');
  contents.set(file, text);
  if (patterns.some((pattern) => pattern.test(text))) throw new Error('Possible placeholder or secret in ' + file + '; value withheld.');
  if (/C:\\Users\\|AppData|\.codex|localhost|127\.0\.0\.1/.test(text)) throw new Error('Local-only path in public asset ' + file);
  if (/учебн|вымышлен|демонстрацион/i.test(text)) throw new Error('Unwanted wording in ' + file);
  if (file.endsWith('.html')) {
    const allIds = [...text.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const ids = new Set(allIds);
    if (ids.size !== allIds.length) throw new Error('Duplicate anchor in ' + file);
    pages.set(file, ids);
    if (/<script|<iframe|<form|<input|\bon\w+\s*=/i.test(text)) throw new Error('Unexpected active content in ' + file);
    if (!/lang="ru"/.test(text) || !/name="viewport"/.test(text)) throw new Error('Missing language or responsive metadata in ' + file);
  }
}

async function checkLink(target, source) {
  if (!target || target === '#') throw new Error('Empty link in ' + source);
  if (externalLinks.has(target)) return;
  if (/^[a-z]+:/i.test(target) || path.isAbsolute(target) || target.includes('..') || target.includes('\\')) throw new Error('Unreviewed link in ' + source);
  const [relative, anchor] = target.split('#');
  const destination = relative || source;
  if (!allowed.has(destination) || !(await lstat(path.join(output, destination))).isFile()) throw new Error('Missing asset: ' + destination);
  if (anchor && !pages.get(destination)?.has(anchor)) throw new Error('Missing anchor: ' + target);
}

for (const [file, text] of contents) {
  if (file.endsWith('.html')) {
    for (const [, target] of text.matchAll(/\b(?:href|src)="([^"]*)"/g)) await checkLink(target, file);
  } else if (file.endsWith('.md')) {
    for (const [, target] of text.matchAll(/\]\(([^)]+)\)/g)) await checkLink(target, file);
  }
}
console.log('PASS: ' + files.length + ' reviewed assets, exact build contents, PNG headers, links and cross-page anchors, unique IDs, responsive metadata, no active widgets or known private-data patterns in text files.');
