const fs = require('fs');
const path = require('path');

const backupPath = path.join('backup_original', 'backup_original_funcionando', 'public', 'index.html');
const backup = fs.readFileSync(backupPath, 'utf8');

// Find the large minified CSS in backup
const styleStart = backup.indexOf('<style>') + 7;
const styleEnd = backup.indexOf('</style>');
const css = backup.substring(styleStart, styleEnd);
console.log('Backup CSS length:', css.length);

// Find hero in backup CSS
const heroIdx = css.indexOf('hero');
console.log('hero in backup CSS:', heroIdx);
if (heroIdx !== -1) {
  console.log('Hero CSS context:', css.substring(Math.max(0, heroIdx - 100), heroIdx + 2000));
}
