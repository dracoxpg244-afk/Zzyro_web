const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

console.log('From 140500 to 141500:\n', s.substring(140500, 141500));
