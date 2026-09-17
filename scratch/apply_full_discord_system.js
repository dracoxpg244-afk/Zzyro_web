// Script to implement Discord Call System, Sound Effects, Random Player Names, Animated GIFs, and Security in public/index.html
const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// ── 1. CSS for Discord Call System, Speaking Glow, Mute badges, and GIF Avatars ──
const discordStyles = `
/* ══════════════════════════════════════════════════════════════════════════════
   DISCORD-STYLE VOICE CALL STAGE & CONTROLS
   ══════════════════════════════════════════════════════════════════════════════ */
.discord-voice-stage {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 380px;
  background: radial-gradient(circle at 50% 30%, rgba(30, 41, 59, 0.45), rgba(6, 9, 19, 0.95));
  border-radius: var(--r-md);
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border);
}
body.theme-light .discord-voice-stage {
  background: radial-gradient(circle at 50% 30%, #f1f5f9, #ffffff);
  border-color: #cbd5e1;
}

.dvs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.dvs-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dvs-live-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #23a55a;
  box-shadow: 0 0 10px #23a55a;
  animation: discordPulse 1.5s infinite alternate;
}
.dvs-title {
  font-size: 15px;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.3px;
}
.dvs-voice-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: var(--r-full);
  background: rgba(35, 165, 90, 0.15);
  color: #23a55a;
  border: 1px solid rgba(35, 165, 90, 0.3);
  display: flex;
  align-items: center;
  gap: 5px;
}
.dvs-voice-badge.locked {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}
.dvs-count {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-s);
  background: var(--bg-card);
  padding: 4px 10px;
  border-radius: var(--r-full);
  border: 1px solid var(--border);
}

/* Grid de Participantes (Estilo Discord Voice Channel) */
.discord-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 16px;
  align-content: center;
  justify-items: center;
  flex: 1;
  padding: 10px 0;
  width: 100%;
}

/* Card Individual de Participante */
.d-user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.65);
  border: 1.5px solid var(--border);
  border-radius: var(--r-md);
  padding: 20px 14px;
  width: 100%;
  max-width: 220px;
  box-sizing: border-box;
  position: relative;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}
body.theme-light .d-user-card {
  background: #ffffff;
  border-color: #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.d-user-card:hover {
  transform: translateY(-2px);
  border-color: var(--border-s);
}

/* Avatar com Glow de Fala estilo Discord (#23a55a) */
.d-avatar-box {
  position: relative;
  width: 76px;
  height: 76px;
  margin-bottom: 12px;
}
.d-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--blue);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  user-select: none;
}
.d-user-card.speaking .d-avatar {
  border-color: #23a55a !important;
  box-shadow: 0 0 0 4px #23a55a, 0 0 20px rgba(35, 165, 90, 0.65);
  animation: discordSpeakingGlow 0.9s infinite alternate;
}
@keyframes discordSpeakingGlow {
  0% { box-shadow: 0 0 0 3px #23a55a, 0 0 10px rgba(35, 165, 90, 0.4); }
  100% { box-shadow: 0 0 0 5px #23a55a, 0 0 24px rgba(35, 165, 90, 0.85); }
}

/* Badge de Mutado no Avatar */
.d-mute-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--bg-deep);
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}
.d-mute-badge svg {
  width: 13px;
  height: 13px;
}

/* Indicador de Fala Animado (Wave GIF/CSS) */
.d-speaking-wave {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #23a55a;
  color: #fff;
  border-radius: var(--r-full);
  padding: 2px 6px;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 3px;
  border: 1.5px solid var(--bg-deep);
  box-shadow: 0 2px 6px rgba(35, 165, 90, 0.5);
}
.d-speaking-wave span {
  display: inline-block;
  width: 2px;
  height: 8px;
  background: #fff;
  border-radius: 1px;
  animation: waveBar 0.5s ease-in-out infinite alternate;
}
.d-speaking-wave span:nth-child(2) { animation-delay: 0.15s; height: 11px; }
.d-speaking-wave span:nth-child(3) { animation-delay: 0.3s; height: 7px; }
@keyframes waveBar {
  0% { transform: scaleY(0.4); }
  100% { transform: scaleY(1.2); }
}

/* Nome e Tags */
.d-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  width: 100%;
}
.d-name {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}
body.theme-light .d-name {
  color: #0f172a;
}
.d-badges-row {
  display: flex;
  align-items: center;
  gap: 5px;
}
.d-role-tag {
  font-size: 9.5px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 4px;
}
.d-role-tag.dono {
  background: rgba(245, 158, 11, 0.18);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.35);
}
.d-role-tag.membro {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.28);
}
.d-status-text {
  font-size: 11px;
  font-weight: 600;
  margin-top: 5px;
  color: var(--text-m);
}
.d-user-card.speaking .d-status-text {
  color: #23a55a;
  font-weight: 700;
}
.d-user-card.muted .d-status-text {
  color: #ef4444;
}

/* Strip Compacto de Voz (quando a tela estiver compartilhada) */
.discord-voice-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  margin-top: 10px;
  overflow-x: auto;
  width: 100%;
  box-sizing: border-box;
}
.dvs-mini-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: var(--r-full);
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.dvs-mini-card.speaking {
  border-color: #23a55a;
  background: rgba(35, 165, 90, 0.1);
  box-shadow: 0 0 10px rgba(35, 165, 90, 0.3);
}
.dvs-mini-av {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: var(--blue);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.dvs-mini-card.speaking .dvs-mini-av {
  box-shadow: 0 0 0 2px #23a55a;
}
.dvs-mini-name {
  font-size: 12px;
  font-weight: 700;
  color: var(--text);
}
body.theme-light .dvs-mini-name {
  color: #0f172a;
}

/* Barra de Controles Inferior Estilo Discord */
.discord-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #090d16;
  border: 1px solid var(--border-b);
  border-radius: var(--r-md);
  padding: 12px 16px;
  margin-top: 14px;
  gap: 12px;
  flex-wrap: wrap;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}
body.theme-light .discord-bar {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.db-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.db-my-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-color: var(--blue);
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #fff;
  font-size: 14px;
  border: 2px solid var(--border);
}
.db-my-avatar.speaking {
  border-color: #23a55a;
  box-shadow: 0 0 0 2px #23a55a;
}
.db-meta {
  display: flex;
  flex-direction: column;
}
.db-my-name {
  font-size: 13px;
  font-weight: 800;
  color: var(--text);
}
body.theme-light .db-my-name {
  color: #0f172a;
}
.db-my-status {
  font-size: 11px;
  color: #23a55a;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}

.db-center {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.db-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 14px;
  border-radius: var(--r-full);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  user-select: none;
}
body.theme-light .db-btn {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #0f172a;
}
.db-btn:hover {
  background: var(--bg-hover);
  border-color: var(--blue);
  transform: translateY(-1px);
}
.db-btn.active {
  background: var(--blue);
  color: #fff !important;
  border-color: var(--blue);
  box-shadow: 0 0 12px var(--blue-g);
}
.db-btn.muted {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444 !important;
  border-color: rgba(239, 68, 68, 0.4);
}
.db-btn.screen-active {
  background: #10b981;
  color: #fff !important;
  border-color: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}
.db-btn.danger {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.35);
}
.db-btn.danger:hover {
  background: #ef4444;
  color: #fff !important;
}

/* Presets de Avatares Animados (GIF) */
.gif-avatars-shelf {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
  gap: 12px;
  margin-top: 10px;
}
.gif-av-item {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--border);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  background: #0f172a;
}
.gif-av-item:hover {
  transform: scale(1.08);
  border-color: var(--blue);
  box-shadow: 0 0 14px var(--blue-g);
}
.gif-av-item.active {
  border-color: #23a55a;
  box-shadow: 0 0 0 3px #23a55a;
}
.gif-av-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
`;

// Inserir os estilos no <head> antes de </style>
if (!html.includes('DISCORD-STYLE VOICE CALL STAGE & CONTROLS')) {
  html = html.replace('</style>', discordStyles + '\n</style>');
  console.log('[+] Discord call styles inserted into <head>');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('[OK] CSS updated in public/index.html');
