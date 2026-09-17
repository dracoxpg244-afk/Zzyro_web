const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const sdpIdx = s.indexOf('sdp');
console.log('Searching for sdp modification:');
let pos = 0;
while ((pos = s.indexOf('setLocalDescription', pos)) !== -1) {
  console.log('--- setLocalDescription around', pos, '---');
  console.log(s.substring(pos - 100, pos + 500));
  pos += 30;
}
