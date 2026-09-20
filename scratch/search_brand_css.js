const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const regex = /\.brand-icon[^{]*\{[^}]*\}/g;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(match[0]);
}

const regex2 = /\.brand[^{]*\{[^}]*\}/g;
while ((match = regex2.exec(html)) !== null) {
  console.log(match[0]);
}
