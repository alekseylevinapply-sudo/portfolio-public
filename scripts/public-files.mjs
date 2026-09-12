import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Reviewed files only. Keep names flat so every publishing step shares one list.
export const publicFiles = Object.freeze([
  'index.html', 'resume.html', 'resume.md', 'styles.css', 'favicon.svg',
  'site-leads.html', 'site-leads-home.png', 'site-leads-form.png',
  'site-leads-accepted.png', 'site-leads-cms.png', 'site-leads-operator.png',
  'site-leads-crm.png',
  'jhipster-leads.html', 'jhipster-leads-home.png',
  'jhipster-leads-mobile.png', 'jhipster-leads-operator.png',
]);

if (new Set(publicFiles).size !== publicFiles.length || publicFiles.some((file) => !/^[a-z0-9][a-z0-9.-]*$/.test(file))) {
  throw new Error('Invalid public-file allowlist.');
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(publicFiles.join('\n'));
}
