const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

console.log('Searching for hero-h1:');
const hIdx = html.indexOf('hero-h1');
while (hIdx !== -1) {
  console.log('hero-h1 at', hIdx);
  break;
}

// Check linked css or if styles were lost or in another file
const linkMatches = html.match(/<link[^>]*>/gi);
console.log('Link tags:', linkMatches);

// Check if there are css files in public
console.log('Files in public:', fs.readdirSync('public'));
if (fs.existsSync('public/css')) {
  console.log('Files in public/css:', fs.readdirSync('public/css'));
}
