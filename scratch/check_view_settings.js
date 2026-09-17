const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const vsIdx = s.indexOf('id="view-settings"');
console.log('view-settings at:', vsIdx);
console.log('500 chars before view-settings:\n', s.substring(vsIdx - 500, vsIdx));
console.log('500 chars of view-settings:\n', s.substring(vsIdx, vsIdx + 500));
