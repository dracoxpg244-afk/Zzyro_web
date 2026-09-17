const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(targetPath, 'utf8');

// Verify all the critical changes
const checks = {
  'Splash uses img2.png': html.includes("url('/assets/img2.png') center center / cover"),
  'Splash has progress bar': html.includes('class="splash-prog-fill"'),
  'Splash has status text': html.includes('id="splash-status"'),
  'runSplashBar function exists': html.includes('function runSplashBar()'),
  'Hero h1 has CSS': html.includes('.hero-h1 {'),
  'Hero-tag has CSS': html.includes('.hero-tag {'),
  'btn-hero-primary has CSS': html.includes('.btn-hero-primary {'),
  'btn-hero-secondary has CSS': html.includes('.btn-hero-secondary {'),
  'No blue button in splash': !html.includes('class="splash-skip-pill"'),
  'Splash.out has opacity': html.includes('#splash.out { opacity: 0;'),
  'Progress bar is white': html.includes('background: #ffffff;') && html.includes('splash-prog-fill'),
  'Body is clean dark': html.includes('background: var(--bg-deep) !important;'),
  'No blue logo shadow': !html.includes('drop-shadow(0 0 10px rgba(59,130,246,.5))') && !html.includes('drop-shadow(0 0 16px rgba(59,130,246,.7))'),
  'Compartilhe tudo is white': html.includes('-webkit-text-fill-color:#ffffff'),
  'P2P removed': (html.match(/p2p/gi) || []).length <= 2, // only in the AES key constant
};

Object.entries(checks).forEach(([name, ok]) => {
  console.log((ok ? '✅' : '❌') + ' ' + name);
});
