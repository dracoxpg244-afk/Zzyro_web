const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/g);
const allCss = styleMatch ? styleMatch.map(s => s).join('\n') : '';

// Find all rules that use var(--blue) 
const blueVarMatches = allCss.match(/[^{]+\{[^}]*var\(--blue\)[^}]*\}/g) || [];
console.log('Rules using var(--blue):');
blueVarMatches.forEach(r => console.log(' ', r.trim().substring(0, 120)));
