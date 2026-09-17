const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const p1 = s.indexOf('function setQ');
console.log('--- setQ ---');
console.log(s.substring(p1, p1 + 600));

const p2 = s.indexOf('applyOptimalSenderParams');
console.log('--- applyOptimalSenderParams ---');
console.log(s.substring(p2, p2 + 800));
