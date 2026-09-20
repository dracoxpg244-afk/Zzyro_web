const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');

// Find all occurrences of getDisplayMedia, RTCPeerConnection, setParameters, etc.
const keywords = [
  'getDisplayMedia',
  'getUserMedia',
  'RTCPeerConnection',
  'maxBitrate',
  'bitrate',
  'scaleResolutionDownBy',
  'contentHint',
  'degradationPreference',
  'frameRate',
  'width',
  'height',
  'play()',
  'jitterBufferTarget',
  'iceServers',
  'RTCRtpSender'
];

keywords.forEach(kw => {
  let idx = 0;
  let count = 0;
  while ((idx = html.indexOf(kw, idx)) !== -1) {
    count++;
    idx += kw.length;
  }
  console.log(`${kw}: ${count} occurrences`);
});

// Also print the snippet where startBroadcast or getDisplayMedia is defined
const gdmIdx = html.indexOf('getDisplayMedia');
if (gdmIdx !== -1) {
  console.log('\n--- getDisplayMedia snippet ---');
  console.log(html.substring(gdmIdx - 100, gdmIdx + 800));
}

// Find RTCPeerConnection creation
const rtcIdx = html.indexOf('new RTCPeerConnection');
if (rtcIdx !== -1) {
  console.log('\n--- RTCPeerConnection snippet ---');
  console.log(html.substring(rtcIdx - 50, rtcIdx + 800));
}
