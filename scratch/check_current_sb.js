const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const sbMatch = s.match(/\.sb\{[^}]+\}/g);
console.log('Matches for .sb in index.html:\n', sbMatch);

const mainMatch = s.match(/\.main\{[^}]+\}/g);
console.log('Matches for .main in index.html:\n', mainMatch);
