// Script to apply all requested features and contrast fixes to public/index.html
const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
const origLen = html.length;

let changes = 0;

// 1. Fix Favicon: replace icon_z.png with logo.png
if (html.includes('href="assets/icon_z.png"')) {
  html = html.replace('href="assets/icon_z.png"', 'href="assets/logo.png"');
  changes++;
  console.log('[+] Fixed favicon icon_z.png -> assets/logo.png');
}

// 2. Fix sound-pill white text in CSS
if (html.includes('.sound-pill.on span{color:#fff}')) {
  html = html.replace('.sound-pill.on span{color:#fff}', '.sound-pill.on span{color:var(--text)}');
  changes++;
  console.log('[+] Fixed sound-pill.on span color');
}

// 3. Fix room-code-box white text in CSS
if (html.includes('.room-code-box{background:var(--bg-base);border:2px dashed var(--border-b);padding:14px 28px;border-radius:var(--r-md);font-family:\'JetBrains Mono\',monospace;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;')) {
  html = html.replace(
    '.room-code-box{background:var(--bg-base);border:2px dashed var(--border-b);padding:14px 28px;border-radius:var(--r-md);font-family:\'JetBrains Mono\',monospace;font-size:28px;font-weight:800;letter-spacing:2px;color:#fff;',
    '.room-code-box{background:var(--bg-base);border:2px dashed var(--border-b);padding:14px 28px;border-radius:var(--r-md);font-family:\'JetBrains Mono\',monospace;font-size:28px;font-weight:800;letter-spacing:2px;color:var(--text);'
  );
  changes++;
  console.log('[+] Fixed room-code-box color:#fff -> color:var(--text)');
}

// 4. Fix Clean Light hardcoded text color
if (html.includes('<span style="color:#0f172a;">Clean Light</span>')) {
  html = html.replace('<span style="color:#0f172a;">Clean Light</span>', '<span>Clean Light</span>');
  changes++;
  console.log('[+] Fixed Clean Light text color');
}

// 5. Tone down logo brightness / drop-shadow
const oldKeyframes = `@keyframes logoFiveMIntro {
  0% {
    opacity: 0;
    transform: perspective(1200px) translate3d(-340px, -170px, 420px) rotateY(-40deg) rotateX(24deg) scale(0.32);
    filter: blur(12px) drop-shadow(0 0 45px rgba(255,255,255,0.95));
  }
  30% {
    opacity: 0.95;
    transform: perspective(1200px) translate3d(-90px, -35px, 200px) rotateY(-18deg) rotateX(10deg) scale(0.78);
    filter: blur(4px) drop-shadow(0 0 55px rgba(255,255,255,1)) drop-shadow(0 0 90px rgba(59,130,246,0.6));
  }
  65% {
    opacity: 1;
    transform: perspective(1200px) translate3d(35px, 8px, 70px) rotateY(9deg) rotateX(-4deg) scale(1.08);
    filter: blur(0px) drop-shadow(0 0 35px rgba(255,255,255,0.95));
  }
  85% {
    transform: perspective(1200px) translate3d(-8px, -2px, 12px) rotateY(-2deg) rotateX(2deg) scale(0.98);
    filter: drop-shadow(0 0 25px rgba(255,255,255,0.85));
  }
  100% {
    opacity: 1;
    transform: perspective(1200px) translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg) scale(1);
    filter: drop-shadow(0 0 22px rgba(255,255,255,0.75)) drop-shadow(0 15px 30px rgba(0,0,0,0.8));
  }
}

@keyframes logoFloatIdle {
  0% { transform: perspective(1200px) translate3d(0, 0, 0) rotateY(0deg) scale(1); }
  100% { transform: perspective(1200px) translate3d(0, -6px, 14px) rotateY(1.8deg) scale(1.015); filter: drop-shadow(0 0 30px rgba(255,255,255,0.9)); }
}`;

const newKeyframes = `@keyframes logoFiveMIntro {
  0% {
    opacity: 0;
    transform: perspective(1200px) translate3d(-340px, -170px, 420px) rotateY(-40deg) rotateX(24deg) scale(0.32);
    filter: blur(8px) drop-shadow(0 4px 15px rgba(0,0,0,0.6));
  }
  30% {
    opacity: 0.95;
    transform: perspective(1200px) translate3d(-90px, -35px, 200px) rotateY(-18deg) rotateX(10deg) scale(0.78);
    filter: blur(2px) drop-shadow(0 4px 20px rgba(0,0,0,0.6)) drop-shadow(0 0 15px rgba(59,130,246,0.35));
  }
  65% {
    opacity: 1;
    transform: perspective(1200px) translate3d(35px, 8px, 70px) rotateY(9deg) rotateX(-4deg) scale(1.08);
    filter: blur(0px) drop-shadow(0 4px 18px rgba(0,0,0,0.6));
  }
  85% {
    transform: perspective(1200px) translate3d(-8px, -2px, 12px) rotateY(-2deg) rotateX(2deg) scale(0.98);
    filter: drop-shadow(0 4px 15px rgba(0,0,0,0.6));
  }
  100% {
    opacity: 1;
    transform: perspective(1200px) translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg) scale(1);
    filter: drop-shadow(0 6px 20px rgba(0,0,0,0.7)) drop-shadow(0 0 8px rgba(255,255,255,0.18));
  }
}

@keyframes logoFloatIdle {
  0% { transform: perspective(1200px) translate3d(0, 0, 0) rotateY(0deg) scale(1); }
  100% { transform: perspective(1200px) translate3d(0, -5px, 10px) rotateY(1.5deg) scale(1.01); filter: drop-shadow(0 8px 24px rgba(0,0,0,0.75)) drop-shadow(0 0 10px rgba(255,255,255,0.18)); }
}`;

if (html.includes(oldKeyframes)) {
  html = html.replace(oldKeyframes, newKeyframes);
  changes++;
  console.log('[+] Dimmed logo intro brightness');
}

// 6. Make brand-logo-zyro drop shadow subtle
if (html.includes('filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.3));')) {
  html = html.replace('filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.3));', 'filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));');
  changes++;
  console.log('[+] Dimmed brand-logo-zyro drop-shadow');
}

// 7. Make stats card 3 100% real: replace "12.6k Membros Ativos" with "Salas Ativas" (total active rooms)
const oldStatCard3 = `<div class="stat-card reveal delay-2">
              <div class="stat-card-h"><span class="stat-label">Comunidade</span><div class="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle></svg></div></div>
              <div class="stat-val">12.6k</div>
              <span class="stat-badge">Membros Ativos</span>
            </div>`;

const newStatCard3 = `<div class="stat-card reveal delay-2">
              <div class="stat-card-h"><span class="stat-label">Salas Ativas</span><div class="stat-ico"><svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle></svg></div></div>
              <div class="stat-val" id="stat-total-rooms">0</div>
              <span class="stat-badge">Tempo Real</span>
            </div>`;

if (html.includes(oldStatCard3)) {
  html = html.replace(oldStatCard3, newStatCard3);
  changes++;
  console.log('[+] Replaced 12.6k with real Salas Ativas stat card');
}

// 8. Fix genCode() to eliminate game names (DAYZ, CS2, NEO, PLAY, ZONE)
const oldGenCode = `function genCode(){const p=['NEO','DAYZ','ZONE','PLAY','CS2'];const code=p[Math.floor(Math.random()*p.length)]+'-'+Math.floor(1000+Math.random()*9000);document.getElementById('priv-code').textContent=code;toast('Código: '+code,'ok');}`;

const newGenCode = `function genCleanCode(){
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let p = '';
  for(let i=0; i<3; i++) p += letters.charAt(Math.floor(Math.random()*letters.length));
  return p + '-' + Math.floor(1000 + Math.random()*9000);
}
function genCode(){
  const code = genCleanCode();
  const el = document.getElementById('priv-code');
  if(el) el.textContent = code;
  toast('Novo Código: ' + code, 'ok');
  soundClick();
}`;

if (html.includes(oldGenCode)) {
  html = html.replace(oldGenCode, newGenCode);
  changes++;
  console.log('[+] Updated genCode without game names');
}

// 9. Fix genHostCode() without game names
const oldGenHostCode = `function genHostCode(){
  const p = ['ZYRO', 'PLAY', 'STREAM', 'LIVE', 'ZONE'];
  const code = p[Math.floor(Math.random() * p.length)] + '-' + Math.floor(1000 + Math.random() * 9000);
  const el = document.getElementById('h-room-code');
  if(el) el.value = code;
  return code;
}`;

const newGenHostCode = `function genHostCode(){
  const code = (typeof genCleanCode === 'function') ? genCleanCode() : ('ZR-' + Math.floor(1000 + Math.random()*9000));
  const el = document.getElementById('h-room-code');
  if(el) el.value = code;
  return code;
}`;

if (html.includes(oldGenHostCode)) {
  html = html.replace(oldGenHostCode, newGenHostCode);
  changes++;
  console.log('[+] Updated genHostCode without game names');
}

// 10. Replace placeholders like Ex: NEO-4680 with Ex: ZR-4820
html = html.replace(/Ex:\s*NEO-4680/g, 'Ex: ZR-4820');
html = html.replace(/<span id="priv-code">NEO-4680<\/span>/g, '<span id="priv-code">ZR-4820</span>');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log(`[OK] Applied ${changes} base fixes to public/index.html. New size: ${html.length}`);
