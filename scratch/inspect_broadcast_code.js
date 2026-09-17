const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');

// Find startBroadcast and surrounding code
const sbIdx = html.indexOf('async function startBroadcast');
console.log('--- startBroadcast ---');
console.log(html.substring(sbIdx, sbIdx + 2500));

// Find viewer WebRTC handling (handleOffer, handleAnswer, etc.)
const hoIdx = html.indexOf('async function handleOffer');
if (hoIdx !== -1) {
  console.log('--- handleOffer ---');
  console.log(html.substring(hoIdx, hoIdx + 2000));
}

// Find quality configs: qCfg, qual, etc.
const qIdx = html.indexOf('qCfg');
if (qIdx !== -1) {
  console.log('--- qCfg context ---');
  console.log(html.substring(qIdx - 100, qIdx + 300));
}
