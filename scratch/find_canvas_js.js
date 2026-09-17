const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const sIdx = html.indexOf('<script>');
const script = html.substring(sIdx);

const lines = script.split('\n');
lines.forEach((l, i) => {
  if (l.includes('bg-canvas') || l.includes('getContext') || l.includes('requestAnimationFrame')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
