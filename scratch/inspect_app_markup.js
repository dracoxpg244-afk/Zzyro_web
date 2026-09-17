const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const appIdx = html.indexOf('<div id="app">');
console.log(html.substring(appIdx, appIdx + 800));
