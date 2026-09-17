const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. FIX view-broadcast HTML STRUCTURE (Remove the premature closing tags)
const oldBroadcastSection = `          <div class="studio-vcol">
            <div class="video-box" id="host-vbox">
              <div class="v-empty" id="host-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <p>Sua transmissão aparecerá aqui após clicar em Iniciar</p>
              </div>
              <video id="local-vid" autoplay playsinline muted style="display:none;"></video>
              
              <!-- STAGE DE VOZ DISCORD (QUANDO NÃO TRANSMITINDO TELA) -->
              
                <div class="discord-grid" id="host-discord-grid"></div>
              </div>

              <!-- OVERLAY PAUSADA -->
              <div id="paused-overlay">
                <div class="paused-ring">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <div class="paused-title">Transmissão Pausada</div>
                <div class="paused-sub">Você saiu da janela capturada. Os espectadores estão aguardando.</div>
                <div class="paused-tips">
                  <div class="ptip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 .49-3.51"></path></svg> Volte para a janela capturada para retomar</div>
                  <div class="ptip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg> Ou clique em "Trocar Janela" abaixo</div>
                </div>
              </div>

              <div class="live-badge" id="host-live-badge" style="display:none;"><div class="live-dot"></div> AO VIVO</div>
              <div class="stream-stats-badge" id="host-stats-badge" style="display:none;">
                <span class="ssb-item"><span class="ssb-dot"></span> <span id="host-fps-tag">60 FPS</span></span>
                <span class="ssb-item">⚡ ZERO DELAY</span>
                <span class="ssb-item" id="host-bitrate-tag">9.0 Mbps</span>
              </div>

              <!-- HUD CÓDIGO AO VIVO -->
              <div class="host-code-banner" id="host-code-banner" style="display:none;">
                <span class="hcb-status"><span class="live-dot"></span> AO VIVO</span>
                <span class="hcb-text">SALA:</span>
                <span class="hcb-code" id="hcb-code">ZYRO-0000</span>
                <button class="hcb-btn" onclick="copyCode()" title="Copiar Código da Sala">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copiar Código
                </button>
              </div>


              
              <!-- OVERLAY DE QUEM ESTÁ FALANDO (VERDE EM VOLTA AO FALAR) -->
              <div class="stream-speaker-overlay" id="host-speaker-hud" style="display:none;">
                <div class="ssh-avatar-wrap" id="host-avatar-wrap">
                  <div class="ssh-avatar" id="host-speaker-av">P</div>
                  <div class="ssh-mute-icon" id="host-speaker-mute" style="display:none;">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>
                  </div>
                </div>
                <div class="ssh-meta">
                  <span class="ssh-name" id="host-speaker-name">Player</span>
                  <span class="ssh-tag" id="host-speaker-status">● Ao Vivo</span>
                </div>
              </div>
              <div class="player-overlay" id="host-overlay" style="display:none;">
                <button class="ctrl on-mic" id="host-mic-btn" onclick="toggleHostMic()" title="Mutar Microfone">
                  <svg id="host-mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <button class="ctrl" onclick="switchWin()" title="Trocar Janela">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                </button>
                <button class="ctrl" onclick="toggleFS('host-vbox')" title="Tela Cheia">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>
                <button class="ctrl danger" onclick="stopStream()" title="Encerrar">
                  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>
                </button>
              </div>
            </div>
            <!-- Strip de participantes (exibido quando compartilhando tela) -->
            <div class="discord-voice-strip" id="host-voice-strip" style="display:none;"></div>

            </div>
          <div class="sf-panel">`;

const newBroadcastSection = `          <div class="studio-vcol">
            <div class="video-box" id="host-vbox">
              <div class="v-empty" id="host-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <p>Sua transmissão aparecerá aqui após clicar em Iniciar</p>
              </div>
              <video id="local-vid" autoplay playsinline muted style="display:none;"></video>
              
              <!-- STAGE DE VOZ DISCORD (QUANDO NÃO TRANSMITINDO TELA) -->
              <div class="discord-grid" id="host-discord-grid"></div>

              <!-- OVERLAY PAUSADA -->
              <div id="paused-overlay">
                <div class="paused-ring">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <div class="paused-title">Transmissão Pausada</div>
                <div class="paused-sub">Você saiu da janela capturada. Os espectadores estão aguardando.</div>
                <div class="paused-tips">
                  <div class="ptip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 .49-3.51"></path></svg> Volte para a janela capturada para retomar</div>
                  <div class="ptip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg> Ou clique em "Trocar Janela" abaixo</div>
                </div>
              </div>

              <div class="live-badge" id="host-live-badge" style="display:none;"><div class="live-dot"></div> AO VIVO</div>
              <div class="stream-stats-badge" id="host-stats-badge" style="display:none;">
                <span class="ssb-item"><span class="ssb-dot"></span> <span id="host-fps-tag">60 FPS</span></span>
                <span class="ssb-item">⚡ ZERO DELAY</span>
                <span class="ssb-item" id="host-bitrate-tag">9.0 Mbps</span>
              </div>

              <!-- HUD CÓDIGO AO VIVO -->
              <div class="host-code-banner" id="host-code-banner" style="display:none;">
                <span class="hcb-status"><span class="live-dot"></span> AO VIVO</span>
                <span class="hcb-text">SALA:</span>
                <span class="hcb-code" id="hcb-code">ZYRO-0000</span>
                <button class="hcb-btn" onclick="copyCode()" title="Copiar Código da Sala">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  Copiar Código
                </button>
              </div>

              <!-- OVERLAY DE QUEM ESTÁ FALANDO (VERDE EM VOLTA AO FALAR) -->
              <div class="stream-speaker-overlay" id="host-speaker-hud" style="display:none;">
                <div class="ssh-avatar-wrap" id="host-avatar-wrap">
                  <div class="ssh-avatar" id="host-speaker-av">P</div>
                  <div class="ssh-mute-icon" id="host-speaker-mute" style="display:none;">
                    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path></svg>
                  </div>
                </div>
                <div class="ssh-meta">
                  <span class="ssh-name" id="host-speaker-name">Player</span>
                  <span class="ssh-tag" id="host-speaker-status">● Ao Vivo</span>
                </div>
              </div>
              <div class="player-overlay" id="host-overlay" style="display:none;">
                <button class="ctrl on-mic" id="host-mic-btn" onclick="toggleHostMic()" title="Mutar Microfone">
                  <svg id="host-mic-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                </button>
                <button class="ctrl" onclick="switchWin()" title="Trocar Janela">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                </button>
                <button class="ctrl" onclick="toggleFS('host-vbox')" title="Tela Cheia">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </button>
                <button class="ctrl danger" onclick="stopStream()" title="Encerrar">
                  <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"></rect></svg>
                </button>
              </div>
            </div>
            <!-- Strip de participantes (exibido quando compartilhando tela) -->
            <div class="discord-voice-strip" id="host-voice-strip" style="display:none;"></div>
          </div>
          <div class="sf-panel">`;

if (html.includes(oldBroadcastSection)) {
  html = html.replace(oldBroadcastSection, newBroadcastSection);
  console.log('Fixed view-broadcast section tags!');
} else {
  console.warn('Could not find oldBroadcastSection');
}

// 2. FIX view-viewer EXTRA </div> TAG
const oldViewerEnd = `              <div class="chat-box">
                <div class="chat-msgs" id="live-chat"></div>
                <div class="chat-bar">
                  <button class="chat-att" onclick="trigUp('live-photo')" title="Foto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
                  <button class="chat-att" onclick="trigUp('live-file')" title="Arquivo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></button>
                  <input type="file" id="live-photo" class="hidden" accept="image/*" onchange="handleFile(this,'live')"/>
                  <input type="file" id="live-file" class="hidden" accept="*/*" onchange="handleFile(this,'live')"/>
                  <input type="text" id="live-in" placeholder="Comentar ou enviar foto&hellip;" onkeydown="if(event.key==='Enter')sendLive()"/>
                  <button class="chat-send" onclick="sendLive()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;

const newViewerEnd = `              <div class="chat-box">
                <div class="chat-msgs" id="live-chat"></div>
                <div class="chat-bar">
                  <button class="chat-att" onclick="trigUp('live-photo')" title="Foto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg></button>
                  <button class="chat-att" onclick="trigUp('live-file')" title="Arquivo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg></button>
                  <input type="file" id="live-photo" class="hidden" accept="image/*" onchange="handleFile(this,'live')"/>
                  <input type="file" id="live-file" class="hidden" accept="*/*" onchange="handleFile(this,'live')"/>
                  <input type="text" id="live-in" placeholder="Comentar ou enviar foto&hellip;" onkeydown="if(event.key==='Enter')sendLive()"/>
                  <button class="chat-send" onclick="sendLive()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
                </div>
              </div>
            </div>
          </div>
      </section>`;

if (html.includes(oldViewerEnd)) {
  html = html.replace(oldViewerEnd, newViewerEnd);
  console.log('Fixed view-viewer extra </div> tag!');
} else {
  console.warn('Could not find oldViewerEnd');
}

// 3. REMOVE EXTRA AVATAR PRESET IMAGES (Keep ONLY the first one)
const oldAvatarShelf = `              <div class="gif-avatars-shelf">
                <div class="gif-av-item" onclick="pickPresetGif(0)" title="Cyber Cat (Animado)"><img src="assets/img1.png" alt="Cat" onerror="this.src='assets/logo.png'"/></div>
                <div class="gif-av-item" onclick="pickPresetGif(1)" title="Retro Game (Animado)"><img src="assets/img2.png" alt="Retro" onerror="this.src='assets/logo.png'"/></div>
                <div class="gif-av-item" onclick="pickPresetGif(2)" title="Zyro Core"><img src="assets/logo.png" alt="Zyro" onerror="this.src='assets/logo.png'"/></div>
                <div class="gif-av-item" onclick="pickPresetGif(3)" title="Showcase Glow"><img src="assets/img_showcase.png" alt="Glow" onerror="this.src='assets/logo.png'"/></div>
              </div>`;

const newAvatarShelf = `              <div class="gif-avatars-shelf">
                <div class="gif-av-item" onclick="pickPresetGif(0)" title="Avatar Zyro"><img src="assets/img1.png" alt="Avatar Zyro" onerror="this.src='assets/logo.png'"/></div>
              </div>`;

if (html.includes(oldAvatarShelf)) {
  html = html.replace(oldAvatarShelf, newAvatarShelf);
  console.log('Kept only first avatar image, removed others!');
}

const oldPresetGifs = `const PRESET_GIFS = [
  'assets/img1.png',
  'assets/img2.png',
  'assets/logo.png',
  'assets/img_showcase.png'
];`;

const newPresetGifs = `const PRESET_GIFS = [
  'assets/img1.png'
];`;

if (html.includes(oldPresetGifs)) {
  html = html.replace(oldPresetGifs, newPresetGifs);
  console.log('Updated PRESET_GIFS array!');
}

// 4. FIX PLACEHOLDER FOR BROADCAST TITLE (no DayZ or CS 2)
const oldTitlePlaceholder = `placeholder="Ex: Gameplay de DayZ, Treino CS 2&hellip;"`;
const newTitlePlaceholder = `placeholder="Ex: Transmissão ao vivo, Conversa com a galera&hellip;"`;
if (html.includes(oldTitlePlaceholder)) {
  html = html.replace(oldTitlePlaceholder, newTitlePlaceholder);
  console.log('Updated broadcast title placeholder!');
}

// 5. FIX RELOAD BUTTON ICON (replace broken polyline with full circular refresh icon)
const oldReloadBtn = `<button class="btn-s" onclick="location.reload()" style="justify-content:center;margin-top:auto;width:100%;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline></svg>
              Recarregar Página
            </button>`;

const newReloadBtn = `<button class="btn-s" onclick="location.reload()" style="justify-content:center;margin-top:auto;width:100%;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path></svg>
              Recarregar Página
            </button>`;

if (html.includes(oldReloadBtn)) {
  html = html.replace(oldReloadBtn, newReloadBtn);
  console.log('Fixed reload button icon!');
}

// 6. FIX "TIRE TUDO DE PRETO DA TELA QUANDO TRANSMITIR"
// Style .video-box so it NEVER looks like a pitch-black dead rectangle.
// Give it a rich ambient gradient, stylish border glow, and clean preview styling.
const videoBoxStyleUpdate = `
/* ── VIDEO BOX: NUNCA TELA PRETA VAZIA ── */
.video-box {
  width: 100%;
  aspect-ratio: 16/9;
  background: radial-gradient(circle at 50% 45%, #0f172a 0%, #060913 100%) !important;
  border: 1px solid rgba(59, 130, 246, 0.3) !important;
  border-radius: var(--r-lg);
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6), 0 0 24px rgba(37, 99, 235, 0.2) !important;
}
.video-box video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: none;
  background: transparent !important;
}
.video-box::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 1;
}
`;

html = html.replace('</style>', videoBoxStyleUpdate + '\n</style>');
console.log('Added videoBoxStyleUpdate to CSS!');

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('All fixes applied to public/index.html!');
