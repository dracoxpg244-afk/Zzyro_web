const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');
const lines = s.split('\n');

// Find inline color:#fff in style attributes
const issues = [];
lines.forEach((l, i) => {
  const lower = l.toLowerCase();
  if (lower.includes('style=') && (lower.includes('color:#fff') || lower.includes('color: #fff') || lower.includes('color:white') || lower.includes('color: white') || lower.includes('color:#ffffff'))) {
    issues.push({line: i+1, text: l.trim().slice(0, 120)});
  }
});

console.log('Inline white color issues:', issues.length);
issues.forEach(({line, text}) => console.log(line + ': ' + text));

// Also check for wallpaper, img1, img2 references
const refs = ['img1.png', 'img2.png', 'splash background', 'wallpaper'];
refs.forEach(r => {
  const count = (s.match(new RegExp(r.replace('.', '\\.'), 'gi')) || []).length;
  if (count > 0) console.log('Ref:', r, '->', count, 'occurrences');
});

// Check data directory
try {
  const dataFiles = fs.readdirSync('data');
  console.log('\nData directory:', dataFiles);
} catch(e) {
  console.log('No data directory');
}
