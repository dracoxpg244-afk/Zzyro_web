const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

console.log('Original size:', html.length);

// 1. CORRIGIR CAMINHOS DE IMAGEM PARA RELATIVOS (funciona em file:///, localhost e Render)
html = html.replace(/src="\/assets\//g, 'src="assets/');
html = html.replace(/href="\/assets\//g, 'href="assets/');
html = html.replace(/url\('\/assets\//g, "url('assets/");
html = html.replace(/url\("\/assets\//g, 'url("assets/');

// 2. DEFINIR CORES EM :root (Corrigir --blue para azul vivo #2563eb, acabando com botões brancos no fundo branco)
html = html.replace(/--blue:#ffffff;/g, '--blue:#2563eb;');
html = html.replace(/--blue-g:rgba\(255,255,255,\.2\);/g, '--blue-g:rgba(37,99,235,.25);');

// 3. ADICIONAR VARIÁVEIS DE TEMAS (Obsidian Dark, Light Soft, Midnight Neon)
const themeVariables = `
/* ── TEMAS DO SISTEMA ── */
:root {
  --bg-deep:#06080c;--bg-base:#0b0e14;--bg-card:#10141e;--bg-hover:#171d2b;--bg-elev:#1c2333;
  --border:rgba(255,255,255,.08);--border-s:rgba(255,255,255,.16);
  --border-b:rgba(255,255,255,.24);--border-r:rgba(255,255,255,.18);--border-g:rgba(255,255,255,.18);
  --text:#ffffff;--text-s:#94a3b8;--text-m:#64748b;
  --red:#ef4444;--red-g:rgba(239,68,68,.3);
  --blue:#2563eb;--blue-hover:#1d4ed8;--blue-g:rgba(37,99,235,.25);
  --gold:#e2e8f0;--gold-g:rgba(255,255,255,.2);
  --green:#10b981;
  --r-sm:8px;--r-md:14px;--r-lg:22px;--r-full:9999px;
  --sw:240px;
}

body.theme-light {
  --bg-deep:#f1f5f9;--bg-base:#f8fafc;--bg-card:#ffffff;--bg-hover:#f1f5f9;--bg-elev:#e2e8f0;
  --border:rgba(0,0,0,.08);--border-s:rgba(0,0,0,.15);
  --border-b:rgba(0,0,0,.22);
  --text:#0f172a;--text-s:#475569;--text-m:#64748b;
  --blue:#2563eb;--blue-hover:#1d4ed8;--blue-g:rgba(37,99,235,.15);
}
body.theme-light .sb {
  background: rgba(255,255,255,0.95);
  border-right: 1px solid rgba(0,0,0,0.08);
}
body.theme-light .topbar {
  background: rgba(255,255,255,0.92);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}
body.theme-light .app-footer {
  background: rgba(255,255,255,0.95);
  border-top: 1px solid rgba(0,0,0,0.08);
}
body.theme-light .hero-h1, body.theme-light .brand-name {
  color: #0f172a;
}

body.theme-midnight {
  --bg-deep:#070a12;--bg-base:#0b1120;--bg-card:#0f172a;--bg-hover:#1e293b;--bg-elev:#334155;
  --border:rgba(99,102,241,.18);--border-s:rgba(99,102,241,.3);
  --border-b:rgba(99,102,241,.45);
  --text:#f8fafc;--text-s:#94a3b8;--text-m:#64748b;
  --blue:#6366f1;--blue-hover:#4f46e5;--blue-g:rgba(99,102,241,.3);
}
`;

html = html.replace(':root{', themeVariables + '\n:root{');

// 4. CORRIGIR ESTILOS DE TODOS OS BOTÕES PROBLEMÁTICOS (Acabando com os botões brancos vazios)
const fixedButtonStyles = `
/* ── CORREÇÕES DE BOTÕES & CONTRASTE VISUAL ── */
.copy-btn {
  background: #2563eb !important;
  color: #ffffff !important;
  border: none !important;
  padding: 8px 18px !important;
  border-radius: var(--r-sm) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  transition: all .2s ease !important;
}
.copy-btn:hover {
  background: #1d4ed8 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4) !important;
}

.chat-send {
  background: #2563eb !important;
  color: #ffffff !important;
  border: none !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all .2s ease !important;
}
.chat-send:hover {
  background: #1d4ed8 !important;
  transform: scale(1.06) !important;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.5) !important;
}
.chat-send svg {
  width: 15px !important;
  height: 15px !important;
  stroke: #ffffff !important;
  fill: none !important;
}

.hcb-btn {
  background: #2563eb !important;
  color: #ffffff !important;
  border: none !important;
  padding: 7px 14px !important;
  border-radius: var(--r-full) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  transition: all .2s ease !important;
}
.hcb-btn:hover {
  background: #1d4ed8 !important;
  transform: translateY(-1px) !important;
}
.hcb-btn svg {
  stroke: #ffffff !important;
}

.qp {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-s);
  transition: all .2s;
}
.qp:hover {
  border-color: #3b82f6;
  color: #fff;
}
.qp.active {
  background: #2563eb !important;
  color: #ffffff !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 14px rgba(37, 99, 235, 0.4) !important;
}

.btn-hero-primary {
  background: #2563eb !important;
  color: #ffffff !important;
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.35) !important;
  border: none !important;
}
.btn-hero-primary:hover {
  background: #1d4ed8 !important;
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.5) !important;
}
`;

html = html.replace('/* QUALITY PILLS */', fixedButtonStyles + '\n/* QUALITY PILLS */');

// 5. REMOVER AVISOS APELATIVOS DE SEGURANÇA QUE O USUÁRIO PEDIU PARA NÃO MOSTRAR
// Remover .sec-badge da barra lateral
html = html.replace(/<div class="sec-badge">[\s\S]*?<\/div>/, '');

// Remover badges chamativas do rodapé (Criptografia DTLS-SRTP e Render Cloud)
html = html.replace(/<div class="footer-badges">[\s\S]*?<\/div>\s*<\/div>/, '</div>');

// 6. ADICIONAR CONTROLES DE VOLUME, MUTE E ZOOM NO PLAYER
const playerControlsStyle = `
/* ── CONTROLES DO PLAYER (VOLUME & ZOOM) ── */
.player-toolbar {
  position: absolute;
  bottom: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(9, 12, 18, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 8px 14px;
  border-radius: var(--r-md);
  border: 1px solid rgba(255, 255, 255, 0.12);
  z-index: 15;
  transition: opacity .25s ease, transform .25s ease;
}
.pt-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.vol-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.vol-slider {
  width: 75px;
  height: 4px;
  accent-color: #3b82f6;
  cursor: pointer;
  border-radius: 4px;
}
.zoom-tag {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-s);
  min-width: 38px;
  text-align: center;
}
`;

html = html.replace('/* ── APP FOOTER', playerControlsStyle + '\n/* ── APP FOOTER');

// 7. REMOVER AVISO PESADO DE TRANSMISSÃO PAUSADA (Substituir por Pill Discreta estilo Discord)
const oldPausedCss = `#paused-overlay{position:absolute;inset:0;z-index:20;background:rgba(5,6,9,.93);backdrop-filter:blur(8px);display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:24px;animation:fadeIn .4s ease}
#paused-overlay.show{display:flex}`;

const newPausedCss = `/* OVERLAY TRANSMISSÃO PAUSADA DISCRETA (ESTILO DISCORD) */
#paused-overlay {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 25;
  background: rgba(15, 20, 30, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 8px 16px;
  border-radius: var(--r-full);
  display: none;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  pointer-events: none;
  animation: slideDown .3s ease;
}
#paused-overlay.show { display: flex; }
@keyframes slideDown { from { opacity: 0; transform: translate(-50%, -10px); } to { opacity: 1; transform: translate(-50%, 0); } }
.paused-ring { display: none; }
.paused-tips { display: none; }
.paused-sub { display: none; }
.paused-title { font-size: 12px; font-weight: 700; color: #fbbf24; }
`;

html = html.replace(oldPausedCss, newPausedCss);

// 8. TOAST NOTIFICATIONS MODERNAS & BONITAS
const newToastCss = `
/* ── NOTIFICAÇÕES (TOASTS) MODERNAS ── */
.toasts {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 99999;
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  min-width: 280px;
  max-width: 380px;
  background: rgba(14, 18, 26, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--r-md);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
  animation: toastIn .3s cubic-bezier(0.16, 1, 0.3, 1);
  transition: all .25s ease;
  position: relative;
  overflow: hidden;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(-12px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.toast.ok { border-left: 4px solid #10b981; }
.toast.inf { border-left: 4px solid #3b82f6; }
.toast.err { border-left: 4px solid #ef4444; }
.toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast.ok .toast-icon { color: #10b981; }
.toast.inf .toast-icon { color: #3b82f6; }
.toast.err .toast-icon { color: #ef4444; }
.toast-msg { flex: 1; line-height: 1.4; }
`;

html = html.replace('.toasts{', newToastCss + '\n.toasts{');

// 9. ATUALIZAR FUNÇÃO TOAST EM JAVASCRIPT
const oldToastFn = `function toast(msg,type='inf'){
  const r=document.getElementById('toasts');if(!r)return;
  const t=document.createElement('div');t.className='toast '+type;t.textContent=msg;r.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(20px)';t.style.transition='.3s';setTimeout(()=>t.remove(),300);},3800);
}`;

const newToastFn = `function toast(msg, type='inf'){
  const r = document.getElementById('toasts');
  if(!r) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  
  let iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  if(type === 'ok') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if(type === 'err') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  }

  t.innerHTML = \`<div class="toast-icon">\${iconSvg}</div><div class="toast-msg">\${msg}</div>\`;
  r.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-10px) scale(0.95)';
    setTimeout(() => t.remove(), 250);
  }, 3200);
}`;

html = html.replace(oldToastFn, newToastFn);

// 10. ATUALIZAR VIEW DE CONFIGURAÇÕES COM SELETOR DE TEMAS
const oldSettingsContent = `<div class="grid-2">
          <div class="set-card">
            <span class="set-title">Aparência do Sistema</span>
            <div style="font-size:13px;color:var(--text-s);line-height:1.6;">Tema: <b>Obsidian Black, Vermelho &amp; Azul Royal</b> com acentos dourados.</div>
            <div class="toggle-row" style="margin-top:12px;">
              <div class="toggle-info"><span class="toggle-name">Efeitos Sonoros</span><span class="toggle-sub">Sons ao enviar mensagens e entrar em salas</span></div>
              <label class="switch"><input type="checkbox" id="set-sound" checked onchange="onToggle(this,'Sons')"/><span class="slider"></span></label>
            </div>
            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Fundo Animado</span><span class="toggle-sub">Constelação animada no plano de fundo</span></div>
              <label class="switch"><input type="checkbox" id="set-canvas" checked onchange="toggleBg(this)"/><span class="slider"></span></label>
            </div>
            <button class="btn-s" onclick="replaySplash()" style="margin-top:12px;width:100%;justify-content:center;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
              Rever Abertura Cinematográfica
            </button>
          </div>
          <div class="set-card">
            <span class="set-title">Segurança Máxima</span>
            <div class="sec-list">
              <div class="sec-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg><span><b>Zero Telemetria:</b> Nenhum dado pessoal é salvo.</span></div>
              <div class="sec-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span><b>Anti-Brute Force:</b> 5 tentativas bloqueiam por 30s.</span></div>
              <div class="sec-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path></svg><span><b>WebRTC DTLS/SRTP:</b> Voz criptografada em tempo real.</span></div>
              <div class="sec-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="7.5" cy="15.5" r="5.5"></circle><path d="m21 2-9.6 9.6"></path></svg><span><b>AES-GCM Chat:</b> Mensagens criptografadas.</span></div>
            </div>
          </div>
        </div>`;

const newSettingsContent = `<div class="grid-2">
          <div class="set-card">
            <span class="set-title">Tema e Aparência</span>
            <p style="font-size:12.5px;color:var(--text-s);margin-bottom:14px;">Escolha o estilo visual ideal para você.</p>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
              <button type="button" class="theme-card-btn active" id="btn-theme-dark" onclick="setTheme('dark')">
                <div style="height:36px;border-radius:6px;background:#06080c;border:1px solid #3b82f6;display:flex;align-items:center;justify-content:center;">
                  <div style="width:8px;height:8px;border-radius:50%;background:#3b82f6;"></div>
                </div>
                <span>Obsidian Dark</span>
              </button>

              <button type="button" class="theme-card-btn" id="btn-theme-light" onclick="setTheme('light')">
                <div style="height:36px;border-radius:6px;background:#f8fafc;border:1px solid #cbd5e1;display:flex;align-items:center;justify-content:center;">
                  <div style="width:8px;height:8px;border-radius:50%;background:#0f172a;"></div>
                </div>
                <span>Clean Light</span>
              </button>

              <button type="button" class="theme-card-btn" id="btn-theme-midnight" onclick="setTheme('midnight')">
                <div style="height:36px;border-radius:6px;background:#0b1120;border:1px solid #6366f1;display:flex;align-items:center;justify-content:center;">
                  <div style="width:8px;height:8px;border-radius:50%;background:#6366f1;"></div>
                </div>
                <span>Midnight Neon</span>
              </button>
            </div>

            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Fundo Animado</span><span class="toggle-sub">Partículas suaves no plano de fundo</span></div>
              <label class="switch"><input type="checkbox" id="set-canvas" checked onchange="toggleBg(this)"/><span class="slider"></span></label>
            </div>
            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Efeitos Sonoros</span><span class="toggle-sub">Sons de clique e entrada em chamadas</span></div>
              <label class="switch"><input type="checkbox" id="set-sound" checked onchange="onToggle(this,'Sons')/><span class="slider"></span></label>
            </div>
          </div>

          <div class="set-card">
            <span class="set-title">Preferências de Transmissão</span>
            <p style="font-size:12.5px;color:var(--text-s);margin-bottom:14px;">Ajustes de reprodução, áudio e vídeo.</p>
            
            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Aviso de Janela Pausada</span><span class="toggle-sub">Exibir aviso discreto quando a janela compartilhada for minimizada</span></div>
              <label class="switch"><input type="checkbox" id="set-pause-notify" checked onchange="onToggle(this,'Aviso de pausa')"/><span class="slider"></span></label>
            </div>

            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Otimização de Hardware</span><span class="toggle-sub">Aceleração de GPU para fluidez de 60fps</span></div>
              <label class="switch"><input type="checkbox" id="set-gpu" checked onchange="onToggle(this,'Aceleração GPU')"/><span class="slider"></span></label>
            </div>

            <button class="btn-s" onclick="replaySplash()" style="margin-top:14px;width:100%;justify-content:center;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M1 4v6h6"></path><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
              Rever Abertura
            </button>
          </div>
        </div>`;

if (html.includes(oldSettingsContent)) {
  html = html.replace(oldSettingsContent, newSettingsContent);
  console.log('Replaced settings view with modern theme switcher and transmission preferences');
}

// 11. CSS PARA O SELETOR DE TEMAS
const themeCardBtnCss = `
.theme-card-btn {
  background: var(--bg-elev);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  transition: all .2s;
  font-family: inherit;
}
.theme-card-btn:hover {
  border-color: var(--blue);
  transform: translateY(-2px);
}
.theme-card-btn.active {
  border-color: var(--blue);
  box-shadow: 0 0 12px rgba(37,99,235,.3);
}
.theme-card-btn span {
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
}
`;

html = html.replace('/* ── TEMAS DO SISTEMA', themeCardBtnCss + '\n/* ── TEMAS DO SISTEMA');

// 12. ADICIONAR FUNÇÃO setTheme EM JAVASCRIPT
const themeJs = `
function setTheme(theme) {
  document.body.classList.remove('theme-light', 'theme-midnight');
  document.querySelectorAll('.theme-card-btn').forEach(b => b.classList.remove('active'));
  
  if (theme === 'light') {
    document.body.classList.add('theme-light');
    const btn = document.getElementById('btn-theme-light');
    if(btn) btn.classList.add('active');
  } else if (theme === 'midnight') {
    document.body.classList.add('theme-midnight');
    const btn = document.getElementById('btn-theme-midnight');
    if(btn) btn.classList.add('active');
  } else {
    const btn = document.getElementById('btn-theme-dark');
    if(btn) btn.classList.add('active');
  }
  localStorage.setItem('zyro-theme', theme);
  toast('Tema atualizado!', 'ok');
}

// Carrega tema salvo ao iniciar
(function initTheme(){
  const saved = localStorage.getItem('zyro-theme');
  if (saved) {
    if(saved === 'light') document.body.classList.add('theme-light');
    else if(saved === 'midnight') document.body.classList.add('theme-midnight');
  }
})();
`;

html = html.replace('/* ═══════════ MISC', themeJs + '\n/* ═══════════ MISC');

// 13. ADICIONAR CONTROLES DE VOLUME E ZOOM NO VIEWER E NO HOST
const volumeZoomJs = `
let currentZoom = 1;
function zoomVideo(targetId, delta) {
  const vid = document.getElementById(targetId);
  if (!vid) return;
  if (delta === 0) {
    currentZoom = 1;
  } else {
    currentZoom = Math.max(1, Math.min(2.5, currentZoom + delta));
  }
  vid.style.transform = \`scale(\${currentZoom})\`;
  vid.style.transformOrigin = 'center center';
  vid.style.transition = 'transform .2s ease';
  toast(\`Zoom: \${Math.round(currentZoom * 100)}%\`, 'inf');
}

function setVolume(targetId, val) {
  const vid = document.getElementById(targetId);
  if (!vid) return;
  vid.volume = parseFloat(val);
  vid.muted = (vid.volume === 0);
}
`;

html = html.replace('/* ═══════════ MISC', volumeZoomJs + '\n/* ═══════════ MISC');

// 14. INSERIR BARRA DE VOLUME E ZOOM NA TRANSMISSÃO DO VIEWER E HOST
const viewerControlsHtml = `
      <div class="player-toolbar">
        <div class="pt-group">
          <div class="vol-wrap">
            <button class="ctrl" onclick="toggleMute('remote-vid')" title="Mutar/Desmutar" style="width:28px;height:28px;padding:0;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
            </button>
            <input type="range" class="vol-slider" min="0" max="1" step="0.05" value="1" oninput="setVolume('remote-vid', this.value)"/>
          </div>
        </div>
        <div class="pt-group">
          <button class="ctrl" onclick="zoomVideo('remote-vid', -0.25)" title="Diminuir Zoom" style="width:28px;height:28px;padding:0;font-weight:800;">-</button>
          <button class="ctrl" onclick="zoomVideo('remote-vid', 0)" title="Redefinir Zoom" style="width:28px;height:28px;padding:0;font-size:11px;">100%</button>
          <button class="ctrl" onclick="zoomVideo('remote-vid', 0.25)" title="Aumentar Zoom" style="width:28px;height:28px;padding:0;font-weight:800;">+</button>
          <button class="ctrl" onclick="toggleFS('viewer-vbox')" title="Tela Cheia" style="width:28px;height:28px;padding:0;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
          </button>
        </div>
      </div>
`;

// Inserir no viewer video box antes do fechamento
html = html.replace('<!-- VIEWER LIVE HUD -->', viewerControlsHtml + '\n<!-- VIEWER LIVE HUD -->');

// 15. ATUALIZAR FUNÇÃO toggleMute EM JS
const muteFn = `
function toggleMute(vidId) {
  const vid = document.getElementById(vidId);
  if (!vid) return;
  vid.muted = !vid.muted;
  toast(vid.muted ? 'Áudio mutado' : 'Áudio ativado', 'inf');
}
`;
html = html.replace('/* ═══════════ MISC', muteFn + '\n/* ═══════════ MISC');

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Successfully polished index.html! New size:', html.length);
