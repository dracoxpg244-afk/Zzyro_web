const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const cvsIdx = html.indexOf('bg-canvas');
console.log(html.substring(cvsIdx - 50, cvsIdx + 1500));
