const fs = require('fs');

const build = fs.readFileSync('C:/Users/everton/.gemini/antigravity-ide/brain/7466f6dd-bf5e-4d2e-9f7f-b11bc8f23f69/scratch/build_html.js', 'utf8');
const buStart = build.indexOf('<style>');
const buEnd = build.indexOf('</style>');
const buildCss = build.substring(buStart + 7, buEnd);

// Let's find any blue/rainbow colors
const colorMatches = buildCss.match(/(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\)|linear-gradient\([^)]+\))/g) || [];
console.log('Sample color declarations:');
const uniqueColors = [...new Set(colorMatches)];
console.log(uniqueColors.filter(c => c.includes('blue') || c.includes('3b82f6') || c.includes('60a5fa') || c.includes('2563eb') || c.includes('linear-gradient')));
