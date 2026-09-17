const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Atualizar initVAD para sincronizar com updateStreamSpeakerIndicator e WebSocket
const oldInitVAD = `function initVAD(stream){
  try{const ac=new(window.AudioContext||window.webkitAudioContext)(),src=ac.createMediaStreamSource(stream),an=ac.createAnalyser();an.fftSize=256;src.connect(an);const buf=new Uint8Array(an.frequencyBinCount);let st=null;
  setInterval(()=>{an.getByteFrequencyData(buf);let s=0;for(let i=0;i<buf.length;i++)s+=buf[i];const av=s/buf.length;const el=document.getElementById('hdr-av');
  if(av>18){if(el)el.classList.add('speaking');clearTimeout(st);st=setTimeout(()=>{if(el)el.classList.remove('speaking');},400);}},150);}catch(e){}
}`;

const newInitVAD = `function initVAD(stream){
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ac = new AudioCtx();
    const src = ac.createMediaStreamSource(stream);
    const an = ac.createAnalyser();
    an.fftSize = 256;
    src.connect(an);
    const buf = new Uint8Array(an.frequencyBinCount);
    let st = null;
    let isSpeakingState = false;

    setInterval(() => {
      const isMuted = (role === 'host' ? hostMuted : !vMicOn);
      if (isMuted) {
        if (isSpeakingState) {
          isSpeakingState = false;
          updateStreamSpeakerIndicator(false, true, myName, myAv);
          wsSend({ type: 'voice-status', isSpeaking: false, isMuted: true, avatar: myAv, name: myName });
        }
        return;
      }
      an.getByteFrequencyData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) sum += buf[i];
      const avg = sum / buf.length;

      const hdrAv = document.getElementById('hdr-av');

      if (avg > 16) {
        if (hdrAv) hdrAv.classList.add('speaking');
        if (!isSpeakingState) {
          isSpeakingState = true;
          updateStreamSpeakerIndicator(true, false, myName, myAv);
          wsSend({ type: 'voice-status', isSpeaking: true, isMuted: false, avatar: myAv, name: myName });
        }
        clearTimeout(st);
        st = setTimeout(() => {
          if (hdrAv) hdrAv.classList.remove('speaking');
          isSpeakingState = false;
          updateStreamSpeakerIndicator(false, false, myName, myAv);
          wsSend({ type: 'voice-status', isSpeaking: false, isMuted: false, avatar: myAv, name: myName });
        }, 320);
      }
    }, 100);
  } catch(e) {}
}`;

if (html.includes(oldInitVAD)) {
  html = html.replace(oldInitVAD, newInitVAD);
  console.log('[+] Updated initVAD with real-time green glowing speaker indicator');
}

// Chamar updateStreamSpeakerIndicator ao iniciar transmissão
if (html.includes("toast('🎉 Transmissão iniciada! Código: ' + customCode, 'ok');")) {
  html = html.replace(
    "toast('🎉 Transmissão iniciada! Código: ' + customCode, 'ok');",
    "updateStreamSpeakerIndicator(false, hostMuted, myName, myAv); toast('🎉 Transmissão iniciada! Código: ' + customCode, 'ok');"
  );
  console.log('[+] Hooked speaker indicator to startStream');
}

// Chamar updateStreamSpeakerIndicator ao entrar como viewer
if (html.includes("function onJoined(m){")) {
  html = html.replace(
    "function onJoined(m){",
    "function onJoined(m){ updateStreamSpeakerIndicator(false, false, m.hostName || 'Host', null);"
  );
  console.log('[+] Hooked speaker indicator to onJoined');
}

// Chamar updateStreamSpeakerIndicator ao mutar/desmutar
if (html.includes("function toggleHostMic(){")) {
  html = html.replace(
    "if(hostMuted){btn.classList.remove('on-mic');btn.classList.add('muted');toast('Microfone silenciado','inf');}",
    "if(hostMuted){btn.classList.remove('on-mic');btn.classList.add('muted');updateStreamSpeakerIndicator(false,true,myName,myAv);wsSend({type:'voice-status',isSpeaking:false,isMuted:true,avatar:myAv,name:myName});toast('Microfone silenciado','inf');}"
  );
  html = html.replace(
    "else{btn.classList.add('on-mic');btn.classList.remove('muted');toast('Microfone ativado','ok');}",
    "else{btn.classList.add('on-mic');btn.classList.remove('muted');updateStreamSpeakerIndicator(false,false,myName,myAv);wsSend({type:'voice-status',isSpeaking:false,isMuted:false,avatar:myAv,name:myName});toast('Microfone ativado','ok');}"
  );
  console.log('[+] Hooked toggleHostMic to speaker indicator and WebSocket voice-status');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('[OK] Applied VAD and speaker indicator sync!');
