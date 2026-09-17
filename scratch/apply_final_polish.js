const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. FIX view-viewer EXTRA </div> TAG
const oldViewerStrip = `            <!-- Strip de participantes do viewer -->
            <div class="discord-voice-strip" id="viewer-voice-strip" style="display:none;"></div>

            </div>
          <div class="sf-panel">`;

const newViewerStrip = `            <!-- Strip de participantes do viewer -->
            <div class="discord-voice-strip" id="viewer-voice-strip" style="display:none;"></div>
          </div>
          <div class="sf-panel">`;

if (html.includes(oldViewerStrip)) {
  html = html.replace(oldViewerStrip, newViewerStrip);
  console.log('Fixed extra </div> in view-viewer!');
} else {
  console.warn('Could not find exact oldViewerStrip');
}

// 2. REPLACE TOAST CSS (Moving to bottom-right, glassmorphism, glowing accents, progress bar)
const oldToastCss = `/* ── NOTIFICAÇÕES (TOASTS) MODERNAS ── */
.toasts {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 99999;
  pointer-events: none;
}
.toast {
  pointer-events: auto;
  min-width: 280px;
  max-width: 380px;
  background: rgba(14, 18, 26, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--r-md);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65);
  animation: toastIn .3s cubic-bezier(0.16, 1, 0.3, 1);
  transition: all .25s ease;
  position: relative;
  overflow: hidden;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(-12px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.toast.ok { border-left: 4px solid #10b981; }
.toast.inf { border-left: 4px solid #3b82f6; }
.toast.err { border-left: 4px solid #ef4444; }
.toast-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast.ok .toast-icon { color: #10b981; }
.toast.inf .toast-icon { color: #3b82f6; }
.toast.err .toast-icon { color: #ef4444; }
.toast-msg { flex: 1; line-height: 1.4; }`;

const newToastCss = `/* ── NOTIFICAÇÕES (TOASTS) ULTRA-PREMIUM DISCRETAS (BOTTOM-RIGHT) ── */
.toasts {
  position: fixed;
  bottom: 26px;
  right: 26px;
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  z-index: 999999;
  pointer-events: none;
  max-width: calc(100vw - 40px);
}
.toast {
  pointer-events: auto;
  min-width: 270px;
  max-width: 420px;
  background: rgba(11, 15, 25, 0.92);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 11px 14px 13px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #f8fafc;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.15);
  animation: toastSlideUp .3s cubic-bezier(0.16, 1, 0.3, 1);
  transition: all .25s ease;
  position: relative;
  overflow: hidden;
  user-select: none;
}
@keyframes toastSlideUp {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.toast.out {
  opacity: 0 !important;
  transform: translateY(12px) scale(0.92) !important;
  transition: all .22s ease !important;
}

/* Toast Badges & Icons */
.toast-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.toast.ok {
  border-left: 3px solid #10b981;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 18px rgba(16, 185, 129, 0.15);
}
.toast.ok .toast-icon-wrap {
  background: rgba(16, 185, 129, 0.16);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.toast.inf {
  border-left: 3px solid #38bdf8;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 18px rgba(56, 189, 248, 0.15);
}
.toast.inf .toast-icon-wrap {
  background: rgba(56, 189, 248, 0.16);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.toast.err {
  border-left: 3px solid #f43f5e;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 18px rgba(244, 63, 94, 0.15);
}
.toast.err .toast-icon-wrap {
  background: rgba(244, 63, 94, 0.16);
  color: #f43f5e;
  border: 1px solid rgba(244, 63, 94, 0.3);
}

.toast.warn {
  border-left: 3px solid #f59e0b;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 18px rgba(245, 158, 11, 0.15);
}
.toast.warn .toast-icon-wrap {
  background: rgba(245, 158, 11, 0.16);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.toast-msg {
  flex: 1;
  line-height: 1.45;
  word-break: break-word;
  font-size: 13px;
  color: #f1f5f9;
}

/* Botão fechar toast */
.toast-close-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  transition: all .15s;
  flex-shrink: 0;
}
.toast-close-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
}

/* Barra de progresso do tempo do toast */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: currentColor;
  opacity: 0.6;
  width: 100%;
  transform-origin: left;
  animation: toastProg linear forwards;
}
@keyframes toastProg {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* Light theme support */
body.theme-light .toast {
  background: #ffffff !important;
  border-color: #e2e8f0 !important;
  color: #0f172a !important;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1) !important;
}
body.theme-light .toast-msg {
  color: #1e293b !important;
}
body.theme-light .toast-close-btn {
  color: #94a3b8 !important;
}
body.theme-light .toast-close-btn:hover {
  color: #0f172a !important;
  background: #f1f5f9 !important;
}`;

if (html.includes(oldToastCss)) {
  html = html.replace(oldToastCss, newToastCss);
  console.log('Replaced Toast CSS with bottom-right luxury design!');
} else {
  console.warn('Could not find exact oldToastCss');
}

// 3. REPLACE toast() JAVASCRIPT FUNCTION (Dynamic duration, pause on hover, icons, progress bar)
const oldToastJs = `function toast(msg, type='inf'){
  const r = document.getElementById('toasts');
  if(!r) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  
  let iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  if(type === 'ok') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if(type === 'err') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  }

  t.innerHTML = \`<div class="toast-icon">\${iconSvg}</div><div class="toast-msg">\${msg}</div>\`;
  r.appendChild(t);

  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(-10px) scale(0.95)';
    setTimeout(() => t.remove(), 250);
  }, 3200);
}`;

const newToastJs = `function toast(msg, type='inf'){
  const r = document.getElementById('toasts');
  if(!r) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type;

  // Duração dinâmica conforme solicitado: mensagens curtas somem mais rápido, mensagens longas duram o tempo necessário para ler
  const plain = msg.replace(/<[^>]*>/g, '');
  const duration = Math.max(1800, Math.min(6000, 1300 + plain.length * 45));

  let iconSvg = '';
  if (type === 'ok') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  } else if (type === 'err') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
  } else if (type === 'warn') {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
  } else {
    iconSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }

  t.innerHTML = \`
    <div class="toast-icon-wrap">\${iconSvg}</div>
    <div class="toast-msg">\${msg}</div>
    <button type="button" class="toast-close-btn" title="Fechar" onclick="this.parentElement.remove()">&times;</button>
    <div class="toast-progress" style="animation-duration: \${duration}ms;"></div>
  \`;
  r.appendChild(t);

  let timer = setTimeout(dismiss, duration);
  function dismiss() {
    t.classList.add('out');
    setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 220);
  }

  t.addEventListener('mouseenter', () => clearTimeout(timer));
  t.addEventListener('mouseleave', () => timer = setTimeout(dismiss, 1200));
}`;

if (html.includes(oldToastJs)) {
  html = html.replace(oldToastJs, newToastJs);
  console.log('Replaced toast() JS with dynamic duration & progress bar!');
} else {
  console.warn('Could not find exact oldToastJs');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('public/index.html updated successfully with final polish!');
