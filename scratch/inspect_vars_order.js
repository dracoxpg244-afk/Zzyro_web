const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const sIdx = html.indexOf('<script>');
console.log(html.substring(sIdx, sIdx + 500));

const estadoIdx = html.indexOf('/* ═══════════ ESTADO ═══════════ */');
console.log('--- ESTADO snippet ---');
console.log(html.substring(estadoIdx, estadoIdx + 600));
