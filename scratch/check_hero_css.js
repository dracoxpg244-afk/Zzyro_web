const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const classes = ['hero-badge', 'hero-h1', 'line1', 'grad', 'hero-sub', 'btn-hero-primary', 'btn-hero-secondary'];
classes.forEach(cls => {
  const reg = new RegExp(`\\.${cls}[^{]*\\{[^}]*\\}`, 'g');
  const matches = html.match(reg);
  console.log(`=== .${cls} ===`, matches);
});
