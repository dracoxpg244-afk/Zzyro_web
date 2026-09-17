const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const iceIdx = s.indexOf('ICE');
console.log('ICE definition snippet:');
let pos = s.indexOf('ICE =');
if (pos === -1) pos = s.indexOf('ICE=');
if (pos !== -1) {
  console.log(s.substring(pos - 50, pos + 400));
}
