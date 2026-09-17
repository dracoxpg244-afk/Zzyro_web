const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

// search for hcb-btn, pr-btn, btn-gen, c-send
const terms = ['hcb-btn', 'btn-gen', 'copy-btn', 'c-send', 'chat-send', 'qp.active', 'pr-copy'];
terms.forEach(t => {
  const m = s.match(new RegExp('\\.' + t.replace('.', '\\.') + '[^{]*\\{[^}]*\\}', 'g'));
  console.log(`CSS for ${t}:`, m);
});

// also find in HTML where NEO-4680 or ZONE-5265 buttons are
const p1 = s.indexOf('hcb-btn');
if (p1 !== -1) {
  console.log('\nhcb-btn snippet in HTML:\n', s.substring(p1 - 50, p1 + 250));
}
