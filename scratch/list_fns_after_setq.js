const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const p = s.indexOf('function setQ');
console.log('p:', p);

// Let's check functions after the second setQ (pos 279911)
const afterSecond = s.substring(279911);
const fns = afterSecond.match(/function\s+[a-zA-Z0-9_]+/g);
console.log('Functions in second half after setQ:\n', fns);
