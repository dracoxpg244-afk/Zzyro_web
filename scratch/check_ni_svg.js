const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const p = s.indexOf('.ni svg');
console.log('ni svg snippet:');
if (p !== -1) {
  console.log(s.substring(p - 50, p + 200));
} else {
  console.log('ni svg not found directly');
}

// search for .ni in CSS
const m = s.match(/\.ni[^{]*\{[^}]*\}/g);
console.log('Matches for .ni:\n', m);
