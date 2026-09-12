import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setTimeout } from 'node:timers/promises';
import { publicFiles } from './public-files.mjs';

const origin = 'https://alekseylevin.codeberg.page/';
const files = publicFiles;
const expected = new Map(await Promise.all(files.map(async (file) => [
  file, await readFile(new URL('../dist/' + file, import.meta.url)),
])));

// Pages updates through a webhook, so allow time for the new commit to arrive.
for (let attempt = 1; attempt <= 8; attempt++) {
  try {
    await Promise.all(files.map(async (file) => {
      const response = await fetch(new URL(file === 'index.html' ? '' : file, origin), {
        cache: 'no-store',
        signal: AbortSignal.timeout(20_000),
      });
      assert.equal(response.status, 200, file + ': expected HTTP 200');
      assert.deepEqual(Buffer.from(await response.arrayBuffer()), expected.get(file), file + ': published content differs');
    }));
    console.log('PASS: all ' + files.length + ' public files match dist at ' + origin);
    break;
  } catch (error) {
    if (attempt === 8) throw error;
    console.log('Pages update not ready yet; retry ' + attempt + '/8.');
    await setTimeout(15_000);
  }
}
