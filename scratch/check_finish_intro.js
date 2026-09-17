const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const fiIdx = html.indexOf('function finishIntro');
console.log(html.substring(fiIdx, fiIdx + 600));
