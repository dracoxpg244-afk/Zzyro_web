function prioritizeH264InSDP(sdp) {
  if (!sdp) return sdp;
  let lines = sdp.split('\r\n');
  if (lines.length <= 1) lines = sdp.split('\n');

  let mVideoIdx = -1;
  const h264Payloads = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('m=video')) {
      mVideoIdx = i;
    }
    const rtpMatch = lines[i].match(/^a=rtpmap:(\d+)\s+H264\/90000/i);
    if (rtpMatch) {
      h264Payloads.push(rtpMatch[1]);
    }
  }

  if (mVideoIdx !== -1 && h264Payloads.length > 0) {
    const parts = lines[mVideoIdx].split(' ');
    // parts[0] is 'm=video', parts[1] is port, parts[2] is proto, parts[3...] are payloads
    const prefix = parts.slice(0, 3);
    const existingPayloads = parts.slice(3);
    const otherPayloads = existingPayloads.filter(p => !h264Payloads.includes(p));
    const reorderedPayloads = [...h264Payloads, ...otherPayloads];
    lines[mVideoIdx] = [...prefix, ...reorderedPayloads].join(' ');
  }

  return lines.join('\r\n');
}

const testSDP = `v=0
m=video 9 UDP/TLS/RTP/SAVPF 100 101 96 97
a=rtpmap:100 VP8/90000
a=rtpmap:101 VP9/90000
a=rtpmap:96 H264/90000
a=rtpmap:97 H264/90000`;

console.log('Prioritized SDP:');
console.log(prioritizeH264InSDP(testSDP));
