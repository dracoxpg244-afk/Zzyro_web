const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const pos = s.indexOf('function setQ');
if (pos !== -1) {
  console.log(s.substring(pos, pos + 800));
}
let qPos = s.indexOf('qCfg');
if (qPos !== -1) {
  console.log('qCfg definition snippet:\n', s.substring(qPos - 30, qPos + 400));
}
