const fs = require('fs');
const vm = require('vm');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(targetPath, 'utf8');

const scriptReg = /<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi;
let match = scriptReg.exec(html);
if (match) {
  const code = match[1];
  try {
    new vm.Script(code, { filename: 'index.inline.js' });
    console.log('Script is valid!');
  } catch (e) {
    console.error('Syntax error details:', e);
    console.error(e.stack);
  }
}
