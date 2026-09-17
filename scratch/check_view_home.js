const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

// Check view definitions in HTML
const vHomeIdx = html.indexOf('id="view-home"');
console.log('view-home snippet:');
console.log(html.substring(vHomeIdx, vHomeIdx + 200));

// Check CSS for .view
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch[1];
const viewCss = css.match(/\.view[^{]*\{[^}]*\}/g);
console.log('view CSS rules:');
console.log(viewCss);

// Check if switchView or initReveal is called
console.log('switchView in script:');
const svMatch = html.match(/function switchView[\s\S]*?\}/);
console.log(svMatch ? svMatch[0] : 'not found');
