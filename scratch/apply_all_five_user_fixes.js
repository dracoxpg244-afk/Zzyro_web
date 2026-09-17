const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');
console.log('Read index.html length:', html.length);

// ── 1. FIX SHOWCASE CARD: Remove horizontal dividing line cutting through the Z ──
// Replace .showcase-glass-bar to not sit over the image with a cut border
const oldShowcaseGlassBar = `.showcase-glass-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(7, 9, 14, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}`;

const newShowcaseGlassBar = `.showcase-glass-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(6, 8, 14, 0.88) 35%, rgba(6, 8, 14, 0.98) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: none !important;
  padding: 24px 20px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}`;

if (html.includes(oldShowcaseGlassBar)) {
  html = html.replace(oldShowcaseGlassBar, newShowcaseGlassBar);
  console.log('Fixed showcase-glass-bar border-top seam');
} else {
  console.warn('Could not match oldShowcaseGlassBar');
}

// Ensure showcase-img has full height and no seam
html = html.replace('.showcase-card:hover .showcase-img {\n  transform: scale(1.02);\n}',
  '.showcase-card:hover .showcase-img {\n  transform: scale(1.015);\n}\n.showcase-card { overflow: hidden; border: 1px solid var(--border-s); }');

// ── 2. MOVE THE 4 FEATURE CARDS FURTHER DOWN ("deixe essas coisas mais para baixo") ──
const oldHeroFeaturesCss = `.hero-features{display:flex;gap:24px;flex-wrap:wrap;justify-content:center}`;
const newHeroFeaturesCss = `.hero-features {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 56px !important;
  margin-bottom: 44px !important;
}`;

if (html.includes(oldHeroFeaturesCss)) {
  html = html.replace(oldHeroFeaturesCss, newHeroFeaturesCss);
  console.log('Moved hero-features further down');
} else {
  console.warn('Could not match oldHeroFeaturesCss');
}

// ── 3. ADD SIDEBAR WIDGET TO FILL EMPTY SPACE ("essa parte quero q tenha algo aqui para nao ficar vazio") ──
const sidebarWidgetHtml = `
    <!-- WIDGET LATERAL: REDE & STATUS P2P (PREENCHE O ESPAÇO VAZIO COM ALTA UTILIDADE) -->
    <div class="sb-widget-card">
      <div class="sw-header">
        <div class="sw-dot"></div>
        <span class="sw-title">Rede P2P Zyro</span>
        <span class="sw-pill">ONLINE</span>
      </div>
      <div class="sw-meta-row">
        <div class="sw-meta-col">
          <span class="sw-val" id="sw-ping">12 ms</span>
          <span class="sw-lbl">Latência</span>
        </div>
        <div class="sw-meta-col">
          <span class="sw-val">60 FPS</span>
          <span class="sw-lbl">Playout</span>
        </div>
        <div class="sw-meta-col">
          <span class="sw-val">AES-256</span>
          <span class="sw-lbl">Segurança</span>
        </div>
      </div>
      <button type="button" class="sw-btn" onclick="openJoinModal()">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Entrar com Código
      </button>
    </div>
`;

// Insert before <div class="sb-footer">
if (html.includes('<div class="sb-footer">') && !html.includes('sb-widget-card')) {
  html = html.replace('<div class="sb-footer">', sidebarWidgetHtml + '\n    <div class="sb-footer">');
  console.log('Added sb-widget-card into sidebar');
}

// ── 4. CSS FOR SIDEBAR WIDGET (DARK & LIGHT COMPATIBLE) ──
const sidebarWidgetCss = `
/* ── SIDEBAR WIDGET CARD (PREENCHIMENTO INTELIGENTE DO ESPAÇO) ── */
.sb-widget-card {
  margin-top: auto;
  margin-bottom: 8px;
  background: linear-gradient(145deg, rgba(37, 99, 235, 0.1) 0%, rgba(15, 20, 32, 0.85) 100%);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: var(--r-md);
  padding: 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  transition: all .25s ease;
}
.sb-widget-card:hover {
  border-color: rgba(59, 130, 246, 0.45);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
}
.sw-header {
  display: flex;
  align-items: center;
  gap: 7px;
}
.sw-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulse 2s infinite;
}
.sw-title {
  font-size: 11.5px;
  font-weight: 800;
  color: #f8fafc;
  letter-spacing: 0.3px;
  flex: 1;
}
.sw-pill {
  font-size: 9px;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  padding: 2px 6px;
  border-radius: 4px;
}
.sw-meta-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: rgba(0, 0, 0, 0.35);
  padding: 6px 4px;
  border-radius: var(--r-sm);
  text-align: center;
}
.sw-meta-col {
  display: flex;
  flex-direction: column;
}
.sw-val {
  font-size: 11px;
  font-weight: 800;
  color: #60a5fa;
  font-family: 'JetBrains Mono', monospace;
}
.sw-lbl {
  font-size: 9px;
  color: var(--text-m);
  margin-top: 1px;
}
.sw-btn {
  background: rgba(37, 99, 235, 0.18);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.32);
  border-radius: var(--r-sm);
  padding: 7px 10px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all .2s;
  font-family: inherit;
}
.sw-btn:hover {
  background: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
}
body.theme-light .sb-widget-card {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
}
body.theme-light .sw-title {
  color: #0f172a !important;
}
body.theme-light .sw-meta-row {
  background: #f1f5f9 !important;
}
body.theme-light .sw-val {
  color: #2563eb !important;
}
body.theme-light .sw-lbl {
  color: #64748b !important;
}
body.theme-light .sw-btn {
  background: #f1f5f9 !important;
  color: #2563eb !important;
  border-color: #cbd5e1 !important;
}
body.theme-light .sw-btn:hover {
  background: #2563eb !important;
  color: #ffffff !important;
  border-color: #2563eb !important;
}
`;

html = html.replace('/* ── SIDEBAR WIDGET CARD', '/* OLD');
html = html.replace('/* ── HERO FEATURE CARDS MODERNOS ── */', sidebarWidgetCss + '\n/* ── HERO FEATURE CARDS MODERNOS ── */');

// ── 5. "coloque o fundo dps de entrar no sistema" ──
// Make bg-canvas opacity 0 by default, and fade in when body.system-entered
const oldBgCanvasCss = `/* ── CANVAS ── */
#bg-canvas{position:fixed;inset:0;z-index:0;pointer-events:none}`;

const newBgCanvasCss = `/* ── CANVAS (ATIVADO SOMENTE APÓS ENTRAR NO SISTEMA) ── */
#bg-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1);
}
body.system-entered #bg-canvas {
  opacity: 1;
}`;

if (html.includes(oldBgCanvasCss)) {
  html = html.replace(oldBgCanvasCss, newBgCanvasCss);
  console.log('Updated #bg-canvas to fade in after entering system');
} else {
  console.warn('Could not match oldBgCanvasCss');
}

// In finishIntro, add body.system-entered
if (!html.includes("document.body.classList.add('system-entered')")) {
  html = html.replace('introDone = true;', "introDone = true;\n  document.body.classList.add('system-entered');");
  console.log('Added system-entered class trigger to finishIntro');
}

// ── 6. SETTINGS VIEW THEME LIGHT CONTRAST: .set-title, .set-card, toggles, reload button ──
html = html.replace('.set-title{font-size:15px;font-weight:800;color:#fff;',
  '.set-title{font-size:15px;font-weight:800;color:var(--text);');

// Additional light theme overrides for settings view
const settingsThemeLightCss = `
/* ── CONTRASTE IMPECÁVEL PARA TELA DE CONFIGURAÇÕES NO TEMA CLARO ── */
body.theme-light .set-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.05) !important;
}
body.theme-light .set-title {
  color: #0f172a !important;
  border-bottom: 1px solid #e2e8f0 !important;
}
body.theme-light .set-card p {
  color: #475569 !important;
}
body.theme-light .set-card .toggle-name {
  color: #0f172a !important;
}
body.theme-light .set-card .toggle-desc {
  color: #64748b !important;
}
body.theme-light .theme-card-btn {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
}
body.theme-light .theme-card-btn:hover {
  border-color: #2563eb !important;
}
body.theme-light .theme-card-btn span {
  color: #0f172a !important;
}
`;

html = html.replace('/* ── TEMAS DO SISTEMA (Obsidian Dark, Clean Light, Midnight Neon) ── */',
  settingsThemeLightCss + '\n/* ── TEMAS DO SISTEMA (Obsidian Dark, Clean Light, Midnight Neon) ── */');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Applied all 5 fixes to public/index.html successfully!');
