const fs = require('fs');

const orig = fs.readFileSync('backup_original/backup_original_funcionando/public/index.html', 'utf8');
console.log('Original length:', orig.length);
console.log('Has logo.png in original:', orig.includes('/assets/logo.png') || orig.includes('logo.png'));
console.log('Has base64:', orig.includes('data:image/png;base64'));
console.log('Has position:sticky:', orig.includes('position:sticky'));
console.log('Has q-pills:', orig.includes('q-pills'));
console.log('Has setQ:', orig.includes('function setQ'));
console.log('Has optimizeSDP:', orig.includes('optimizeSDP'));
