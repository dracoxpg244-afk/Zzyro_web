const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const pos = s.indexOf('CSECRET');
console.log('CSECRET pos:', pos);
if (pos !== -1) {
  console.log(s.substring(pos - 20, pos + 200));
}
