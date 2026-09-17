const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

// Find all CSS rules for #app, .sb, .main, body, html
const css = s.substring(s.indexOf('<style>') + 7, s.indexOf('</style>'));
const rules = css.match(/(#app|\.sb|\.main|html|body)[^{]*\{[^}]*\}/g);
console.log('Layout rules:');
rules.forEach(r => console.log(r));
