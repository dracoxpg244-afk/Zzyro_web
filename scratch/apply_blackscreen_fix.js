const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

console.log('Original length:', html.length);

// 1. Add Favicon if not present
if (!html.includes('rel="icon"')) {
  html = html.replace('<meta name="viewport"', '<link rel="icon" type="image/png" href="assets/icon_z.png">\n  <meta name="viewport"');
} else {
  html = html.replace(/<link rel="icon"[^>]*>/, '<link rel="icon" type="image/png" href="assets/icon_z.png">');
}

// 2. Update brand badge SVG to use assets/icon_z.png
const oldBrandBadge = `<div class="brand-badge-z">
        <svg viewBox="0 0 28 28" width="20" height="20" fill="none">
          <path d="M5 7h18l-12 14h12" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 7h14" stroke="#3b82f6" stroke-width="3.2" stroke-linecap="round"/>
        </svg>
      </div>`;

const newBrandBadge = `<div class="brand-badge-z">
        <img src="assets/icon_z.png" alt="Zyro" class="brand-icon-img"/>
      </div>`;

if (html.includes(oldBrandBadge)) {
  html = html.replace(oldBrandBadge, newBrandBadge);
  console.log('Replaced old brand badge with icon_z.png');
} else {
  console.log('Could not find exact oldBrandBadge string, searching pattern...');
  html = html.replace(/<div class="brand-badge-z">[\s\S]*?<\/div>\s*<div>\s*<div class="brand-name">/m, `<div class="brand-badge-z">\n        <img src="assets/icon_z.png" alt="Zyro" class="brand-icon-img"/>\n      </div>\n      <div>\n        <div class="brand-name">`);
}

// 3. Update brand-badge-z CSS & add anti-black-tip CSS
const oldBrandCss = `/* ── BRAND BADGE Z ELEGANTE ── */
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
}`;

const newBrandCss = `/* ── BRAND BADGE Z ELEGANTE ── */
.brand-badge-z {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 14px rgba(37, 99, 235, 0.4);
  flex-shrink: 0;
  overflow: hidden;
  transition: all .25s ease;
}
.brand-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}
.brand:hover .brand-badge-z {
  transform: scale(1.08) rotate(-2deg);
  box-shadow: 0 0 22px rgba(59, 130, 246, 0.7);
}

/* ── BANNER DICA ANTI-TELA PRETA ── */
.anti-black-tip {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: var(--r-md);
  padding: 10px 13px;
  font-size: 11.5px;
  line-height: 1.45;
  color: #bfdbfe;
  margin-top: 10px;
  margin-bottom: 8px;
}
.anti-black-tip b {
  color: #fff;
}
body.theme-light .anti-black-tip {
  background: rgba(37, 99, 235, 0.08);
  border-color: rgba(37, 99, 235, 0.28);
  color: #1e3a8a;
}
body.theme-light .anti-black-tip b {
  color: #0f172a;
}`;

if (html.includes(oldBrandCss)) {
  html = html.replace(oldBrandCss, newBrandCss);
  console.log('Replaced brand badge CSS');
} else {
  console.warn('Could not match exact oldBrandCss');
}

// 4. Add anti-black-tip banner above start-btn
const oldStartBtn = `<button class="btn-p" id="start-btn" onclick="startStream()" style="width:100%;justify-content:center;padding:12px;margin-top:4px;">`;
const newStartBtn = `<div class="anti-black-tip">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#3b82f6" stroke-width="2" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span><b>Dica Anti-Tela Preta:</b> Para capturar o <b>Discord</b>, jogos ou navegadores sem tela preta, selecione a aba <b>"Tela Inteira" (Monitor)</b> na janela de compartilhamento do navegador.</span>
              </div>
              <button class="btn-p" id="start-btn" onclick="startStream()" style="width:100%;justify-content:center;padding:12px;margin-top:4px;">`;

if (html.includes(oldStartBtn) && !html.includes('Dica Anti-Tela Preta')) {
  html = html.replace(oldStartBtn, newStartBtn);
  console.log('Inserted anti-black-tip banner');
}

// 5. Replace WebRTC Optimization Functions & Monitors
const oldWebRTCBlock = `/* ═══════════ OTIMIZADOR DE TRANSMISSÃO WEBRTC (ZERO LAG & ULTRA HD) ═══════════ */
function optimizeSDP(sdp) {
  if (!sdp) return sdp;
  let lines = sdp.split('\\r\\n');
  if (lines.length <= 1) lines = sdp.split('\\n');

  let mVideoIdx = -1;
  const h264Payloads = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('m=video')) {
      mVideoIdx = i;
    }
    const rtpMatch = lines[i].match(/^a=rtpmap:(\\d+)\\s+H264\\/90000/i);
    if (rtpMatch) {
      h264Payloads.push(rtpMatch[1]);
    }
  }

  // Prioriza H.264 (Aceleração por Hardware GPU NVENC / AMF / QuickSync) no cabeçalho m=video
  if (mVideoIdx !== -1 && h264Payloads.length > 0) {
    const parts = lines[mVideoIdx].split(' ');
    const prefix = parts.slice(0, 3);
    const existing = parts.slice(3);
    const others = existing.filter(p => !h264Payloads.includes(p));
    lines[mVideoIdx] = [...prefix, ...h264Payloads, ...others].join(' ');
  }

  // Otimização de áudio Opus: 10ms packet time (latência mínima de voz), 320kbps estéreo cristalino
  lines = lines.map(line => {
    if (line.startsWith('a=fmtp:') && line.includes('opus')) {
      if (!line.includes('minptime=')) {
        line += ';minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=320000;cbr=1';
      }
    }
    return line;
  });

  // Elevação Máxima de Banda de Vídeo: até 18 Mbps para 4K e 10 Mbps para 1080p
  if (mVideoIdx !== -1) {
    let insertIdx = mVideoIdx + 1;
    while (insertIdx < lines.length && (lines[insertIdx].startsWith('c=') || lines[insertIdx].startsWith('b='))) {
      insertIdx++;
    }
    const bwVal = qCfg.w >= 3840 ? '18000' : (qCfg.w >= 2560 ? '14000' : (qCfg.w >= 1920 ? '10000' : '5000'));
    const tiasVal = (parseInt(bwVal, 10) * 1000000).toString();
    lines.splice(insertIdx, 0, 'b=AS:' + bwVal, 'b=TIAS:' + tiasVal);
  }

  return lines.join('\\r\\n');
}

async function applyOptimalSenderParams(pc) {
  if (!pc) return;
  try {
    for (const sender of pc.getSenders()) {
      if (sender.track && sender.track.kind === 'video') {
        if ('degradationPreference' in sender) {
          sender.degradationPreference = (qCfg.mode === 'framerate') ? 'maintain-framerate' : 'maintain-resolution';
        }
        const params = sender.getParameters();
        if (!params.encodings || params.encodings.length === 0) {
          params.encodings = [{}];
        }
        const targetBitrate = qCfg.bitrate || (qCfg.w >= 3840 ? 18000000 : (qCfg.w >= 2560 ? 14000000 : (qCfg.w >= 1920 ? 10000000 : (qCfg.w >= 1280 ? 5000000 : 2200000))));
        const minBitrate = Math.floor(targetBitrate * 0.45);
        params.encodings[0].maxBitrate = targetBitrate;
        params.encodings[0].minBitrate = minBitrate;
        params.encodings[0].priority = 'high';
        params.encodings[0].networkPriority = 'high';
        await sender.setParameters(params);
      }
    }
  } catch(e) {
    console.warn('Erro ao configurar sender:', e);
  }
}

let driftTimer = null;
function startLowLatencyMonitor(vid) {
  if (driftTimer) clearInterval(driftTimer);
  driftTimer = setInterval(() => {
    if (!vid || vid.paused || !vid.buffered || vid.buffered.length === 0) return;
    try {
      const end = vid.buffered.end(vid.buffered.length - 1);
      const delay = end - vid.currentTime;
      // Se atraso acumulado passar de 250ms, compensa imediatamente sem travar
      if (delay > 0.35) {
        vid.currentTime = end - 0.04;
      } else if (delay > 0.12) {
        vid.playbackRate = 1.05; // acelera 5% quase imperceptível para sincronizar
      } else {
        vid.playbackRate = 1.0;
      }
    } catch(e) {}
  }, 800);
}

function stopLowLatencyMonitor() {
  if (driftTimer) {
    clearInterval(driftTimer);
    driftTimer = null;
  }
}`;

const newWebRTCBlock = `/* ═══════════ OTIMIZADOR DE TRANSMISSÃO WEBRTC (ZERO LAG, ANTI-TELA PRETA & ULTRA HD) ═══════════ */
function optimizeSDP(sdp) {
  if (!sdp) return sdp;
  let lines = sdp.split('\\r\\n');
  if (lines.length <= 1) lines = sdp.split('\\n');

  // Otimização segura de áudio Opus em alta fidelidade estéreo sem quebrar o vídeo
  lines = lines.map(line => {
    if (line.startsWith('a=fmtp:') && line.includes('opus')) {
      if (!line.includes('minptime=')) {
        line += ';minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=320000';
      }
    }
    return line;
  });

  return lines.join('\\r\\n');
}

function requestKeyFrameFor(vid) {
  const pc = pcs[vid];
  if (!pc) return;
  try {
    for (const sender of pc.getSenders()) {
      if (sender.track && sender.track.kind === 'video') {
        if ('generateKeyFrame' in sender) {
          sender.generateKeyFrame().catch(() => {});
        }
      }
    }
  } catch(e) {}
}

async function applyOptimalSenderParams(pc) {
  if (!pc) return;
  try {
    for (const sender of pc.getSenders()) {
      if (sender.track && sender.track.kind === 'video') {
        if ('degradationPreference' in sender) {
          sender.degradationPreference = (qCfg.mode === 'framerate') ? 'maintain-framerate' : 'maintain-resolution';
        }
        const params = sender.getParameters();
        if (params && params.encodings && params.encodings.length > 0) {
          const targetBitrate = qCfg.bitrate || (qCfg.w >= 3840 ? 16000000 : (qCfg.w >= 2560 ? 12000000 : (qCfg.w >= 1920 ? 8000000 : 3500000)));
          params.encodings[0].maxBitrate = targetBitrate;
          params.encodings[0].priority = 'high';
          params.encodings[0].networkPriority = 'high';
          await sender.setParameters(params);
        }
      }
    }
  } catch(e) {
    console.warn('Configuração de sender:', e);
  }
}

function startLowLatencyMonitor(vid) {
  // Sincronização nativa do WebRTC - zero manipulação forçada de currentTime para evitar tela preta
}

function stopLowLatencyMonitor() {}`;

if (html.includes(oldWebRTCBlock)) {
  html = html.replace(oldWebRTCBlock, newWebRTCBlock);
  console.log('Replaced WebRTC optimization block');
} else {
  console.warn('Could not match oldWebRTCBlock directly');
}

// 6. Update WebSocket message handling
const oldWsMsg = `    case 'room-created':roomId=m.roomId;myRole='Dono';onCreated(m.roomId);chime();toast('Sala '+m.roomId+' criada!','ok');break;
    case 'joined':roomId=m.roomId;viewerId=m.viewerId;myRole=m.userRole||'Membro';onJoined(m);chime();toast('Acesso liberado!','ok');break;
    case 'viewer-joined':mkOffer(m.viewerId);toast(m.name+' conectou-se à live','inf');break;
    case 'offer':await handleOffer(m.sdp);break;
    case 'answer':
      if(pcs[m.fromId]){
        await pcs[m.fromId].setRemoteDescription(new RTCSessionDescription(m.sdp));
        await applyOptimalSenderParams(pcs[m.fromId]);
      }
      break;
    case 'candidate':
      if(role==='host'){const pc=pcs[m.fromId];if(pc&&pc.remoteDescription)await pc.addIceCandidate(new RTCIceCandidate(m.candidate)).catch(()=>{});}
      else if(viewerPC&&viewerPC.remoteDescription)await viewerPC.addIceCandidate(new RTCIceCandidate(m.candidate)).catch(()=>{});
      break;`;

const newWsMsg = `    case 'room-created':roomId=m.roomId;myRole='Dono';onCreated(m.roomId);chime();toast('Sala '+m.roomId+' criada!','ok');break;
    case 'joined':roomId=m.roomId;viewerId=m.viewerId;myRole=m.userRole||'Membro';onJoined(m);chime();toast('Acesso liberado!','ok');break;
    case 'viewer-joined':mkOffer(m.viewerId);toast(m.name+' conectou-se à live','inf');break;
    case 'request-keyframe':if(role==='host')requestKeyFrameFor(m.viewerId);break;
    case 'offer':await handleOffer(m.sdp);break;
    case 'answer':
      if(pcs[m.fromId]){
        const pc = pcs[m.fromId];
        await pc.setRemoteDescription(new RTCSessionDescription(m.sdp));
        if(pc._iceQueue && pc._iceQueue.length > 0){
          while(pc._iceQueue.length > 0){
            const cand = pc._iceQueue.shift();
            await pc.addIceCandidate(new RTCIceCandidate(cand)).catch(()=>{});
          }
        }
        await applyOptimalSenderParams(pc);
        requestKeyFrameFor(m.fromId);
      }
      break;
    case 'candidate':
      if(role==='host'){
        const pc = pcs[m.fromId];
        if(pc){
          if(!pc.remoteDescription || !pc.remoteDescription.type){
            if(!pc._iceQueue) pc._iceQueue = [];
            pc._iceQueue.push(m.candidate);
          } else {
            await pc.addIceCandidate(new RTCIceCandidate(m.candidate)).catch(()=>{});
          }
        }
      } else {
        if(!viewerPC || !viewerPC.remoteDescription || !viewerPC.remoteDescription.type){
          viewerIceQueue.push(m.candidate);
        } else {
          await viewerPC.addIceCandidate(new RTCIceCandidate(m.candidate)).catch(()=>{});
        }
      }
      break;`;

if (html.includes(oldWsMsg)) {
  html = html.replace(oldWsMsg, newWsMsg);
  console.log('Replaced WebSocket message handlers');
} else {
  console.warn('Could not match oldWsMsg');
}

// 7. Update startStream() constraints
const oldStartStream = `async function startStream(){
  const btn = document.getElementById('start-btn');
  btn.disabled = true;
  btn.textContent = 'Iniciando captura…';

  let customCode = (document.getElementById('h-room-code') ? document.getElementById('h-room-code').value.trim().toUpperCase() : '');
  if(!customCode) customCode = genHostCode();

  const title = document.getElementById('h-title').value.trim() || ('Live de ' + myName);
  const cat = document.getElementById('h-cat').value;
  const mic = document.getElementById('h-mic').checked;
  const priv = document.getElementById('h-private').checked;
  const pass = priv ? document.getElementById('h-pass').value.trim() : '';

  let ds;
  try {
    try {
      ds = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: qCfg.w, max: qCfg.w },
          height: { ideal: qCfg.h, max: qCfg.h },
          frameRate: { ideal: qCfg.fps, max: qCfg.fps },
          cursor: 'always',
          displaySurface: 'monitor',
          resizeMode: 'none'
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 2
        },
        systemAudio: 'include',
        selfBrowserSurface: 'exclude'
      });
    } catch(audioErr) {
      ds = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: qCfg.w, max: 1920 },
          height: { ideal: qCfg.h, max: 1080 },
          frameRate: { ideal: qCfg.fps, max: 60 },
          cursor: 'always',
          displaySurface: 'monitor'
        }
      });
    }
  } catch(e) {
    console.warn('Erro ao obter tela:', e);
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Iniciar Transmissão';
    if(e.name === 'NotAllowedError') {
      toast('Captura cancelada pelo usuário.', 'inf');
    } else {
      toast('Não foi possível capturar a tela: ' + (e.message || e.name), 'err');
    }
    return;
  }

  localStream = ds;
  const initialVt = localStream.getVideoTracks()[0];
  if(initialVt && 'contentHint' in initialVt) {
    initialVt.contentHint = 'motion'; // Força modo 60fps sem lag
  }`;

const newStartStream = `async function startStream(){
  const btn = document.getElementById('start-btn');
  btn.disabled = true;
  btn.textContent = 'Iniciando captura…';

  let customCode = (document.getElementById('h-room-code') ? document.getElementById('h-room-code').value.trim().toUpperCase() : '');
  if(!customCode) customCode = genHostCode();

  const title = document.getElementById('h-title').value.trim() || ('Live de ' + myName);
  const cat = document.getElementById('h-cat').value;
  const mic = document.getElementById('h-mic').checked;
  const priv = document.getElementById('h-private').checked;
  const pass = priv ? document.getElementById('h-pass').value.trim() : '';

  let ds;
  try {
    try {
      ds = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: qCfg.w },
          height: { ideal: qCfg.h },
          frameRate: { ideal: qCfg.fps, max: 60 },
          cursor: 'always'
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 2
        },
        systemAudio: 'include',
        selfBrowserSurface: 'exclude',
        surfaceSwitching: 'include'
      });
    } catch(audioErr) {
      try {
        ds = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: qCfg.w },
            height: { ideal: qCfg.h },
            frameRate: { ideal: qCfg.fps, max: 60 },
            cursor: 'always'
          },
          audio: true
        });
      } catch(videoOnlyErr) {
        ds = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
      }
    }
  } catch(e) {
    console.warn('Erro ao obter tela:', e);
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Iniciar Transmissão';
    if(e.name === 'NotAllowedError') {
      toast('Captura cancelada pelo usuário.', 'inf');
    } else {
      toast('Não foi possível capturar a tela: ' + (e.message || e.name), 'err');
    }
    return;
  }

  localStream = ds;
  const initialVt = localStream.getVideoTracks()[0];
  if(initialVt && 'contentHint' in initialVt) {
    initialVt.contentHint = 'motion';
  }`;

if (html.includes(oldStartStream)) {
  html = html.replace(oldStartStream, newStartStream);
  console.log('Replaced startStream');
} else {
  console.warn('Could not match oldStartStream');
}

// 8. Update local-vid play in startStream
const oldLocalVidAttach = `  const v = document.getElementById('local-vid');
  v.srcObject = localStream;
  v.style.display = 'block';`;

const newLocalVidAttach = `  const v = document.getElementById('local-vid');
  v.srcObject = localStream;
  v.style.display = 'block';
  v.play().catch(e => console.warn('local-vid play:', e));`;

if (html.includes(oldLocalVidAttach)) {
  html = html.replace(oldLocalVidAttach, newLocalVidAttach);
  console.log('Replaced local-vid play');
}

// 9. Update switchWin() constraints
const oldSwitchWin = `async function switchWin(){
  if(!localStream)return;
  try{
    const ns=await navigator.mediaDevices.getDisplayMedia({
      video:{width:{ideal:qCfg.w,max:1920},height:{ideal:qCfg.h,max:1080},frameRate:{ideal:qCfg.fps,max:60},cursor:'always'},
      audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}
    });
    const nt=ns.getVideoTracks()[0],ot=localStream.getVideoTracks()[0];
    if(nt && 'contentHint' in nt) nt.contentHint = 'motion';
    for(const pc of Object.values(pcs)){
      const s=pc.getSenders().find(s=>s.track&&s.track.kind==='video');
      if(s) {
        await s.replaceTrack(nt);
        await applyOptimalSenderParams(pc);
      }
    }
    if(ot)ot.stop();localStream.removeTrack(ot);localStream.addTrack(nt);
    document.getElementById('local-vid').srcObject=localStream;
    nt.addEventListener('ended',stopStream);
    nt.addEventListener('mute',()=>showPaused(true));
    nt.addEventListener('unmute',()=>showPaused(false));
    showPaused(false);wsSend({type:'switch-window'});toast('Janela trocada em tempo real!','ok');
  }catch(e){}
}`;

const newSwitchWin = `async function switchWin(){
  if(!localStream)return;
  try{
    const ns=await navigator.mediaDevices.getDisplayMedia({
      video:{
        width:{ideal:qCfg.w},
        height:{ideal:qCfg.h},
        frameRate:{ideal:qCfg.fps,max:60},
        cursor:'always'
      },
      audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false,sampleRate:48000,channelCount:2},
      systemAudio:'include',
      selfBrowserSurface:'exclude',
      surfaceSwitching:'include'
    });
    const nt=ns.getVideoTracks()[0],ot=localStream.getVideoTracks()[0];
    if(nt && 'contentHint' in nt) nt.contentHint = 'motion';
    for(const pc of Object.values(pcs)){
      const s=pc.getSenders().find(s=>s.track&&s.track.kind==='video');
      if(s) {
        await s.replaceTrack(nt);
        await applyOptimalSenderParams(pc);
      }
    }
    if(ot)ot.stop();localStream.removeTrack(ot);localStream.addTrack(nt);
    const lv = document.getElementById('local-vid');
    lv.srcObject=localStream;
    lv.play().catch(()=>{});
    nt.addEventListener('ended',stopStream);
    nt.addEventListener('mute',()=>showPaused(true));
    nt.addEventListener('unmute',()=>showPaused(false));
    showPaused(false);
    wsSend({type:'switch-window'});
    toast('Janela trocada em tempo real!','ok');
  }catch(e){}
}`;

if (html.includes(oldSwitchWin)) {
  html = html.replace(oldSwitchWin, newSwitchWin);
  console.log('Replaced switchWin');
}

// 10. Update mkOffer and handleOffer
const oldOffersBlock = `async function mkOffer(vid){
  if(!localStream)return;
  const pc=new RTCPeerConnection(ICE);pcs[vid]=pc;
  localStream.getTracks().forEach(t=>pc.addTrack(t,localStream));

  // Prioriza H.264 com Aceleração de Hardware nos Transceivers WebRTC
  try {
    if ('RTCRtpSender' in window && 'getCapabilities' in RTCRtpSender) {
      const caps = RTCRtpSender.getCapabilities('video');
      if (caps && caps.codecs) {
        const h264Codecs = caps.codecs.filter(c => c.mimeType.toLowerCase() === 'video/h264');
        const others = caps.codecs.filter(c => c.mimeType.toLowerCase() !== 'video/h264');
        const preferredOrder = [...h264Codecs, ...others];
        for (const tc of pc.getTransceivers()) {
          if (tc.sender && tc.sender.track && tc.sender.track.kind === 'video' && tc.setCodecPreferences) {
            tc.setCodecPreferences(preferredOrder);
          }
        }
      }
    }
  } catch(e) {}
  pc.onicecandidate=e=>{if(e.candidate)wsSend({type:'candidate',candidate:e.candidate,targetId:vid});};
  const o=await pc.createOffer();
  const optSdp = optimizeSDP(o.sdp);
  await pc.setLocalDescription({type: o.type, sdp: optSdp});
  wsSend({type:'offer',sdp:pc.localDescription,targetId:vid});
}

/* ═══════════ VIEWER ═══════════ */
function joinRoom(code,pass=''){
  const rid=code.trim().toUpperCase();if(!rid)return;
  const rm=rooms.find(r=>r.id===rid);
  if(rm&&rm.isPrivate&&!pass){pendRoom=rid;document.getElementById('pass-in').value='';document.getElementById('modal-pass').classList.add('active');return;}
  role='viewer';roomId=rid;
  wsSend({type:'viewer-join',roomId:rid,name:myName,password:pass});
  switchView('viewer');
  document.getElementById('viewer-code').textContent=rid;
  const ve=document.getElementById('viewer-empty');
  if(ve){
    ve.style.display='flex';
    ve.innerHTML='<p>Conectando com segurança à sala <b style="color:#60a5fa">'+rid+'</b>...</p><button class="btn-s" onclick="leaveRoom()" style="margin-top:10px;font-size:12px;">Voltar</button>';
  }
}
function submitPass(){const p=document.getElementById('pass-in').value.trim();closeModal('modal-pass');if(pendRoom){joinRoom(pendRoom,p);pendRoom=null;}}
function onJoined(m){document.getElementById('viewer-title').textContent=m.title||'Live de '+(m.hostName||'Host');document.getElementById('viewer-host').textContent=m.hostName||'Host';document.getElementById('viewer-code').textContent=m.roomId;}
async function handleOffer(sdp){
  if(viewerPC)viewerPC.close();
  viewerPC=new RTCPeerConnection(ICE);
  viewerPC.ontrack=e=>{
    const v=document.getElementById('remote-vid');
    v.srcObject=e.streams[0];
    v.style.display='block';
    document.getElementById('viewer-empty').style.display='none';
    document.getElementById('viewer-live').style.display='flex';
    const vsb = document.getElementById('viewer-stats-badge'); if(vsb) vsb.style.display = 'flex';
    
    // Configura receptores para playout imediato (Zero Buffering Delay)
    for (const receiver of viewerPC.getReceivers()) {
      if ('jitterBufferTarget' in receiver) {
        receiver.jitterBufferTarget = 0.01; // 10ms buffer para playout fluido sem atraso // Entrega instantânea de quadros
      }
      if ('playoutDelayHint' in receiver) {
        receiver.playoutDelayHint = 0;
      }
    }
    
    v.play().catch(()=>document.getElementById('unmute-btn').style.display='inline-flex');
    startLowLatencyMonitor(v);
  };
  viewerPC.onicecandidate=e=>{if(e.candidate)wsSend({type:'candidate',candidate:e.candidate});};
  const optOfferSdp = optimizeSDP(sdp.sdp);
  await viewerPC.setRemoteDescription(new RTCSessionDescription({type: sdp.type, sdp: optOfferSdp}));
  const a=await viewerPC.createAnswer();
  const optAnswerSdp = optimizeSDP(a.sdp);
  await viewerPC.setLocalDescription({type: a.type, sdp: optAnswerSdp});
  wsSend({type:'answer',sdp:viewerPC.localDescription});
}`;

const newOffersBlock = `async function mkOffer(vid){
  if(!localStream)return;
  if(pcs[vid]){
    try{ pcs[vid].close(); }catch(e){}
  }
  const pc=new RTCPeerConnection(ICE);
  pc._iceQueue = [];
  pcs[vid]=pc;
  localStream.getTracks().forEach(t=>pc.addTrack(t,localStream));

  pc.onicecandidate=e=>{
    if(e.candidate) wsSend({type:'candidate',candidate:e.candidate,targetId:vid});
  };

  const o=await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: false
  });
  const optSdp = optimizeSDP(o.sdp);
  await pc.setLocalDescription({type: o.type, sdp: optSdp});
  wsSend({type:'offer',sdp:pc.localDescription,targetId:vid});
}

/* ═══════════ VIEWER ═══════════ */
let viewerIceQueue = [];
let streamWatchdog = null;

function joinRoom(code,pass=''){
  const rid=code.trim().toUpperCase();if(!rid)return;
  const rm=rooms.find(r=>r.id===rid);
  if(rm&&rm.isPrivate&&!pass){pendRoom=rid;document.getElementById('pass-in').value='';document.getElementById('modal-pass').classList.add('active');return;}
  role='viewer';roomId=rid;
  wsSend({type:'viewer-join',roomId:rid,name:myName,password:pass});
  switchView('viewer');
  document.getElementById('viewer-code').textContent=rid;
  const ve=document.getElementById('viewer-empty');
  if(ve){
    ve.style.display='flex';
    ve.innerHTML='<p>Conectando com segurança à sala <b style="color:#60a5fa">'+rid+'</b>...</p><button class="btn-s" onclick="leaveRoom()" style="margin-top:10px;font-size:12px;">Voltar</button>';
  }
}
function submitPass(){const p=document.getElementById('pass-in').value.trim();closeModal('modal-pass');if(pendRoom){joinRoom(pendRoom,p);pendRoom=null;}}
function onJoined(m){document.getElementById('viewer-title').textContent=m.title||'Live de '+(m.hostName||'Host');document.getElementById('viewer-host').textContent=m.hostName||'Host';document.getElementById('viewer-code').textContent=m.roomId;}

async function handleOffer(sdp){
  if(viewerPC){
    try{ viewerPC.close(); }catch(e){}
  }
  viewerIceQueue = [];
  viewerPC=new RTCPeerConnection(ICE);
  const remoteStream = new MediaStream();

  viewerPC.ontrack=e=>{
    const v=document.getElementById('remote-vid');
    if(e.streams && e.streams[0]) {
      v.srcObject=e.streams[0];
    } else {
      remoteStream.addTrack(e.track);
      v.srcObject = remoteStream;
    }
    v.style.display='block';
    document.getElementById('viewer-empty').style.display='none';
    document.getElementById('viewer-live').style.display='flex';
    const vsb = document.getElementById('viewer-stats-badge'); if(vsb) vsb.style.display = 'flex';
    
    v.play().catch(()=>document.getElementById('unmute-btn').style.display='inline-flex');
  };

  viewerPC.onconnectionstatechange = () => {
    if(viewerPC.connectionState === 'connected'){
      clearTimeout(streamWatchdog);
    } else if(viewerPC.connectionState === 'failed'){
      wsSend({ type: 'request-keyframe' });
    }
  };

  viewerPC.onicecandidate=e=>{
    if(e.candidate) wsSend({type:'candidate',candidate:e.candidate});
  };

  const optOfferSdp = optimizeSDP(sdp.sdp);
  await viewerPC.setRemoteDescription(new RTCSessionDescription({type: sdp.type, sdp: optOfferSdp}));

  // Descarrega candidatos ICE que chegaram antes da descrição remota
  while(viewerIceQueue.length > 0){
    const cand = viewerIceQueue.shift();
    await viewerPC.addIceCandidate(new RTCIceCandidate(cand)).catch(()=>{});
  }

  const a=await viewerPC.createAnswer();
  const optAnswerSdp = optimizeSDP(a.sdp);
  await viewerPC.setLocalDescription({type: a.type, sdp: optAnswerSdp});
  wsSend({type:'answer',sdp:viewerPC.localDescription});

  // Watchdog de segurança: se após 4s o vídeo não exibir frames, solicita keyframe ao host
  clearTimeout(streamWatchdog);
  streamWatchdog = setTimeout(() => {
    const v = document.getElementById('remote-vid');
    if (role === 'viewer' && (!v.srcObject || v.videoWidth === 0 || v.paused)) {
      console.warn('[Watchdog] Vídeo sem quadros renderizados, solicitando keyframe...');
      wsSend({ type: 'request-keyframe' });
    }
  }, 4000);
}`;

if (html.includes(oldOffersBlock)) {
  html = html.replace(oldOffersBlock, newOffersBlock);
  console.log('Replaced mkOffer and handleOffer');
} else {
  console.warn('Could not match oldOffersBlock');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Updated public/index.html successfully! New length:', html.length);
