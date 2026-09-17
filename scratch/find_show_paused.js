const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

let idx = 0;
while ((idx = s.indexOf('showPaused', idx)) !== -1) {
  console.log('showPaused at', idx);
  console.log(s.substring(idx - 100, idx + 200));
  idx += 10;
}
