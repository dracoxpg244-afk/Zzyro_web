const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const ansIdx = html.indexOf("case 'answer'");
console.log(html.substring(ansIdx, ansIdx + 500));
