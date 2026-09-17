const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

// Find all classes in HTML
const classRegex = /class="([^"]+)"/g;
let m;
const classesInHtml = new Set();
while ((m = classRegex.exec(html)) !== null) {
  m[1].split(/\s+/).forEach(c => classesInHtml.add(c));
}

// Find all classes in CSS
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch ? styleMatch[1] : '';

const missing = [];
classesInHtml.forEach(c => {
  if (!css.includes('.' + c) && !css.includes(c + '{') && !css.includes(c + ' ') && !css.includes(c + ':')) {
    missing.push(c);
  }
});
console.log('Total classes in HTML:', classesInHtml.size);
console.log('Missing classes in CSS count:', missing.length);
console.log('Sample missing classes:', missing.slice(0, 40));
