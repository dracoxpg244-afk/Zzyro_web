const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const ft = s.indexOf('class="app-footer"');
console.log(s.substring(ft, ft + 1200));
