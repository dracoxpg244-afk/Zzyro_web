const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Atualizar botões de qualidade no HTML
const oldQP = `<div class="q-pills">
                  <button type="button" class="qp" data-q="2k" onclick="setQ(this)" title="Qualidade máxima 2K 60FPS para telas de alta resolução">2K Pro (60fps)</button>
                  <button type="button" class="qp active" data-q="1080" onclick="setQ(this)" title="Ultra HD 1080p 60FPS">1080p Ultra (60fps)</button>
                  <button type="button" class="qp" data-q="720" onclick="setQ(this)">720p Fluido</button>
                  <button type="button" class="qp" data-q="480" onclick="setQ(this)">480p Lite</button>
                </div>`;

const newQP = `<div class="q-pills">
                  <button type="button" class="qp" data-q="4k" onclick="setQ(this)" title="Ultra HD 4K 60FPS (3840x2160) - Máxima nitidez e resolução">4K Ultra (60fps)</button>
                  <button type="button" class="qp" data-q="2k" onclick="setQ(this)" title="Quad HD 2K 60FPS (2560x1440) - Altíssima fidelidade">2K Pro (60fps)</button>
                  <button type="button" class="qp active" data-q="1080" onclick="setQ(this)" title="Full HD Pro 1080p 60FPS (1920x1080) - Cristalino">1080p Ultra (60fps)</button>
                  <button type="button" class="qp" data-q="gamer" onclick="setQ(this)" title="Modo Gamer 60FPS - Prioridade absoluta de fluidez e quadros">Gamer (60fps)</button>
                  <button type="button" class="qp" data-q="720" onclick="setQ(this)" title="Econômico 720p 60FPS - Para conexões mais lentas">720p HD</button>
                </div>`;

if (html.includes(oldQP)) {
  html = html.replace(oldQP, newQP);
  console.log('Replaced q-pills HTML with 4K and Gamer options');
} else {
  console.warn('oldQP not matched directly');
}

// 2. Atualizar setQ
const oldSetQPattern = /function setQ\(btn\)\{[\s\S]*?toast\('Qualidade alterada para '\+btn\.textContent\+'!','ok'\);\s*\}/;

const newSetQ = `function setQ(btn){
  document.querySelectorAll('.qp').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const q = btn.dataset.q;
  if (q === '4k') qCfg = { w: 3840, h: 2160, fps: 60, mode: 'resolution', bitrate: 18000000 };
  else if (q === '2k') qCfg = { w: 2560, h: 1440, fps: 60, mode: 'resolution', bitrate: 14000000 };
  else if (q === '1080') qCfg = { w: 1920, h: 1080, fps: 60, mode: 'resolution', bitrate: 10000000 };
  else if (q === 'gamer') qCfg = { w: 1920, h: 1080, fps: 60, mode: 'framerate', bitrate: 9000000 };
  else if (q === '720') qCfg = { w: 1280, h: 720, fps: 60, mode: 'framerate', bitrate: 5000000 };
  else qCfg = { w: 854, h: 480, fps: 30, mode: 'framerate', bitrate: 2500000 };

  // Atualiza indicadores de stats na tela
  const hostBitrateTag = document.getElementById('host-bitrate-tag');
  if (hostBitrateTag) {
    hostBitrateTag.textContent = (qCfg.bitrate / 1000000).toFixed(1) + ' Mbps';
  }

  // Se a live já estiver ativa, ajusta constraints e bitrate dinamicamente sem reconectar
  if (localStream) {
    const vt = localStream.getVideoTracks()[0];
    if (vt && vt.applyConstraints) {
      vt.applyConstraints({
        width: { ideal: qCfg.w, max: qCfg.w },
        height: { ideal: qCfg.h, max: qCfg.h },
        frameRate: { ideal: qCfg.fps, max: qCfg.fps }
      }).catch(() => {});
      if ('contentHint' in vt) {
        vt.contentHint = (qCfg.mode === 'framerate') ? 'motion' : 'detail';
      }
    }
    for (const pc of Object.values(pcs)) {
      applyOptimalSenderParams(pc);
    }
  }
  toast('Qualidade alterada para ' + btn.textContent + '!', 'ok');
}`;

if (oldSetQPattern.test(html)) {
  html = html.replace(oldSetQPattern, newSetQ);
  console.log('Replaced setQ with advanced 4K/2K/1080p/Gamer parameters');
} else {
  console.warn('oldSetQPattern did not match');
}

// 3. Atualizar applyOptimalSenderParams
const oldSenderPattern = /async function applyOptimalSenderParams\(pc\)\{[\s\S]*?console\.warn\('Erro ao configurar sender:',\s*e\);\s*\}\s*\}/;

const newSender = `async function applyOptimalSenderParams(pc) {
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
}`;

if (oldSenderPattern.test(html)) {
  html = html.replace(oldSenderPattern, newSender);
  console.log('Replaced applyOptimalSenderParams');
} else {
  console.warn('oldSenderPattern did not match');
}

// 4. Corrigir getDisplayMedia para não limitar 2k/4k na captura e fallback
html = html.replace(/max:\s*1920,\s*height:\s*\{\s*ideal:\s*qCfg\.h,\s*max:\s*1080\s*\}/g, 'max: qCfg.w, height: { ideal: qCfg.h, max: qCfg.h }');

// 5. Ajustar jitterBufferTarget no viewer para 10ms (latência ultrabaixa)
html = html.replace(/receiver\.jitterBufferTarget\s*=\s*0;/g, 'receiver.jitterBufferTarget = 0.01; // 10ms buffer para playout fluido sem atraso');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated public/index.html with quality optimizations!');
