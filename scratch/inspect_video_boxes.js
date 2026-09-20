const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const sIdx = html.indexOf('id="host-live-badge"');
console.log('--- host video box ---');
console.log(html.substring(sIdx - 100, sIdx + 700));

const vIdx = html.indexOf('id="viewer-live"');
console.log('--- viewer video box ---');
console.log(html.substring(vIdx - 100, vIdx + 700));
