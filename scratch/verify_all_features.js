const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(targetPath, 'utf8');

const checks = [
  { name: 'Sidebar fixed position', pass: html.includes('position:fixed;top:0;left:0;bottom:0;') || html.includes('position:fixed') },
  { name: 'Main margin-left offset', pass: html.includes('margin-left:var(--sw)') },
  { name: 'Footer direitos reservados', pass: html.includes('© 2026 Zyro Stream Technologies. Todos os direitos reservados.') },
  { name: 'Sidebar footer copyright', pass: html.includes('© 2026 Zyro Stream') },
  { name: '4K Ultra quality pill', pass: html.includes('data-q="4k"') },
  { name: 'Gamer quality pill', pass: html.includes('data-q="gamer"') },
  { name: 'Logo cached asset path', pass: html.includes('/assets/logo.png') },
  { name: 'No gigantic base64 in HTML', pass: !html.includes('data:image/png;base64,iVBORw0KGgo') },
  { name: 'optimizeSDP function', pass: html.includes('function optimizeSDP') },
  { name: '320kbps Opus audio in SDP', pass: html.includes('maxaveragebitrate=320000') },
  { name: 'applyOptimalSenderParams with 18Mbps 4K support', pass: html.includes('3840') && html.includes('18000000') },
  { name: 'Low latency jitter buffer target', pass: html.includes('jitterBufferTarget') }
];

console.log('--- Verification Checklist ---');
let allPass = true;
checks.forEach(c => {
  console.log(`${c.pass ? '✅' : '❌'} ${c.name}`);
  if (!c.pass) allPass = false;
});

console.log('\nAll checks passed:', allPass);
