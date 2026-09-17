const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const p = s.lastIndexOf('charset="UTF-8"/>');
console.log('Last charset at:', p);
console.log(s.substring(p - 150, p + 200));
