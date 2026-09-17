const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

// Find view-home
const vHomeIdx = html.indexOf('id="view-home"');
const vBroadcastIdx = html.indexOf('id="view-broadcast"');
console.log(html.substring(vHomeIdx, vHomeIdx + 2500));
