const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

const styleStart = html.indexOf('<style>') + 7;
const styleEnd = html.indexOf('</style>');
const css = html.substring(styleStart, styleEnd);

// hero is at index 2075 in css
const heroCtx = css.substring(2000, 3000);
console.log(heroCtx);
