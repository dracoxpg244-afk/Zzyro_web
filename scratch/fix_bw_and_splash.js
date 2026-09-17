const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// ── 1. FIX SPLASH: remove the button overlay on top of img2.png
//    Keep img2 as background, remove the pill-button overlay (fix ugly white button on logo)
//    And add a real animated progress bar overlaid at the bottom
html = html.replace(
  /<div id="splash" onclick="finishIntro\(\)">\s*<button class="splash-skip-pill"[^>]*>.*?<\/button>\s*<\/div>/s,
  `<div id="splash">
  <!-- Barra de carregamento animada -->
  <div class="splash-progress-wrap">
    <div class="splash-prog-label"><span id="splash-status">CARREGANDO...</span><span id="splash-pct">0%</span></div>
    <div class="splash-prog-track"><div class="splash-prog-fill" id="splash-fill"></div></div>
  </div>
</div>`
);

// ── 2. REPLACE SPLASH CSS: full-screen img2.png + animated bar at bottom, no box
const oldSplashCSS = `#splash {
  position: fixed; inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(4, 6, 14, 0.55) 0%, rgba(3, 4, 10, 0.95) 100%), url('/assets/img2.png') center/cover no-repeat, #03040a !important;
  z-index: 99999;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  transition: opacity .7s ease, transform .7s ease;
}`;

const newSplashCSS = `#splash {
  position: fixed; inset: 0;
  background: url('/assets/img2.png') center center / cover no-repeat, #040508;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 60px;
  cursor: default;
  transition: opacity .7s ease;
}
#splash.out { opacity: 0; pointer-events: none; }
.splash-progress-wrap {
  width: min(420px, 80vw);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.splash-prog-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
  font-family: 'JetBrains Mono', monospace;
}
.splash-prog-track {
  width: 100%;
  height: 3px;
  background: rgba(255,255,255,0.12);
  border-radius: 10px;
  overflow: hidden;
}
.splash-prog-fill {
  height: 100%;
  width: 0%;
  background: #ffffff;
  box-shadow: 0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(255,255,255,0.4);
  border-radius: 10px;
  transition: width 0.3s ease;
}`;

html = html.replace(oldSplashCSS, newSplashCSS);

// ── 3. REMOVE .splash-skip-pill CSS if still present
html = html.replace(
  /\.splash-skip-pill\s*\{[^}]*\}\s*\.splash-skip-pill:hover\s*\{[^}]*\}/gs,
  ''
);
html = html.replace(/\.splash-skip-pill\s*\{[^}]*\}/gs, '');

// ── 4. FIX HERO: remove colorful gradient text, make it clean B&W
// Fix the "compartilhe tudo" colored gradient span
html = html.replace(
  /<span class="grad">compartilhe tudo<\/span>/g,
  `<span style="color:#ffffff;background:none;-webkit-text-fill-color:#ffffff;">compartilhe tudo</span>`
);

// Fix "SEGURANÇA TOTAL & ALTA PERFORMANCE" badge - remove blue border
html = html.replace(
  /class="hero-badge[^"]*"/g,
  `class="hero-badge" style="border-color:rgba(255,255,255,.25);color:#fff;background:rgba(255,255,255,.06);"`
);

// Fix btn-hero-primary - remove blue fill, use white/dark
html = html.replace(
  /class="btn-hero-primary"/g,
  `class="btn-hero-primary" style="background:#ffffff;color:#000000;border:none;"`
);

// Fix btn-hero-secondary - clean border
html = html.replace(
  /class="btn-hero-secondary"/g,
  `class="btn-hero-secondary" style="background:transparent;border:1px solid rgba(255,255,255,.3);color:#ffffff;"`
);

// ── 5. REMOVE BLUE GLOW from logo
html = html.replace(
  /filter: drop-shadow\(0 0 10px rgba\(59,130,246,\.5\)\);/g,
  `filter: drop-shadow(0 0 8px rgba(255,255,255,0.25));`
);
html = html.replace(
  /filter: drop-shadow\(0 0 16px rgba\(59,130,246,\.7\)\);/g,
  `filter: drop-shadow(0 0 12px rgba(255,255,255,0.3));`
);

// ── 6. FIX showcase-card border: remove blue border
html = html.replace(
  /border: 1px solid rgba\(59,130,246,\.35\);/g,
  `border: 1px solid rgba(255,255,255,.1);`
);
html = html.replace(
  /box-shadow: 0 16px 50px rgba\(0,0,0,\.8\), 0 0 35px rgba\(59,130,246,\.18\);/g,
  `box-shadow: 0 16px 50px rgba(0,0,0,.8);`
);

// ── 7. FIX live-pulse-dot: use white instead of blue
html = html.replace(
  /background: #3b82f6;\s*box-shadow: 0 0 12px #3b82f6;/g,
  `background: #ef4444;
  box-shadow: 0 0 12px #ef4444;`
);

// ── 8. FIX finishIntro JS: replace with new animated loading bar version
const oldFinishIntro = /\/\* ── SPLASH AUTO-DISMISS ── \*\/[\s\S]*?setTimeout\(finishIntro, 1200\);\s*\}/s;

const newSplashJS = `/* ── TELA DE CARREGAMENTO ANIMADA ── */
let introDone = false;
function finishIntro() {
  if (introDone) return;
  introDone = true;
  const s = document.getElementById('splash');
  if (s) {
    s.classList.add('out');
    setTimeout(() => {
      s.style.display = 'none';
      if (s.parentNode) s.parentNode.removeChild(s);
    }, 700);
  }
  try { checkFirstVisit(); } catch(e) {}
  try { initReveal(); } catch(e) {}
}

function runSplashBar() {
  const fill = document.getElementById('splash-fill');
  const pct  = document.getElementById('splash-pct');
  const status = document.getElementById('splash-status');

  const steps = [
    { p: 20, s: 'INICIALIZANDO...' },
    { p: 45, s: 'CARREGANDO...' },
    { p: 68, s: 'CRIPTOGRAFIA...' },
    { p: 85, s: 'CONECTANDO...' },
    { p: 100, s: 'PRONTO!' }
  ];

  let i = 0;
  const tick = setInterval(() => {
    if (introDone || i >= steps.length) { clearInterval(tick); return; }
    const st = steps[i];
    if (fill) fill.style.width = st.p + '%';
    if (pct) pct.textContent = st.p + '%';
    if (status) status.textContent = st.s;
    i++;
    if (st.p >= 100) {
      clearInterval(tick);
      setTimeout(finishIntro, 400);
    }
  }, 280);

  setTimeout(finishIntro, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runSplashBar);
} else {
  runSplashBar();
}`;

html = html.replace(oldFinishIntro, newSplashJS);

// Also remove the duplicate setTimeout calls after
html = html.replace(
  /\/\/ Fecha automaticamente a tela de carregamento após 1\.5s\nsetTimeout\(finishIntro, 1500\);\nif \(document\.readyState === 'loading'\) \{\n  document\.addEventListener\('DOMContentLoaded', \(\) => setTimeout\(finishIntro, 1200\)\);\n\} else \{\n  setTimeout\(finishIntro, 1200\);\n\}\n\n\n\n/,
  `\n\n\n\n`
);

fs.writeFileSync(targetPath, html, 'utf8');
console.log('DONE! File size:', fs.statSync(targetPath).size);
