const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(targetPath, 'utf8');

// Find the large inline CSS block that has the hero styling
// We need to find classes like .hero-h1, .grad, etc.
const heroIdx = html.indexOf('hero-h1');
console.log('hero-h1 at:', heroIdx);
if (heroIdx !== -1) {
  console.log(html.substring(heroIdx - 200, heroIdx + 500));
}

// Search for .grad
const gradIdx = html.indexOf('.grad');
console.log('\n.grad at:', gradIdx);
if (gradIdx !== -1) {
  console.log(html.substring(gradIdx, gradIdx + 300));
}
