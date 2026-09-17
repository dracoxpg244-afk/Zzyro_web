const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

const badIdx = html.indexOf('}charset="UTF-8"/>');
const resumeIdx = html.indexOf('let driftTimer = null;');

if (badIdx !== -1 && resumeIdx !== -1 && resumeIdx > badIdx) {
  html = html.substring(0, badIdx + 1) + '\n\n' + html.substring(resumeIdx);
  fs.writeFileSync(targetPath, html, 'utf8');
  console.log('Removed duplicate section! New size:', html.length);
} else {
  console.error('Indices not found or invalid');
}
