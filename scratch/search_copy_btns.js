const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const p = s.indexOf('copyCode');
while (p !== -1) {
  console.log('copyCode at', p);
  console.log(s.substring(p - 80, p + 150));
  break;
}

const p2 = s.indexOf('hcb-code');
if (p2 !== -1) {
  console.log('\nhcb-code snippet:\n', s.substring(p2 - 50, p2 + 350));
}

// Check where NEO-4680 or private room ready is
const p3 = s.indexOf('Sala Privada Pronta');
if (p3 !== -1) {
  console.log('\nSala Privada Pronta snippet:\n', s.substring(p3 - 50, p3 + 400));
}
