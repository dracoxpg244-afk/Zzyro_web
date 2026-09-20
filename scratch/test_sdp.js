// Test SDP optimizer
function optimizeSDP(sdp, isVideo = true) {
  if (!sdp) return sdp;
  let lines = sdp.split('\r\n');
  if (lines.length <= 1) lines = sdp.split('\n');

  let mVideoIdx = -1;
  let mAudioIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('m=video')) mVideoIdx = i;
    if (lines[i].startsWith('m=audio')) mAudioIdx = i;
  }

  // 1. Optimize Opus Audio for 10ms low-latency and 128kbps stereo
  lines = lines.map(line => {
    if (line.startsWith('a=fmtp:') && line.includes('opus')) {
      if (!line.includes('minptime=')) {
        line += ';minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=128000;cbr=1';
      }
    }
    return line;
  });

  // 2. Add Bandwidth limit b=AS:8000 and b=TIAS:8000000 under m=video
  if (mVideoIdx !== -1) {
    let nextM = lines.findIndex((l, idx) => idx > mVideoIdx && l.startsWith('m='));
    let insertIdx = mVideoIdx + 1;
    while (insertIdx < lines.length && (lines[insertIdx].startsWith('c=') || lines[insertIdx].startsWith('b='))) {
      insertIdx++;
    }
    lines.splice(insertIdx, 0, 'b=AS:8000', 'b=TIAS:8000000');
  }

  return lines.join('\r\n');
}

console.log('Test sample SDP:');
const sample = `v=0
o=- 12345 2 IN IP4 127.0.0.1
s=-
t=0 0
m=audio 9 UDP/TLS/RTP/SAVPF 111
c=IN IP4 0.0.0.0
a=rtpmap:111 opus/48000/2
a=fmtp:111 minptime=10
m=video 9 UDP/TLS/RTP/SAVPF 96
c=IN IP4 0.0.0.0
a=rtpmap:96 H264/90000`;

console.log(optimizeSDP(sample));
