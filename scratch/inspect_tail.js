const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const tpIdx = s.indexOf('function togglePass', 279911);
console.log('Snippet from togglePass to end:\n', s.substring(tpIdx));
