const fs = require('fs');

const orig = fs.readFileSync('backup_original/backup_original_funcionando/public/index.html', 'utf8');

let idx = orig.indexOf('.nav');
while (idx !== -1) {
  console.log(orig.substring(idx - 20, idx + 400));
  break;
}

idx = orig.indexOf('.brand');
if (idx !== -1) {
  console.log('brand:\n', orig.substring(idx - 20, idx + 400));
}
