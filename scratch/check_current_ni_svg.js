const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

// Check .ni svg in the file
const matches = s.match(/\.ni\s+svg[^{]*\{[^}]*\}/g);
console.log('.ni svg matches:', matches);

// Check .sb styles
const sbMatches = s.match(/\.sb[^{]*\{[^}]*\}/g);
console.log('.sb matches:', sbMatches);

// Check .brand-icon styles
const biMatches = s.match(/\.brand-icon[^{]*\{[^}]*\}/g);
console.log('.brand-icon matches:', biMatches);
