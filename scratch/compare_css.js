const fs = require('fs');

const backup = fs.readFileSync('backup_original/backup_original_funcionando/public/index.html', 'utf8');
const bStart = backup.indexOf('<style>');
const bEnd = backup.indexOf('</style>');
const backupCss = backup.substring(bStart + 7, bEnd);

const build = fs.readFileSync('C:/Users/everton/.gemini/antigravity-ide/brain/7466f6dd-bf5e-4d2e-9f7f-b11bc8f23f69/scratch/build_html.js', 'utf8');
const buStart = build.indexOf('<style>');
const buEnd = build.indexOf('</style>');
const buildCss = build.substring(buStart + 7, buEnd);

console.log('Backup CSS length:', backupCss.length);
console.log('Build CSS length:', buildCss.length);

// Let's check which one matches the classes in public/index.html better
const html = fs.readFileSync('public/index.html', 'utf8');
const classRegex = /class="([^"]+)"/g;
let m;
const classesInHtml = new Set();
while ((m = classRegex.exec(html)) !== null) {
  m[1].split(/\s+/).forEach(c => classesInHtml.add(c));
}

let missingInBackup = 0;
let missingInBuild = 0;
classesInHtml.forEach(c => {
  if (!backupCss.includes('.' + c) && !backupCss.includes(c + '{')) missingInBackup++;
  if (!buildCss.includes('.' + c) && !buildCss.includes(c + '{')) missingInBuild++;
});

console.log('Missing in Backup CSS:', missingInBackup);
console.log('Missing in Build CSS:', missingInBuild);
