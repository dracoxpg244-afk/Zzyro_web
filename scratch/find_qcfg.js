const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const regex = /qCfg/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log(html.substring(m.index - 50, m.index + 150));
  console.log('---');
}
