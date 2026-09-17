const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const head = html.substring(html.indexOf('<head>'), html.indexOf('</head>'));
console.log(head);
