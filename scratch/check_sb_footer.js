const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const pos = s.indexOf('class="sb-footer"');
if (pos !== -1) {
  console.log(s.substring(pos, pos + 800));
}
