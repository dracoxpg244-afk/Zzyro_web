const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(filePath, 'utf8');

// ── 1. REMOVE "BOLA" (RADIAL CIRCLE) FROM SPLASH CSS AND ADD HORIZON BEAM ──
const oldSplashCssPattern = `/* ── SPLASH (TELA DE CARREGAMENTO FIVEM CINEMÁTICA) ── */
#splash {
  position: fixed;
  inset: 0;
  /* Fundo 3D escuro limpo e profundo sem nenhuma logo estática de fundo */
  background: radial-gradient(circle at 50% 45%, #090d16 0%, #030407 75%);
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
}`;

const newSplashCssPattern = `/* ── SPLASH (TELA DE CARREGAMENTO FIVEM CINEMÁTICA - SEM BOLA/CÍRCULO) ── */
#splash {
  position: fixed;
  inset: 0;
  /* Fundo linear metálico escuro escovado com horizonte cinemático (zero círculos ou bolas) */
  background: linear-gradient(180deg, #020305 0%, #060913 32%, #0a0e1c 50%, #060913 68%, #020305 100%);
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
  transition: opacity .4s cubic-bezier(0.16, 1, 0.3, 1), transform .4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Feixe de luz horizontal no horizonte (substitui o efeito redondo por um horizonte futurista) */
.splash-horizon-beam {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 86vw;
  max-width: 1100px;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.25) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(59, 130, 246, 0.25) 80%, transparent 100%);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 45px rgba(255, 255, 255, 0.6);
  z-index: 1;
  pointer-events: none;
  animation: beamHorizonPulse 3s ease-in-out infinite alternate;
}
@keyframes beamHorizonPulse {
  0% { opacity: 0.55; transform: translate(-50%, -50%) scaleX(0.85); }
  100% { opacity: 1; transform: translate(-50%, -50%) scaleX(1); }
}`;

if (html.includes(oldSplashCssPattern)) {
  html = html.replace(oldSplashCssPattern, newSplashCssPattern);
  console.log('Replaced splash CSS pattern!');
}

// Remove splash-dark-wall CSS
const oldDarkWallCss = `/* Parede preta 3D inicial que envolve o centro */
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
}`;

if (html.includes(oldDarkWallCss)) {
  html = html.replace(oldDarkWallCss, '/* splash-dark-wall removida para eliminar círculo/bola */');
  console.log('Removed splash-dark-wall CSS!');
}

// In splash HTML: replace splash-dark-wall with splash-horizon-beam
const oldSplashWallHtml = `<div class="splash-dark-wall" id="splash-dark-wall"></div>`;
const newSplashBeamHtml = `<div class="splash-horizon-beam"></div>`;
if (html.includes(oldSplashWallHtml)) {
  html = html.replace(oldSplashWallHtml, newSplashBeamHtml);
  console.log('Replaced splash-dark-wall with splash-horizon-beam HTML!');
}

// ── 2. FIX SIDEBAR BRAND HEADER (REPLACE "Zzyro Zyro" WITH SLEEK NEON "Z" ICON) ──
const oldBrandHeader = `<div class="brand" onclick="switchView('home')">
      <div class="brand-icon" style="border:none !important;box-shadow:none !important;background:transparent !important;padding:0 !important;">
        <img src="assets/logo.png" alt="Zyro" class="brand-logo-img"/>
      </div>
      <div>
        <div class="brand-name">Zyro</div>
        <div class="brand-sub" style="color:#94a3b8;letter-spacing:1px;font-size:9.5px;text-transform:uppercase;">Live Stream</div>
      </div>
    </div>`;

const newBrandHeader = `<div class="brand" onclick="switchView('home')" title="Zyro Live Stream">
      <div class="brand-badge-z">
        <svg viewBox="0 0 28 28" width="20" height="20" fill="none">
          <path d="M5 7h18l-12 14h12" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 7h14" stroke="#3b82f6" stroke-width="3.2" stroke-linecap="round"/>
        </svg>
      </div>
      <div>
        <div class="brand-name">Zyro</div>
        <div class="brand-sub">Live Stream</div>
      </div>
    </div>`;

if (html.includes(oldBrandHeader)) {
  html = html.replace(oldBrandHeader, newBrandHeader);
  console.log('Updated Sidebar Brand Header with clean Z icon!');
}

// ── 3. REPLACE HERO FEATURE PILLS (ANTI-BRUTE FORCE / AES-GCM) WITH SLEEK HIGH-END BADGES ──
const oldHeroFeatures = `<div class="hero-features reveal delay-4">
            <div class="hf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Anti-Brute Force</div>
            <div class="hf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path></svg> Voz Bidirecional</div>
            <div class="hf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Fotos &amp; Arquivos</div>
            <div class="hf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg> AES-GCM Chat</div>
          </div>`;

const newHeroFeatures = `<div class="hero-features reveal delay-4">
            <div class="hf-card">
              <div class="hf-dot" style="background:#3b82f6;box-shadow:0 0 8px #3b82f6;"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span>Ultra Baixa Latência</span>
            </div>
            <div class="hf-card">
              <div class="hf-dot" style="background:#10b981;box-shadow:0 0 8px #10b981;"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
              <span>Modo Gamer 60 FPS</span>
            </div>
            <div class="hf-card">
              <div class="hf-dot" style="background:#8b5cf6;box-shadow:0 0 8px #8b5cf6;"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
              <span>Áudio Estéreo 320k</span>
            </div>
            <div class="hf-card">
              <div class="hf-dot" style="background:#f59e0b;box-shadow:0 0 8px #f59e0b;"></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <span>Fotos &amp; Arquivos P2P</span>
            </div>
          </div>`;

if (html.includes(oldHeroFeatures)) {
  html = html.replace(oldHeroFeatures, newHeroFeatures);
  console.log('Replaced Hero Feature pills!');
}

// ── 4. ADD COOL OPTIONS TO VIEWER CONTROLS: PiP, SNAPSHOT, THEATER MODE ──
const oldControlsRow = `<div class="player-overlay" id="viewer-ctrls-bar">
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

const newControlsRow = `<div class="player-overlay" id="viewer-ctrls-bar">
                <!-- Controle de Microfone -->
                <button class="ctrl" id="viewer-mic" onclick="toggleVMic()" title="Microfone">
                  <svg id="vmic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>

                <!-- Controle de Volume -->
                <div class="player-vol-wrap">
                  <button class="ctrl" id="viewer-vol-btn" onclick="toggleVolumeMute()" title="Mutar/Desmutar Áudio" style="width:28px;height:28px;background:transparent!important;border:none!important;">
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

                <!-- OPÇÃO INTERESSANTE 1: Mini-Player Flutuante (PiP) -->
                <button class="ctrl" onclick="togglePiP()" title="Mini-Player Flutuante (PiP)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"></rect><rect x="12" y="9" width="8" height="6" rx="1" fill="currentColor"></rect></svg>
                </button>

                <!-- OPÇÃO INTERESSANTE 2: Capturar Foto da Live -->
                <button class="ctrl" onclick="takeStreamSnapshot()" title="Tirar Foto da Tela">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19 4h-3.5l-1-2h-5l-1 2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path></svg>
                </button>

                <!-- OPÇÃO INTERESSANTE 3: Modo Teatro (Expandir Player) -->
                <button class="ctrl" onclick="toggleTheaterMode()" title="Modo Teatro (Expandir)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                </button>

                <!-- Tela Cheia -->
                <button class="ctrl" onclick="toggleFS('viewer-vbox')" title="Tela Cheia">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>

                <!-- Sair -->
                <button class="ctrl danger" onclick="leaveRoom()" title="Sair da Sala">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
              </div>`;

if (html.includes(oldControlsRow)) {
  html = html.replace(oldControlsRow, newControlsRow);
  console.log('Added PiP, Snapshot, and Theater Mode controls to viewer overlay!');
}

// ── 5. CSS FOR BRAND BADGE, HF-CARD, AND THEATER MODE ──
const additionalCss = `
/* ── BRAND BADGE Z ELEGANTE ── */
.brand-badge-z {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.35) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(59, 130, 246, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 14px rgba(37, 99, 235, 0.4);
  flex-shrink: 0;
  transition: all .25s ease;
}
.brand:hover .brand-badge-z {
  transform: scale(1.08) rotate(-2deg);
  border-color: #3b82f6;
  box-shadow: 0 0 22px rgba(59, 130, 246, 0.65);
}
body.theme-light .brand-badge-z {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.16) 0%, #ffffff 100%) !important;
  border-color: rgba(37, 99, 235, 0.45) !important;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.25) !important;
}
body.theme-light .brand-badge-z svg path:first-child {
  stroke: #0f172a !important;
}

/* ── HERO FEATURE CARDS MODERNOS ── */
.hf-card {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 18px;
  border-radius: var(--r-full);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--text);
  transition: all .25s ease;
  user-select: none;
}
.hf-card:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.26);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}
.hf-card svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
.hf-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
body.theme-light .hf-card {
  background: #ffffff !important;
  border-color: #cbd5e1 !important;
  color: #0f172a !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04) !important;
}
body.theme-light .hf-card:hover {
  border-color: #94a3b8 !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
}

/* ── MODO TEATRO NO PLAYER ── */
.studio-grid.theater-active {
  grid-template-columns: 1fr !important;
}
.studio-grid.theater-active .sf-panel {
  display: none !important;
}
`;

html = html.replace('</style>', additionalCss + '\n</style>');
console.log('Injected additional CSS styles!');

// ── 6. JS FOR PiP, SNAPSHOT, THEATER MODE ──
const coolOptionsJs = `
// Mini-Player Flutuante (PiP)
async function togglePiP() {
  const vid = document.getElementById('remote-vid');
  if (!vid) return;
  try {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      toast('Mini-Player encerrado', 'inf');
    } else {
      await vid.requestPictureInPicture();
      toast('Mini-Player ativado', 'ok');
    }
  } catch (err) {
    toast('PiP indisponível nesta aba', 'err');
  }
}

// Captura de Foto instantânea da Live
function takeStreamSnapshot() {
  const vid = document.getElementById('remote-vid');
  if (!vid || !vid.videoWidth) {
    toast('Aguarde o vídeo carregar para tirar foto', 'inf');
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.width = vid.videoWidth;
  canvas.height = vid.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  const a = document.createElement('a');
  a.download = \`zyro-foto-\${Date.now()}.png\`;
  a.href = canvas.toDataURL('image/png');
  a.click();
  playTone(850, 'sine', 0.06, 0.02);
  toast('Foto da transmissão capturada com sucesso!', 'ok');
}

// Modo Teatro (Expande o player e esconde painel lateral)
let isTheaterMode = false;
function toggleTheaterMode() {
  isTheaterMode = !isTheaterMode;
  const grid = document.querySelector('#view-viewer .studio-grid');
  if (!grid) return;
  if (isTheaterMode) {
    grid.classList.add('theater-active');
    toast('Modo Teatro ativado', 'ok');
  } else {
    grid.classList.remove('theater-active');
    toast('Modo Normal restaurado', 'inf');
  }
}
`;

html = html.replace('</script>', coolOptionsJs + '\n</script>');
console.log('Injected cool options JS!');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated public/index.html with all refinements!');
