const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

console.log('Starting final polish. Initial size:', html.length);

// 1. GARANTIR QUE NENHUMA IMAGEM USE CAMINHO ABSOLUTO COM BARRA INICIAL (/assets/)
html = html.replace(/src="\/assets\//g, 'src="assets/');
html = html.replace(/href="\/assets\//g, 'href="assets/');
html = html.replace(/url\('\/assets\//g, "url('assets/");
html = html.replace(/url\("\/assets\//g, 'url("assets/');

// 2. ATUALIZAR :root E ADICIONAR OS TEMAS
const newThemesCss = `
/* ── TEMAS DO SISTEMA (Obsidian Dark, Clean Light, Midnight Neon) ── */
:root {
  --bg-deep:#06080c;--bg-base:#0b0e14;--bg-card:#10141e;--bg-hover:#171d2b;--bg-elev:#1c2333;
  --border:rgba(255,255,255,.08);--border-s:rgba(255,255,255,.16);
  --border-b:rgba(255,255,255,.24);--border-r:rgba(255,255,255,.18);--border-g:rgba(255,255,255,.18);
  --text:#ffffff;--text-s:#94a3b8;--text-m:#64748b;
  --red:#ef4444;--red-g:rgba(239,68,68,.3);
  --blue:#2563eb;--blue-hover:#1d4ed8;--blue-g:rgba(37,99,235,.3);
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
  background:#f1f5f9 !important;color:#0f172a !important;
}
body.theme-light .sb{background:rgba(255,255,255,0.96) !important;border-right:1px solid rgba(0,0,0,0.08) !important;}
body.theme-light .topbar{background:rgba(255,255,255,0.94) !important;border-bottom:1px solid rgba(0,0,0,0.08) !important;}
body.theme-light .app-footer{background:rgba(255,255,255,0.96) !important;border-top:1px solid rgba(0,0,0,0.08) !important;}
body.theme-light .hero-h1,body.theme-light .brand-name,body.theme-light .stat-val,body.theme-light .section-h2,body.theme-light .sc-title{color:#0f172a !important;}
body.theme-light .search{background:#f1f5f9 !important;border-color:#cbd5e1 !important;}
body.theme-light .search input{color:#0f172a !important;}
body.theme-light .ni:hover{background:#f1f5f9 !important;color:#0f172a !important;}
body.theme-light .ni.active{background:rgba(37,99,235,0.1) !important;color:#2563eb !important;border-color:#2563eb !important;}
body.theme-light .ni.active svg{stroke:#2563eb !important;}
body.theme-light .sound-pill,body.theme-light .ping-pill,body.theme-light .profile-pill{background:#ffffff !important;border-color:#cbd5e1 !important;}
body.theme-light .pname{color:#0f172a !important;}

body.theme-midnight {
  --bg-deep:#070a12;--bg-base:#0b1120;--bg-card:#0f172a;--bg-hover:#1e293b;--bg-elev:#334155;
  --border:rgba(99,102,241,.18);--border-s:rgba(99,102,241,.32);
  --border-b:rgba(99,102,241,.45);
  --text:#f8fafc;--text-s:#94a3b8;--text-m:#64748b;
  --blue:#6366f1;--blue-hover:#4f46e5;--blue-g:rgba(99,102,241,.3);
}
`;

// Substituir declaração de variáveis antiga
html = html.replace(/\/\* ── TEMAS DO SISTEMA[\s\S]*?:root\{[^}]+\}/, newThemesCss);

// 3. FIXAR PERMANENTEMENTE A SIDEBAR E OFFSET DO MAIN
const sbCss = `/* ── SIDEBAR FIXA PERMANENTE (NÃO SOME NUNCA AO ROLAR) ── */
.sb {
  width: var(--sw) !important;
  background: rgba(9, 11, 18, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  height: 100vh !important;
  z-index: 1000 !important;
  padding: 20px 14px;
  gap: 16px;
  overflow-y: auto;
  overflow-x: hidden;
}
.sb::-webkit-scrollbar { width: 4px; }
.sb::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); border-radius: 4px; }
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: var(--sw) !important;
  width: calc(100% - var(--sw)) !important;
  min-height: 100vh;
  position: relative;
}`;

html = html.replace(/\/\* ── SIDEBAR FIXA[\s\S]*?position:relative\}/, sbCss);

// 4. CORREÇÃO COMPLETA DE TODOS OS BOTÕES (Zero botões brancos no fundo branco)
const buttonStyles = `
/* ── ESTILOS DE ALTO CONTRASTE PARA BOTÕES (ZERO BRANCO NO BRANCO) ── */
.copy-btn {
  background: #2563eb !important;
  color: #ffffff !important;
  border: none !important;
  padding: 8px 16px !important;
  border-radius: var(--r-sm) !important;
  font-size: 12.5px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 7px !important;
  transition: all .2s ease !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35) !important;
}
.copy-btn:hover {
  background: #1d4ed8 !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.5) !important;
}
.copy-btn svg {
  stroke: #ffffff !important;
  fill: none !important;
}

.chat-send {
  background: #2563eb !important;
  color: #ffffff !important;
  border: none !important;
  width: 34px !important;
  height: 34px !important;
  border-radius: 8px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all .2s ease !important;
}
.chat-send:hover {
  background: #1d4ed8 !important;
  transform: scale(1.08) !important;
  box-shadow: 0 0 14px rgba(37, 99, 235, 0.6) !important;
}
.chat-send svg {
  width: 16px !important;
  height: 16px !important;
  stroke: #ffffff !important;
  fill: none !important;
}

.hcb-btn {
  background: #2563eb !important;
  color: #ffffff !important;
  border: none !important;
  padding: 7px 16px !important;
  border-radius: var(--r-full) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  transition: all .2s ease !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
}
.hcb-btn:hover {
  background: #1d4ed8 !important;
  transform: translateY(-1px) !important;
}
.hcb-btn svg {
  stroke: #ffffff !important;
  fill: none !important;
}

.qp {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-s);
  transition: all .2s;
  padding: 8px 10px !important;
  font-size: 11.5px !important;
}
.qp:hover {
  border-color: #3b82f6;
  color: #fff;
}
.qp.active {
  background: #2563eb !important;
  color: #ffffff !important;
  border-color: #3b82f6 !important;
  box-shadow: 0 0 14px rgba(37, 99, 235, 0.45) !important;
}

.btn-hero-primary {
  background: #2563eb !important;
  color: #ffffff !important;
  border: none !important;
  box-shadow: 0 6px 24px rgba(37, 99, 235, 0.35) !important;
}
.btn-hero-primary:hover {
  background: #1d4ed8 !important;
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.5) !important;
}

.theme-card-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  transition: all .2s;
  font-family: inherit;
}
.theme-card-btn:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}
.theme-card-btn.active {
  border-color: #3b82f6;
  box-shadow: 0 0 14px rgba(37, 99, 235, 0.35);
}
.theme-card-btn span {
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
}
`;

html = html.replace(/\/\* ── CORREÇÕES DE BOTÕES[\s\S]*?font-family:inherit;\s*\}/, buttonStyles);

// 5. ATUALIZAR OS BOTÕES DE COPIAR NO HTML (Inserindo SVG e texto visível)
html = html.replace(
  '<div class="room-code-box"><span id="priv-code">NEO-4680</span><button class="copy-btn" onclick="copyPriv()">Copiar</button></div>',
  '<div class="room-code-box"><span id="priv-code">NEO-4680</span><button class="copy-btn" onclick="copyPriv()"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copiar</button></div>'
);

// 6. ATUALIZAR A SEÇÃO DE CONFIGURAÇÕES (#view-settings)
const fullNewSettings = `      <!-- ══ 6. CONFIGURAÇÕES ══ -->
      <section class="view" id="view-settings">
        <div style="padding:28px 0 18px;">
          <h1 style="font-size:22px;font-weight:900;color:var(--text);margin-bottom:4px;">Configurações</h1>
          <p style="font-size:13px;color:var(--text-s);">Personalize o visual, áudio e transmissão do seu Zyro.</p>
        </div>
        <div class="grid-2">
          <div class="set-card">
            <span class="set-title">Tema do Sistema</span>
            <p style="font-size:12.5px;color:var(--text-s);margin-bottom:14px;">Escolha o estilo de cor que mais combina com você:</p>
            
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px;">
              <button type="button" class="theme-card-btn active" id="btn-theme-dark" onclick="setTheme('dark')">
                <div style="width:100%;height:44px;border-radius:8px;background:#06080c;border:2px solid #3b82f6;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.5);">
                  <div style="width:12px;height:12px;border-radius:50%;background:#3b82f6;"></div>
                </div>
                <span>Obsidian Dark</span>
              </button>

              <button type="button" class="theme-card-btn" id="btn-theme-light" onclick="setTheme('light')">
                <div style="width:100%;height:44px;border-radius:8px;background:#f8fafc;border:1px solid #cbd5e1;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                  <div style="width:12px;height:12px;border-radius:50%;background:#0284c7;"></div>
                </div>
                <span style="color:#0f172a;">Clean Light</span>
              </button>

              <button type="button" class="theme-card-btn" id="btn-theme-midnight" onclick="setTheme('midnight')">
                <div style="width:100%;height:44px;border-radius:8px;background:#0b1120;border:1px solid #6366f1;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(99,102,241,0.25);">
                  <div style="width:12px;height:12px;border-radius:50%;background:#a855f7;"></div>
                </div>
                <span>Midnight Neon</span>
              </button>
            </div>

            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Fundo Animado</span><span class="toggle-desc">Partículas suaves no plano de fundo</span></div>
              <label class="tgl"><input type="checkbox" id="set-bg" checked onchange="toggleBg(this)"/><span class="tgl-sl"></span></label>
            </div>
            <div class="toggle-row">
              <div class="toggle-info"><span class="toggle-name">Efeitos Sonoros</span><span class="toggle-desc">Sons de clique e entrada em salas</span></div>
              <label class="tgl"><input type="checkbox" id="set-sound" checked onchange="toggleSoundTgl(this)"/><span class="tgl-sl"></span></label>
            </div>
          </div>

          <div class="set-card">
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
          </div>
        </div>
      </section>`;

const vsStart = html.indexOf('id="view-settings"');
if (vsStart !== -1) {
  const vsSectionStart = html.lastIndexOf('<section class="view"', vsStart);
  const vsSectionEnd = html.indexOf('</section>', vsStart) + 10;
  html = html.substring(0, vsSectionStart) + fullNewSettings + html.substring(vsSectionEnd);
  console.log('Replaced entire view-settings section successfully');
}

// 7. REMOVER MENÇÕES RESTANTES DE CRIPTOGRAFIA DTLS-SRTP OU RENDER CLOUD VISÍVEIS
html = html.replace(/Criptografia DTLS-SRTP P2P/g, 'Transmissão P2P HD');
html = html.replace(/Pronto para o Render Cloud/g, 'Servidor Ativo');
html = html.replace(/Criptografia Ativa/g, 'Sessão Segura');
html = html.replace(/CRIPTOGRAFIA\.\.\./g, 'CARREGANDO...');
html = html.replace(/Segurança Total &amp; Alta Performance/g, 'Transmissão em Alta Definição');

// 8. CONTROLE DE JANELA PAUSADA DISCRETA
const pausedToggleJs = `
let notifyPause = true;
function togglePauseNotification(chk) {
  notifyPause = chk.checked;
  if (!notifyPause) showPaused(false);
  toast(notifyPause ? 'Aviso de pausa ativado' : 'Aviso de pausa desativado', 'inf');
}
`;
html = html.replace('/* ═══════════ MISC', pausedToggleJs + '\n/* ═══════════ MISC');

// Ajustar showPaused para respeitar notifyPause
html = html.replace(
  'function showPaused(on){const o=document.getElementById(\'paused-overlay\');if(o){if(on)o.classList.add(\'show\');else o.classList.remove(\'show\');}}',
  'function showPaused(on){const o=document.getElementById(\'paused-overlay\');if(o){if(on && notifyPause)o.classList.add(\'show\');else o.classList.remove(\'show\');}}'
);

// 9. AJUSTAR BREAKPOINT MOBILE PARA 768px (Assim laptops e janelas meio-ecrã nunca quebram o sidebar)
html = html.replace(/@media\(max-width:960px\)/g, '@media(max-width:768px)');

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Final polish saved successfully! New file size:', html.length);
