const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const pos = s.indexOf('hero-showcase');
console.log('hero-showcase at:', pos);
if (pos !== -1) {
  console.log(s.substring(pos - 30, pos + 1000));
}
