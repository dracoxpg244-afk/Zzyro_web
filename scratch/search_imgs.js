const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

console.log('Includes img1.png:', s.includes('img1.png'));
console.log('Includes img2.png:', s.includes('img2.png'));
let idx = 0;
while ((idx = s.indexOf('img2', idx)) !== -1) {
  console.log('img2 at', idx, s.substring(idx - 30, idx + 50));
  idx += 5;
}
