const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');

const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes('getDisplayMedia') || l.includes('setQuality') || l.includes('mkOffer') || l.includes('handleOffer') || l.includes('RTCPeerConnection')) {
    console.log(`Line ${i+1}: ${l.trim()}`);
  }
});
