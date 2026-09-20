const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const sIdx = html.indexOf('/* ── SIDEBAR ── */');
console.log(html.substring(sIdx, sIdx + 1200));

const appIdx = html.indexOf('/* ── APP LAYOUT ── */');
console.log(html.substring(appIdx, appIdx + 600));
