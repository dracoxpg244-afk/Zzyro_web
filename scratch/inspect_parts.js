const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const bIdx = html.indexOf('class="brand"');
if (bIdx !== -1) {
  // slice from bIdx to 1000 chars later, but omitting base64
  let snippet = html.substring(bIdx, bIdx + 1500);
  snippet = snippet.replace(/data:image\/png;base64,[^"]+/, '[BASE64_IMAGE]');
  console.log(snippet);
}

const cssBrand = html.match(/\.brand[^{]*\{[^}]*\}/gi);
console.log('--- CSS .brand ---', cssBrand);
const cssBrandName = html.match(/\.brand-name[^{]*\{[^}]*\}/gi);
console.log('--- CSS .brand-name ---', cssBrandName);
const cssBrandSub = html.match(/\.brand-sub[^{]*\{[^}]*\}/gi);
console.log('--- CSS .brand-sub ---', cssBrandSub);
