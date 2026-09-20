const fs = require('fs');

const buildHtml = fs.readFileSync('C:/Users/everton/.gemini/antigravity-ide/brain/7466f6dd-bf5e-4d2e-9f7f-b11bc8f23f69/scratch/build_html.js', 'utf8');
const sStart = buildHtml.indexOf('<style>');
const sEnd = buildHtml.indexOf('</style>');
const buildCss = buildHtml.substring(sStart + 7, sEnd);

const html = fs.readFileSync('public/index.html', 'utf8');
const classRegex = /class="([^"]+)"/g;
let m;
const classesInHtml = new Set();
while ((m = classRegex.exec(html)) !== null) {
  m[1].split(/\s+/).forEach(c => classesInHtml.add(c));
}

const stillMissing = [];
classesInHtml.forEach(c => {
  if (!buildCss.includes('.' + c) && !buildCss.includes(c + '{') && !buildCss.includes(c + ' ') && !buildCss.includes(c + ':')) {
    stillMissing.push(c);
  }
});
console.log('Build CSS length:', buildCss.length);
console.log('Classes missing if we use buildCss:', stillMissing);
