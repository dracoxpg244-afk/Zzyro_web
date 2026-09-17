const fs = require('fs');

const s = fs.readFileSync('public/index.html', 'utf8');
const b64start = s.indexOf('data:image/png;base64');
console.log('b64start:', b64start);
if (b64start !== -1) {
  const b64end = s.indexOf('"', b64start);
  console.log('b64end:', b64end);
  console.log('Length of b64 in bytes:', b64end - b64start);
  console.log('After b64 snippet:\n', s.substring(b64end, b64end + 500));
}
