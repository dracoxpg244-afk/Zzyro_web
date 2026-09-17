const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const irIdx = html.indexOf('function initReveal');
console.log(html.substring(irIdx, irIdx + 500));
