const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

// Find .sc (stream card) and .btn-watch styles
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/g);
const allCss = styleMatch ? styleMatch.map(s => s).join('\n') : '';

const scRules = allCss.match(/\.sc[^,{]*\{[^}]*\}/g);
const btnWatchRules = allCss.match(/\.btn-watch[^,{]*\{[^}]*\}/g);

console.log('.sc rules:', scRules);
console.log('.btn-watch rules:', btnWatchRules);

// Check the HTML for the stream card area
const scHtmlIdx = html.indexOf('class="sc"');
if (scHtmlIdx !== -1) {
  console.log('\nStream card HTML:');
  console.log(html.substring(scHtmlIdx - 50, scHtmlIdx + 600));
}
