const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const vs = s.indexOf('id="view-settings"');
console.log(s.substring(vs, vs + 2000));
