import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicFiles } from './public-files.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const files = publicFiles;

await mkdir(output, { recursive: true });
// Only the allowlist is published. Refuse unexpected files rather than copying
// a repository and attempting to remove private material afterwards.
for (const entry of await readdir(output)) {
  if (!files.includes(entry)) throw new Error('Unexpected dist entry: ' + entry);
}
for (const file of files) {
  const contents = await readFile(path.join(root, file));
  await writeFile(path.join(output, file), contents);
}
console.log('Built dist with exactly: ' + files.join(', '));
