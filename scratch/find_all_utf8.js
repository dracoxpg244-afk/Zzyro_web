const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

let pos = 0;
while ((pos = s.indexOf('UTF-8"/>', pos)) !== -1) {
  console.log('UTF-8"/> at pos:', pos);
  console.log(s.substring(Math.max(0, pos - 80), Math.min(s.length, pos + 80)));
  pos += 8;
}
