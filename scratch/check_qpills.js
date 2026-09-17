const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const qpIdx = s.indexOf('q-pills');
if (qpIdx !== -1) {
  console.log('q-pills snippet:\n', s.substring(qpIdx - 50, qpIdx + 600));
}

const setqIdx = s.indexOf('function setQ');
if (setqIdx !== -1) {
  console.log('function setQ snippet:\n', s.substring(setqIdx - 50, setqIdx + 700));
}
