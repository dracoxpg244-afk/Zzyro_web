const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const idx = html.indexOf('Transmita');
if (idx !== -1) {
  console.log('--- HERO SECTION ---');
  console.log(html.substring(idx - 200, idx + 800));
} else {
  console.log('Transmita not found');
}
