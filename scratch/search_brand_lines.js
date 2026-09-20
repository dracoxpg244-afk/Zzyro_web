const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const regex = /\.sb[^{]*\{[^}]*\}/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(match[0]);
}

// Let's search for "brand" anywhere in <style>
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>');
const styleContent = html.substring(styleStart, styleEnd);
const lines = styleContent.split('\n');
lines.forEach((l, i) => {
  if (/brand/i.test(l)) {
    console.log(`Line ${i+1}: ${l}`);
  }
});
