const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// ── 1. Mudar a bolinha de efeito da logo no carregamento ───────────────────────
// Substitui a bolinha circular (border-radius: 50%) por um feixe linear de laser horizontal
const oldShockwaveCSS = `.splash-shockwave {
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
}`;

const newLaserBladeCSS = `/* Feixe Laser Anamórfico de Impacto da Logo (Zero círculos/bolinhas) */
.splash-shockwave {
  position: absolute;
  top: 45%;
  left: 50%;
  width: 4px;
  height: 3px;
  border-radius: 0 !important;
  border: none !important;
  background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.8) 25%, #ffffff 50%, rgba(59, 130, 246, 0.8) 75%, transparent 100%);
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.9), 0 0 32px #ffffff;
  transform: translate(-50%, -50%) scaleX(0);
  z-index: 4;
  opacity: 0;
  pointer-events: none;
}
.splash-shockwave.pulse {
  animation: laserBladeExpand 1.1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
}
@keyframes laserBladeExpand {
  0% { transform: translate(-50%, -50%) scaleX(0); opacity: 1; height: 4px; }
  35% { transform: translate(-50%, -50%) scaleX(25); opacity: 1; height: 3px; }
  100% { transform: translate(-50%, -50%) scaleX(140); opacity: 0; height: 1px; }
}`;

if (html.includes(oldShockwaveCSS)) {
  html = html.replace(oldShockwaveCSS, newLaserBladeCSS);
  console.log('[+] Replaced round shockwave ball with sleek horizontal laser beam');
}

// ── 2. Corrigir CSS de posicionamento de .host-code-banner (Elimina o bug visual) ──
const oldHcbCSS = `.host-code-banner {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--r-md);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}`;

const newHcbCSS = `.host-code-banner {
  position: absolute !important;
  top: 14px !important;
  right: 14px !important;
  left: auto !important;
  bottom: auto !important;
  background: rgba(10, 14, 26, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  border-radius: var(--r-full) !important;
  padding: 6px 14px !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  z-index: 25 !important;
  margin: 0 !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5) !important;
}`;

if (html.includes(oldHcbCSS)) {
  html = html.replace(oldHcbCSS, newHcbCSS);
  console.log('[+] Fixed host-code-banner absolute positioning bug');
}

// ── 3. Adicionar estilos para o Overlay de Avatar ("quando falar fica verde em volta") ──
const speakerOverlayCSS = `
/* ── OVERLAY DE QUEM ESTÁ FALANDO NA TRANSMISSÃO ── */
.stream-speaker-overlay {
  position: absolute;
  bottom: 18px;
  left: 18px;
  z-index: 25;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(9, 13, 24, 0.85);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--r-full);
  padding: 6px 14px 6px 6px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  transition: all 0.25s ease;
  pointer-events: auto;
}
.ssh-avatar-wrap {
  position: relative;
  width: 40px;
  height: 40px;
}
.ssh-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--blue);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 15px;
  color: #fff;
  border: 2.5px solid rgba(255, 255, 255, 0.25);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
/* QUANDO A PESSOA FALAR FICA VERDE EM VOLTA */
.ssh-avatar-wrap.speaking .ssh-avatar {
  border-color: #23a55a !important;
  box-shadow: 0 0 0 3.5px #23a55a, 0 0 18px rgba(35, 165, 90, 0.85) !important;
  animation: speakingGlowGreen 0.8s infinite alternate !important;
}
@keyframes speakingGlowGreen {
  0% { box-shadow: 0 0 0 3px #23a55a, 0 0 10px rgba(35, 165, 90, 0.5); }
  100% { box-shadow: 0 0 0 5px #23a55a, 0 0 22px rgba(35, 165, 90, 0.95); }
}
.ssh-avatar-wrap.muted .ssh-avatar {
  border-color: #ef4444 !important;
}
.ssh-mute-icon {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 1.5px solid #000;
}
.ssh-meta {
  display: flex;
  flex-direction: column;
}
.ssh-name {
  font-size: 12px;
  font-weight: 800;
  color: #ffffff;
}
.ssh-tag {
  font-size: 10px;
  font-weight: 700;
  color: #23a55a;
}
.ssh-avatar-wrap.muted + .ssh-meta .ssh-tag {
  color: #ef4444;
}
`;

if (!html.includes('STREAM-SPEAKER-OVERLAY')) {
  html = html.replace('</style>', speakerOverlayCSS + '\n</style>');
  console.log('[+] Inserted speakerOverlayCSS');
}

// ── 4. Remover botões extras de call do formulário e deixar apenas "Iniciar Transmissão" ──
const oldButtonsPattern = `<div class="toggle-row">
                <div class="toggle-info">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#f59e0b" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                  <span class="toggle-name">Modo Apenas Ouvintes</span>
                  <span class="toggle-desc">Silenciar microfone de todos os participantes (você pode liberar a qualquer momento)</span>
                </div>
                <label class="tgl"><input type="checkbox" id="h-listen-only" onchange="onToggle(this,'Apenas Ouvintes')"/><span class="tgl-sl"></span></label>
              </div>
              <div class="anti-black-tip">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span><b>Dica:</b> Você pode iniciar apenas a <b>Call de Voz</b> para conversar (estilo Discord) e, se quiser, transmitir a tela depois!</span>
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px;">
                <button type="button" class="btn-p" id="start-voice-btn" onclick="startVoiceCallOnly()" style="justify-content:center;padding:12px;background:#23a55a;border-color:#23a55a;box-shadow:0 4px 14px rgba(35,165,90,0.3);">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  Entrar na Call
                </button>
                <button type="button" class="btn-p" id="start-btn" onclick="startStream()" style="justify-content:center;padding:12px;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Com Tela HD
                </button>
              </div>`;

const cleanSingleButton = `<div class="anti-black-tip">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span><b>Dica Anti-Tela Preta:</b> Para capturar o <b>Discord</b>, jogos ou navegadores sem tela preta, selecione a aba <b>"Tela Inteira" (Monitor)</b> na janela de compartilhamento.</span>
              </div>
              <button class="btn-p" id="start-btn" onclick="startStream()" style="width:100%;justify-content:center;padding:14px;font-size:14px;font-weight:800;margin-top:8px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Iniciar Transmissão
              </button>`;

if (html.includes(oldButtonsPattern)) {
  html = html.replace(oldButtonsPattern, cleanSingleButton);
  console.log('[+] Cleaned up broadcast setup form: single Iniciar Transmissão button');
}

// ── 5. Ajustar o player para preencher a tela inteira com o vídeo e o avatar overlay ──
// Remover o stage de voz feio encaixado no meio da tela preta
html = html.replace(/<div class="discord-voice-stage" id="host-voice-stage" style="display:none;">[\s\S]*?<\/div>\s*<\/div>/, '');
html = html.replace(/<div class="discord-voice-stage" id="viewer-voice-stage" style="display:none;">[\s\S]*?<\/div>\s*<\/div>/, '');

// Inserir o overlay de avatar ("quando falar fica verde em volta") dentro de #host-vbox e #viewer-vbox
const hostOverlayHUD = `
              <!-- OVERLAY DE QUEM ESTÁ FALANDO (VERDE EM VOLTA AO FALAR) -->
              <div class="stream-speaker-overlay" id="host-speaker-hud" style="display:none;">
                <div class="ssh-avatar-wrap" id="host-avatar-wrap">
                  <div class="ssh-avatar" id="host-speaker-av">P</div>
                  <div class="ssh-mute-icon" id="host-speaker-mute" style="display:none;">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>
                  </div>
                </div>
                <div class="ssh-meta">
                  <span class="ssh-name" id="host-speaker-name">Player</span>
                  <span class="ssh-tag" id="host-speaker-status">● Ao Vivo</span>
                </div>
              </div>`;

if (!html.includes('id="host-speaker-hud"')) {
  html = html.replace('<div class="player-overlay" id="host-overlay"', hostOverlayHUD + '\n              <div class="player-overlay" id="host-overlay"');
  console.log('[+] Inserted host-speaker-hud into host player');
}

const viewerOverlayHUD = `
              <!-- OVERLAY DE QUEM ESTÁ FALANDO PARA O VIEWER -->
              <div class="stream-speaker-overlay" id="viewer-speaker-hud" style="display:none;">
                <div class="ssh-avatar-wrap" id="viewer-avatar-wrap">
                  <div class="ssh-avatar" id="viewer-speaker-av">H</div>
                  <div class="ssh-mute-icon" id="viewer-speaker-mute" style="display:none;">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>
                  </div>
                </div>
                <div class="ssh-meta">
                  <span class="ssh-name" id="viewer-speaker-name">Host</span>
                  <span class="ssh-tag" id="viewer-speaker-status">● Assistindo</span>
                </div>
              </div>`;

if (!html.includes('id="viewer-speaker-hud"')) {
  html = html.replace('<div class="player-overlay" id="viewer-ctrls-bar"', viewerOverlayHUD + '\n              <div class="player-overlay" id="viewer-ctrls-bar"');
  console.log('[+] Inserted viewer-speaker-hud into viewer player');
}

// Remover barras duplicadas ou soltas
html = html.replace(/<!-- BARRA DE CONTROLES DISCORD -->[\s\S]*?<\/div>\s*<\/div>\s*<div class="sf-panel">/, '</div>\n          <div class="sf-panel">');
html = html.replace(/<!-- BARRA DE CONTROLES DISCORD VIEWER -->[\s\S]*?<\/div>\s*<\/div>\s*<div class="sf-panel">/, '</div>\n          <div class="sf-panel">');

// ── 6. Atualizar a lógica do VAD para deixar o avatar verde em volta quando falar ──
const updateVADSpeakingLogic = `
// Atualiza o avatar da transmissão para ficar verde em volta quando falar
function updateStreamSpeakerIndicator(isSpeaking, isMuted, name, avatar) {
  const isHost = role === 'host';
  const hudId = isHost ? 'host-speaker-hud' : 'viewer-speaker-hud';
  const wrapId = isHost ? 'host-avatar-wrap' : 'viewer-avatar-wrap';
  const avId = isHost ? 'host-speaker-av' : 'viewer-speaker-av';
  const nameId = isHost ? 'host-speaker-name' : 'viewer-speaker-name';
  const muteId = isHost ? 'host-speaker-mute' : 'viewer-speaker-mute';
  const statusId = isHost ? 'host-speaker-status' : 'viewer-speaker-status';

  const hud = document.getElementById(hudId);
  if (hud) hud.style.display = 'flex';

  const wrap = document.getElementById(wrapId);
  if (wrap) {
    if (isSpeaking) wrap.classList.add('speaking');
    else wrap.classList.remove('speaking');

    if (isMuted) wrap.classList.add('muted');
    else wrap.classList.remove('muted');
  }

  const av = document.getElementById(avId);
  if (av) {
    if (avatar) {
      av.style.backgroundImage = 'url(' + avatar + ')';
      av.textContent = '';
    } else {
      av.style.backgroundImage = 'none';
      av.textContent = (name || 'P').charAt(0).toUpperCase();
    }
  }

  const nEl = document.getElementById(nameId);
  if (nEl && name) nEl.textContent = name;

  const mEl = document.getElementById(muteId);
  if (mEl) mEl.style.display = isMuted ? 'flex' : 'none';

  const stEl = document.getElementById(statusId);
  if (stEl) {
    if (isSpeaking) stEl.textContent = '🟢 Falando';
    else if (isMuted) stEl.textContent = '🔇 Mutado';
    else stEl.textContent = isHost ? '● Transmitindo' : '● Assistindo';
  }
}
`;

if (!html.includes('updateStreamSpeakerIndicator')) {
  html = html.replace('function handleRoomParticipants', updateVADSpeakingLogic + '\nfunction handleRoomParticipants');
  console.log('[+] Added updateStreamSpeakerIndicator');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('[OK] Cleaned up interface and applied green speaker overlay!');
