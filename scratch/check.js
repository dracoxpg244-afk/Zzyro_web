const fs = require('fs');
const h = fs.readFileSync('public/index.html', 'utf8');
const l = h.split('\n');
let count = 0;
l.forEach((x, i) => {
  if ((x.includes('class') && x.includes('evt')) || x.includes('evts-card') || x.includes('evts-list') || x.includes('evts-tab')) {
    if (count < 25) console.log(i+1, ':', x.trim().substring(0, 100));
    count++;
  }
});
