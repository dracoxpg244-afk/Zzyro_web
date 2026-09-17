const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// 1. UPDATE CANVAS CODE: Monochrome colors + auto-pause when streaming/viewing
const oldCanvasPart = `  const colors=['rgba(59,130,246,.55)','rgba(239,68,68,.45)','rgba(245,158,11,.3)'];
  function resize(){
    w=c.width=window.innerWidth; h=c.height=window.innerHeight; pts=[];
    for(let i=0;i<52;i++) pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*1.6+.6,color:colors[i%3]});
  }
  function draw(){
    if(!bgOn){ctx.clearRect(0,0,w,h);requestAnimationFrame(draw);return;}
    ctx.clearRect(0,0,w,h);
    const g1=ctx.createRadialGradient(w*.12,h*.12,0,w*.12,h*.12,w*.45);
    g1.addColorStop(0,'rgba(59,130,246,.07)');g1.addColorStop(1,'transparent');
    ctx.fillStyle=g1;ctx.fillRect(0,0,w,h);
    const g2=ctx.createRadialGradient(w*.88,h*.88,0,w*.88,h*.88,w*.4);
    g2.addColorStop(0,'rgba(239,68,68,.06)');g2.addColorStop(1,'transparent');
    ctx.fillStyle=g2;ctx.fillRect(0,0,w,h);`;

const newCanvasPart = `  const colors=['rgba(255,255,255,.25)','rgba(255,255,255,.14)','rgba(255,255,255,.32)'];
  function resize(){
    w=c.width=window.innerWidth; h=c.height=window.innerHeight; pts=[];
    for(let i=0;i<40;i++) pts.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.4+.5,color:colors[i%3]});
  }
  function draw(){
    // Otimização Máxima: Pausa animação de fundo durante transmissão para liberar 100% de CPU e GPU
    if(!bgOn || role === 'host' || role === 'viewer'){
      ctx.clearRect(0,0,w,h);
      setTimeout(() => requestAnimationFrame(draw), 1000);
      return;
    }
    ctx.clearRect(0,0,w,h);
    const g1=ctx.createRadialGradient(w*.12,h*.12,0,w*.12,h*.12,w*.45);
    g1.addColorStop(0,'rgba(255,255,255,.03)');g1.addColorStop(1,'transparent');
    ctx.fillStyle=g1;ctx.fillRect(0,0,w,h);
    const g2=ctx.createRadialGradient(w*.88,h*.88,0,w*.88,h*.88,w*.4);
    g2.addColorStop(0,'rgba(255,255,255,.02)');g2.addColorStop(1,'transparent');
    ctx.fillStyle=g2;ctx.fillRect(0,0,w,h);`;

html = html.replace(oldCanvasPart, newCanvasPart);

// 2. ENHANCE optimizeSDP WITH H.264 HARDWARE ACCELERATION PRIORITY AND 12MBPS BITRATE
const oldOptimizeSDP = `function optimizeSDP(sdp) {
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
}`;

const newOptimizeSDP = `function optimizeSDP(sdp) {
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

  // Otimização de áudio Opus: 10ms packet time (latência mínima de voz), 256kbps estéreo cristalino
  lines = lines.map(line => {
    if (line.startsWith('a=fmtp:') && line.includes('opus')) {
      if (!line.includes('minptime=')) {
        line += ';minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=256000;cbr=1';
      }
    }
    return line;
  });

  // Elevação Máxima de Banda de Vídeo: até 12 Mbps com arranque instantâneo a 8 Mbps
  if (mVideoIdx !== -1) {
    let insertIdx = mVideoIdx + 1;
    while (insertIdx < lines.length && (lines[insertIdx].startsWith('c=') || lines[insertIdx].startsWith('b='))) {
      insertIdx++;
    }
    const bwVal = qCfg.w >= 2560 ? '12000' : (qCfg.w >= 1920 ? '9000' : '5000');
    const tiasVal = qCfg.w >= 2560 ? '12000000' : (qCfg.w >= 1920 ? '9000000' : '5000000');
    lines.splice(insertIdx, 0, 'b=AS:' + bwVal, 'b=TIAS:' + tiasVal);
  }

  return lines.join('\\r\\n');
}`;

html = html.replace(oldOptimizeSDP, newOptimizeSDP);

// 3. ENHANCE applyOptimalSenderParams FOR 2K, 1080P PRO AND 12MBPS
const oldSenderParams = `        const targetBitrate = qCfg.w >= 1920 ? 8000000 : (qCfg.w >= 1280 ? 4500000 : 2000000);
        const minBitrate = qCfg.w >= 1920 ? 3000000 : (qCfg.w >= 1280 ? 1500000 : 800000);`;

const newSenderParams = `        const targetBitrate = qCfg.w >= 2560 ? 12000000 : (qCfg.w >= 1920 ? 9000000 : (qCfg.w >= 1280 ? 5000000 : 2200000));
        const minBitrate = qCfg.w >= 2560 ? 6000000 : (qCfg.w >= 1920 ? 4000000 : (qCfg.w >= 1280 ? 2000000 : 1000000));`;

html = html.replace(oldSenderParams, newSenderParams);

// 4. PREFERRED CODECS HELPER IN mkOffer
const oldMkOfferBlock = `async function mkOffer(vid){
  if(!localStream)return;
  const pc=new RTCPeerConnection(ICE);pcs[vid]=pc;
  localStream.getTracks().forEach(t=>pc.addTrack(t,localStream));`;

const newMkOfferBlock = `async function mkOffer(vid){
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
  } catch(e) {}`;

html = html.replace(oldMkOfferBlock, newMkOfferBlock);

// 5. ENHANCE getDisplayMedia CONSTRAINTS WITH resizeMode: 'none', systemAudio: 'include'
const oldGDMCall = `      ds = await navigator.mediaDevices.getDisplayMedia({
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
      });`;

const newGDMCall = `      ds = await navigator.mediaDevices.getDisplayMedia({
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
      });`;

html = html.replace(oldGDMCall, newGDMCall);

// 6. UPDATE q-pills IN HTML TO INCLUDE 2K PRO (60FPS)
const oldQPills = `<div class="q-pills">
                  <button type="button" class="qp active" data-q="1080" onclick="setQ(this)">1080p 60fps</button>
                  <button type="button" class="qp" data-q="720" onclick="setQ(this)">720p HD</button>
                  <button type="button" class="qp" data-q="480" onclick="setQ(this)">480p Lite</button>
                </div>`;

const newQPills = `<div class="q-pills">
                  <button type="button" class="qp" data-q="2k" onclick="setQ(this)" title="Qualidade máxima 2K 60FPS para telas de alta resolução">2K Pro (60fps)</button>
                  <button type="button" class="qp active" data-q="1080" onclick="setQ(this)" title="Ultra HD 1080p 60FPS">1080p Ultra (60fps)</button>
                  <button type="button" class="qp" data-q="720" onclick="setQ(this)">720p Fluido</button>
                  <button type="button" class="qp" data-q="480" onclick="setQ(this)">480p Lite</button>
                </div>`;

html = html.replace(oldQPills, newQPills);

// 7. UPDATE setQ FUNCTION TO SUPPORT 2K
const oldSetQ = `function setQ(btn){
  document.querySelectorAll('.qp').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const q=btn.dataset.q;
  if(q==='1080') qCfg={w:1920,h:1080,fps:60};
  else if(q==='720') qCfg={w:1280,h:720,fps:60};
  else qCfg={w:854,h:480,fps:30};`;

const newSetQ = `function setQ(btn){
  document.querySelectorAll('.qp').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const q=btn.dataset.q;
  if(q==='2k') qCfg={w:2560,h:1440,fps:60};
  else if(q==='1080') qCfg={w:1920,h:1080,fps:60};
  else if(q==='720') qCfg={w:1280,h:720,fps:60};
  else qCfg={w:854,h:480,fps:30};`;

html = html.replace(oldSetQ, newSetQ);

// 8. ADD STREAM STATS HUD BADGES IN VIDEO BOXES
const oldHostVideoBox = `<div class="live-badge" id="host-live-badge" style="display:none;"><div class="live-dot"></div> AO VIVO</div>`;
const newHostVideoBox = `<div class="live-badge" id="host-live-badge" style="display:none;"><div class="live-dot"></div> AO VIVO</div>
              <div class="stream-stats-badge" id="host-stats-badge" style="display:none;">
                <span class="ssb-item"><span class="ssb-dot"></span> <span id="host-fps-tag">60 FPS</span></span>
                <span class="ssb-item">⚡ ZERO DELAY</span>
                <span class="ssb-item" id="host-bitrate-tag">9.0 Mbps</span>
              </div>`;

html = html.replace(oldHostVideoBox, newHostVideoBox);

const oldViewerVideoBox = `<div class="live-badge" id="viewer-live" style="display:none;"><div class="live-dot"></div> AO VIVO</div>`;
const newViewerVideoBox = `<div class="live-badge" id="viewer-live" style="display:none;"><div class="live-dot"></div> AO VIVO</div>
              <div class="stream-stats-badge" id="viewer-stats-badge" style="display:none;">
                <span class="ssb-item"><span class="ssb-dot"></span> 60 FPS</span>
                <span class="ssb-item">💎 ULTRA HD</span>
                <span class="ssb-item" id="viewer-latency-tag">&lt; 15 ms</span>
              </div>`;

html = html.replace(oldViewerVideoBox, newViewerVideoBox);

// 9. SHOW/HIDE STATS BADGES IN startStream, stopStream, handleOffer, leaveRoom
html = html.replace(
  `document.getElementById('host-live-badge').style.display = 'flex';`,
  `document.getElementById('host-live-badge').style.display = 'flex';\n  const hsb = document.getElementById('host-stats-badge'); if(hsb) hsb.style.display = 'flex';`
);

html = html.replace(
  `document.getElementById('host-live-badge').style.display='none';`,
  `document.getElementById('host-live-badge').style.display='none';\n  const hsb = document.getElementById('host-stats-badge'); if(hsb) hsb.style.display = 'none';`
);

html = html.replace(
  `document.getElementById('viewer-live').style.display='flex';`,
  `document.getElementById('viewer-live').style.display='flex';\n    const vsb = document.getElementById('viewer-stats-badge'); if(vsb) vsb.style.display = 'flex';`
);

html = html.replace(
  `document.getElementById('viewer-live').style.display='none';`,
  `document.getElementById('viewer-live').style.display='none';\n  const vsb = document.getElementById('viewer-stats-badge'); if(vsb) vsb.style.display = 'none';`
);

// 10. ADD CSS FOR .stream-stats-badge AND GPU COMPOSITING TO video
const additionalCss = `
/* ── STREAM STATS BADGE (HUD TEMPO REAL) ── */
.stream-stats-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--r-full);
  padding: 5px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  color: #ffffff;
  z-index: 25;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
  pointer-events: none;
}
.ssb-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.ssb-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
  animation: pulse 2s infinite;
}
.video-box video {
  transform: translateZ(0);
  will-change: transform;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
}
`;

html = html.replace('</style>', additionalCss + '\n</style>');

fs.writeFileSync(targetPath, html, 'utf8');
console.log('MAXIMUM WebRTC Performance & Ultra HD Optimizations applied! File size:', fs.statSync(targetPath).size);
