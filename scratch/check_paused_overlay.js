const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

// Check paused overlay logic
const pausedPos = s.indexOf('paused-overlay');
console.log('paused-overlay at:', pausedPos);
if (pausedPos !== -1) {
  console.log(s.substring(pausedPos - 50, pausedPos + 800));
}

// Check where paused overlay is triggered in JS
let idx = 0;
while ((idx = s.indexOf('paused-overlay', idx)) !== -1) {
  console.log('paused-overlay mentioned at', idx);
  console.log(s.substring(idx - 50, idx + 200));
  idx += 15;
}
