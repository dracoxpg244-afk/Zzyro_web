const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

let pos = 0;
while ((pos = s.indexOf('function setQ', pos)) !== -1) {
  console.log('function setQ at:', pos);
  pos += 13;
}
