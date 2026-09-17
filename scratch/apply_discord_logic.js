const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

const discordLogic = `
/* ══════════════════════════════════════════════════════════════════════════════
   DISCORD CALL LOGIC, PARTICIPANTS REAL-TIME SYNC, VOICE MODES & GIF AVATARS
   ══════════════════════════════════════════════════════════════════════════════ */

// Presets de GIFs animados
const PRESET_GIFS = [
  'assets/img1.png',
  'assets/img2.png',
  'assets/logo.png',
  'assets/img_showcase.png'
];

function pickPresetGif(idx) {
  if (idx >= 0 && idx < PRESET_GIFS.length) {
    myAv = PRESET_GIFS[idx];
    localStorage.setItem('ss_avatar', myAv);
    updateAvatar();
    soundClick();
    toast('Avatar animado selecionado!', 'ok');
    if (role && ws && ws.readyState === WebSocket.OPEN) {
      wsSend({ type: 'voice-status', isSpeaking: false, isMuted: myIsMuted, avatar: myAv });
    }
  }
}

// ── Iniciar Call de Voz Direta (sem precisar transmitir a tela) ───────────────
async function startVoiceCallOnly() {
  const btn = document.getElementById('start-voice-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Entrando...'; }

  let customCode = (document.getElementById('h-room-code') ? document.getElementById('h-room-code').value.trim().toUpperCase() : '');
  if (!customCode) customCode = genHostCode();

  const title = document.getElementById('h-title').value.trim() || ('Call de ' + myName);
  const cat = document.getElementById('h-cat').value;
  const priv = document.getElementById('h-private').checked;
  const pub = document.getElementById('h-public') ? document.getElementById('h-public').checked : false;
  const pass = priv ? document.getElementById('h-pass').value.trim() : '';
  const listenOnly = document.getElementById('h-listen-only') ? document.getElementById('h-listen-only').checked : false;

  role = 'host';
  isSharingScreenNow = false;
  roomAllowVoice = !listenOnly;
  myRole = 'Dono';
  roomId = customCode;

  // Tenta obter microfone para a call
  try {
    const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
    vMicStream = ms;
    myIsMuted = false;
    initVAD(ms);
  } catch (err) {
    console.warn('Microfone não ativado de início:', err);
    myIsMuted = true;
  }

  // Prepara visual
  onCreated(customCode);
  document.getElementById('host-empty').style.display = 'none';
  document.getElementById('local-vid').style.display = 'none';
  document.getElementById('host-live-badge').style.display = 'flex';
  document.getElementById('host-voice-stage').style.display = 'flex';
  document.getElementById('host-discord-bar').style.display = 'flex';
  const hsb = document.getElementById('host-stats-badge'); if (hsb) hsb.style.display = 'flex';

  updateMyDiscordBar();

  if (!ws || ws.readyState !== WebSocket.OPEN) wsConnect();
  const sendReq = () => {
    wsSend({
      type: 'host-create',
      roomId: customCode,
      title,
      category: cat,
      quality: 'Voz HD 60fps',
      name: myName,
      tag: myTag,
      avatar: myAv,
      isPrivate: priv,
      isPublic: pub,
      allowVoice: roomAllowVoice,
      hasScreenShare: false,
      password: pass
    });
  };
  if (ws && ws.readyState === WebSocket.OPEN) sendReq();
  else setTimeout(sendReq, 500);

  soundJoin();
  toast('🎧 Conectado à Call de Voz! Código: ' + customCode, 'ok');
}

// ── Alternar Compartilhamento de Tela Dinamicamente na Call ───────────────────
async function toggleScreenShare() {
  if (isSharingScreenNow) {
    // Parar compartilhamento de tela mantendo a call ativa
    if (localStream) {
      localStream.getVideoTracks().forEach(t => t.stop());
    }
    isSharingScreenNow = false;
    const v = document.getElementById('local-vid');
    if (v) { v.srcObject = null; v.style.display = 'none'; }

    const stage = document.getElementById('host-voice-stage');
    if (stage) stage.style.display = 'flex';
    const strip = document.getElementById('host-voice-strip');
    if (strip) strip.style.display = 'none';

    wsSend({ type: 'set-screen-share', active: false });
    soundLeave();
    toast('Transmissão de tela encerrada. Call de voz continua!', 'inf');
    updateMyDiscordBar();
  } else {
    // Iniciar compartilhamento de tela
    try {
      const ds = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: qCfg.w }, height: { ideal: qCfg.h }, frameRate: { ideal: qCfg.fps, max: 60 } },
        audio: true
      });
      localStream = ds;
      const vt = localStream.getVideoTracks()[0];
      if (vt) {
        vt.addEventListener('ended', () => toggleScreenShare());
      }
      isSharingScreenNow = true;
      const v = document.getElementById('local-vid');
      if (v) {
        v.srcObject = localStream;
        v.style.display = 'block';
        v.play().catch(() => {});
      }

      const stage = document.getElementById('host-voice-stage');
      if (stage) stage.style.display = 'none';
      const strip = document.getElementById('host-voice-strip');
      if (strip) strip.style.display = 'flex';

      wsSend({ type: 'set-screen-share', active: true });

      // Se há viewers, renegocia WebRTC
      if (typeof rooms !== 'undefined') {
        Object.keys(pcs).forEach(vid => mkOffer(vid));
      }

      soundJoin();
      toast('🖥️ Transmitindo tela com sucesso!', 'ok');
      updateMyDiscordBar();
    } catch (e) {
      if (e.name !== 'NotAllowedError') {
        toast('Erro ao capturar tela: ' + e.message, 'err');
      }
    }
  }
}

// ── Mutar / Desmutar Microfone da Call ─────────────────────────────────────────
async function toggleMyVoiceMic() {
  if (!roomAllowVoice && role === 'viewer') {
    toast('🔒 Modo Apenas Ouvintes ativo. O Dono da sala silenciou os microfones.', 'err');
    return;
  }

  // Se o stream de mic ainda não existe, tenta abrir
  if (!vMicStream) {
    try {
      vMicStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      initVAD(vMicStream);
      myIsMuted = false;
      soundUnmute();
      toast('🎙️ Microfone ativado!', 'ok');
    } catch (e) {
      toast('Microfone indisponível: ' + e.message, 'err');
      return;
    }
  } else {
    myIsMuted = !myIsMuted;
    vMicStream.getAudioTracks().forEach(t => t.enabled = !myIsMuted);
    if (myIsMuted) {
      soundMute();
      toast('🔇 Microfone silenciado', 'inf');
    } else {
      soundUnmute();
      toast('🎙️ Microfone ativado!', 'ok');
    }
  }

  updateMyDiscordBar();
  wsSend({
    type: 'voice-status',
    isSpeaking: false,
    isMuted: myIsMuted,
    isDeafened: myIsDeafened,
    avatar: myAv
  });
}

// ── Ensordecer Áudio (Silenciar o som dos outros) ─────────────────────────────
function toggleMyDeafen() {
  myIsDeafened = !myIsDeafened;
  const rv = document.getElementById('remote-vid');
  if (rv) rv.muted = myIsDeafened;

  if (myIsDeafened) {
    soundMute();
    toast('🎧 Áudio silenciado (Ensordecido)', 'inf');
  } else {
    soundUnmute();
    toast('🔊 Áudio restaurado', 'ok');
  }

  updateMyDiscordBar();
  wsSend({
    type: 'voice-status',
    isSpeaking: false,
    isMuted: myIsMuted,
    isDeafened: myIsDeafened,
    avatar: myAv
  });
}

// ── Dono Alterna Modo de Voz da Sala (Liberado <-> Apenas Ouvintes) ───────────
function toggleHostVoiceRule() {
  if (role !== 'host') return;
  roomAllowVoice = !roomAllowVoice;
  wsSend({ type: 'host-toggle-voice', allowVoice: roomAllowVoice });
  soundClick();
  if (!roomAllowVoice) {
    toast('🔒 Modo Apenas Ouvintes ativado! Participantes silenciados.', 'inf');
  } else {
    toast('🔓 Voz liberada para todos os participantes!', 'ok');
  }
}

// ── Atualiza a barra de controles inferior (Discord Bar) ─────────────────────
function updateMyDiscordBar() {
  const isHost = role === 'host';
  const prefix = isHost ? 'host-' : 'viewer-';

  const myAvBox = document.getElementById(prefix + 'db-av');
  if (myAvBox) {
    if (myAv) {
      myAvBox.style.backgroundImage = 'url(' + myAv + ')';
      myAvBox.textContent = '';
    } else {
      myAvBox.style.backgroundImage = 'none';
      myAvBox.textContent = (myName || 'P').charAt(0).toUpperCase();
    }
  }

  const myNameEl = document.getElementById(prefix + 'db-name');
  if (myNameEl) myNameEl.textContent = (myName || 'Player') + ' ' + (myTag || '');

  const micBtn = document.getElementById(prefix + 'mic-toggle-btn');
  const micTxt = document.getElementById(prefix + 'mic-text');
  if (micBtn && micTxt) {
    if (myIsMuted || (!roomAllowVoice && !isHost)) {
      micBtn.classList.remove('active');
      micBtn.classList.add('muted');
      micTxt.textContent = 'Desmutar';
    } else {
      micBtn.classList.remove('muted');
      micBtn.classList.add('active');
      micTxt.textContent = 'Mutar';
    }
  }

  const deafBtn = document.getElementById(prefix + 'deaf-btn');
  const deafTxt = document.getElementById(prefix + 'deaf-text');
  if (deafBtn && deafTxt) {
    if (myIsDeafened) {
      deafBtn.classList.add('muted');
      deafTxt.textContent = 'Ouvir';
    } else {
      deafBtn.classList.remove('muted');
      deafTxt.textContent = 'Áudio';
    }
  }

  const screenBtn = document.getElementById(prefix + 'screen-toggle-btn');
  const screenTxt = document.getElementById(prefix + 'screen-text');
  if (screenBtn && screenTxt) {
    if (isSharingScreenNow) {
      screenBtn.classList.add('screen-active');
      screenTxt.textContent = 'Parar Tela';
    } else {
      screenBtn.classList.remove('screen-active');
      screenTxt.textContent = 'Transmitir Tela';
    }
  }

  const hostRuleBtn = document.getElementById('host-mute-all-btn');
  const hostRuleTxt = document.getElementById('host-rule-text');
  if (hostRuleBtn && hostRuleTxt) {
    if (isHost) {
      hostRuleBtn.style.display = 'inline-flex';
      hostRuleTxt.textContent = roomAllowVoice ? 'Silenciar Todos' : 'Liberar Voz';
      if (!roomAllowVoice) hostRuleBtn.classList.add('muted');
      else hostRuleBtn.classList.remove('muted');
    } else {
      hostRuleBtn.style.display = 'none';
    }
  }
}

// ── Renderização em Tempo Real dos Participantes da Call (Estilo Discord) ────
function handleRoomParticipants(data) {
  if (!data) return;
  roomAllowVoice = data.allowVoice !== false;
  const hasScreen = !!data.hasScreenShare;
  const participants = data.participants || [];
  currentRoomParticipants = participants;

  const isHost = role === 'host';
  const stageId = isHost ? 'host-voice-stage' : 'viewer-voice-stage';
  const gridId = isHost ? 'host-discord-grid' : 'viewer-discord-grid';
  const stripId = isHost ? 'host-voice-strip' : 'viewer-voice-strip';
  const vidId = isHost ? 'local-vid' : 'remote-vid';
  const countId = isHost ? 'host-dvs-count' : 'viewer-dvs-count';
  const badgeId = isHost ? 'host-voice-badge' : 'viewer-voice-badge';

  const countEl = document.getElementById(countId);
  if (countEl) countEl.textContent = participants.length + (participants.length === 1 ? ' conectado' : ' conectados');

  const badgeEl = document.getElementById(badgeId);
  if (badgeEl) {
    if (!roomAllowVoice) {
      badgeEl.className = 'dvs-voice-badge locked';
      badgeEl.textContent = '🔇 Apenas Ouvintes';
    } else {
      badgeEl.className = 'dvs-voice-badge';
      badgeEl.textContent = '🎙️ Voz Liberada';
    }
  }

  // Notifica viewer se a sala for silenciada
  if (!isHost && !roomAllowVoice && !myIsMuted) {
    myIsMuted = true;
    if (vMicStream) vMicStream.getAudioTracks().forEach(t => t.enabled = false);
    toast('🔒 O Dono ativou o Modo Apenas Ouvintes. Microfone silenciado.', 'inf');
  }

  // Alternar entre Vídeo de Tela vs Stage de Voz Discord
  const vidEl = document.getElementById(vidId);
  const stageEl = document.getElementById(stageId);
  const stripEl = document.getElementById(stripId);

  if (hasScreen) {
    // Alguém está compartilhando tela
    if (vidEl) vidEl.style.display = 'block';
    if (stageEl) stageEl.style.display = 'none';
    if (stripEl) {
      stripEl.style.display = 'flex';
      renderDiscordStrip(stripEl, participants);
    }
  } else {
    // Ninguém está compartilhando tela: EXIBE O GRID COMPLETO DISCORD
    if (vidEl) vidEl.style.display = 'none';
    if (stageEl) {
      stageEl.style.display = 'flex';
      const gridEl = document.getElementById(gridId);
      if (gridEl) renderDiscordGrid(gridEl, participants);
    }
    if (stripEl) stripEl.style.display = 'none';
  }

  updateMyDiscordBar();
}

function renderDiscordGrid(gridEl, participants) {
  gridEl.innerHTML = '';
  participants.forEach(p => {
    const card = document.createElement('div');
    card.className = 'd-user-card' + (p.isSpeaking ? ' speaking' : '') + (p.isMuted ? ' muted' : '');

    const avBox = document.createElement('div');
    avBox.className = 'd-avatar-box';

    const av = document.createElement('div');
    av.className = 'd-avatar';
    if (p.avatar) {
      av.style.backgroundImage = 'url(' + p.avatar + ')';
    } else {
      av.textContent = (p.name || 'P').charAt(0).toUpperCase();
    }
    avBox.appendChild(av);

    if (p.isSpeaking) {
      const wave = document.createElement('div');
      wave.className = 'd-speaking-wave';
      wave.innerHTML = '<span></span><span></span><span></span>';
      avBox.appendChild(wave);
    }

    if (p.isMuted) {
      const muteB = document.createElement('div');
      muteB.className = 'd-mute-badge';
      muteB.title = 'Mutado';
      muteB.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>';
      avBox.appendChild(muteB);
    }

    card.appendChild(avBox);

    const meta = document.createElement('div');
    meta.className = 'd-meta';

    const name = document.createElement('span');
    name.className = 'd-name';
    name.textContent = p.name;
    meta.appendChild(name);

    const badges = document.createElement('div');
    badges.className = 'd-badges-row';

    const roleTag = document.createElement('span');
    roleTag.className = 'd-role-tag ' + (p.role === 'Dono' ? 'dono' : 'membro');
    roleTag.textContent = p.role;
    badges.appendChild(roleTag);
    meta.appendChild(badges);

    const status = document.createElement('span');
    status.className = 'd-status-text';
    if (p.isSpeaking) status.textContent = '🟢 Falando...';
    else if (p.isMuted) status.textContent = '🔇 Mutado';
    else if (p.isDeafened) status.textContent = '🎧 Ensordecido';
    else status.textContent = '🎙️ Conectado';
    meta.appendChild(status);

    card.appendChild(meta);
    gridEl.appendChild(card);
  });
}

function renderDiscordStrip(stripEl, participants) {
  stripEl.innerHTML = '';
  participants.forEach(p => {
    const mini = document.createElement('div');
    mini.className = 'dvs-mini-card' + (p.isSpeaking ? ' speaking' : '');

    const av = document.createElement('div');
    av.className = 'dvs-mini-av';
    if (p.avatar) av.style.backgroundImage = 'url(' + p.avatar + ')';
    else av.textContent = (p.name || 'P').charAt(0).toUpperCase();

    const name = document.createElement('span');
    name.className = 'dvs-mini-name';
    name.textContent = p.name + (p.isMuted ? ' 🔇' : '');

    mini.appendChild(av);
    mini.appendChild(name);
    stripEl.appendChild(mini);
  });
}

// ── Detector de Atividade Vocal Atualizado (VAD) ──────────────────────────────
let vadLastSpeaking = false;
function initVAD(stream) {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    const src = ac.createMediaStreamSource(stream);
    const an = ac.createAnalyser();
    an.fftSize = 256;
    src.connect(an);
    const buf = new Uint8Array(an.frequencyBinCount);
    let silenceTimer = null;

    setInterval(() => {
      if (myIsMuted || !vMicStream) {
        if (vadLastSpeaking) {
          vadLastSpeaking = false;
          wsSend({ type: 'voice-status', isSpeaking: false, isMuted: true, isDeafened: myIsDeafened, avatar: myAv });
        }
        return;
      }
      an.getByteFrequencyData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i];
      const avg = sum / buf.length;

      if (avg > 16) {
        clearTimeout(silenceTimer);
        if (!vadLastSpeaking) {
          vadLastSpeaking = true;
          wsSend({ type: 'voice-status', isSpeaking: true, isMuted: false, isDeafened: myIsDeafened, avatar: myAv });
        }
      } else if (vadLastSpeaking) {
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          vadLastSpeaking = false;
          wsSend({ type: 'voice-status', isSpeaking: false, isMuted: myIsMuted, isDeafened: myIsDeafened, avatar: myAv });
        }, 350);
      }
    }, 120);
  } catch (e) {}
}
`;

// Inserir a lógica do Discord antes do fechamento de </script>
if (!html.includes('DISCORD CALL LOGIC, PARTICIPANTS REAL-TIME SYNC')) {
  html = html.replace('</script>', discordLogic + '\n</script>');
  console.log('[+] Injected Discord Call logic into public/index.html');
}

// Atualizar inicialização do perfil e do cabeçalho com o nome gerado
html = html.replace("document.getElementById('hdr-name').textContent=myName+' '+myTag;", "document.getElementById('hdr-name').textContent=(myName||'Player')+' '+(myTag||''); const pn=document.getElementById('p-name'); if(pn) pn.value=myName; const pt=document.getElementById('p-tag'); if(pt) pt.value=myTag; updateAvatar();");

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('[OK] Full Discord System and logic successfully applied!');
