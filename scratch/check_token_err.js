const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const p = s.indexOf('/* ═══════════ ESTADO GLOBAL');
console.log(s.substring(p - 100, p + 200));
