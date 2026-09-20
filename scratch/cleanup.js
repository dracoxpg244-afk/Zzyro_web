const fs = require('fs');
let h = fs.readFileSync('public/index.html', 'utf8');

// Find the old qwb-left block and remove it until </section>
const OLD_START = '          <div class="qwb-left">';
const OLD_END = '      </section>\n\n      <!-- ══ 3. SALAS PRIVADAS ══ -->';

const si = h.indexOf(OLD_START);
const ei = h.indexOf(OLD_END);

if (si === -1) { console.log('NOT FOUND: OLD_START'); process.exit(1); }
if (ei === -1) { console.log('NOT FOUND: OLD_END'); process.exit(1); }

console.log('OLD block found at bytes', si, '-', ei);
console.log('Removing', ei - si, 'bytes');

h = h.slice(0, si) + '\n' + h.slice(ei);
fs.writeFileSync('public/index.html', h);
console.log('Done. New size:', h.length);
