const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

console.log('Index 6500 to 7500:');
console.log(html.substring(6540, 7500));
