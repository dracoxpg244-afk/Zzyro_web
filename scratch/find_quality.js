const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const sqIdx = html.indexOf('function setQuality');
console.log(html.substring(sqIdx, sqIdx + 800));
