const fs = require('fs');
const orig = fs.readFileSync('backup_original/backup_original_funcionando/public/index.html', 'utf8');
const lines = orig.split('\n');

lines.forEach((l, i) => {
  if (l.includes('<aside') || l.includes('logo.png') || l.includes('class="logo"') || l.includes('sidebar')) {
    console.log((i+1) + ': ' + l.trim().slice(0, 100));
  }
});
