const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// 1. UPDATE ICE CONFIG
const oldIce = `const ICE={iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'},{urls:'stun:stun.cloudflare.com:3478'}]};`;
const newIce = `const ICE = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' }
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle',
  rtcpMuxPolicy: 'require'
};

/* ═══════════ OTIMIZADOR DE TRANSMISSÃO WEBRTC (ZERO LAG & ULTRA HD) ═══════════ */
function optimizeSDP(sdp) {
  if (!sdp) return sdp;
  let lines = sdp.split('\\r\\n');
  if (lines.length <= 1) lines = sdp.split('\\n');

  let mVideoIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('m=video')) mVideoIdx = i;
  }

  // Otimização de áudio Opus: 10ms packet time (menor atraso de voz), 128kbps stereo
  lines = lines.map(line => {
    if (line.startsWith('a=fmtp:') && line.includes('opus')) {
      if (!line.includes('minptime=')) {
        line += ';minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=128000;cbr=1';
      }
    }
    return line;
  });

  // Elevação de Banda de Vídeo (8 Mbps para 1080p60 ultra nítido sem pixelização)
  if (mVideoIdx !== -1) {
    let insertIdx = mVideoIdx + 1;
    while (insertIdx < lines.length && (lines[insertIdx].startsWith('c=') || lines[insertIdx].startsWith('b='))) {
      insertIdx++;
    }
    lines.splice(insertIdx, 0, 'b=AS:8000', 'b=TIAS:8000000');
  }

  return lines.join('\\r\\n');
}

async function applyOptimalSenderParams(pc) {
  if (!pc) return;
  try {
    for (const sender of pc.getSenders()) {
      if (sender.track && sender.track.kind === 'video') {
        if ('degradationPreference' in sender) {
          sender.degradationPreference = 'maintain-framerate'; // Nunca congela ou reduz FPS
        }
        const params = sender.getParameters();
        if (!params.encodings || params.encodings.length === 0) {
          params.encodings = [{}];
        }
        const targetBitrate = qCfg.w >= 1920 ? 8000000 : (qCfg.w >= 1280 ? 4500000 : 2000000);
        const minBitrate = qCfg.w >= 1920 ? 3000000 : (qCfg.w >= 1280 ? 1500000 : 800000);
        params.encodings[0].maxBitrate = targetBitrate;
        params.encodings[0].minBitrate = minBitrate;
        params.encodings[0].maxFramerate = qCfg.fps;
        params.encodings[0].networkPriority = 'high';
        params.encodings[0].priority = 'high';
        await sender.setParameters(params);
      } else if (sender.track && sender.track.kind === 'audio') {
        const params = sender.getParameters();
        if (!params.encodings || params.encodings.length === 0) {
          params.encodings = [{}];
        }
        params.encodings[0].maxBitrate = 128000;
        params.encodings[0].networkPriority = 'high';
        params.encodings[0].priority = 'high';
        await sender.setParameters(params);
      }
    }
  } catch(e) {
    console.warn('Sender params:', e);
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

html = html.replace(oldIce, newIce);

// 2. ENHANCE getDisplayMedia CONSTRAINTS IN startStream
const oldGDM = `  let ds;
  try {
    try {
      ds = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: qCfg.w }, height: { ideal: qCfg.h }, frameRate: { ideal: qCfg.fps } },
        audio: true
      });
    } catch(audioErr) {
      // Fallback sem áudio se o browser não aceitar
      ds = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: qCfg.w }, height: { ideal: qCfg.h }, frameRate: { ideal: qCfg.fps } }
      });
    }
  }`;

const newGDM = `  let ds;
  try {
    try {
      ds = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: qCfg.w, max: 1920 },
          height: { ideal: qCfg.h, max: 1080 },
          frameRate: { ideal: qCfg.fps, max: 60 },
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          sampleRate: 48000,
          channelCount: 2
        }
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
  }`;

html = html.replace(oldGDM, newGDM);

// 3. SET contentHint = 'motion' ON LOCAL VIDEO TRACK
const oldLocalStreamSet = `  localStream = ds;

  if(mic){`;

const newLocalStreamSet = `  localStream = ds;
  const initialVt = localStream.getVideoTracks()[0];
  if(initialVt && 'contentHint' in initialVt) {
    initialVt.contentHint = 'motion'; // Força modo 60fps sem lag
  }

  if(mic){`;

html = html.replace(oldLocalStreamSet, newLocalStreamSet);

// 4. UPDATE mkOffer: optimize offer SDP and configure senders
const oldMkOffer = `async function mkOffer(vid){
  if(!localStream)return;
  const pc=new RTCPeerConnection(ICE);pcs[vid]=pc;
  localStream.getTracks().forEach(t=>pc.addTrack(t,localStream));
  pc.onicecandidate=e=>{if(e.candidate)wsSend({type:'candidate',candidate:e.candidate,targetId:vid});};
  const o=await pc.createOffer();await pc.setLocalDescription(o);
  wsSend({type:'offer',sdp:pc.localDescription,targetId:vid});
}`;

const newMkOffer = `async function mkOffer(vid){
  if(!localStream)return;
  const pc=new RTCPeerConnection(ICE);pcs[vid]=pc;
  localStream.getTracks().forEach(t=>pc.addTrack(t,localStream));
  pc.onicecandidate=e=>{if(e.candidate)wsSend({type:'candidate',candidate:e.candidate,targetId:vid});};
  const o=await pc.createOffer();
  const optSdp = optimizeSDP(o.sdp);
  await pc.setLocalDescription({type: o.type, sdp: optSdp});
  wsSend({type:'offer',sdp:pc.localDescription,targetId:vid});
}`;

html = html.replace(oldMkOffer, newMkOffer);

// 5. UPDATE case 'answer' IN HOST: applyOptimalSenderParams
const oldAnswerCase = `case 'answer':if(pcs[m.fromId])await pcs[m.fromId].setRemoteDescription(new RTCSessionDescription(m.sdp));break;`;
const newAnswerCase = `case 'answer':
      if(pcs[m.fromId]){
        await pcs[m.fromId].setRemoteDescription(new RTCSessionDescription(m.sdp));
        await applyOptimalSenderParams(pcs[m.fromId]);
      }
      break;`;

html = html.replace(oldAnswerCase, newAnswerCase);

// 6. UPDATE handleOffer IN VIEWER: zero jitter buffer and low latency monitor
const oldHandleOffer = `async function handleOffer(sdp){
  if(viewerPC)viewerPC.close();viewerPC=new RTCPeerConnection(ICE);
  viewerPC.ontrack=e=>{
    const v=document.getElementById('remote-vid');v.srcObject=e.streams[0];v.style.display='block';
    document.getElementById('viewer-empty').style.display='none';document.getElementById('viewer-live').style.display='flex';
    v.play().catch(()=>document.getElementById('unmute-btn').style.display='inline-flex');
  };
  viewerPC.onicecandidate=e=>{if(e.candidate)wsSend({type:'candidate',candidate:e.candidate});};
  await viewerPC.setRemoteDescription(new RTCSessionDescription(sdp));
  const a=await viewerPC.createAnswer();await viewerPC.setLocalDescription(a);
  wsSend({type:'answer',sdp:viewerPC.localDescription});
}`;

const newHandleOffer = `async function handleOffer(sdp){
  if(viewerPC)viewerPC.close();
  viewerPC=new RTCPeerConnection(ICE);
  viewerPC.ontrack=e=>{
    const v=document.getElementById('remote-vid');
    v.srcObject=e.streams[0];
    v.style.display='block';
    document.getElementById('viewer-empty').style.display='none';
    document.getElementById('viewer-live').style.display='flex';
    
    // Configura receptores para playout imediato (Zero Buffering Delay)
    for (const receiver of viewerPC.getReceivers()) {
      if ('jitterBufferTarget' in receiver) {
        receiver.jitterBufferTarget = 0; // Entrega instantânea de quadros
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

html = html.replace(oldHandleOffer, newHandleOffer);

// 7. UPDATE switchWin TO SET contentHint AND RE-APPLY SENDER PARAMS
const oldSwitchWin = `async function switchWin(){
  if(!localStream)return;
  try{
    const ns=await navigator.mediaDevices.getDisplayMedia({video:{width:{ideal:qCfg.w},height:{ideal:qCfg.h},frameRate:{ideal:qCfg.fps}},audio:true});
    const nt=ns.getVideoTracks()[0],ot=localStream.getVideoTracks()[0];
    for(const pc of Object.values(pcs)){const s=pc.getSenders().find(s=>s.track&&s.track.kind==='video');if(s)await s.replaceTrack(nt);}
    if(ot)ot.stop();localStream.removeTrack(ot);localStream.addTrack(nt);
    document.getElementById('local-vid').srcObject=localStream;
    nt.addEventListener('ended',stopStream);
    nt.addEventListener('mute',()=>showPaused(true));
    nt.addEventListener('unmute',()=>showPaused(false));
    showPaused(false);wsSend({type:'switch-window'});toast('Janela trocada!','ok');
  }catch(e){}
}`;

const newSwitchWin = `async function switchWin(){
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

html = html.replace(oldSwitchWin, newSwitchWin);

// 8. UPDATE setQ TO APPLY DYNAMICALLY ON THE FLY
const oldSetQ = `function setQ(btn){document.querySelectorAll('.qp').forEach(p=>p.classList.remove('active'));btn.classList.add('active');const q=btn.dataset.q;if(q==='1080')qCfg={w:1920,h:1080,fps:60};else if(q==='720')qCfg={w:1280,h:720,fps:60};else qCfg={w:854,h:480,fps:30};toast('Qualidade: '+q+'p','inf');}`;

const newSetQ = `function setQ(btn){
  document.querySelectorAll('.qp').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const q=btn.dataset.q;
  if(q==='1080') qCfg={w:1920,h:1080,fps:60};
  else if(q==='720') qCfg={w:1280,h:720,fps:60};
  else qCfg={w:854,h:480,fps:30};

  // Se a live já estiver ativa, ajusta bitrate e resolução dinamicamente sem reconectar
  if(localStream){
    const vt=localStream.getVideoTracks()[0];
    if(vt && vt.applyConstraints){
      vt.applyConstraints({
        width:{ideal:qCfg.w,max:1920},
        height:{ideal:qCfg.h,max:1080},
        frameRate:{ideal:qCfg.fps,max:60}
      }).catch(()=>{});
    }
    for(const pc of Object.values(pcs)){
      applyOptimalSenderParams(pc);
    }
  }
  toast('Qualidade: ' + q + 'p (' + qCfg.fps + ' FPS) ajustada com sucesso!','ok');
}`;

html = html.replace(oldSetQ, newSetQ);

// 9. UPDATE leaveRoom / stopStream TO CLEAN UP LOW LATENCY MONITOR
html = html.replace(
  `function leaveRoom(){`,
  `function leaveRoom(){\n  stopLowLatencyMonitor();`
);
html = html.replace(
  `async function stopStream(){`,
  `async function stopStream(){\n  stopLowLatencyMonitor();`
);

fs.writeFileSync(targetPath, html, 'utf8');
console.log('WebRTC optimizations applied successfully! File size:', fs.statSync(targetPath).size);
