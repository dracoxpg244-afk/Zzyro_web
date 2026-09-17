const fs = require('fs');

const orig = fs.readFileSync('backup_original/backup_original_funcionando/public/index.html', 'utf8');

const p = orig.indexOf('function setQ');
console.log('In orig, setQ is at:', p);
console.log(orig.substring(p, p + 900));
