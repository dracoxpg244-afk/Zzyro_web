const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(targetPath, 'utf8');

// Check splash markup
const sIdx = html.indexOf('id="splash"');
console.log('--- SPLASH MARKUP ---');
console.log(html.substring(sIdx - 5, sIdx + 500));

// Check splash CSS
const splashCSS = html.match(/#splash\s*\{[^}]*\}/);
console.log('\n--- SPLASH CSS ---');
console.log(splashCSS ? splashCSS[0] : 'NOT FOUND');

// Check finishIntro / runSplashBar
const rbIdx = html.indexOf('runSplashBar');
console.log('\n--- runSplashBar exists:', rbIdx !== -1, 'at index', rbIdx);

// Check finishIntro JS block
const fiIdx = html.indexOf('function finishIntro()');
const end = html.indexOf('\n}', fiIdx + 20) + 2;
console.log('\n--- finishIntro function ---');
console.log(html.substring(fiIdx, end));

// Check hero gradient
const gradIdx = html.indexOf('compartilhe tudo');
console.log('\n--- Hero text ---');
console.log(html.substring(gradIdx - 20, gradIdx + 120));
