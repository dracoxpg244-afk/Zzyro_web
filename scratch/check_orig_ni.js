const fs = require('fs');

const orig = fs.readFileSync('backup_original/backup_original_funcionando/public/index.html', 'utf8');
const p = orig.indexOf('.brand{');
console.log(orig.substring(p, p + 1200));
