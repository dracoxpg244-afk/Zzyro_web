const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Ensure view-home has class="view active"
html = html.replace('<div class="view" id="view-home">', '<div class="view active" id="view-home">');

// 2. In finishIntro, ensure switchView('home') and shown classes are applied
const oldFinish = `  try { checkFirstVisit(); } catch(e) {}
  try { initReveal(); } catch(e) {}`;

const newFinish = `  try { switchView('home'); } catch(e) {}
  try { checkFirstVisit(); } catch(e) {}
  try { initReveal(); } catch(e) {}
  try {
    document.querySelectorAll('#view-home .reveal, #view-home .reveal-l, #view-home .reveal-r').forEach(el => el.classList.add('shown'));
  } catch(e) {}`;

html = html.replace(oldFinish, newFinish);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Fixed view-home and finishIntro! File size:', fs.statSync('public/index.html').size);
