const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

// Find renderStreams function in the JS
const rsIdx = html.indexOf('function renderStreams');
console.log(html.substring(rsIdx, rsIdx + 2000));
