const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

console.log('Total file length:', s.length);
console.log('Last 800 chars of file:\n', s.substring(s.length - 800));
