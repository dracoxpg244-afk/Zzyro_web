const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Update #splash background to pure solid dark metallic wall (NO BAKED LOGO AT ALL)
const oldSplashBg = `/* Máscara radial central escura que cobre 100% qualquer logo estática gravada no wallpaper */
  background: radial-gradient(ellipse 70% 60% at 50% 45%, #05060a 40%, transparent 100%),
              url('assets/img_showcase.png') center center / cover no-repeat,
              #05060a;`;

const newSplashBg = `/* Fundo 3D escuro limpo e profundo sem nenhuma logo estática de fundo */
  background: radial-gradient(circle at 50% 45%, #090d16 0%, #030407 75%);`;

if (html.includes(oldSplashBg)) {
  html = html.replace(oldSplashBg, newSplashBg);
  console.log('Replaced splash background with pure clean 3D backdrop!');
}

// 2. Make #splash.out disappear cleanly and quickly without ghosting
const oldSplashOut = `#splash.out {
  opacity: 0;
  transform: scale(1.04);
  pointer-events: none;
}`;

const newSplashOut = `#splash.out {
  opacity: 0 !important;
  transform: scale(1.03) !important;
  pointer-events: none !important;
  visibility: hidden !important;
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s !important;
}`;

if (html.includes(oldSplashOut)) {
  html = html.replace(oldSplashOut, newSplashOut);
  console.log('Replaced splash.out transition!');
}

// 3. Update finishIntro and runSplashBar timing to be fast, snappy and cleanly remove splash
const oldFinishIntro = `let introDone = false;
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
  try { switchView('home'); } catch(e) {}
  try { checkFirstVisit(); } catch(e) {}
  try { initReveal(); } catch(e) {}
  try {
    document.querySelectorAll('#view-home .reveal, #view-home .reveal-l, #view-home .reveal-r').forEach(el => el.classList.add('shown'));
  } catch(e) {}
}`;

const newFinishIntro = `let introDone = false;
function finishIntro() {
  if (introDone) return;
  introDone = true;
  if (typeof tipTimer !== 'undefined' && tipTimer) clearInterval(tipTimer);
  if (typeof splashCanvasAnimId !== 'undefined' && splashCanvasAnimId) cancelAnimationFrame(splashCanvasAnimId);
  const s = document.getElementById('splash');
  if (s) {
    s.classList.add('out');
    s.style.pointerEvents = 'none';
    setTimeout(() => {
      s.style.display = 'none';
      s.style.visibility = 'hidden';
      if (s.parentNode) s.parentNode.removeChild(s);
    }, 280);
  }
  try { switchView('home'); } catch(e) {}
  try { checkFirstVisit(); } catch(e) {}
  try { initReveal(); } catch(e) {}
  try {
    document.querySelectorAll('#view-home .reveal, #view-home .reveal-l, #view-home .reveal-r').forEach(el => el.classList.add('shown'));
  } catch(e) {}
}`;

if (html.includes(oldFinishIntro)) {
  html = html.replace(oldFinishIntro, newFinishIntro);
  console.log('Replaced finishIntro successfully!');
}

// 4. Optimize splash timing steps (~2.4s total, ultra smooth, responsive)
const oldStepsPattern = `  const steps = [
    { p: 12,  s: 'INICIALIZANDO MOTOR ZYRO...' },
    { p: 28,  s: 'CARREGANDO RECURSOS E CODECS...' },
    { p: 46,  s: 'CONECTANDO INFRAESTRUTURA P2P...' },
    { p: 68,  s: 'SINCRONIZANDO SALAS E COMUNIDADE...' },
    { p: 88,  s: 'PREPARANDO INTERFACE HD...' },
    { p: 100, s: 'PRONTO! BEM-VINDO AO ZYRO' }
  ];

  let stepIdx = 0;
  const progressInterval = setInterval(() => {
    if (introDone || stepIdx >= steps.length) {
      clearInterval(progressInterval);
      return;
    }
    const st = steps[stepIdx];
    if (fill) fill.style.width = st.p + '%';
    if (pct) pct.textContent = st.p + '%';
    if (status) status.textContent = st.s;
    stepIdx++;

    if (st.p >= 100) {
      clearInterval(progressInterval);
      setTimeout(finishIntro, 500);
    }
  }, 850);

  // Limite de segurança de carregamento (5.5s)
  setTimeout(finishIntro, 5600);`;

const newStepsPattern = `  const steps = [
    { p: 15,  s: 'INICIALIZANDO MOTOR ZYRO...' },
    { p: 35,  s: 'CARREGANDO CODECS & ACELERAÇÃO...' },
    { p: 60,  s: 'CONECTANDO INFRAESTRUTURA P2P...' },
    { p: 85,  s: 'SINCRONIZANDO COMUNIDADE & SALAS...' },
    { p: 100, s: 'PRONTO! BEM-VINDO AO ZYRO' }
  ];

  let stepIdx = 0;
  const progressInterval = setInterval(() => {
    if (introDone || stepIdx >= steps.length) {
      clearInterval(progressInterval);
      return;
    }
    const st = steps[stepIdx];
    if (fill) fill.style.width = st.p + '%';
    if (pct) pct.textContent = st.p + '%';
    if (status) status.textContent = st.s;
    stepIdx++;

    if (st.p >= 100) {
      clearInterval(progressInterval);
      setTimeout(finishIntro, 350);
    }
  }, 480);

  // Limite de segurança de carregamento (2.8s)
  setTimeout(finishIntro, 2800);`;

if (html.includes(oldStepsPattern)) {
  html = html.replace(oldStepsPattern, newStepsPattern);
  console.log('Replaced splash steps timing!');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished updating public/index.html!');
