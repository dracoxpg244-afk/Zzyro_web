const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const qpIdx = html.lastIndexOf('class="q-pills"');
console.log(html.substring(qpIdx - 50, qpIdx + 500));
