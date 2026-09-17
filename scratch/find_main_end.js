const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const mainEnd = s.indexOf('</main>');
console.log('</main> is at:', mainEnd);
if (mainEnd !== -1) {
  console.log(s.substring(mainEnd - 200, mainEnd + 200));
}
