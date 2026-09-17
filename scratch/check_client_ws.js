const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

let pos = s.indexOf('new WebSocket');
while (pos !== -1) {
  console.log('--- WebSocket at', pos, '---');
  console.log(s.substring(pos - 50, pos + 400));
  pos = s.indexOf('new WebSocket', pos + 15);
}
