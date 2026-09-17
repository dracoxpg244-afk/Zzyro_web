const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const qpDivIdx = s.indexOf('<div class="q-pills">');
console.log('HTML <div class="q-pills">: pos =', qpDivIdx);
if (qpDivIdx !== -1) {
  console.log(s.substring(qpDivIdx, qpDivIdx + 700));
}

const applyPos = s.indexOf('applyOptimalSenderParams');
console.log('applyOptimalSenderParams: pos =', applyPos);
if (applyPos !== -1) {
  console.log(s.substring(applyPos, applyPos + 800));
}
