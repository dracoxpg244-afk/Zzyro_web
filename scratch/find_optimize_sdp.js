const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const pos = s.indexOf('function optimizeSDP');
console.log(s.substring(pos, pos + 2500));
