const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const b64start = s.indexOf('data:image/png;base64,');
const b64end = s.indexOf('"', b64start);
const b64Data = s.substring(b64start + 22, b64end);
const buf = Buffer.from(b64Data, 'base64');
console.log('Decoded b64 length in bytes:', buf.length);

const logoBuf = fs.readFileSync('public/assets/logo.png');
console.log('assets/logo.png length in bytes:', logoBuf.length);
console.log('Is identical:', buf.equals(logoBuf));
