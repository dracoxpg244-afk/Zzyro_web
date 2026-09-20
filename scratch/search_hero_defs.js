const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// The hero classes (hero-h1, hero-tag, etc.) are defined in the LARGE minified block
// which was in the original backup HTML. Since it's all in one file, and there's only ONE style block, 
// the big main CSS was overwritten. Let's view lines around 100-300 of the html to see the minified CSS

// Let's check what precedes the <style> opening -- maybe there's a huge minified block somewhere else
// Let's find the large CSS chunk -- look for .hero-h1 case insensitively
const matches = [];
let regex = /hero-h1/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  matches.push(m.index);
}
console.log('hero-h1 occurrences:', matches);

// Let's try finding .hero-section or .hero-tag
regex = /\.hero-section/gi;
while ((m = regex.exec(html)) !== null) {
  console.log('.hero-section at', m.index, ':', html.substring(m.index, m.index + 200));
}

regex = /\.hero-tag/gi;
while ((m = regex.exec(html)) !== null) {
  console.log('.hero-tag at', m.index, ':', html.substring(m.index, m.index + 200));
}

regex = /\.hero-h1/gi;
while ((m = regex.exec(html)) !== null) {
  console.log('.hero-h1 at', m.index, ':', html.substring(m.index, m.index + 200));
}
