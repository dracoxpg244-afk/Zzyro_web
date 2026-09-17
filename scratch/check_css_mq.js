const fs = require('fs');

const s = fs.readFileSync('public/index.html', 'utf8');
const headEnd = s.indexOf('</head>');
const css = s.substring(s.indexOf('<style>') + 7, s.indexOf('</style>'));

console.log('CSS length:', css.length);

// Check media queries
const mq = css.match(/@media[^{]+\{/g);
console.log('Media queries found:', mq);

// Check footer
const hasFooter = s.includes('footer') || s.includes('direitos');
console.log('Has footer or direitos:', hasFooter);
const footerMatches = s.match(/<footer[\s\S]*?<\/footer>/gi);
console.log('Footer matches:', footerMatches);
