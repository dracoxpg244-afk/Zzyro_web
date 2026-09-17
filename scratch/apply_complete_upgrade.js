const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

console.log('Original index.html size:', html.length);

// 1. Substituir a imagem base64 gigante pela logo em cache
const b64start = html.indexOf('data:image/png;base64,');
if (b64start !== -1) {
  const b64end = html.indexOf('"', b64start);
  const oldImgTag = html.substring(b64start, b64end);
  html = html.replace(oldImgTag, '/assets/logo.png');
  console.log('Replaced base64 logo with /assets/logo.png');
}

// 2. Corrigir CSS da Sidebar e Layout
const oldSbCss = `.sb{width:var(--sw);background:rgba(9,11,18,.92);backdrop-filter:blur(22px);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;position:sticky;top:0;height:100vh;z-index:100;padding:20px 14px;gap:16px}`;
const newSbCss = `/* ── SIDEBAR FIXA (NÃO SOME AO ROLAR) ── */
.sb{width:var(--sw);background:rgba(9,11,18,.96);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;position:fixed;top:0;left:0;bottom:0;height:100vh;z-index:100;padding:20px 14px;gap:16px;overflow-y:auto;overflow-x:hidden}
.sb::-webkit-scrollbar{width:4px}
.sb::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:4px}
.sb::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.25)}`;

if (html.includes(oldSbCss)) {
  html = html.replace(oldSbCss, newSbCss);
  console.log('Replaced .sb CSS with fixed sticky-free version');
} else {
  console.warn('oldSbCss exact match not found, checking with regex');
  html = html.replace(/\.sb\{width:var\(--sw\)[^}]+\}/, newSbCss);
}

// Corrigir .main para margin-left: var(--sw)
const oldMainCss = `.main{flex:1;display:flex;flex-direction:column;min-width:0}`;
const newMainCss = `.main{flex:1;display:flex;flex-direction:column;min-width:0;margin-left:var(--sw);width:calc(100% - var(--sw));min-height:100vh;position:relative}`;

if (html.includes(oldMainCss)) {
  html = html.replace(oldMainCss, newMainCss);
  console.log('Replaced .main CSS with margin-left offset');
}

// Corrigir Media Query para dispositivos menores (<=960px)
const oldMq = `@media(max-width:960px){
  #app{flex-direction:column}
  .sb{width:100%;height:auto;position:relative;padding:14px 18px}
  .nav{flex-direction:row;overflow-x:auto;padding-bottom:4px}
  .sb-footer{display:none}
  .dash-grid,.studio-grid,.private-layout,.events-layout{grid-template-columns:1fr}
  .hero-h1{font-size:2rem}
  .sec-wrap{padding:40px 0}
}`;

const newMq = `@media(max-width:960px){
  #app{flex-direction:column}
  .sb{width:100%;height:auto;position:relative;padding:14px 18px;overflow-y:visible}
  .main{margin-left:0;width:100%}
  .nav{flex-direction:row;overflow-x:auto;padding-bottom:4px}
  .sb-footer{display:none}
  .dash-grid,.studio-grid,.private-layout,.events-layout{grid-template-columns:1fr}
  .hero-h1{font-size:2rem}
  .sec-wrap{padding:40px 0}
  .footer-mid{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
  .footer-mid{grid-template-columns:1fr}
  .footer-top{flex-direction:column;align-items:flex-start}
}`;

if (html.includes(oldMq)) {
  html = html.replace(oldMq, newMq);
  console.log('Replaced media query for mobile responsiveness');
}

// 3. Adicionar estilos do rodapé e direitos reservados ao CSS
const footerStyles = `
/* ── APP FOOTER (DIREITOS RESERVADOS & STATUS) ── */
.app-footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background: rgba(7, 9, 14, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  padding: 48px 32px 32px;
  color: var(--text-s);
  position: relative;
  z-index: 10;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 36px;
}
.footer-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}
.footer-brand-logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.25));
}
.footer-brand-text h3 {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer-brand-text p {
  font-size: 12px;
  color: var(--text-m);
  margin-top: 2px;
}
.footer-badges {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.ft-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-s);
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 7px 14px;
  border-radius: var(--r-full);
  transition: all .25s ease;
}
.ft-badge:hover {
  border-color: rgba(255, 255, 255, 0.25);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0,0,0,.5);
}
.ft-badge svg {
  width: 14px;
  height: 14px;
  stroke: var(--green);
}
.footer-mid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
.footer-col h4 {
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #fff;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.footer-col ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.footer-col a {
  color: var(--text-s);
  font-size: 13px;
  text-decoration: none;
  transition: all .2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.footer-col a:hover {
  color: #fff;
  transform: translateX(4px);
}
.footer-col span {
  font-size: 12.5px;
  color: var(--text-m);
  line-height: 1.4;
}
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 12px;
  color: var(--text-m);
}
.footer-copy {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-s);
}
.footer-legal {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 11.5px;
}
.footer-legal span.dot {
  opacity: .4;
}
.sb-copy {
  font-size: 10px;
  color: var(--text-m);
  padding: 8px 4px 0;
  text-align: center;
  letter-spacing: 0.3px;
  line-height: 1.4;
  border-top: 1px solid rgba(255,255,255,0.06);
}
.sb-copy strong {
  color: var(--text-s);
  font-weight: 700;
}
`;

// Inserir estilos do rodapé antes do fechamento de </style>
html = html.replace('</style>', footerStyles + '\n</style>');
console.log('Inserted footer styles');

// 4. Inserir Direitos Reservados na Sidebar
const oldSbFooter = `<div class="online-badge">
        <div class="odot"></div>
        <span id="sb-online">1 online</span>
      </div>
    </div>`;

const newSbFooter = `<div class="online-badge">
        <div class="odot"></div>
        <span id="sb-online">1 online</span>
      </div>
      <div class="sb-copy">
        <strong>© 2026 Zyro Stream</strong><br/>
        <span>Direitos Reservados • P2P HD</span>
      </div>
    </div>`;

if (html.includes(oldSbFooter)) {
  html = html.replace(oldSbFooter, newSbFooter);
  console.log('Inserted copyright in sidebar footer');
}

// 5. Inserir o componente de Rodapé antes de </main>
const footerHtml = `
    <!-- FOOTER COM DIREITOS RESERVADOS & INFORMAÇÕES DO SISTEMA -->
    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <img src="/assets/logo.png" alt="Zyro Logo" class="footer-brand-logo"/>
            <div class="footer-brand-text">
              <h3>Zyro Stream HD <span>• Pro 2.5</span></h3>
              <p>Transmissão de tela Ultra-HD com voz estéreo cristalina, baixa latência e segurança ponta a ponta.</p>
            </div>
          </div>
          <div class="footer-badges">
            <div class="ft-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              <span>Criptografia DTLS-SRTP P2P</span>
            </div>
            <div class="ft-badge">
              <div class="ping-dot" style="width:7px;height:7px;background:var(--green);border-radius:50%;box-shadow:0 0 8px var(--green);"></div>
              <span>Pronto para o Render Cloud</span>
            </div>
            <div class="ft-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              <span>Aceleração de Hardware GPU</span>
            </div>
          </div>
        </div>

        <div class="footer-mid">
          <div class="footer-col">
            <h4>Navegação</h4>
            <ul>
              <li><a onclick="switchView('home')">Início &amp; Destaques</a></li>
              <li><a onclick="switchView('broadcast')">Sala de Transmissão</a></li>
              <li><a onclick="switchView('private')">Salas Privadas com Senha</a></li>
              <li><a onclick="switchView('events')">Eventos da Comunidade</a></li>
              <li><a onclick="switchView('settings')">Configurações &amp; Dispositivos</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Qualidade &amp; Vídeo</h4>
            <ul>
              <li><span>Ultra HD 4K 60 FPS (18 Mbps)</span></li>
              <li><span>Quad HD 2K 60 FPS (14 Mbps)</span></li>
              <li><span>Full HD Pro 1080p 60 FPS (10 Mbps)</span></li>
              <li><span>Modo Gamer Fluido (Baixa Latência)</span></li>
              <li><span>Codec H.264 / NVENC / QuickSync</span></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Áudio &amp; Comunicação</h4>
            <ul>
              <li><span>Áudio Opus Estéreo a 320 kbps</span></li>
              <li><span>Frequência de Amostragem 48 kHz</span></li>
              <li><span>Pacotes Ultrarrápidos de 10ms</span></li>
              <li><span>Voz Bidirecional Host &amp; Viewers</span></li>
              <li><span>Recuperação de Perda (FEC) Ativa</span></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Segurança &amp; Privacidade</h4>
            <ul>
              <li><span>Comunicação Direta P2P Descentralizada</span></li>
              <li><span>Zero Gravação de Tela / Zero Logs</span></li>
              <li><span>Salas Protegidas com Hash Seguro</span></li>
              <li><span>Bloqueio Automático Anti-Força Bruta</span></li>
              <li><span>Endpoint <code>/healthz</code> para o Render</span></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-copy">
            <span>© 2026 Zyro Stream Technologies. Todos os direitos reservados.</span>
          </div>
          <div class="footer-legal">
            <span>Privacidade Absoluta</span>
            <span class="dot">•</span>
            <span>Sem Rastreamento</span>
            <span class="dot">•</span>
            <span>Transmissão Segura P2P</span>
          </div>
        </div>
      </div>
    </footer>
`;

const contentEnd = '</div><!-- /content -->\n  </main>';
const newContentEnd = '</div><!-- /content -->\n' + footerHtml + '\n  </main>';

if (html.includes(contentEnd)) {
  html = html.replace(contentEnd, newContentEnd);
  console.log('Inserted footer before </main>');
} else {
  console.warn('contentEnd marker not found, using </main>');
  html = html.replace('</main>', footerHtml + '\n</main>');
}

// 6. Atualizar os botões de qualidade de vídeo para incluir 4K e Modo Gamer
const oldQPills = `<div class="q-pills">
                  <button type="button" class="qp" data-q="2k" onclick="setQ(this)" title="Qualidade máxima 2K 60FPS para telas de alta resolução">2K Pro (60fps)</button>
                  <button type="button" class="qp active" data-q="1080" onclick="setQ(this)" title="Ultra HD 1080p 60FPS">1080p Ultra (60fps)</button>
                  <button type="button" class="qp" data-q="720" onclick="setQ(this)" title="Qualidade balanceada 720p 60FPS">720p HD (60fps)</button>
                  <button type="button" class="qp" data-q="480" onclick="setQ(this)" title="Modo econômico para conexões lentas">480p Eco</button>
                </div>`;

const newQPills = `<div class="q-pills">
                  <button type="button" class="qp" data-q="4k" onclick="setQ(this)" title="Ultra HD 4K 60FPS (3840x2160) - Máxima nitidez absoluta e leitura cristalina">4K Ultra (60fps)</button>
                  <button type="button" class="qp" data-q="2k" onclick="setQ(this)" title="Quad HD 2K 60FPS (2560x1440) - Altíssima fidelidade visual">2K Pro (60fps)</button>
                  <button type="button" class="qp active" data-q="1080" onclick="setQ(this)" title="Full HD Pro 1080p 60FPS (1920x1080) - Padrão Cristalino">1080p Ultra (60fps)</button>
                  <button type="button" class="qp" data-q="gamer" onclick="setQ(this)" title="Modo Gamer 60FPS - Prioridade de taxa de quadros e fluidez máxima">Gamer (60fps)</button>
                  <button type="button" class="qp" data-q="720" onclick="setQ(this)" title="Econômico 720p 60FPS - Para conexões com banda limitada">720p HD</button>
                </div>`;

if (html.includes(oldQPills)) {
  html = html.replace(oldQPills, newQPills);
  console.log('Replaced quality pills with 4K and Gamer options');
}

// 7. Atualizar a lógica de setQ, qCfg e applyOptimalSenderParams para suporte total a 4K e Gamer
const oldSetQ = `function setQ(btn){
  document.querySelectorAll('.qp').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const q=btn.dataset.q;
  if(q==='2k') qCfg={w:2560,h:1440,fps:60};
  else if(q==='1080') qCfg={w:1920,h:1080,fps:60};
  else if(q==='720') qCfg={w:1280,h:720,fps:60};
  else qCfg={w:854,h:480,fps:30};

  // Se a live já estiver ativa, ajusta bitrate e resolução dinamicamente sem reconectar
  if(localStream){
    const vt=localStream.getVideoTracks()[0];
    if(vt && vt.applyConstraints){
      vt.applyConstraints({
        width:{ideal:qCfg.w,max:1920},
        height:{ideal:qCfg.h,max:1080},
        frameRate:{ideal:qCfg.fps,max:60}
      }).catch(()=>{});
    }
    for(const pc of Object.values(pcs)){
      applyOptimalSenderParams(pc);
    }
  }
  toast('Qualidade alterada para '+btn.textContent+'!','ok');
}`;

const newSetQ = `function setQ(btn){
  document.querySelectorAll('.qp').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  const q=btn.dataset.q;
  if(q==='4k') qCfg={w:3840,h:2160,fps:60,mode:'resolution',bitrate:18000000};
  else if(q==='2k') qCfg={w:2560,h:1440,fps:60,mode:'resolution',bitrate:14000000};
  else if(q==='1080') qCfg={w:1920,h:1080,fps:60,mode:'resolution',bitrate:10000000};
  else if(q==='gamer') qCfg={w:1920,h:1080,fps:60,mode:'framerate',bitrate:9000000};
  else if(q==='720') qCfg={w:1280,h:720,fps:60,mode:'framerate',bitrate:5000000};
  else qCfg={w:854,h:480,fps:30,mode:'framerate',bitrate:2500000};

  // Se a live já estiver ativa, ajusta bitrate e resolução dinamicamente sem reconectar
  if(localStream){
    const vt=localStream.getVideoTracks()[0];
    if(vt && vt.applyConstraints){
      vt.applyConstraints({
        width:{ideal:qCfg.w,max:qCfg.w},
        height:{ideal:qCfg.h,max:qCfg.h},
        frameRate:{ideal:qCfg.fps,max:qCfg.fps}
      }).catch(()=>{});
      if('contentHint' in vt){
        vt.contentHint = (qCfg.mode === 'framerate') ? 'motion' : 'detail';
      }
    }
    for(const pc of Object.values(pcs)){
      applyOptimalSenderParams(pc);
    }
  }
  toast('Qualidade alterada para '+btn.textContent+'!','ok');
}`;

if (html.includes(oldSetQ)) {
  html = html.replace(oldSetQ, newSetQ);
  console.log('Replaced setQ with complete 4K & Gamer mode handling');
}

// 8. Atualizar qCfg inicial
html = html.replace('var qCfg = { w: 1920, h: 1080, fps: 60 };', "var qCfg = { w: 1920, h: 1080, fps: 60, mode: 'resolution', bitrate: 10000000 };");

// 9. Atualizar optimizeSDP para 320kbps de áudio Opus estéreo e até 18 Mbps de vídeo
const oldOptimizeSDP = `function optimizeSDP(sdp) {
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

  // Otimização de áudio Opus: 10ms packet time (latência mínima de voz), 320kbps estéreo cristalino
  lines = lines.map(line => {
    if (line.startsWith('a=fmtp:') && line.includes('opus')) {
      if (!line.includes('minptime=')) {
        line += ';minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=320000;cbr=1';
      }
    }
    return line;
  });

  // Elevação Máxima de Banda de Vídeo: até 18 Mbps para 4K e 10 Mbps para 1080p
  if (mVideoIdx !== -1) {
    let insertIdx = mVideoIdx + 1;
    while (insertIdx < lines.length && (lines[insertIdx].startsWith('c=') || lines[insertIdx].startsWith('b='))) {
      insertIdx++;
    }
    const bwVal = qCfg.w >= 3840 ? '18000' : (qCfg.w >= 2560 ? '14000' : (qCfg.w >= 1920 ? '10000' : '5000'));
    const tiasVal = (parseInt(bwVal, 10) * 1000000).toString();
    lines.splice(insertIdx, 0, 'b=AS:' + bwVal, 'b=TIAS:' + tiasVal);
  }

  return lines.join('\\r\\n');
}`;

if (html.includes(oldOptimizeSDP)) {
  html = html.replace(oldOptimizeSDP, newOptimizeSDP);
  console.log('Replaced optimizeSDP with 320kbps audio & 18Mbps video');
}

// 10. Atualizar applyOptimalSenderParams
const oldSenderParams = `async function applyOptimalSenderParams(pc) {
  if (!pc) return;
  try {
    for (const sender of pc.getSenders()) {
      if (sender.track && sender.track.kind === 'video') {
        if ('degradationPreference' in sender) {
          sender.degradationPreference = 'maintain-framerate'; // Nunca congela ou reduz FPS
        }
        const params = sender.getParameters();
        if (!params.encodings || params.encodings.length === 0) {
          params.encodings = [{}];
        }
        const targetBitrate = qCfg.w >= 2560 ? 12000000 : (qCfg.w >= 1920 ? 9000000 : (qCfg.w >= 1280 ? 5000000 : 2200000));
        const minBitrate = qCfg.w >= 2560 ? 6000000 : (qCfg.w >= 1920 ? 4000000 : (qCfg.w >= 1280 ? 2500000 : 1000000));
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

const newSenderParams = `async function applyOptimalSenderParams(pc) {
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

if (html.includes(oldSenderParams)) {
  html = html.replace(oldSenderParams, newSenderParams);
  console.log('Replaced applyOptimalSenderParams with dynamic bitrate allocation');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Saved updated index.html! New size:', html.length);
