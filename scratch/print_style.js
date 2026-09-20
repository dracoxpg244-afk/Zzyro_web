const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const sStart = html.indexOf('<style>');
const sEnd = html.indexOf('</style>');
console.log(html.substring(sStart, sEnd + 8));
