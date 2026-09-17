const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(filePath, 'utf8');

console.log('Original HTML size:', html.length);

// ── 1. FIX SPLASH SCREEN (REMOVE DUPLICATE BACKGROUND LOGO & POLISH 3D FLYING LOGO) ──
// Replace splash CSS with clean center mask that completely conceals baked-in logo in img1/img2
const splashCssPatternStart = '/* ── SPLASH (TELA DE CARREGAMENTO FIVEM CINEMÁTICA) ── */';
const splashCssPatternEnd = '/* ── APP LAYOUT ── */';
const sStart = html.indexOf(splashCssPatternStart);
const sEnd = html.indexOf(splashCssPatternEnd);

if (sStart !== -1 && sEnd !== -1) {
  const newSplashCss = `/* ── SPLASH (TELA DE CARREGAMENTO FIVEM CINEMÁTICA) ── */
#splash {
  position: fixed;
  inset: 0;
  /* Máscara radial central escura que cobre 100% qualquer logo estática gravada no wallpaper */
  background: radial-gradient(ellipse 70% 60% at 50% 45%, #05060a 40%, transparent 100%),
              url('assets/img_showcase.png') center center / cover no-repeat,
              #05060a;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 34px;
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

/* Parede preta 3D inicial que envolve o centro */
.splash-dark-wall {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 45%, rgba(6, 8, 14, 0.95) 0%, rgba(3, 4, 7, 0.99) 75%);
  z-index: 1;
  transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
.splash-dark-wall.faded {
  opacity: 0.15;
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
  top: 45%;
  left: -140%;
  width: 140%;
  height: 140px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.0) 20%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.9) 75%, transparent 100%);
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
  25% { opacity: 0.95; }
  60% { opacity: 0.8; }
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
  border: 4px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 35px rgba(255, 255, 255, 0.9), 0 0 70px rgba(59, 130, 246, 0.6);
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
  50% { opacity: 0.75; border-width: 2.5px; }
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
    opacity: 0.95;
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
    filter: drop-shadow(0 0 22px rgba(255,255,255,0.75)) drop-shadow(0 15px 30px rgba(0,0,0,0.8));
  }
}

@keyframes logoFloatIdle {
  0% { transform: perspective(1200px) translate3d(0, 0, 0) rotateY(0deg) scale(1); }
  100% { transform: perspective(1200px) translate3d(0, -6px, 14px) rotateY(1.8deg) scale(1.015); filter: drop-shadow(0 0 30px rgba(255,255,255,0.9)); }
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
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.85) 50%, transparent 65%);
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
  gap: 10px;
  z-index: 10;
  position: relative;
}

/* Card de Dicas & Novidades */
.splash-tips-box {
  background: rgba(6, 9, 15, 0.78);
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
  color: rgba(255, 255, 255, 0.45);
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
  gap: 7px;
  background: rgba(6, 9, 15, 0.78);
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
}
`;
  html = html.substring(0, sStart) + newSplashCss + '\n' + html.substring(sEnd);
  console.log('Updated Splash CSS successfully!');
}

// ── 2. LIGHT THEME CONTRAST & LOGO OUTLINE & HERO STYLING ──
const lightThemeFixes = `
/* ── LIGHT THEME CONTRAST REFINEMENT & OUTLINES ── */
body.theme-light .brand-logo-img {
  filter: drop-shadow(0 0 1px #0f172a) drop-shadow(0 1px 3px rgba(15,23,42,0.45)) drop-shadow(0 0 8px rgba(37,99,235,0.2)) !important;
}
body.theme-light .hero-tag {
  background: #e2e8f0 !important;
  color: #1e293b !important;
  border-color: #cbd5e1 !important;
}
body.theme-light .hero-tag svg {
  stroke: #2563eb !important;
}
body.theme-light .hero-h1 .h1-top {
  color: #0f172a !important;
}
body.theme-light .hero-h1 .h1-accent {
  color: #2563eb !important;
  text-shadow: none !important;
}
body.theme-light .hero-sub {
  color: #334155 !important;
}
body.theme-light .btn-hero-secondary {
  background: #ffffff !important;
  color: #0f172a !important;
  border: 1.5px solid #cbd5e1 !important;
  box-shadow: 0 4px 14px rgba(0,0,0,0.06) !important;
}
body.theme-light .btn-hero-secondary:hover {
  background: #f8fafc !important;
  border-color: #94a3b8 !important;
}
body.theme-light .stat-card {
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
  box-shadow: 0 4px 18px rgba(0,0,0,0.04) !important;
}
body.theme-light .stat-label {
  color: #64748b !important;
}
body.theme-light .stat-val {
  color: #0f172a !important;
}
body.theme-light .section-h2 {
  color: #0f172a !important;
}
body.theme-light .side-card {
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
}
body.theme-light .side-card-title {
  color: #0f172a !important;
}
body.theme-light .chat-wrap {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
}
body.theme-light .cmsg-auth {
  color: #1e293b !important;
}
body.theme-light .cmsg-text {
  color: #334155 !important;
}
body.theme-light .chat-in {
  color: #0f172a !important;
}
body.theme-light .stream-card {
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
}
body.theme-light .stream-card-title {
  color: #0f172a !important;
}
body.theme-light .stream-host {
  color: #475569 !important;
}
body.theme-light .footer-slim {
  color: #475569 !important;
}
body.theme-light .footer-copy-text {
  color: #64748b !important;
}
body.theme-light .footer-copy-text strong {
  color: #0f172a !important;
}
body.theme-light .footer-slim-links a {
  color: #475569 !important;
}
body.theme-light .footer-slim-links a:hover {
  color: #2563eb !important;
}

/* ── HERO TYPOGRAPHY & ESTILOS ── */
.hero-h1 .h1-top {
  display: block;
  color: #ffffff;
}
.hero-h1 .h1-accent {
  display: block;
  color: #3b82f6;
  text-shadow: 0 0 24px rgba(59, 130, 246, 0.45);
}

/* ── SHOWCASE CARD ANIMADO ── */
.showcase-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85);
  transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
  transform-style: preserve-3d;
}
.showcase-card:hover {
  box-shadow: 0 24px 70px rgba(37, 99, 235, 0.25);
}
.showcase-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.showcase-card:hover .showcase-img {
  transform: scale(1.02);
}
.showcase-gleam {
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
  background-size: 250% 100%;
  pointer-events: none;
  animation: showcaseGleamSweep 6s ease-in-out infinite;
}
@keyframes showcaseGleamSweep {
  0% { background-position: 250% 0; }
  25% { background-position: -150% 0; }
  100% { background-position: -150% 0; }
}

/* ── CONTROLES DO PLAYER (VOLUME, MIC & HUD AUTO-HIDE) ── */
.player-vol-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 4px 10px 4px 6px;
  border-radius: var(--r-full);
  transition: all .2s;
}
.player-vol-wrap:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.25);
}
.player-vol-slider-box {
  width: 68px;
  display: flex;
  align-items: center;
}
.player-vol-slider-box input[type="range"] {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}
.player-vol-slider-box input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.9);
  cursor: pointer;
  transition: transform .15s;
}
.player-vol-slider-box input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.25);
}
.player-vol-pct {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  min-width: 32px;
}

/* Controles de botões com transição suave sem trocar fundo para vermelho/verde */
.ctrl {
  background: rgba(255, 255, 255, 0.08) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all .2s ease;
  box-shadow: none !important;
}
.ctrl:hover {
  background: rgba(255, 255, 255, 0.18) !important;
  transform: scale(1.08);
}
.ctrl.danger {
  background: rgba(239, 68, 68, 0.18) !important;
  border-color: rgba(239, 68, 68, 0.45) !important;
  color: #ef4444 !important;
}
.ctrl.danger:hover {
  background: #ef4444 !important;
  color: #ffffff !important;
}

/* ── AUTO-HIDE HUD DO PLAYER (DESAPARECE QUANDO O MOUSE PARAR) ── */
.video-box.hud-idle .stream-stats-badge,
.video-box.hud-idle .host-code-banner,
.video-box.hud-idle .live-badge,
.video-box.hud-idle .player-overlay {
  opacity: 0 !important;
  pointer-events: none !important;
  transform: translateY(8px) scale(0.98);
}
.stream-stats-badge, .host-code-banner, .live-badge, .player-overlay {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

/* ── BARRA SUPERIOR DE ENTRAR EM UMA TRANSMISSÃO (SUPER FÁCIL) ── */
.quick-watch-banner {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(9, 11, 18, 0.95) 100%);
  border: 1px solid rgba(37, 99, 235, 0.35);
  border-radius: var(--r-md);
  padding: 16px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}
.qwb-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.qwb-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(37, 99, 235, 0.25);
  border: 1px solid rgba(37, 99, 235, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #60a5fa;
  flex-shrink: 0;
}
.qwb-text h3 {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
}
.qwb-text p {
  font-size: 12px;
  color: var(--text-s);
  margin-top: 2px;
}
.qwb-form {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.qwb-input {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--r-full);
  padding: 9px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13.5px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 1px;
  outline: none;
  min-width: 180px;
  transition: all .2s;
}
.qwb-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 16px rgba(37, 99, 235, 0.4);
}
.qwb-btn {
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: var(--r-full);
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all .2s;
}
.qwb-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 18px rgba(37, 99, 235, 0.45);
}
`;

// Inject before </style>
html = html.replace('</style>', lightThemeFixes + '\n</style>');
console.log('Injected Light Theme and Player styles!');

// ── 3. REMOVE "EVENTOS" FROM SIDEBAR ──
const oldEventLi = `<li class="ni" id="nav-events" onclick="switchView('events')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>Eventos</span>
      </li>`;
if (html.includes(oldEventLi)) {
  html = html.replace(oldEventLi, '');
  console.log('Removed Eventos from sidebar nav!');
}

// ── 4. UPDATE HERO TITLE & HERO SHOWCASE CARD IN HOME VIEW ──
const oldHeroHeading = `<h1 class="hero-h1 reveal delay-1">
            <span class="line1">Transmita, fale e</span>
            <span style="color:#ffffff;background:none;-webkit-text-fill-color:#ffffff;">compartilhe tudo</span>
          </h1>`;

const newHeroHeading = `<h1 class="hero-h1 reveal delay-1">
            <span class="h1-top">Transmita, fale e</span>
            <span class="h1-accent">compartilhe tudo</span>
          </h1>`;

if (html.includes(oldHeroHeading)) {
  html = html.replace(oldHeroHeading, newHeroHeading);
  console.log('Updated Hero Title with blue accent!');
} else {
  // Regex fallback for hero-h1
  html = html.replace(/<h1 class="hero-h1[^>]*>[\s\S]*?<\/h1>/, newHeroHeading);
  console.log('Updated Hero Title via regex!');
}

// Update Showcase Card to use img_showcase.png with gleam
const oldShowcaseCard = `<div class="hero-showcase reveal delay-3">
            <div class="showcase-card">
              <img src="assets/img1.png" alt="Zyro Broadcast Engine" class="showcase-img"/>
              <div class="showcase-glass-bar">
                <div class="sg-left">
                  <div class="live-pulse-dot"></div>
                  <div>
                    <div class="sg-title">Zyro Hub Studio &bull; Transmissão HD</div>
                    <div class="sg-sub">HD 60FPS • Voz Sem Delay • Salas Privadas com Senha</div>
                  </div>
                </div>
                <div class="sg-right">
                  <button class="btn-p" onclick="switchView('broadcast')" style="padding:8px 18px;font-size:12.5px;">
                    Iniciar Transmissão
                  </button>
                </div>
              </div>
            </div>
          </div>`;

const newShowcaseCard = `<div class="hero-showcase reveal delay-3">
            <div class="showcase-card" id="home-showcase-card">
              <img src="assets/img_showcase.png" alt="Zyro Broadcast Engine" class="showcase-img" id="home-showcase-img"/>
              <div class="showcase-gleam"></div>
              <div class="showcase-glass-bar">
                <div class="sg-left">
                  <div class="live-pulse-dot"></div>
                  <div>
                    <div class="sg-title">Zyro Hub Studio &bull; Transmissão HD</div>
                    <div class="sg-sub">HD 60FPS • Voz Sem Delay • Salas Privadas com Senha</div>
                  </div>
                </div>
                <div class="sg-right">
                  <button class="btn-p" onclick="switchView('broadcast')" style="padding:8px 18px;font-size:12.5px;">
                    Iniciar Transmissão
                  </button>
                </div>
              </div>
            </div>
          </div>`;

if (html.includes(oldShowcaseCard)) {
  html = html.replace(oldShowcaseCard, newShowcaseCard);
  console.log('Updated Showcase Card successfully!');
} else {
  html = html.replace(/<div class="hero-showcase[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, newShowcaseCard);
  console.log('Updated Showcase Card via regex!');
}

// ── 5. ADD PROMINENT "ASSISTIR TRANSMISSÃO" AT TOP OF #view-broadcast ──
const oldBroadcastHeader = `<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">Sala de Transmissão</h1>
              <p style="font-size:13px;color:var(--text-s);">Transmita sua tela, converse com voz ativa e proteja sua live com senha.</p>`;

const newBroadcastHeader = `<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">Transmissões &amp; Ao Vivo</h1>
              <p style="font-size:13px;color:var(--text-s);">Assista a transmissões em tempo real ou compartilhe sua própria tela em alta definição.</p>`;

if (html.includes(oldBroadcastHeader)) {
  html = html.replace(oldBroadcastHeader, newBroadcastHeader);
}

// Add Quick Watch banner right before <div class="studio-grid"> in #view-broadcast
const studioGridIdx = html.indexOf('<div class="studio-grid">');
if (studioGridIdx !== -1) {
  const watchBannerHtml = `<!-- BARRA DIRETA: ASSISTIR TRANSMISSÃO POR CÓDIGO (SUPER SIMPLES) -->
        <div class="quick-watch-banner">
          <div class="qwb-left">
            <div class="qwb-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            <div class="qwb-text">
              <h3>Deseja assistir a uma transmissão?</h3>
              <p>Digite o código da sala fornecido pelo seu amigo para assistir ao vivo instantaneamente:</p>
            </div>
          </div>
          <div class="qwb-form">
            <input type="text" class="qwb-input" id="quick-watch-in" placeholder="EX: ZYRO-8321" maxlength="16" onkeydown="if(event.key==='Enter')joinByCode()"/>
            <button class="qwb-btn" onclick="joinByCode()">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Assistir ao Vivo
            </button>
          </div>
        </div>

        `;
  html = html.substring(0, studioGridIdx) + watchBannerHtml + html.substring(studioGridIdx);
  console.log('Injected Quick Watch banner in view-broadcast!');
}

// ── 6. UPDATE VIEWER PLAYER CONTROLS (VOLUME SLIDER & MUTE / MIC ICONS) ──
const oldViewerControls = `<div class="player-overlay">
                <button class="ctrl" id="viewer-mic" onclick="toggleVMic()" title="Microfone">
                  <svg id="vmic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <button class="ctrl" id="viewer-deaf" onclick="toggleDeafen()" title="Silenciar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                </button>
                <button class="ctrl" onclick="resetZoom()" title="Zoom 100%"><span style="font-size:11px;font-weight:700;">100%</span></button>
                <input type="range" id="zoom-sl" min="100" max="250" value="100" style="width:70px;accent-color:var(--blue);" oninput="applyZoom(this.value)"/>
                <button class="ctrl" onclick="toggleFS('viewer-vbox')" title="Tela Cheia">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>
                <button class="ctrl danger" onclick="leaveRoom()" title="Sair">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </div>`;

const newViewerControls = `<div class="player-overlay" id="viewer-ctrls-bar">
                <!-- Controle de Microfone com troca de ícone sem cor de fundo agressiva -->
                <button class="ctrl" id="viewer-mic" onclick="toggleVMic()" title="Microfone">
                  <svg id="vmic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>

                <!-- Controle de Volume estilo nativo do site -->
                <div class="player-vol-wrap">
                  <button class="ctrl" id="viewer-vol-btn" onclick="toggleDeafen()" title="Mutar/Desmutar Áudio" style="width:30px;height:30px;background:transparent!important;border:none!important;">
                    <svg id="v-vol-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                  </button>
                  <div class="player-vol-slider-box">
                    <input type="range" id="zoom-vol-sl" min="0" max="100" value="100" oninput="setStreamVolume(this.value)"/>
                  </div>
                  <span class="player-vol-pct" id="v-vol-pct">100%</span>
                </div>

                <!-- Zoom -->
                <button class="ctrl" onclick="resetZoom()" title="Resetar Zoom (100%)"><span style="font-size:11px;font-weight:700;">100%</span></button>
                <button class="ctrl" onclick="stepZoom(0.2)" title="Aumentar Zoom (+)"><span style="font-size:14px;font-weight:800;">+</span></button>
                <button class="ctrl" onclick="stepZoom(-0.2)" title="Diminuir Zoom (-)"><span style="font-size:14px;font-weight:800;">&minus;</span></button>

                <!-- Tela Cheia -->
                <button class="ctrl" onclick="toggleFS('viewer-vbox')" title="Tela Cheia">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>

                <!-- Sair -->
                <button class="ctrl danger" onclick="leaveRoom()" title="Sair da Sala">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </div>`;

if (html.includes(oldViewerControls)) {
  html = html.replace(oldViewerControls, newViewerControls);
  console.log('Replaced Viewer Controls successfully!');
}

// ── 7. REMOVE #view-events SECTION COMPLETELY ──
const vEvtIdx = html.indexOf('<!-- ══ 4. EVENTOS ══ -->');
const vProfIdx = html.indexOf('<!-- ══ 5. PERFIL ══ -->');
if (vEvtIdx !== -1 && vProfIdx !== -1) {
  html = html.substring(0, vEvtIdx) + html.substring(vProfIdx);
  console.log('Removed #view-events section completely!');
}

// ── 8. UPDATE #view-settings (REMOVE TOGGLES & KEEP AUTOMATIC DISCORD-STYLE DETECTION & GPU) ──
const oldSettingsCard = `<div class="set-card">
            <span class="set-title">Preferências de Transmissão</span>
            <p style="font-size:12.5px;color:var(--text-s);margin-bottom:14px;">Ajustes de reprodução e estabilidade.</p>

            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Aviso de Janela Pausada</span><span class="toggle-desc">Exibir aviso discreto quando a janela compartilhada for minimizada</span></div>
              <label class="tgl"><input type="checkbox" id="set-pause-notify" checked onchange="togglePauseNotification(this)"/><span class="tgl-sl"></span></label>
            </div>

            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Aceleração de GPU</span><span class="toggle-desc">Priorizar placa de vídeo para manter 60 FPS estáveis</span></div>
              <label class="tgl"><input type="checkbox" id="set-gpu" checked onchange="toast('Aceleração por Hardware GPU ativada', 'ok')"/><span class="tgl-sl"></span></label>
            </div>

            <button class="btn-s" onclick="location.reload()" style="justify-content:center;margin-top:14px;width:100%;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline></svg>
              Recarregar Sistema
            </button>
          </div>`;

const newSettingsCard = `<div class="set-card">
            <span class="set-title">Transmissão &amp; Desempenho</span>
            <p style="font-size:12.5px;color:var(--text-s);margin-bottom:14px;">Otimizações que operam automaticamente em segundo plano:</p>

            <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:16px;">
              <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--bg-elev);border:1px solid var(--border);border-radius:var(--r-md);">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);"></div>
                  <div>
                    <div style="font-size:13px;font-weight:700;color:var(--text);">Aceleração de GPU &amp; 60 FPS</div>
                    <div style="font-size:11px;color:var(--text-m);">Codificação H.264 / NVENC prioritária sem travamentos</div>
                  </div>
                </div>
                <span style="font-size:10.5px;font-weight:800;color:var(--green);font-family:'JetBrains Mono',monospace;background:rgba(16,185,129,0.15);padding:3px 8px;border-radius:6px;">AUTOMÁTICO</span>
              </div>

              <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:var(--bg-elev);border:1px solid var(--border);border-radius:var(--r-md);">
                <div style="display:flex;align-items:center;gap:10px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:var(--blue);box-shadow:0 0 8px var(--blue);"></div>
                  <div>
                    <div style="font-size:13px;font-weight:700;color:var(--text);">Aviso de Janela Pausada</div>
                    <div style="font-size:11px;color:var(--text-m);">Notifica suavemente quando o app capturado for minimizado</div>
                  </div>
                </div>
                <span style="font-size:10.5px;font-weight:800;color:var(--blue);font-family:'JetBrains Mono',monospace;background:rgba(37,99,235,0.15);padding:3px 8px;border-radius:6px;">ATIVO</span>
              </div>
            </div>

            <button class="btn-s" onclick="location.reload()" style="justify-content:center;margin-top:auto;width:100%;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline></svg>
              Recarregar Página
            </button>
          </div>`;

if (html.includes(oldSettingsCard)) {
  html = html.replace(oldSettingsCard, newSettingsCard);
  console.log('Replaced Settings card with automatic features!');
} else {
  html = html.replace(/<div class="set-card">[\s\S]*?Preferências de Transmissão[\s\S]*?<\/div>\s*<\/div>/, newSettingsCard + '</div>');
  console.log('Replaced Settings card via regex!');
}

// ── 9. REPLACE GIANT FOOTER (LINES 1982-2060) WITH SLIM FOOTER ──
const footerTagStart = html.indexOf('<footer class="app-footer">');
const footerTagEnd = html.indexOf('</footer>');
if (footerTagStart !== -1 && footerTagEnd !== -1) {
  const newFooterComplete = `<footer class="app-footer">
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
          <a onclick="switchView('settings')">Configurações</a>
        </div>
      </div>
    </footer>`;
  html = html.substring(0, footerTagStart) + newFooterComplete + html.substring(footerTagEnd + 9);
  console.log('Replaced complete footer with slim version!');
}

// ── 10. JAVASCRIPT LOGIC: AUTO-HIDE HUD, VOLUME CONTROL, JOIN BY CODE, SHOWCASE 3D PARALLAX ──
const newJsLogic = `
/* ═══════════ AUTO-HIDE HUD & VOLUME & QUICK JOIN ═══════════ */
function joinByCode() {
  const inEl = document.getElementById('quick-watch-in');
  if (!inEl) return;
  const code = inEl.value.trim().toUpperCase();
  if (!code) {
    toast('Digite o código da sala para assistir', 'inf');
    inEl.focus();
    return;
  }
  joinRoom(code);
}

// Auto-hide HUD do player quando o usuário não mover o mouse
function initPlayerAutoHide() {
  ['host-vbox', 'viewer-vbox'].forEach(id => {
    const box = document.getElementById(id);
    if (!box) return;
    let timer = null;
    const show = () => {
      box.classList.remove('hud-idle');
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        box.classList.add('hud-idle');
      }, 2400);
    };
    box.addEventListener('mousemove', show);
    box.addEventListener('mouseenter', show);
    box.addEventListener('mouseleave', () => {
      if (timer) clearTimeout(timer);
      box.classList.add('hud-idle');
    });
  });
}

// Controle fino de volume da transmissão
let currentVolume = 100;
let isMutedState = false;
function setStreamVolume(val) {
  currentVolume = parseInt(val, 10);
  const v = document.getElementById('remote-vid');
  if (v) v.volume = currentVolume / 100;
  const pct = document.getElementById('v-vol-pct');
  if (pct) pct.textContent = currentVolume + '%';
  const icon = document.getElementById('v-vol-icon');
  if (icon) {
    if (currentVolume === 0) {
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      isMutedState = true;
    } else {
      icon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      isMutedState = false;
    }
  }
}

function toggleVolumeMute() {
  const sl = document.getElementById('zoom-vol-sl');
  if (isMutedState) {
    setStreamVolume(100);
    if (sl) sl.value = 100;
  } else {
    setStreamVolume(0);
    if (sl) sl.value = 0;
  }
}

// Step zoom
let currentZoomVal = 1;
function stepZoom(delta) {
  currentZoomVal = Math.max(1, Math.min(2.5, currentZoomVal + delta));
  const v = document.getElementById('remote-vid');
  if (v) v.style.transform = \`scale(\${currentZoomVal})\`;
  toast(\`Zoom: \${Math.round(currentZoomVal * 100)}%\`, 'inf');
}

// Parallax 3D interativo na Showcase Card da Home
function initShowcaseParallax() {
  const card = document.getElementById('home-showcase-card');
  if (!card) return;
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -6;
    const ry = ((x - cx) / cx) * 6;
    card.style.transform = \`perspective(1000px) rotateX(\${rx}deg) rotateY(\${ry}deg) translateY(-4px)\`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
}

// Microfone viewer com troca de ícone sem cor de fundo
let vMicActive = true;
function toggleVMic() {
  vMicActive = !vMicActive;
  const icon = document.getElementById('vmic-icon');
  if (icon) {
    if (vMicActive) {
      icon.innerHTML = '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>';
      toast('Microfone ativado', 'ok');
    } else {
      icon.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>';
      toast('Microfone mutado', 'inf');
    }
  }
}

// Microfone host com troca de ícone sem cor agressiva
let hostMicActive = true;
function toggleHostMic() {
  hostMicActive = !hostMicActive;
  const icon = document.getElementById('host-mic-icon');
  if (localStream) {
    localStream.getAudioTracks().forEach(t => t.enabled = hostMicActive);
  }
  if (icon) {
    if (hostMicActive) {
      icon.innerHTML = '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>';
      toast('Microfone da live ativado', 'ok');
    } else {
      icon.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line>';
      toast('Microfone da live silenciado', 'inf');
    }
  }
}

// Inicia escutas na carga da página
document.addEventListener('DOMContentLoaded', () => {
  initPlayerAutoHide();
  initShowcaseParallax();
});
`;

html = html.replace('</script>', newJsLogic + '\n</script>');
console.log('Added auto-hide HUD, volume, mic toggle and 3D parallax script!');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Finished writing updated public/index.html! New size:', html.length);
