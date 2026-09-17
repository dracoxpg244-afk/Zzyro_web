const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const pos = s.indexOf('class="hero-section"');
console.log('hero-section at:', pos);
if (pos !== -1) {
  console.log(s.substring(pos, pos + 2000));
}
