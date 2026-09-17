const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Add .view-h1, .view-h2, .view-desc CSS and comprehensive theme-light rules
const themeEnhancements = `
/* ── CLASSES PADRÃO PARA CABEÇALHOS DE VIEWS (COMPATÍVEL DARK & LIGHT) ── */
.view-h1 {
  font-size: 22px;
  font-weight: 900;
  color: var(--text);
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}
.view-h2 {
  font-size: 19px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 4px;
}
.view-desc {
  font-size: 13px;
  color: var(--text-s);
  line-height: 1.4;
}

/* ── REGRAS EXAUSTIVAS DE CONTRASTE E ACABAMENTO PARA TEMA CLARO ── */
body.theme-light .view-h1,
body.theme-light .view-h2 {
  color: #0f172a !important;
}
body.theme-light .view-desc {
  color: #475569 !important;
}
body.theme-light .btn-s {
  background: #ffffff !important;
  color: #0f172a !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05) !important;
}
body.theme-light .btn-s:hover {
  background: #f1f5f9 !important;
  border-color: #94a3b8 !important;
  color: #000000 !important;
}
body.theme-light .btn-s svg {
  stroke: #0f172a !important;
}
body.theme-light .btn-p {
  background: #2563eb !important;
  color: #ffffff !important;
  border: 1px solid #1d4ed8 !important;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35) !important;
}
body.theme-light .btn-p:hover {
  background: #1d4ed8 !important;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.45) !important;
}
body.theme-light .btn-gen {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #2563eb !important;
}
body.theme-light .btn-gen:hover {
  background: #f1f5f9 !important;
  border-color: #2563eb !important;
}
body.theme-light .quick-watch-banner {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, #ffffff 100%) !important;
  border: 1px solid rgba(37, 99, 235, 0.28) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
}
body.theme-light .qwb-icon {
  background: rgba(37, 99, 235, 0.12) !important;
  border-color: rgba(37, 99, 235, 0.3) !important;
  color: #2563eb !important;
}
body.theme-light .qwb-text h3 {
  color: #0f172a !important;
}
body.theme-light .qwb-text p {
  color: #475569 !important;
}
body.theme-light .qwb-input {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #2563eb !important;
}
body.theme-light .qwb-input:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 12px rgba(37, 99, 235, 0.25) !important;
}
body.theme-light .sf-card,
body.theme-light .card,
body.theme-light .pv-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
}
body.theme-light .form-label {
  color: #334155 !important;
}
body.theme-light .form-in,
body.theme-light select.form-in {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #0f172a !important;
}
body.theme-light .form-in:focus,
body.theme-light select.form-in:focus {
  border-color: #2563eb !important;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.2) !important;
}
body.theme-light .toggle-row {
  border-bottom: 1px solid #f1f5f9 !important;
}
body.theme-light .toggle-name {
  color: #0f172a !important;
}
body.theme-light .toggle-desc {
  color: #64748b !important;
}
body.theme-light .q-pills .qp {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #334155 !important;
}
body.theme-light .q-pills .qp:hover {
  background: #f8fafc !important;
  border-color: #94a3b8 !important;
  color: #0f172a !important;
}
body.theme-light .q-pills .qp.active {
  background: #2563eb !important;
  border-color: #2563eb !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35) !important;
}
body.theme-light .video-box {
  background: #000000 !important;
  border-color: #cbd5e1 !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08) !important;
}
body.theme-light .v-empty {
  color: #94a3b8 !important;
}
body.theme-light .v-empty svg {
  stroke: #94a3b8 !important;
}
body.theme-light .modal-box {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18) !important;
}
body.theme-light .modal-title {
  color: #0f172a !important;
}
body.theme-light .modal-desc {
  color: #475569 !important;
}
body.theme-light .modal-x {
  color: #64748b !important;
}
body.theme-light .modal-x:hover {
  color: #0f172a !important;
}
body.theme-light .cat {
  background: #ffffff !important;
  border: 1px solid #cbd5e1 !important;
  color: #475569 !important;
}
body.theme-light .cat:hover {
  background: #f1f5f9 !important;
  border-color: #94a3b8 !important;
  color: #0f172a !important;
}
body.theme-light .cat.active {
  background: #2563eb !important;
  border-color: #2563eb !important;
  color: #ffffff !important;
}
body.theme-light .pr-chip {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
}
body.theme-light .pr-name {
  color: #0f172a !important;
}
body.theme-light .pr-sub {
  color: #64748b !important;
}
body.theme-light .pr-btn {
  background: #f1f5f9 !important;
  border: 1px solid #cbd5e1 !important;
  color: #2563eb !important;
}
body.theme-light .pr-btn:hover {
  background: #2563eb !important;
  color: #ffffff !important;
}
body.theme-light .sc {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
}
body.theme-light .sc-title {
  color: #0f172a !important;
}
body.theme-light .sc-meta {
  color: #64748b !important;
}
body.theme-light .btn-watch {
  background: #2563eb !important;
  color: #ffffff !important;
}
body.theme-light .btn-watch:hover {
  background: #1d4ed8 !important;
}
body.theme-light .streams-empty-box {
  background: #ffffff !important;
  border-color: #cbd5e1 !important;
}
body.theme-light .pv-title {
  color: #0f172a !important;
}
body.theme-light .pv-sub {
  color: #64748b !important;
}
`;

// Insert theme enhancements into CSS
html = html.replace('/* ── HERO FEATURE CARDS MODERNOS ── */', themeEnhancements + '\n/* ── HERO FEATURE CARDS MODERNOS ── */');

// 2. Fix inline style color:#fff on view titles
html = html.replace('<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">Transmissões &amp; Ao Vivo</h1>\n              <p style="font-size:13px;color:var(--text-s);">Assista a transmissões em tempo real ou compartilhe sua própria tela em alta definição.</p>',
  '<h1 class="view-h1">Transmissões &amp; Ao Vivo</h1>\n              <p class="view-desc">Assista a transmissões em tempo real ou compartilhe sua própria tela em alta definição.</p>');

html = html.replace('<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">Salas Privadas com Senha</h1>\n              <p style="font-size:13px;color:var(--text-s);">Crie salas com senha criptografada SHA-256 e proteção anti-força bruta.</p>',
  '<h1 class="view-h1">Salas Privadas com Senha</h1>\n              <p class="view-desc">Crie salas com senha criptografada SHA-256 e proteção anti-força bruta.</p>');

html = html.replace('<h2 style="font-size:20px;font-weight:800;color:#fff;">Sala Privada Pronta</h2>',
  '<h2 class="view-h2">Sala Privada Pronta</h2>');

html = html.replace('<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">Meu Perfil &amp; Personalização</h1>\n              <p style="font-size:13px;color:var(--text-s);">Personalize seu nome de exibição, avatar e preferências no Zyro Stream.</p>',
  '<h1 class="view-h1">Meu Perfil &amp; Personalização</h1>\n              <p class="view-desc">Personalize seu nome de exibição, avatar e preferências no Zyro Stream.</p>');

html = html.replace('<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">Configurações do Sistema</h1>\n              <p style="font-size:13px;color:var(--text-s);">Ajuste o tema visual, parâmetros de rede e preferências de transmissão.</p>',
  '<h1 class="view-h1">Configurações do Sistema</h1>\n              <p class="view-desc">Ajuste o tema visual, parâmetros de rede e preferências de transmissão.</p>');

html = html.replace('<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;" id="viewer-title">Assistindo Transmissão</h1>',
  '<h1 class="view-h1" id="viewer-title">Assistindo Transmissão</h1>');

// 3. Add stream visibility toggle (SEMPRE DESATIVADO / DEFAULT OFF) in Host Broadcast setup
const targetToggles = `<div class="toggle-row">
                <div class="toggle-info">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ef4444" style="display:inline;vertical-align:middle;margin-right:3px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span class="toggle-name">Sala Protegida por Senha</span>
                  <span class="toggle-desc">Ninguém entra sem a senha correta</span>
                </div>
                <label class="tgl"><input type="checkbox" id="h-private" onchange="togglePass(this)"/><span class="tgl-sl"></span></label>
              </div>`;

const newTogglesWithPublic = `<div class="toggle-row">
                <div class="toggle-info">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ef4444" style="display:inline;vertical-align:middle;margin-right:3px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span class="toggle-name">Sala Protegida por Senha</span>
                  <span class="toggle-desc">Ninguém entra sem a senha correta</span>
                </div>
                <label class="tgl"><input type="checkbox" id="h-private" onchange="togglePass(this)"/><span class="tgl-sl"></span></label>
              </div>
              <div class="toggle-row">
                <div class="toggle-info">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#3b82f6" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <span class="toggle-name">Listar na Comunidade (Pública)</span>
                  <span class="toggle-desc">Exibir sua live na lista pública (padrão: desativado)</span>
                </div>
                <label class="tgl"><input type="checkbox" id="h-public"/><span class="tgl-sl"></span></label>
              </div>`;

if (html.includes(targetToggles)) {
  html = html.replace(targetToggles, newTogglesWithPublic);
  console.log('Added public stream visibility toggle (always off by default)');
} else {
  console.warn('Could not match targetToggles');
}

// 4. Update startStream to read h-public and pass to server
html = html.replace('const priv = document.getElementById(\'h-private\').checked;',
  'const priv = document.getElementById(\'h-private\').checked;\n  const pub = document.getElementById(\'h-public\') ? document.getElementById(\'h-public\').checked : false;');

html = html.replace('isPrivate: priv,\n      password: pass',
  'isPrivate: priv,\n      isPublic: pub,\n      password: pass');

// 5. Replace fake fallback streams in renderStreams and renderSideLive
const oldRenderStreams = `function renderStreams(list2){
  const c=document.getElementById('streams-grid');if(!c)return;c.textContent='';
  const list=list2.length>0?list2:[
    {id:'LIVE-DAYZ',title:'Sobrevivendo em Chernarus',category:'DayZ',hostName:'Sobrevivente',viewersCount:412,isPrivate:false},
    {id:'LIVE-CS2',title:'Treino Tático 5v5 Premier',category:'CS 2',hostName:'Fallen',viewersCount:689,isPrivate:false},
    {id:'LIVE-GTA',title:'Roleplay Policial Bahamas',category:'GTA RP',hostName:'Host Principal',viewersCount:842,isPrivate:false}
  ];
  list.forEach(r=>{
    const card=document.createElement('div');card.className='sc';
    const th=document.createElement('div');th.className='sc-thumb';
    th.innerHTML='<div class="sc-pattern"></div><div class="sc-play"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div><div class="live-badge"><div class="live-dot"></div> LIVE</div><div class="viewers-badge"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> '+r.viewersCount+'</div>'+(r.isPrivate?'<div class="lock-badge"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Senha</div>':'');
    const inf=document.createElement('div');inf.className='sc-info';
    const t=document.createElement('div');t.className='sc-title';t.textContent=r.title;
    const m=document.createElement('div');m.className='sc-meta';m.innerHTML='<span class="sc-tag">'+(r.category||'Geral')+'</span><span>'+r.hostName+'</span>';
    const btn=document.createElement('button');btn.className='btn-watch';btn.textContent='Assistir';btn.onclick=e=>{e.stopPropagation();joinRoom(r.id);};
    inf.appendChild(t);inf.appendChild(m);inf.appendChild(btn);card.appendChild(th);card.appendChild(inf);
    card.onclick=()=>joinRoom(r.id);c.appendChild(card);
  });
}`;

const newRenderStreams = `function renderStreams(list2){
  const c=document.getElementById('streams-grid');if(!c)return;c.textContent='';
  if(!list2 || list2.length === 0){
    c.innerHTML = \`
      <div class="streams-empty-box" style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: var(--bg-card); border: 1px dashed var(--border-s); border-radius: var(--r-lg);">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(37,99,235,0.12); color: #3b82f6; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
        </div>
        <h3 style="font-size: 16px; font-weight: 800; color: var(--text); margin-bottom: 6px;">Nenhuma transmissão pública online no momento</h3>
        <p style="font-size: 13px; color: var(--text-s); max-width: 440px; margin: 0 auto 18px;">As transmissões aparecem aqui somente quando um streamer estiver ao vivo e escolher listar publicamente.</p>
        <button class="btn-p" onclick="switchView('broadcast')" style="font-size: 12.5px; padding: 8px 20px;">Iniciar Minha Live</button>
      </div>\`;
    return;
  }
  list2.forEach(r=>{
    const card=document.createElement('div');card.className='sc';
    const th=document.createElement('div');th.className='sc-thumb';
    th.innerHTML='<div class="sc-pattern"></div><div class="sc-play"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div><div class="live-badge"><div class="live-dot"></div> LIVE</div><div class="viewers-badge"><svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> '+r.viewersCount+'</div>'+(r.isPrivate?'<div class="lock-badge"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Senha</div>':'');
    const inf=document.createElement('div');inf.className='sc-info';
    const t=document.createElement('div');t.className='sc-title';t.textContent=r.title;
    const m=document.createElement('div');m.className='sc-meta';m.innerHTML='<span class="sc-tag">'+(r.category||'Geral')+'</span><span>'+r.hostName+'</span>';
    const btn=document.createElement('button');btn.className='btn-watch';btn.textContent='Assistir';btn.onclick=e=>{e.stopPropagation();joinRoom(r.id);};
    inf.appendChild(t);inf.appendChild(m);inf.appendChild(btn);card.appendChild(th);card.appendChild(inf);
    card.onclick=()=>joinRoom(r.id);c.appendChild(card);
  });
}`;

if (html.includes(oldRenderStreams)) {
  html = html.replace(oldRenderStreams, newRenderStreams);
  console.log('Removed fake streams from renderStreams');
} else {
  console.warn('Could not match oldRenderStreams');
}

const oldRenderSide = `function renderSideLive(list2){
  const c=document.getElementById('side-live-list');if(!c)return;c.textContent='';
  const lc=document.getElementById('live-count');if(lc)lc.textContent=list2.length+' live'+(list2.length!==1?'s':'');
  const list=list2.length>0?list2:[{id:'LIVE-DAYZ',title:'DayZ Sobrevivência',viewersCount:412},{id:'LIVE-CS2',title:'CS 2 Competitivo',viewersCount:689}];
  list.forEach(r=>{
    const item=document.createElement('div');item.style.cssText='display:flex;align-items:center;gap:10px;padding:6px;border-radius:6px;cursor:pointer;transition:background .2s;';
    item.onmouseenter=()=>item.style.background='var(--bg-elev)';item.onmouseleave=()=>item.style.background='transparent';item.onclick=()=>joinRoom(r.id);
    item.innerHTML='<div style="width:36px;height:26px;background:var(--bg-elev);border-radius:4px;display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div><div style="display:flex;flex-direction:column;min-width:0;"><span style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+r.title+'</span><span style="font-size:10.5px;color:var(--text-m);">'+r.viewersCount+' espectadores</span></div>';
    c.appendChild(item);
  });
}`;

const newRenderSide = `function renderSideLive(list2){
  const c=document.getElementById('side-live-list');if(!c)return;c.textContent='';
  const count = list2 ? list2.length : 0;
  const lc=document.getElementById('live-count');if(lc)lc.textContent=count+' live'+(count!==1?'s':'');
  if(!list2 || list2.length === 0){
    c.innerHTML='<div style="font-size:11.5px;color:var(--text-m);padding:10px 4px;">Nenhuma live pública online.</div>';
    return;
  }
  list2.forEach(r=>{
    const item=document.createElement('div');item.style.cssText='display:flex;align-items:center;gap:10px;padding:6px;border-radius:6px;cursor:pointer;transition:background .2s;';
    item.onmouseenter=()=>item.style.background='var(--bg-elev)';item.onmouseleave=()=>item.style.background='transparent';item.onclick=()=>joinRoom(r.id);
    item.innerHTML='<div style="width:36px;height:26px;background:var(--bg-elev);border-radius:4px;display:flex;align-items:center;justify-content:center;"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div><div style="display:flex;flex-direction:column;min-width:0;"><span style="font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+r.title+'</span><span style="font-size:10.5px;color:var(--text-m);">'+r.viewersCount+' espectadores</span></div>';
    c.appendChild(item);
  });
}`;

if (html.includes(oldRenderSide)) {
  html = html.replace(oldRenderSide, newRenderSide);
  console.log('Removed fake streams from renderSideLive');
} else {
  console.warn('Could not match oldRenderSide');
}

// 6. Replace fake chips on Home
const oldHomeChips = `<div class="pr-chips">
                  <div class="pr-chip" onclick="quickJoin('DAYZ-SURVIVAL')"><div class="pr-left"><div class="pr-name"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Sala DayZ Tática</div><div class="pr-sub">DayZ &bull; Voz Ativa &bull; Senha</div></div><button class="pr-btn">Entrar</button></div>
                  <div class="pr-chip" onclick="quickJoin('CS2-COMPETITIVO')"><div class="pr-left"><div class="pr-name"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Treino CS 2 (5v5)</div><div class="pr-sub">CS 2 &bull; 1080p 60fps &bull; Senha</div></div><button class="pr-btn">Entrar</button></div>
                  <div class="pr-chip" onclick="quickJoin('SALA-AMIGOS')"><div class="pr-left"><div class="pr-name"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Sala dos Amigos</div><div class="pr-sub">Conversa &amp; Fotos &bull; Privada</div></div><button class="pr-btn">Entrar</button></div>
                  <div class="pr-chip" onclick="quickJoin('STAFF-ROOM')"><div class="pr-left"><div class="pr-name"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Equipe Staff</div><div class="pr-sub">Moderadores &bull; Restrita</div></div><button class="pr-btn">Entrar</button></div>
                </div>`;

const newHomeChips = `<div class="pr-chips">
                  <div class="pr-chip" onclick="openJoinModal()"><div class="pr-left"><div class="pr-name"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Entrar com Código da Sala</div><div class="pr-sub">Digite o código único para assistir em tempo real</div></div><button class="pr-btn">Entrar</button></div>
                  <div class="pr-chip" onclick="switchView('private')"><div class="pr-left"><div class="pr-name"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Criar Sala Protegida por Senha</div><div class="pr-sub">Crie uma sala restrita somente para convidados</div></div><button class="pr-btn">Criar Sala</button></div>
                </div>`;

if (html.includes(oldHomeChips)) {
  html = html.replace(oldHomeChips, newHomeChips);
  console.log('Replaced fake chips on Home with real action cards');
} else {
  console.warn('Could not match oldHomeChips');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Updated public/index.html with all fixes!');
