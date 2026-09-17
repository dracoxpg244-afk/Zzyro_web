const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// ── 1. Nomes Aleatórios por Padrão (PlayerXXXX e #XXXX) ──────────────────────────
const oldNickInit = `var myName = localStorage.getItem('ss_name') || 'Host';
var myTag = localStorage.getItem('ss_tag') || '#8321';
var myAv = localStorage.getItem('ss_avatar') || null;`;

const newNickInit = `var savedNick = localStorage.getItem('ss_name');
if (!savedNick || savedNick === 'Host' || savedNick === 'Dono' || savedNick.startsWith('Host')) {
  savedNick = 'Player' + Math.floor(1000 + Math.random() * 9000);
  localStorage.setItem('ss_name', savedNick);
}
var myName = savedNick;

var savedTag = localStorage.getItem('ss_tag');
if (!savedTag || savedTag === '#8321') {
  savedTag = '#' + Math.floor(1000 + Math.random() * 9000);
  localStorage.setItem('ss_tag', savedTag);
}
var myTag = savedTag;
var myAv = localStorage.getItem('ss_avatar') || null;
var myIsMuted = false;
var myIsDeafened = false;
var currentRoomParticipants = [];
var roomAllowVoice = true;
var isSharingScreenNow = false;`;

if (html.includes(oldNickInit)) {
  html = html.replace(oldNickInit, newNickInit);
  console.log('[+] Updated user name initialization to PlayerXXXX and #XXXX');
}

// ── 2. Melhoria Completa no Sistema de Áudio / Efeitos Sonoros ───────────────────
const oldAudioSection = `/* ═══════════ SOM ═══════════ */
let actx=null,sndOn=true;
function playTone(f,t='sine',d=.1,g=.04){
  if(!sndOn)return;
  try{
    if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();
    if(actx.state==='suspended')actx.resume();
    const o=actx.createOscillator(),gn=actx.createGain();
    o.type=t;o.frequency.setValueAtTime(f,actx.currentTime);
    gn.gain.setValueAtTime(g,actx.currentTime);
    gn.gain.exponentialRampToValueAtTime(.0001,actx.currentTime+d);
    o.connect(gn);gn.connect(actx.destination);o.start();o.stop(actx.currentTime+d);
  }catch(e){}
}
function chime(){playTone(520,'sine',.08,.03);setTimeout(()=>playTone(780,'sine',.12,.04),55);}`;

const newAudioSection = `/* ═══════════ SOM E EFEITOS SONOROS (Audíveis & Transparentes) ═══════════ */
let actx = null, sndOn = true;

function ensureAudioCtx() {
  if (!actx) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) actx = new AudioContextClass();
    } catch(e) {}
  }
  if (actx && actx.state === 'suspended') {
    actx.resume().catch(() => {});
  }
}

['click', 'keydown', 'touchstart', 'mousedown'].forEach(ev => {
  window.addEventListener(ev, ensureAudioCtx, { passive: true });
});

function playTone(freq, type = 'sine', duration = 0.12, gainVal = 0.22) {
  if (!sndOn) return;
  ensureAudioCtx();
  try {
    if (!actx) return;
    const osc = actx.createOscillator();
    const gainNode = actx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, actx.currentTime);
    const safeGain = Math.min(Math.max(gainVal, 0.05), 0.35);
    gainNode.gain.setValueAtTime(safeGain, actx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + duration);
  } catch(e) {}
}

function soundClick() {
  playTone(850, 'sine', 0.06, 0.16);
}

function soundJoin() {
  playTone(480, 'triangle', 0.12, 0.24);
  setTimeout(() => playTone(720, 'sine', 0.18, 0.28), 65);
}

function soundLeave() {
  playTone(720, 'sine', 0.12, 0.22);
  setTimeout(() => playTone(380, 'triangle', 0.16, 0.22), 65);
}

function soundMute() {
  playTone(320, 'sine', 0.09, 0.22);
}

function soundUnmute() {
  playTone(560, 'sine', 0.09, 0.22);
}

function soundMessage() {
  playTone(660, 'triangle', 0.08, 0.24);
  setTimeout(() => playTone(880, 'sine', 0.12, 0.22), 50);
}

function chime() { soundJoin(); }`;

if (html.includes(oldAudioSection)) {
  html = html.replace(oldAudioSection, newAudioSection);
  console.log('[+] Replaced audio system with robust, audible sound effects');
}

// ── 3. Atualizar toggleSound para tocar o chime imediatamente de confirmação ──────
const oldToggleSound = `function toggleSound(){
  sndOn=!sndOn;
  const pill=document.getElementById('sound-pill'),lbl=document.getElementById('sound-label');
  if(sndOn){pill.classList.remove('off');pill.classList.add('on');lbl.textContent='Som';}
  else{pill.classList.remove('on');pill.classList.add('off');lbl.textContent='Mudo';}
  toast(sndOn?'Efeitos sonoros ativados':'Efeitos sonoros desativados','inf');
}`;

const newToggleSound = `function toggleSound(){
  ensureAudioCtx();
  sndOn = !sndOn;
  const pill = document.getElementById('sound-pill'), lbl = document.getElementById('sound-label');
  if(sndOn){
    pill.classList.remove('off'); pill.classList.add('on'); lbl.textContent = 'Som';
    soundJoin();
    toast('🔊 Efeitos sonoros ativados!', 'ok');
  } else {
    pill.classList.remove('on'); pill.classList.add('off'); lbl.textContent = 'Mudo';
    toast('🔇 Efeitos sonoros desativados', 'inf');
  }
  const st = document.getElementById('set-sound'); if(st) st.checked = sndOn;
}`;

if (html.includes(oldToggleSound)) {
  html = html.replace(oldToggleSound, newToggleSound);
  console.log('[+] Updated toggleSound with immediate audio feedback');
}

// ── 4. Atualizar stats handling em ws.onmessage ──────────────────────────────────
const oldWsStats = `    case 'stats':if(m.stats){
      const s1=document.getElementById('stat-streams'),s2=document.getElementById('stat-users'),s3=document.getElementById('stat-uptime'),s4=document.getElementById('sb-online');
      if(s1)s1.textContent=m.stats.totalStreams;if(s2)s2.textContent=m.stats.onlineUsers;
      if(s4)s4.textContent=m.stats.onlineUsers+' online';if(s3&&m.stats.uptimeFormatted)s3.textContent=m.stats.uptimeFormatted;
    }break;`;

const newWsStats = `    case 'stats':if(m.stats){
      const s1=document.getElementById('stat-streams'),s2=document.getElementById('stat-users'),s3=document.getElementById('stat-uptime'),s4=document.getElementById('sb-online');
      const sTotal=document.getElementById('stat-total-rooms');
      if(s1) s1.textContent = m.stats.totalStreams || 0;
      if(s2) s2.textContent = m.stats.onlineUsers || 0;
      if(sTotal) sTotal.textContent = m.stats.totalRooms || 0;
      if(s4) s4.textContent = (m.stats.onlineUsers || 0) + ' online';
      if(s3 && m.stats.uptimeFormatted) s3.textContent = m.stats.uptimeFormatted;
    }break;
    case 'room-participants':
      handleRoomParticipants(m);
      break;`;

if (html.includes(oldWsStats)) {
  html = html.replace(oldWsStats, newWsStats);
  console.log('[+] Updated ws.onmessage with real stats & room-participants');
}

// ── 5. Atualizar chat vazio da comunidade (100% real, sem fake) ──────────────────
const oldCommChatCase = `    case 'community-chat-history':{const box=document.getElementById('comm-chat');if(box){box.textContent='';for(const msg of(m.messages||[]))await appendMsg(box,msg);}break;}`;
const newCommChatCase = `    case 'community-chat-history':{
      const box=document.getElementById('comm-chat');
      if(box){
        box.textContent='';
        const msgs = m.messages || [];
        if(msgs.length === 0){
          box.innerHTML = '<div style="text-align:center;padding:28px 12px;color:var(--text-m);font-size:12px;">Nenhuma mensagem ainda.<br><span style="color:var(--text-s);font-weight:600;">Envie uma mensagem criptografada abaixo!</span></div>';
        } else {
          for(const msg of msgs) await appendMsg(box,msg);
        }
      }
      break;
    }`;

if (html.includes(oldCommChatCase)) {
  html = html.replace(oldCommChatCase, newCommChatCase);
  console.log('[+] Updated community chat history with clean real empty state');
}

// ── 6. Inserir opções de GIFs Animados na tela de Perfil ─────────────────────────
const oldProfileVisual = `<div class="set-card">
            <span class="set-title">Identidade Visual</span>
            <div style="display:flex;align-items:center;gap:16px;">
              <div class="av" style="width:60px;height:60px;font-size:22px;" id="big-av">H</div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <input type="file" id="av-input" class="hidden" accept="image/*" onchange="uploadAv(this)"/>
                <button class="btn-s" onclick="document.getElementById('av-input').click()" style="padding:6px 14px;font-size:12px;">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  Enviar Foto
                </button>
                <span style="font-size:11px;color:var(--text-m);">PNG, JPG ou WEBP (Max 5MB)</span>
              </div>
            </div>`;

const newProfileVisual = `<div class="set-card">
            <span class="set-title">Identidade Visual &amp; Avatares</span>
            <div style="display:flex;align-items:center;gap:16px;">
              <div class="av" style="width:64px;height:64px;font-size:24px;border:2px solid var(--border);" id="big-av">H</div>
              <div style="display:flex;flex-direction:column;gap:6px;">
                <input type="file" id="av-input" class="hidden" accept="image/*" onchange="uploadAv(this)"/>
                <button class="btn-s" onclick="document.getElementById('av-input').click()" style="padding:7px 14px;font-size:12px;">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                  Enviar Imagem ou GIF
                </button>
                <span style="font-size:11px;color:var(--text-m);">PNG, JPG, WEBP ou GIF Animado (Max 8MB)</span>
              </div>
            </div>
            <div style="margin-top:14px;">
              <span style="font-size:12px;font-weight:700;color:var(--text-s);">Escolha um Avatar Animado (GIF):</span>
              <div class="gif-avatars-shelf">
                <div class="gif-av-item" onclick="pickPresetGif(0)" title="Cyber Cat (Animado)"><img src="assets/img1.png" alt="Cat" onerror="this.src='assets/logo.png'"/></div>
                <div class="gif-av-item" onclick="pickPresetGif(1)" title="Retro Game (Animado)"><img src="assets/img2.png" alt="Retro" onerror="this.src='assets/logo.png'"/></div>
                <div class="gif-av-item" onclick="pickPresetGif(2)" title="Zyro Core"><img src="assets/logo.png" alt="Zyro" onerror="this.src='assets/logo.png'"/></div>
                <div class="gif-av-item" onclick="pickPresetGif(3)" title="Showcase Glow"><img src="assets/img_showcase.png" alt="Glow" onerror="this.src='assets/logo.png'"/></div>
              </div>
            </div>`;

if (html.includes(oldProfileVisual)) {
  html = html.replace(oldProfileVisual, newProfileVisual);
  console.log('[+] Inserted Animated GIF Avatar options in profile');
}

// ── 7. Atualizar formulário do Host com "Modo Apenas Ouvintes" e "Iniciar Call de Voz"
const oldHostSetupEnd = `              <div class="anti-black-tip">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span><b>Dica Anti-Tela Preta:</b> Para capturar o <b>Discord</b>, jogos ou navegadores sem tela preta, selecione a aba <b>"Tela Inteira" (Monitor)</b> na janela de compartilhamento do navegador.</span>
              </div>
              <button class="btn-p" id="start-btn" onclick="startStream()" style="width:100%;justify-content:center;padding:12px;margin-top:4px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Iniciar Transmissão
              </button>`;

const newHostSetupEnd = `              <div class="toggle-row">
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

if (html.includes(oldHostSetupEnd)) {
  html = html.replace(oldHostSetupEnd, newHostSetupEnd);
  console.log('[+] Added Apenas Ouvintes toggle & separate Entrar na Call button');
}

// ── 8. Inserir Discord Voice Stage & Bar dentro de view-broadcast e view-viewer ───
const hostVboxSearch = `<video id="local-vid" autoplay playsinline muted></video>`;
const hostVboxReplace = `<video id="local-vid" autoplay playsinline muted style="display:none;"></video>
              
              <!-- STAGE DE VOZ DISCORD (QUANDO NÃO TRANSMITINDO TELA) -->
              <div class="discord-voice-stage" id="host-voice-stage" style="display:none;">
                <div class="dvs-header">
                  <div class="dvs-header-left">
                    <div class="dvs-live-dot"></div>
                    <span class="dvs-title" id="host-dvs-title">Call de Voz Ao Vivo</span>
                    <span class="dvs-voice-badge" id="host-voice-badge">🎙️ Voz Liberada</span>
                  </div>
                  <div class="dvs-count" id="host-dvs-count">1 conectado</div>
                </div>
                <div class="discord-grid" id="host-discord-grid"></div>
              </div>`;

if (html.includes(hostVboxSearch) && !html.includes('id="host-voice-stage"')) {
  html = html.replace(hostVboxSearch, hostVboxReplace);
  console.log('[+] Inserted host-voice-stage into host-vbox');
}

// Inserir Discord Strip e Bar após host-vbox
const hostVcolEnd = `</div>
          </div>

          <div class="sf-panel">`;

const hostVcolWithDiscordBar = `</div>
            <!-- Strip de participantes (exibido quando compartilhando tela) -->
            <div class="discord-voice-strip" id="host-voice-strip" style="display:none;"></div>

            <!-- BARRA DE CONTROLES DISCORD -->
            <div class="discord-bar" id="host-discord-bar" style="display:none;">
              <div class="db-left">
                <div class="db-my-avatar" id="host-db-av"></div>
                <div class="db-meta">
                  <span class="db-my-name" id="host-db-name">Player</span>
                  <span class="db-my-status" id="host-db-status">● Voz Conectada</span>
                </div>
              </div>
              <div class="db-center">
                <button class="db-btn active" id="host-mic-toggle-btn" onclick="toggleMyVoiceMic()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  <span id="host-mic-text">Mutar</span>
                </button>
                <button class="db-btn" id="host-screen-toggle-btn" onclick="toggleScreenShare()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  <span id="host-screen-text">Transmitir Tela</span>
                </button>
                <button class="db-btn" id="host-mute-all-btn" onclick="toggleHostVoiceRule()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                  <span id="host-rule-text">Silenciar Todos</span>
                </button>
              </div>
              <div class="db-right">
                <button class="db-btn danger" onclick="stopStream()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
                  <span>Sair da Call</span>
                </button>
              </div>
            </div>
          </div>
          <div class="sf-panel">`;

if (html.includes(hostVcolEnd) && !html.includes('id="host-discord-bar"')) {
  html = html.replace(hostVcolEnd, hostVcolWithDiscordBar);
  console.log('[+] Inserted Discord Voice Bar into view-broadcast');
}

// Em view-viewer:
const viewerVboxSearch = `<video id="remote-vid" autoplay playsinline></video>`;
const viewerVboxReplace = `<video id="remote-vid" autoplay playsinline style="display:none;"></video>
              
              <!-- STAGE DE VOZ DISCORD PARA VIEWER (QUANDO HOST NÃO ESTÁ TRANSMITINDO TELA) -->
              <div class="discord-voice-stage" id="viewer-voice-stage" style="display:none;">
                <div class="dvs-header">
                  <div class="dvs-header-left">
                    <div class="dvs-live-dot"></div>
                    <span class="dvs-title" id="viewer-dvs-title">Call de Voz Conectada</span>
                    <span class="dvs-voice-badge" id="viewer-voice-badge">🎙️ Voz Liberada</span>
                  </div>
                  <div class="dvs-count" id="viewer-dvs-count">1 conectado</div>
                </div>
                <div class="discord-grid" id="viewer-discord-grid"></div>
              </div>`;

if (html.includes(viewerVboxSearch) && !html.includes('id="viewer-voice-stage"')) {
  html = html.replace(viewerVboxSearch, viewerVboxReplace);
  console.log('[+] Inserted viewer-voice-stage into viewer-vbox');
}

const viewerVcolEnd = `</div>
          </div>
          <div class="sf-panel">
            <div class="side-card" style="height:460px;">`;

const viewerVcolWithDiscordBar = `</div>
            <!-- Strip de participantes do viewer -->
            <div class="discord-voice-strip" id="viewer-voice-strip" style="display:none;"></div>

            <!-- BARRA DE CONTROLES DISCORD VIEWER -->
            <div class="discord-bar" id="viewer-discord-bar">
              <div class="db-left">
                <div class="db-my-avatar" id="viewer-db-av"></div>
                <div class="db-meta">
                  <span class="db-my-name" id="viewer-db-name">Player</span>
                  <span class="db-my-status" id="viewer-db-status">● Voz Conectada</span>
                </div>
              </div>
              <div class="db-center">
                <button class="db-btn active" id="viewer-mic-toggle-btn" onclick="toggleMyVoiceMic()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                  <span id="viewer-mic-text">Mutar</span>
                </button>
                <button class="db-btn" id="viewer-deaf-btn" onclick="toggleMyDeafen()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>
                  <span id="viewer-deaf-text">Áudio</span>
                </button>
                <button class="db-btn" id="viewer-screen-btn" onclick="toggleScreenShare()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  <span id="viewer-screen-text">Compartilhar Tela</span>
                </button>
              </div>
              <div class="db-right">
                <button class="db-btn danger" onclick="leaveRoom()">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path><line x1="23" y1="1" x2="1" y2="23"></line></svg>
                  <span>Sair da Call</span>
                </button>
              </div>
            </div>
          </div>
          <div class="sf-panel">
            <div class="side-card" style="height:460px;">`;

if (html.includes(viewerVcolEnd) && !html.includes('id="viewer-discord-bar"')) {
  html = html.replace(viewerVcolEnd, viewerVcolWithDiscordBar);
  console.log('[+] Inserted viewer Discord Voice Bar and Strip');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('[OK] Step 1 of features inserted. Now adding JS handlers.');
