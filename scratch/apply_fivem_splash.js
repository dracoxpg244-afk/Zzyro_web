const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../public/index.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. UPDATE SPLASH CSS (lines 93 to 147)
const oldSplashCss = `/* ── SPLASH (TELA DE CARREGAMENTO) ── */
#splash {
  position: fixed; inset: 0;
  background: url('assets/img1.png') center center / cover no-repeat, #030407;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
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
  width: min(440px, 85vw);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 14px 20px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}
.splash-prog-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  font-family: 'JetBrains Mono', monospace;
}
.splash-prog-track {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  overflow: hidden;
}
.splash-prog-fill {
  height: 100%;
  width: 0%;
  background: #ffffff;
  box-shadow: 0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(255,255,255,0.5);
  border-radius: 10px;
  transition: width 0.28s ease;
}`;

const newSplashCss = `/* ── SPLASH (TELA DE CARREGAMENTO FIVEM CINEMÁTICA) ── */
#splash {
  position: fixed;
  inset: 0;
  background: url('assets/img1.png') center center / cover no-repeat, #05060a;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 36px;
  cursor: default;
  overflow: hidden;
  perspective: 1200px;
  transition: opacity .8s cubic-bezier(0.16, 1, 0.3, 1), transform .8s cubic-bezier(0.16, 1, 0.3, 1);
}
#splash.out {
  opacity: 0;
  transform: scale(1.04);
  pointer-events: none;
}

/* Parede preta 3D inicial que revela o wallpaper quando a logo assenta */
.splash-dark-wall {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(14, 18, 28, 0.88) 0%, rgba(4, 5, 8, 0.98) 100%),
              radial-gradient(ellipse at top right, rgba(37, 99, 235, 0.12) 0%, transparent 60%);
  z-index: 1;
  transition: opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.splash-dark-wall.faded {
  opacity: 0;
}

#splash-canvas {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

/* Rastro de onda / vento cortando a tela */
.splash-wind-wave {
  position: absolute;
  top: 44%;
  left: -120%;
  width: 140%;
  height: 140px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.0) 20%, rgba(255, 255, 255, 0.35) 50%, rgba(255, 255, 255, 0.85) 75%, transparent 100%);
  transform: rotate(-14deg) translateY(-50%);
  filter: blur(10px);
  z-index: 3;
  opacity: 0;
  pointer-events: none;
}
.splash-wind-wave.active {
  animation: windWaveSweep 1.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes windWaveSweep {
  0% { left: -140%; opacity: 0; transform: rotate(-22deg) translateY(-50%) scaleY(0.4); }
  25% { opacity: 0.9; }
  60% { opacity: 0.75; }
  100% { left: 140%; opacity: 0; transform: rotate(-8deg) translateY(-50%) scaleY(1.5); }
}

/* Shockwave de impacto */
.splash-shockwave {
  position: absolute;
  top: 45%;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 35px rgba(255, 255, 255, 0.85), 0 0 70px rgba(59, 130, 246, 0.5);
  transform: translate(-50%, -50%) scale(0);
  z-index: 4;
  opacity: 0;
  pointer-events: none;
}
.splash-shockwave.pulse {
  animation: shockwaveExpand 1.3s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
}
@keyframes shockwaveExpand {
  0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; border-width: 5px; }
  50% { opacity: 0.7; border-width: 2.5px; }
  100% { transform: translate(-50%, -50%) scale(130); opacity: 0; border-width: 1px; }
}

/* Palco da Logo Zyro 3D */
.splash-stage {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.splash-logo-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
  animation: logoFiveMIntro 2.3s cubic-bezier(0.16, 1, 0.3, 1) forwards, logoFloatIdle 4.5s ease-in-out 2.3s infinite alternate;
}

@keyframes logoFiveMIntro {
  0% {
    opacity: 0;
    transform: perspective(1200px) translate3d(-340px, -170px, 420px) rotateY(-40deg) rotateX(24deg) scale(0.32);
    filter: blur(12px) drop-shadow(0 0 45px rgba(255,255,255,0.95));
  }
  30% {
    opacity: 0.9;
    transform: perspective(1200px) translate3d(-90px, -35px, 200px) rotateY(-18deg) rotateX(10deg) scale(0.78);
    filter: blur(4px) drop-shadow(0 0 55px rgba(255,255,255,1)) drop-shadow(0 0 90px rgba(59,130,246,0.6));
  }
  65% {
    opacity: 1;
    transform: perspective(1200px) translate3d(35px, 8px, 70px) rotateY(9deg) rotateX(-4deg) scale(1.08);
    filter: blur(0px) drop-shadow(0 0 35px rgba(255,255,255,0.95));
  }
  85% {
    transform: perspective(1200px) translate3d(-8px, -2px, 12px) rotateY(-2deg) rotateX(2deg) scale(0.98);
    filter: drop-shadow(0 0 25px rgba(255,255,255,0.85));
  }
  100% {
    opacity: 1;
    transform: perspective(1200px) translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg) scale(1);
    filter: drop-shadow(0 0 20px rgba(255,255,255,0.65)) drop-shadow(0 15px 30px rgba(0,0,0,0.8));
  }
}

@keyframes logoFloatIdle {
  0% { transform: perspective(1200px) translate3d(0, 0, 0) rotateY(0deg) scale(1); }
  100% { transform: perspective(1200px) translate3d(0, -6px, 14px) rotateY(1.8deg) scale(1.015); filter: drop-shadow(0 0 28px rgba(255,255,255,0.85)); }
}

.splash-flying-logo {
  width: min(440px, 75vw);
  height: auto;
  object-fit: contain;
  display: block;
  user-select: none;
}

/* Reflexo de luz / sheen que corre na logo */
.splash-logo-sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.8) 50%, transparent 65%);
  background-size: 200% 100%;
  mix-blend-mode: overlay;
  pointer-events: none;
  opacity: 0;
}
.splash-logo-sheen.flash {
  animation: logoSheenSweep 1.2s ease forwards;
}
@keyframes logoSheenSweep {
  0% { background-position: 200% 0; opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 0.8; }
  100% { background-position: -100% 0; opacity: 0; }
}

/* Painel inferior com Dicas & Novidades + Progresso FiveM */
.splash-bottom-hud {
  width: min(520px, 92vw);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
  position: relative;
}

/* Card de Dicas & Novidades */
.splash-tips-box {
  background: rgba(6, 9, 15, 0.76);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 12px 18px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stb-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #3b82f6;
  background: rgba(37, 99, 235, 0.16);
  border: 1px solid rgba(37, 99, 235, 0.35);
  padding: 3px 10px;
  border-radius: 9999px;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.25);
  transition: all .3s ease;
}
.stb-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.5px;
}
.stb-body {
  min-height: 42px;
  display: flex;
  align-items: center;
}
.stb-body p {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.45;
  transition: opacity .32s ease, transform .32s ease;
  will-change: opacity, transform;
}
.stb-body p.fade {
  opacity: 0;
  transform: translateY(6px);
}
.stb-indicators {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}
.stb-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  transition: all .3s ease;
}
.stb-dot.active {
  width: 18px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.85);
}

/* Barra de progresso FiveM */
.splash-progress-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(6, 9, 15, 0.76);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 12px 18px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 16px 36px rgba(0,0,0,0.75);
}
.splash-prog-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  font-family: 'JetBrains Mono', monospace;
}
.splash-prog-track {
  width: 100%;
  height: 5px;
  background: rgba(255,255,255,0.14);
  border-radius: 10px;
  overflow: hidden;
}
.splash-prog-fill {
  height: 100%;
  width: 0%;
  background: #ffffff;
  box-shadow: 0 0 14px rgba(255,255,255,1), 0 0 28px rgba(59,130,246,0.6);
  border-radius: 10px;
  transition: width 0.35s ease;
}`;

if (content.includes(oldSplashCss)) {
  content = content.replace(oldSplashCss, newSplashCss);
  console.log('Replaced splash CSS successfully!');
} else {
  console.warn('Could not find exact oldSplashCss string, trying substring replace...');
  const startIdx = content.indexOf('/* ── SPLASH (TELA DE CARREGAMENTO) ── */');
  const endIdx = content.indexOf('/* ── APP LAYOUT ── */');
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + newSplashCss + '\n\n' + content.substring(endIdx);
    console.log('Replaced splash CSS via index boundaries!');
  } else {
    console.error('Failed to locate splash CSS boundaries');
  }
}

// 2. BULLETPROOF .ni and .ni svg CSS
const oldNiCss = `.ni {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--r-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-s);
  cursor: pointer;
  transition: all .2s;
  user-select: none;
  border: 1px solid transparent;
}
.ni svg {
  width: 18px !important;
  height: 18px !important;
  max-width: 18px !important;
  max-height: 18px !important;
  flex-shrink: 0;
  stroke-width: 2;
  transition: transform .2s;
}`;

const newNiCss = `.ni {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 12px !important;
  padding: 10px 14px !important;
  border-radius: var(--r-md);
  font-size: 13px !important;
  font-weight: 600;
  color: var(--text-s);
  cursor: pointer;
  transition: all .2s;
  user-select: none;
  border: 1px solid transparent;
  white-space: nowrap;
}
.ni svg {
  width: 18px !important;
  height: 18px !important;
  min-width: 18px !important;
  max-width: 18px !important;
  min-height: 18px !important;
  max-height: 18px !important;
  flex-shrink: 0 !important;
  stroke-width: 2;
  display: block !important;
  transition: transform .2s;
}
.ni span {
  font-size: 13px !important;
  line-height: 1.2 !important;
  display: inline-block !important;
}`;

if (content.includes(oldNiCss)) {
  content = content.replace(oldNiCss, newNiCss);
  console.log('Replaced .ni CSS successfully!');
} else {
  console.warn('Could not find exact oldNiCss string, searching via substring...');
  const niStart = content.indexOf('.ni {');
  const niEnd = content.indexOf('.ni:hover {');
  if (niStart !== -1 && niEnd !== -1) {
    content = content.substring(0, niStart) + newNiCss + '\n' + content.substring(niEnd);
    console.log('Replaced .ni CSS via index boundaries!');
  }
}

// 3. SLIM COMPACT FOOTER CSS
const footerCssStart = content.indexOf('/* ── APP FOOTER (DIREITOS RESERVADOS & STATUS) ── */');
const footerCssEnd = content.indexOf('</style>');
if (footerCssStart !== -1 && footerCssEnd !== -1) {
  const newFooterCss = `/* ── APP FOOTER (DISCRETO, COMPACTO E ELEGANTE) ── */
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: rgba(7, 9, 14, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 14px 28px;
  color: var(--text-s);
  position: relative;
  z-index: 10;
}
.footer-slim {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.footer-slim-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.footer-brand-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
  filter: drop-shadow(0 0 6px rgba(255,255,255,0.25));
}
.footer-copy-text {
  font-size: 12px;
  color: var(--text-m);
}
.footer-copy-text strong {
  color: var(--text-s);
  font-weight: 700;
}
.footer-slim-links {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}
.footer-slim-links a {
  color: var(--text-s);
  cursor: pointer;
  transition: color .2s;
  text-decoration: none;
}
.footer-slim-links a:hover {
  color: #fff;
}
.ft-sep {
  color: var(--border-s);
  font-size: 10px;
}
.sb-copy {
  font-size: 10px;
  color: var(--text-m);
}`;
  content = content.substring(0, footerCssStart) + newFooterCss + '\n\n' + content.substring(footerCssEnd);
  console.log('Replaced footer CSS successfully!');
}

// 4. UPDATE SPLASH HTML
const oldSplashHtml = `<div id="splash">
  <!-- Barra de carregamento animada -->
  <div class="splash-progress-wrap">
    <div class="splash-prog-label"><span id="splash-status">CARREGANDO...</span><span id="splash-pct">0%</span></div>
    <div class="splash-prog-track"><div class="splash-prog-fill" id="splash-fill"></div></div>
  </div>
</div>`;

const newSplashHtml = `<!-- SPLASH / TELA DE CARREGAMENTO CINEMÁTICA FIVEM -->
<div id="splash" onclick="skipSplash()">
  <!-- Parede preta 3D inicial com textura e vinheta que se funde ao wallpaper -->
  <div class="splash-dark-wall" id="splash-dark-wall"></div>

  <!-- Canvas FiveM: vento luminoso, partículas de poeira cósmica, pássaros distantes -->
  <canvas id="splash-canvas"></canvas>

  <!-- Rastro de onda luminosa / vento branco cortando a tela -->
  <div class="splash-wind-wave" id="splash-wind-wave"></div>
  <div class="splash-shockwave" id="splash-shockwave"></div>

  <!-- Container central da Logo Zyro 3D com rastro de vento e reflexos -->
  <div class="splash-stage">
    <div class="splash-logo-wrap" id="splash-logo-wrap">
      <img src="assets/logo.png" alt="Zyro Logo" class="splash-flying-logo" id="splash-logo"/>
      <div class="splash-logo-sheen" id="splash-sheen"></div>
    </div>
  </div>

  <!-- Painel Inferior: Dicas & Novidades rotativas + Barra de Carregamento FiveM -->
  <div class="splash-bottom-hud">
    <!-- Dicas & Novidades dinâmicas -->
    <div class="splash-tips-box">
      <div class="stb-header">
        <span class="stb-badge" id="stb-cat">🚀 NOVIDADE</span>
        <span class="stb-sub">Fique por dentro</span>
      </div>
      <div class="stb-body">
        <p id="splash-tip-text">Transmissão ao vivo de tela criada com arquitetura P2P de ultra baixa latência via WebRTC nativo.</p>
      </div>
      <div class="stb-indicators" id="stb-indicators"></div>
    </div>

    <!-- Barra de Progresso com porcentagem e status -->
    <div class="splash-progress-wrap">
      <div class="splash-prog-label">
        <span id="splash-status">INICIALIZANDO MOTOR ZYRO...</span>
        <span id="splash-pct">0%</span>
      </div>
      <div class="splash-prog-track">
        <div class="splash-prog-fill" id="splash-fill"></div>
      </div>
    </div>
  </div>
</div>`;

if (content.includes(oldSplashHtml)) {
  content = content.replace(oldSplashHtml, newSplashHtml);
  console.log('Replaced splash HTML successfully!');
} else {
  const sStart = content.indexOf('<div id="splash">');
  const sEnd = content.indexOf('<canvas id="bg-canvas"></canvas>');
  if (sStart !== -1 && sEnd !== -1) {
    content = content.substring(0, sStart) + newSplashHtml + '\n\n' + content.substring(sEnd);
    console.log('Replaced splash HTML via boundaries!');
  }
}

// 5. UPDATE FOOTER HTML
const footHtmlStart = content.indexOf('<footer class="app-footer">');
const footHtmlEnd = content.indexOf('<!-- ══ 2. TRANSMISSÕES');
if (footHtmlStart !== -1 && footHtmlEnd !== -1) {
  const newFooterHtml = `<!-- FOOTER ELEGANTE E COMPACTO -->
    <footer class="app-footer">
      <div class="footer-slim">
        <div class="footer-slim-left">
          <img src="assets/logo.png" alt="Zyro Logo" class="footer-brand-logo"/>
          <span class="footer-copy-text"><strong>© 2026 Zyro Stream</strong> • Plataforma P2P HD</span>
        </div>
        <div class="footer-slim-links">
          <a onclick="switchView('home')">Início</a>
          <span class="ft-sep">•</span>
          <a onclick="switchView('broadcast')">Transmissões</a>
          <span class="ft-sep">•</span>
          <a onclick="switchView('private')">Salas Privadas</a>
          <span class="ft-sep">•</span>
          <a onclick="switchView('events')">Eventos</a>
          <span class="ft-sep">•</span>
          <a onclick="switchView('settings')">Configurações</a>
        </div>
      </div>
    </footer>
    </section>

`;
  content = content.substring(0, footHtmlStart) + newFooterHtml + content.substring(footHtmlEnd);
  console.log('Replaced footer HTML successfully!');
}

// 6. UPDATE SPLASH JS AND WEBSOCKET ON file:///
const runSplashStart = content.indexOf('function runSplashBar() {');
const checkFirstVisitIdx = content.indexOf('/* ═══════════ PRIMEIRA VISITA ═══════════ */');
if (runSplashStart !== -1 && checkFirstVisitIdx !== -1) {
  const newSplashJs = `/* ═══════════ CINEMATIC FIVEM SPLASH & TIPS ═══════════ */
const splashTips = [
  { cat: 'NOVIDADE', icon: '🚀', text: 'A transmissão ao vivo de tela foi desenvolvida com WebRTC de ultra baixa latência, sem atrasos para quem assiste.' },
  { cat: 'DICA', icon: '💡', text: 'Você pode compartilhar sua tela ou jogos em até 4K 60 FPS com áudio cristalino do sistema e voz simultânea.' },
  { cat: 'NOVIDADE', icon: '🔒', text: 'Salas privadas contam com links de convite direto e senhas protegidas por criptografia moderna.' },
  { cat: 'DICA', icon: '🎙️', text: 'Ajuste o volume de cada pessoa e use o zoom nos controles dedicados no player de vídeo.' },
  { cat: 'NOVIDADE', icon: '🎨', text: 'Alterne entre os novos temas Obsidian Dark, Clean Light e Midnight Neon nas configurações.' },
  { cat: 'DICA', icon: '⚡', text: 'Se minimizar a janela transmitida, o sistema avisa os espectadores com uma notificação discreta sem travar sua live.' },
  { cat: 'NOVIDADE', icon: '💬', text: 'O chat da sala permite troca rápida de mensagens criptografadas e compartilhamento de fotos e arquivos.' }
];

let tipIndex = 0;
let tipTimer = null;
let splashCanvasAnimId = null;

function renderTipIndicators() {
  const cont = document.getElementById('stb-indicators');
  if (!cont) return;
  cont.innerHTML = splashTips.map((_, i) => \`<span class="stb-dot \${i === tipIndex ? 'active' : ''}"></span>\`).join('');
}

function updateSplashTip() {
  const catEl = document.getElementById('stb-cat');
  const textEl = document.getElementById('splash-tip-text');
  if (!catEl || !textEl) return;

  textEl.classList.add('fade');
  setTimeout(() => {
    tipIndex = (tipIndex + 1) % splashTips.length;
    const cur = splashTips[tipIndex];
    catEl.innerHTML = \`\${cur.icon} \${cur.cat}\`;
    textEl.textContent = cur.text;
    textEl.classList.remove('fade');
    renderTipIndicators();
  }, 320);
}

// Canvas FiveM: vento luminoso, partículas cósmicas e pássaros distantes
function initSplashCanvas() {
  const canvas = document.getElementById('splash-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    if (!canvas) return;
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  // Linhas de vento (wind streaks)
  const windStreaks = Array.from({ length: 24 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h * 0.8,
    len: Math.random() * 180 + 80,
    speed: Math.random() * 4 + 3,
    alpha: Math.random() * 0.28 + 0.08,
    width: Math.random() * 1.8 + 0.8,
    waveAmp: Math.random() * 8 + 4,
    waveFreq: Math.random() * 0.02 + 0.01
  }));

  // Partículas luminosas (embers)
  const motes = Array.from({ length: 36 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 0.8,
    vx: Math.random() * 2.5 + 1.2,
    vy: (Math.random() - 0.5) * 0.8,
    alpha: Math.random() * 0.6 + 0.2
  }));

  // Pássaros distantes (silhuetas cinematográficas FiveM)
  const birds = [
    { x: w * 0.15, y: h * 0.22, speed: 1.4, scale: 0.9, flap: 0 },
    { x: w * 0.05, y: h * 0.28, speed: 1.7, scale: 0.7, flap: 1.2 },
    { x: -w * 0.1, y: h * 0.18, speed: 1.2, scale: 0.55, flap: 2.4 }
  ];

  function drawBird(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.scale(b.scale, b.scale);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    const wingAngle = Math.sin(b.flap) * 7;
    // Asa esquerda
    ctx.moveTo(-16, -wingAngle);
    ctx.quadraticCurveTo(-8, -wingAngle * 1.5, 0, 0);
    // Asa direita
    ctx.quadraticCurveTo(8, -wingAngle * 1.5, 16, -wingAngle);
    ctx.stroke();
    ctx.restore();
  }

  function render() {
    if (introDone) return;
    ctx.clearRect(0, 0, w, h);

    // Renderiza linhas de vento
    windStreaks.forEach(s => {
      ctx.save();
      ctx.beginPath();
      const waveY = Math.sin(s.x * s.waveFreq) * s.waveAmp;
      ctx.moveTo(s.x, s.y + waveY);
      ctx.lineTo(s.x + s.len, s.y + waveY);
      const grad = ctx.createLinearGradient(s.x, s.y, s.x + s.len, s.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.5, \`rgba(255, 255, 255, \${s.alpha})\`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.stroke();
      ctx.restore();

      s.x += s.speed;
      if (s.x > w + s.len) {
        s.x = -s.len - Math.random() * 200;
        s.y = Math.random() * h * 0.85;
      }
    });

    // Renderiza motes/partículas
    motes.forEach(m => {
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = \`rgba(255, 255, 255, \${m.alpha})\`;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fill();

      m.x += m.vx;
      m.y += m.vy;
      if (m.x > w) { m.x = -10; m.y = Math.random() * h; }
    });

    // Renderiza pássaros
    birds.forEach(b => {
      drawBird(b);
      b.x += b.speed;
      b.flap += 0.08;
      if (b.x > w + 60) {
        b.x = -80;
        b.y = Math.random() * h * 0.35 + 40;
      }
    });

    splashCanvasAnimId = requestAnimationFrame(render);
  }

  render();
}

function skipSplash() {
  finishIntro();
}

document.addEventListener('keydown', (e) => {
  if (!introDone && (e.key === 'Escape' || e.key === ' ')) {
    finishIntro();
  }
});

function runSplashBar() {
  renderTipIndicators();
  initSplashCanvas();

  // Aciona a onda de vento luminoso cruzando a tela em 400ms
  setTimeout(() => {
    const wave = document.getElementById('splash-wind-wave');
    if (wave) wave.classList.add('active');
  }, 400);

  // Logo assenta no centro em 1750ms -> Shockwave, Sheen e parede preta se dissolve revelando wallpaper
  setTimeout(() => {
    const shock = document.getElementById('splash-shockwave');
    if (shock) shock.classList.add('pulse');
    const sheen = document.getElementById('splash-sheen');
    if (sheen) sheen.classList.add('flash');
    const wall = document.getElementById('splash-dark-wall');
    if (wall) wall.classList.add('faded');
  }, 1750);

  // Inicia rotação contínua de dicas & novidades
  tipTimer = setInterval(updateSplashTip, 2400);

  const fill = document.getElementById('splash-fill');
  const pct  = document.getElementById('splash-pct');
  const status = document.getElementById('splash-status');

  const steps = [
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
  setTimeout(finishIntro, 5600);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runSplashBar);
} else {
  runSplashBar();
}

`;

  content = content.substring(0, runSplashStart) + newSplashJs + content.substring(checkFirstVisitIdx);
  console.log('Replaced splash JS successfully!');
}

// 7. WS SAFE CONNECT FOR file:///
const wsConnectOld = `function wsConnect(){
  if(ws&&ws.readyState<=1)return;
  const p=location.protocol==='https:'?'wss:':'ws:';
  ws=new WebSocket(p+'//'+location.host);
  ws.onopen=()=>{wsSend({type:'get-public-rooms'});wsSend({type:'get-events'});wsSend({type:'get-stats'});startPing();};
  ws.onmessage=e=>{try{onMsg(JSON.parse(e.data));}catch(err){}};
  ws.onclose=()=>{setTimeout(wsConnect,3000);};
}`;

const wsConnectNew = `function wsConnect(){
  if(ws&&ws.readyState<=1)return;
  const host = location.host || 'localhost:3000';
  const p = location.protocol === 'https:' ? 'wss:' : 'ws:';
  try {
    ws = new WebSocket(p + '//' + host);
    ws.onopen=()=>{wsSend({type:'get-public-rooms'});wsSend({type:'get-events'});wsSend({type:'get-stats'});startPing();};
    ws.onmessage=e=>{try{onMsg(JSON.parse(e.data));}catch(err){}};
    ws.onclose=()=>{setTimeout(wsConnect,3000);};
    ws.onerror=err=>{/* Silently fallback in file:/// without breaking script */};
  } catch(e) {
    console.warn('WS offline / modo offline:', e);
  }
}`;

if (content.includes(wsConnectOld)) {
  content = content.replace(wsConnectOld, wsConnectNew);
  console.log('Replaced wsConnect successfully!');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated public/index.html!');
