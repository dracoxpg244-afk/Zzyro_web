const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const bIdx = html.indexOf('class="brand"');
const afterImg = html.indexOf('</img>', bIdx) !== -1 ? html.indexOf('</img>', bIdx) : html.indexOf('"/>', bIdx) !== -1 ? html.indexOf('"/>', bIdx) : html.indexOf('">', bIdx + 30);
// let's find the closing of <div class="brand">
const endBrand = html.indexOf('</aside>', bIdx);
console.log('After img in brand:');
let snippet = html.substring(bIdx, endBrand);
snippet = snippet.replace(/data:image\/png;base64,[^"]+/, '[BASE64]');
console.log(snippet);
