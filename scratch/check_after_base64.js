const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const bIdx = html.indexOf('data:image/png;base64,');
const quoteEnd = html.indexOf('"', bIdx);
console.log('Base64 ends at:', quoteEnd);
console.log('After base64 (500 chars):');
console.log(html.substring(quoteEnd, quoteEnd + 500));
