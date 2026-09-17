const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const s = html.indexOf('id="view-viewer"');
const e = html.indexOf('</section>', s);
const sub = html.substring(s, e);
const lines = sub.split('\n');
let depth = 0;
lines.forEach((l, i) => {
  const o = (l.match(/<div\b/g) || []).length;
  const c = (l.match(/<\/div>/g) || []).length;
  depth += (o - c);
  if (depth < 0) console.log('depth < 0 at line', i+1, l);
});
console.log('final depth in viewer:', depth);
