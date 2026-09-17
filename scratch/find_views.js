const fs = require('fs');
const content = fs.readFileSync('public/index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('<section class="view"') || l.includes('<main class="main">') || l.includes('class="content"') || l.includes('<footer')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
