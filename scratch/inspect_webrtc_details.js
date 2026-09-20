const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

// Find WebRTC configuration & stream handling
const pcMatches = s.match(/(RTCPeerConnection|getDisplayMedia|getUserMedia|createOffer|setRemoteDescription|sdpTransform|b=AS|bitrate|quality|codec)/g);
console.log('RTCPeerConnection keywords count:', pcMatches ? pcMatches.length : 0);

// Let's search where getDisplayMedia is called
let idx = 0;
while ((idx = s.indexOf('getDisplayMedia', idx)) !== -1) {
  console.log('--- getDisplayMedia at', idx, '---');
  console.log(s.substring(Math.max(0, idx - 100), Math.min(s.length, idx + 400)));
  idx += 15;
}
