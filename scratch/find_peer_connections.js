const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

let idx = 0;
while ((idx = s.indexOf('new RTCPeerConnection', idx)) !== -1) {
  console.log('--- RTCPeerConnection at', idx, '---');
  console.log(s.substring(Math.max(0, idx - 50), Math.min(s.length, idx + 600)));
  idx += 20;
}
