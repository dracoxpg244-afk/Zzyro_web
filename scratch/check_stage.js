const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');
const idx = s.indexOf('host-voice-stage');
console.log('Context around first occurrence:');
console.log(s.slice(Math.max(0, idx - 200), idx + 200));
