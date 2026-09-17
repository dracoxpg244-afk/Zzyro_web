const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const sStart = html.indexOf('/* Botão Gerar Código */');
const sEnd = html.indexOf('</style>');
console.log(html.substring(sStart, sEnd));
