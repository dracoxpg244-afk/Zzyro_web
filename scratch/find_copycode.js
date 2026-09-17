const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const badPos = 140557; // where UTF-8"/> is
const copyCodePos = s.indexOf('function copyCode', badPos);
console.log('copyCodePos after badPos:', copyCodePos);
if (copyCodePos !== -1) {
  console.log('Snippet before copyCode:\n', s.substring(copyCodePos - 100, copyCodePos + 100));
}
