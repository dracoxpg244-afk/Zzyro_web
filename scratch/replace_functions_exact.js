const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Substituir setQ
const setQStart = html.indexOf('function setQ(btn){');
const setQEnd = html.indexOf("toast('Qualidade alterada para '+btn.textContent+'!','ok');\n}", setQStart) + "toast('Qualidade alterada para '+btn.textContent+'!','ok');\n}".length;

console.log('setQ found:', setQStart !== -1, 'length:', setQEnd - setQStart);
if (setQStart !== -1) {
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

  const hostBitrateTag = document.getElementById('host-bitrate-tag');
  if (hostBitrateTag) {
    hostBitrateTag.textContent = (qCfg.bitrate / 1000000).toFixed(1) + ' Mbps';
  }

  // Se a live já estiver ativa, ajusta bitrate e resolução dinamicamente sem reconectar
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
  html = html.substring(0, setQStart) + newSetQ + html.substring(setQEnd);
  console.log('Successfully updated setQ');
}

// 2. Substituir applyOptimalSenderParams
const senderStart = html.indexOf('async function applyOptimalSenderParams(pc)');
const senderEnd = html.indexOf("console.warn('Erro ao configurar sender:', e);\n  }\n}", senderStart) + "console.warn('Erro ao configurar sender:', e);\n  }\n}".length;

console.log('sender found:', senderStart !== -1, 'length:', senderEnd - senderStart);
if (senderStart !== -1) {
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
  html = html.substring(0, senderStart) + newSender + html.substring(senderEnd);
  console.log('Successfully updated applyOptimalSenderParams');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Finished updating exact functions!');
