const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');
const idx = s.indexOf('@media(max-width:960px)');
if (idx !== -1) {
  console.log(s.substring(idx, idx + 1000));
}
