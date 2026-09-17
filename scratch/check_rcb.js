const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const rcb = s.indexOf('.room-code-box');
if (rcb !== -1) {
  console.log(s.substring(rcb, rcb + 400));
}
