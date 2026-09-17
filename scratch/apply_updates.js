const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. REMOVE .splash-logo-sheen CSS (lines ~302-321)
const oldSheenCss = `/* Reflexo de luz / sheen que corre na logo */
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
}`;

if (html.includes(oldSheenCss)) {
  html = html.replace(oldSheenCss, '/* Sheen retangular removido conforme solicitado para eliminar borda estranha */');
  console.log('Removed oldSheenCss successfully');
} else {
  console.warn('Could not find exact oldSheenCss block');
}

// 2. REMOVE <div class="splash-logo-sheen" id="splash-sheen"></div> AND onclick="skipSplash()"
const oldSplashHtml = `<div id="splash" onclick="skipSplash()">`;
if (html.includes(oldSplashHtml)) {
  html = html.replace(oldSplashHtml, `<div id="splash">`);
  console.log('Removed onclick=skipSplash successfully');
}

const oldSheenDiv = `      <img src="assets/logo_cropped.png" alt="Zyro Logo" class="splash-flying-logo" id="splash-logo"/>
      <div class="splash-logo-sheen" id="splash-sheen"></div>`;

if (html.includes(oldSheenDiv)) {
  html = html.replace(oldSheenDiv, `      <img src="assets/logo_cropped.png" alt="Zyro Logo" class="splash-flying-logo" id="splash-logo"/>`);
  console.log('Removed splash-sheen div successfully');
} else {
  console.warn('Could not find exact oldSheenDiv');
}

// 3. DISABLE skipSplash AND KEYDOWN SKIP
const oldSkipJs = `function skipSplash() {
  finishIntro();
}

document.addEventListener('keydown', (e) => {
  if (!introDone && (e.key === 'Escape' || e.key === ' ')) {
    finishIntro();
  }
});`;

const newSkipJs = `function skipSplash() {
  // Desabilitado conforme solicitação do usuário: clicar na tela não pula o carregamento
}

document.addEventListener('keydown', (e) => {
  // Desabilitado pular por clique ou teclado acidental durante a inicialização
});`;

if (html.includes(oldSkipJs)) {
  html = html.replace(oldSkipJs, newSkipJs);
  console.log('Disabled skipSplash and keydown successfully');
} else {
  console.warn('Could not find exact oldSkipJs');
}

// 4. In runSplashBar(), clean up sheen reference
const oldRunSheen = `    const shock = document.getElementById('splash-shockwave');
    if (shock) shock.classList.add('pulse');
    const sheen = document.getElementById('splash-sheen');
    if (sheen) sheen.classList.add('flash');`;

const newRunSheen = `    const shock = document.getElementById('splash-shockwave');
    if (shock) shock.classList.add('pulse');`;

if (html.includes(oldRunSheen)) {
  html = html.replace(oldRunSheen, newRunSheen);
  console.log('Cleaned runSplashBar sheen code');
}

// 5. UPDATE .nav CSS: change flex: 1 to flex: 0 0 auto
const oldNavCss = `.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  flex: 1;
}`;

const newNavCss = `.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  flex: 0 0 auto;
}`;

if (html.includes(oldNavCss)) {
  html = html.replace(oldNavCss, newNavCss);
  console.log('Updated .nav CSS successfully');
} else {
  console.warn('Could not find exact oldNavCss');
}

// 6. ADD CSS FOR NEW SIDEBAR ELEMENTS (Voice dock, tools card, discord user card)
const newSidebarCss = `
/* ── NOVO: DOCK DE VOZ & ÁUDIO LATERAL ── */
.sb-section-card {
  background: rgba(14, 18, 28, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--r-md);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all .2s ease;
}
.sb-section-card:hover {
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.svc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.svc-title-row {
  display: flex;
  align-items: center;
  gap: 7px;
}
.svc-mic-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 6px #22c55e;
  transition: all .3s;
}
.svc-title {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.2px;
}
.svc-badge {
  font-size: 9.5px;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  letter-spacing: 0.5px;
  transition: all .3s;
}

/* VU-meter dinâmico de voz */
.svc-vumeter {
  display: flex;
  gap: 4px;
  height: 6px;
  width: 100%;
  background: rgba(255, 255, 255, 0.06);
  padding: 1px;
  border-radius: 4px;
  overflow: hidden;
}
.svc-vu-bar {
  flex: 1;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.12);
  transition: background-color .1s ease, transform .1s ease, box-shadow .1s ease;
}
.svc-vu-bar.lit {
  background: #22c55e;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.8);
}
.svc-vu-bar.lit:nth-child(4) {
  background: #eab308;
  box-shadow: 0 0 6px rgba(234, 179, 8, 0.8);
}
.svc-vu-bar.lit:nth-child(5) {
  background: #ef4444;
  box-shadow: 0 0 6px rgba(239, 68, 68, 0.8);
}

.svc-controls-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
}
.svc-btn {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 6px 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--text-s);
  font-family: inherit;
  font-size: 10px;
  font-weight: 700;
  transition: all .2s;
}
.svc-btn:hover {
  background: var(--bg-hover);
  color: var(--text);
  border-color: rgba(59, 130, 246, 0.4);
}
.svc-btn.active {
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
}
.svc-btn.muted {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.1);
}
.svc-btn.testing {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.15);
  animation: pulseTesting 1.2s infinite;
}
@keyframes pulseTesting {
  0%, 100% { box-shadow: 0 0 0 rgba(34, 197, 94, 0); }
  50% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.4); }
}

/* ── NOVO: FERRAMENTAS RÁPIDAS DA LIVE ── */
.sb-tools-card {
  gap: 6px;
}
.stc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stc-title {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-m);
}
.stc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.stc-item-btn {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 7px 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text);
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  transition: all .2s;
}
.stc-item-btn:hover {
  background: rgba(59, 130, 246, 0.12);
  border-color: #3b82f6;
  color: #ffffff;
  transform: translateY(-1px);
}
.stc-item-btn svg {
  color: #3b82f6;
}

/* ── NOVO: DISCORD USER CARD NO RODAPÉ ── */
.sb-user-card {
  background: rgba(14, 18, 28, 0.88);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  transition: all .2s;
}
.sb-user-card:hover {
  background: var(--bg-hover);
  border-color: rgba(59, 130, 246, 0.35);
}
.suc-avatar-wrap {
  position: relative;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
}
.suc-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}
.suc-status-dot {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid rgba(9, 11, 18, 0.96);
  box-shadow: 0 0 6px #22c55e;
}
.suc-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}
.suc-name {
  font-size: 12.5px;
  font-weight: 800;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.suc-tag {
  font-size: 10px;
  color: var(--text-m);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}
.suc-gear-btn {
  background: transparent;
  border: none;
  color: var(--text-s);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .2s;
}
.suc-gear-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
}

/* Light theme overrides */
body.theme-light .sb-section-card,
body.theme-light .sb-user-card {
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}
body.theme-light .svc-title,
body.theme-light .suc-name {
  color: #0f172a !important;
}
body.theme-light .svc-btn,
body.theme-light .stc-item-btn {
  background: #f8fafc !important;
  border-color: #cbd5e1 !important;
  color: #334155 !important;
}
body.theme-light .svc-vumeter {
  background: rgba(0, 0, 0, 0.05) !important;
}
body.theme-light .svc-vu-bar {
  background: rgba(0, 0, 0, 0.12) !important;
}
body.theme-light .suc-status-dot {
  border-color: #ffffff !important;
}
`;

// Insert newSidebarCss right above </style>
html = html.replace('</style>', newSidebarCss + '\n</style>');
console.log('Appended newSidebarCss');

// 7. INSERT NEW SIDEBAR HTML
const oldSidebarNavClose = `      <li class="ni" id="nav-settings" onclick="switchView('settings')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        <span>Configurações</span>
      </li>
    </ul>`;

const newSidebarWidgetsHtml = `      <li class="ni" id="nav-settings" onclick="switchView('settings')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        <span>Configurações</span>
      </li>
    </ul>

    <!-- NOVO: DOCK DE VOZ & ÁUDIO LATERAL -->
    <div class="sb-section-card sb-voice-card" id="sb-voice-card">
      <div class="svc-header">
        <div class="svc-title-row">
          <div class="svc-mic-dot" id="sb-mic-indicator"></div>
          <span class="svc-title">Controle de Voz</span>
        </div>
        <span class="svc-badge" id="sb-voice-status-badge">PRONTO</span>
      </div>
      
      <!-- VU-Meter interativo de voz -->
      <div class="svc-vumeter" title="Nível de captação do microfone">
        <div class="svc-vu-bar"></div>
        <div class="svc-vu-bar"></div>
        <div class="svc-vu-bar"></div>
        <div class="svc-vu-bar"></div>
        <div class="svc-vu-bar"></div>
      </div>

      <div class="svc-controls-row">
        <!-- Botão Mute / Unmute do Mic -->
        <button type="button" class="svc-btn active" id="sb-btn-mic" onclick="toggleSidebarMic()" title="Mutar / Ativar Microfone">
          <svg id="sb-icon-mic-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          <svg id="sb-icon-mic-off" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          <span id="sb-txt-mic">Mic</span>
        </button>

        <!-- Botão Deafen (Silenciar Som dos Outros) -->
        <button type="button" class="svc-btn active" id="sb-btn-deafen" onclick="toggleSidebarDeafen()" title="Silenciar / Ouvir Transmissão">
          <svg id="sb-icon-headset-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
          <svg id="sb-icon-headset-off" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M3.5 12a9 9 0 0 1 15.36-6.36M21 12v6a2 2 0 0 1-.59 1.41"></path><path d="M17 17a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-3v3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
          <span id="sb-txt-deafen">Áudio</span>
        </button>

        <!-- Botão Testar Mic -->
        <button type="button" class="svc-btn" id="sb-btn-testmic" onclick="toggleSidebarTestMic()" title="Testar sensibilidade do Microfone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
          <span>Testar</span>
        </button>
      </div>
    </div>

    <!-- NOVO: FERRAMENTAS RÁPIDAS DE TRANSMISSÃO -->
    <div class="sb-section-card sb-tools-card">
      <div class="stc-header">
        <span class="stc-title">Ferramentas da Live</span>
      </div>
      <div class="stc-grid">
        <button type="button" class="stc-item-btn" onclick="takeStreamSnapshot()" title="Capturar print instantâneo da transmissão em alta resolução">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          <span>Print HD</span>
        </button>
        <button type="button" class="stc-item-btn" onclick="toggleAppFullscreen()" title="Alternar modo Tela Cheia / Cinema (F11)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          <span>Tela Cheia</span>
        </button>
      </div>
    </div>`;

if (html.includes(oldSidebarNavClose)) {
  html = html.replace(oldSidebarNavClose, newSidebarWidgetsHtml);
  console.log('Inserted new sidebar widgets HTML successfully');
} else {
  console.warn('Could not find exact oldSidebarNavClose');
}

// 8. INSERT DISCORD USER CARD IN SIDEBAR (right before .sb-footer)
const oldSbFooter = `    <div class="sb-footer">`;
const newSbFooter = `    <!-- NOVO: CARD DE IDENTIDADE DO USUÁRIO TIPO DISCORD -->
    <div class="sb-user-card" onclick="switchView('profile')" title="Ver e editar meu perfil">
      <div class="suc-avatar-wrap">
        <div class="suc-avatar" id="sb-user-avatar">P</div>
        <div class="suc-status-dot" id="sb-user-status-dot"></div>
      </div>
      <div class="suc-info">
        <div class="suc-name" id="sb-user-name">Player</div>
        <div class="suc-tag" id="sb-user-tag">#ZR-01</div>
      </div>
      <button type="button" class="suc-gear-btn" onclick="event.stopPropagation(); switchView('settings');" title="Configurações">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="14" height="14"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </button>
    </div>

    <div class="sb-footer">`;

if (html.includes(oldSbFooter)) {
  html = html.replace(oldSbFooter, newSbFooter);
  console.log('Inserted discord user card HTML successfully');
} else {
  console.warn('Could not find exact oldSbFooter');
}

// 9. ADD JAVASCRIPT CONTROLLERS FOR SIDEBAR WIDGETS
const sidebarJsControllers = `
// ═══════════ NOVO: CONTROLE DE ÁUDIO & FERRAMENTAS DO SIDEBAR ═══════════
let sbTestMicActive = false;
let sbTestMicStream = null;
let sbTestMicAudioCtx = null;
let sbTestMicInterval = null;

function setSidebarVuBars(level) {
  const bars = document.querySelectorAll('.svc-vu-bar');
  bars.forEach((bar, idx) => {
    if (idx < level) bar.classList.add('lit');
    else bar.classList.remove('lit');
  });
}

function updateSidebarAudioDock() {
  const dot = document.getElementById('sb-mic-indicator');
  const badge = document.getElementById('sb-voice-status-badge');
  const micBtn = document.getElementById('sb-btn-mic');
  const micTxt = document.getElementById('sb-txt-mic');
  const iconOn = document.getElementById('sb-icon-mic-on');
  const iconOff = document.getElementById('sb-icon-mic-off');
  
  const deafenBtn = document.getElementById('sb-btn-deafen');
  const deafenTxt = document.getElementById('sb-txt-deafen');
  const dOn = document.getElementById('sb-icon-headset-on');
  const dOff = document.getElementById('sb-icon-headset-off');

  if (myIsMuted) {
    if (dot) { dot.style.background = '#ef4444'; dot.style.boxShadow = '0 0 8px #ef4444'; }
    if (badge) { badge.textContent = 'MUTADO'; badge.style.color = '#ef4444'; badge.style.background = 'rgba(239,68,68,0.15)'; }
    if (micBtn) { micBtn.classList.add('muted'); micBtn.classList.remove('active'); }
    if (micTxt) micTxt.textContent = 'Mudo';
    if (iconOn) iconOn.style.display = 'none';
    if (iconOff) iconOff.style.display = 'inline-block';
    if (!sbTestMicActive) setSidebarVuBars(0);
  } else {
    if (dot) { dot.style.background = '#22c55e'; dot.style.boxShadow = '0 0 8px #22c55e'; }
    if (badge) { badge.textContent = 'ATIVO'; badge.style.color = '#22c55e'; badge.style.background = 'rgba(34,197,94,0.15)'; }
    if (micBtn) { micBtn.classList.add('active'); micBtn.classList.remove('muted'); }
    if (micTxt) micTxt.textContent = 'Mic';
    if (iconOn) iconOn.style.display = 'inline-block';
    if (iconOff) iconOff.style.display = 'none';
  }

  if (myIsDeafened) {
    if (deafenBtn) { deafenBtn.classList.add('muted'); deafenBtn.classList.remove('active'); }
    if (deafenTxt) deafenTxt.textContent = 'Mudo';
    if (dOn) dOn.style.display = 'none';
    if (dOff) dOff.style.display = 'inline-block';
  } else {
    if (deafenBtn) { deafenBtn.classList.remove('muted'); deafenBtn.classList.add('active'); }
    if (deafenTxt) deafenTxt.textContent = 'Áudio';
    if (dOn) dOn.style.display = 'inline-block';
    if (dOff) dOff.style.display = 'none';
  }
}

function toggleSidebarMic() {
  toggleMyMic();
  updateSidebarAudioDock();
}

function toggleSidebarDeafen() {
  toggleMyDeafen();
  updateSidebarAudioDock();
}

async function toggleSidebarTestMic() {
  const btn = document.getElementById('sb-btn-testmic');
  if (sbTestMicActive) {
    sbTestMicActive = false;
    if (sbTestMicStream) {
      sbTestMicStream.getTracks().forEach(t => t.stop());
      sbTestMicStream = null;
    }
    if (sbTestMicAudioCtx) {
      sbTestMicAudioCtx.close().catch(() => {});
      sbTestMicAudioCtx = null;
    }
    if (sbTestMicInterval) clearInterval(sbTestMicInterval);
    if (btn) btn.classList.remove('testing');
    setSidebarVuBars(0);
    toast('Teste de microfone encerrado.', 'inf');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    sbTestMicStream = stream;
    sbTestMicActive = true;
    if (btn) btn.classList.add('testing');
    toast('🎙️ Testando microfone! Fale para ver as barras verdes.', 'ok');

    const ac = new (window.AudioContext || window.webkitAudioContext)();
    sbTestMicAudioCtx = ac;
    const src = ac.createMediaStreamSource(stream);
    const an = ac.createAnalyser();
    an.fftSize = 128;
    src.connect(an);
    const buf = new Uint8Array(an.frequencyBinCount);

    sbTestMicInterval = setInterval(() => {
      if (!sbTestMicActive) {
        clearInterval(sbTestMicInterval);
        return;
      }
      an.getByteFrequencyData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i];
      const avg = sum / buf.length;
      let barsLit = 0;
      if (avg > 4) barsLit = 1;
      if (avg > 14) barsLit = 2;
      if (avg > 28) barsLit = 3;
      if (avg > 50) barsLit = 4;
      if (avg > 75) barsLit = 5;
      setSidebarVuBars(barsLit);
    }, 70);
  } catch (err) {
    toast('Não foi possível acessar o microfone: ' + err.message, 'err');
  }
}

function takeStreamSnapshot() {
  const v = document.getElementById('remote-vid');
  const h = document.getElementById('screen-preview');
  const active = (v && v.videoWidth > 0 && v.style.display !== 'none') ? v : ((h && h.videoWidth > 0) ? h : null);

  if (active) {
    try {
      const c = document.createElement('canvas');
      c.width = active.videoWidth;
      c.height = active.videoHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(active, 0, 0, c.width, c.height);
      const a = document.createElement('a');
      a.download = 'zyro-print-' + Date.now() + '.png';
      a.href = c.toDataURL('image/png');
      a.click();
      soundClick();
      toast('📸 Captura da tela salva com sucesso!', 'ok');
    } catch (e) {
      toast('Erro ao capturar frame do vídeo: ' + e.message, 'err');
    }
  } else {
    toast('Inicie ou assista a uma transmissão para tirar um Print HD!', 'inf');
  }
}

function toggleAppFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
    toast('🖥️ Modo Tela Cheia ativado', 'ok');
  } else {
    document.exitFullscreen().catch(() => {});
    toast('Modo Janela restaurado', 'inf');
  }
}
`;

// Insert sidebarJsControllers before </script>
html = html.replace('</script>\n</body>', sidebarJsControllers + '\n</script>\n</body>');
console.log('Appended sidebarJsControllers');

// 10. Update updateAvatar to sync Discord card in sidebar
const oldUpdateAvatar = `function updateAvatar(){
  const h=document.getElementById('hdr-av'),b=document.getElementById('big-av');const ini=myName.charAt(0).toUpperCase();
  if(myAv){if(h){h.style.backgroundImage='url('+myAv+')';h.style.backgroundSize='cover';h.style.backgroundPosition='center';h.textContent='';}if(b){b.style.backgroundImage='url('+myAv+')';b.style.backgroundSize='cover';b.style.backgroundPosition='center';b.textContent='';}}
  else{if(h)h.textContent=ini;if(b)b.textContent=ini;}
}`;

const newUpdateAvatar = `function updateAvatar(){
  const h=document.getElementById('hdr-av'),b=document.getElementById('big-av');
  const sbAv=document.getElementById('sb-user-avatar');
  const sbNm=document.getElementById('sb-user-name');
  const sbTg=document.getElementById('sb-user-tag');
  const ini=myName.charAt(0).toUpperCase();
  if(myAv){
    if(h){h.style.backgroundImage='url('+myAv+')';h.style.backgroundSize='cover';h.style.backgroundPosition='center';h.textContent='';}
    if(b){b.style.backgroundImage='url('+myAv+')';b.style.backgroundSize='cover';b.style.backgroundPosition='center';b.textContent='';}
    if(sbAv){sbAv.style.backgroundImage='url('+myAv+')';sbAv.style.backgroundSize='cover';sbAv.style.backgroundPosition='center';sbAv.textContent='';}
  } else {
    if(h)h.textContent=ini;
    if(b)b.textContent=ini;
    if(sbAv){sbAv.style.backgroundImage='none';sbAv.textContent=ini;}
  }
  if(sbNm) sbNm.textContent = myName || 'Player';
  if(sbTg) sbTg.textContent = myTag || '#ZR-01';
  if(typeof updateSidebarAudioDock === 'function') updateSidebarAudioDock();
}`;

if (html.includes(oldUpdateAvatar)) {
  html = html.replace(oldUpdateAvatar, newUpdateAvatar);
  console.log('Updated updateAvatar successfully');
} else {
  console.warn('Could not find exact oldUpdateAvatar');
}

// 11. In initVAD, also bounce sidebar VU-meter when speaking
const oldVadSpeak = `        if (!vadLastSpeaking) {
          vadLastSpeaking = true;
          wsSend({ type: 'voice-status', isSpeaking: true, isMuted: false, isDeafened: myIsDeafened, avatar: myAv });
        }`;

const newVadSpeak = `        if (!vadLastSpeaking) {
          vadLastSpeaking = true;
          wsSend({ type: 'voice-status', isSpeaking: true, isMuted: false, isDeafened: myIsDeafened, avatar: myAv });
        }
        if (!sbTestMicActive) {
          let barsLit = Math.min(5, Math.max(1, Math.round(avg / 15)));
          setSidebarVuBars(barsLit);
        }`;

if (html.includes(oldVadSpeak)) {
  html = html.replace(oldVadSpeak, newVadSpeak);
  console.log('Hooked sidebar VU-meter into initVAD speaking');
}

const oldVadSilence = `        silenceTimer = setTimeout(() => {
          vadLastSpeaking = false;
          wsSend({ type: 'voice-status', isSpeaking: false, isMuted: myIsMuted, isDeafened: myIsDeafened, avatar: myAv });
        }, 350);`;

const newVadSilence = `        silenceTimer = setTimeout(() => {
          vadLastSpeaking = false;
          wsSend({ type: 'voice-status', isSpeaking: false, isMuted: myIsMuted, isDeafened: myIsDeafened, avatar: myAv });
          if (!sbTestMicActive) setSidebarVuBars(0);
        }, 350);`;

if (html.includes(oldVadSilence)) {
  html = html.replace(oldVadSilence, newVadSilence);
  console.log('Hooked sidebar VU-meter silence into initVAD');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('public/index.html updated successfully!');
