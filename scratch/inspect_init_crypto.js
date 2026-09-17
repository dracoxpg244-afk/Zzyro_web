const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const pos = s.indexOf('initCrypto');
console.log('initCrypto at:', pos);
if (pos !== -1) {
  console.log(s.substring(pos, pos + 1500));
}
