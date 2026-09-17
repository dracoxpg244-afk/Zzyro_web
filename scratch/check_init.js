const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

// Search for calls to switchView
const matches = [...html.matchAll(/switchView\([^)]*\)/g)];
console.log('switchView calls:', matches.map(m => m[0]));

// Search for DOMContentLoaded or window.onload
const loadMatches = [...html.matchAll(/addEventListener\(['"]DOMContentLoaded['"][\s\S]*?\)/g)];
console.log('DOMContentLoaded listeners:');
loadMatches.forEach(m => console.log(m[0].substring(0, 150)));

// Also check .reveal classes
console.log('reveal CSS rules:');
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
const css = styleMatch[1];
console.log(css.match(/\.reveal[^{]*\{[^}]*\}/g));
