const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const badPos = 140557;
const copyCodePos = s.indexOf('function copyCode', badPos);
console.log('Between badPos and copyCodePos:');
console.log(s.substring(copyCodePos - 500, copyCodePos));
