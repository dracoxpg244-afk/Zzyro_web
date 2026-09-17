const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const p = s.indexOf('chat-send') !== -1 ? s.indexOf('chat-send') : s.indexOf('c-send');
console.log('chat send pos:', p);

// search for chat input container
const m = s.match(/<button[^>]*send[^>]*>[\s\S]*?<\/button>/gi);
console.log('Send buttons found:\n', m);

// search for .c-send or .btn-send in css
const m2 = s.match(/\.(c-send|btn-send|chat-send)[^{]*\{[^}]*\}/g);
console.log('Send button CSS:\n', m2);
