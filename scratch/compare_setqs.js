const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

console.log('--- At 138968 ---');
console.log(s.substring(138900, 139200));

console.log('--- At 279911 ---');
console.log(s.substring(279850, 280200));
