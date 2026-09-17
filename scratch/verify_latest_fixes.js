const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const checks = {
  'system-entered class': s.includes('system-entered'),
  'sb-widget-card HTML': s.includes('sb-widget-card'),
  'bg-canvas opacity:0': s.includes('opacity: 0'),
  'bg-canvas transition': s.includes('transition: opacity 1.4s'),
  'body.system-entered': s.includes('body.system-entered'),
  'finishIntro adds class': s.includes("document.body.classList.add('system-entered')"),
  'set-title color:var(--text)': s.includes('color:var(--text)') || s.includes('color: var(--text)'),
  'showcase border-top none': s.includes('border-top: none !important'),
  'hero-features margin-top 56px': s.includes('margin-top: 56px'),
};

Object.entries(checks).forEach(([k, v]) => console.log((v ? '✓' : '✗') + ' ' + k));
