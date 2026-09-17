const fs = require('fs');
const path = require('path');

// 1. Read build_html.js to get base CSS
const build = fs.readFileSync('C:/Users/everton/.gemini/antigravity-ide/brain/7466f6dd-bf5e-4d2e-9f7f-b11bc8f23f69/scratch/build_html.js', 'utf8');
const buStart = build.indexOf('<style>');
const buEnd = build.indexOf('</style>');
let baseCss = build.substring(buStart + 7, buEnd);

// 2. Convert base CSS to strict black-and-white / dark luxury monochrome
// Replace root variables
baseCss = baseCss.replace(
  /:root\{[\s\S]*?--sw:240px\s*\}/,
  `:root{
  --bg-deep:#050608;--bg-base:#0b0d12;--bg-card:#10131a;--bg-hover:#161922;--bg-elev:#1a1e28;
  --border:rgba(255,255,255,.08);--border-s:rgba(255,255,255,.16);
  --border-b:rgba(255,255,255,.24);--border-r:rgba(255,255,255,.18);--border-g:rgba(255,255,255,.18);
  --text:#ffffff;--text-s:#9da5b4;--text-m:#646b7a;
  --red:#ef4444;--red-g:rgba(239,68,68,.3);
  --blue:#ffffff;--blue-g:rgba(255,255,255,.2);
  --gold:#e2e8f0;--gold-g:rgba(255,255,255,.2);
  --green:#10b981;
  --r-sm:8px;--r-md:14px;--r-lg:22px;--r-full:9999px;
  --sw:240px
}`
);

// Replace blue buttons with clean B&W
baseCss = baseCss.replace(
  /background:linear-gradient\(135deg,#3b82f6,#1d4ed8\);color:#fff;border:1px solid rgba\(255,255,255,\.2\)/g,
  'background:#ffffff;color:#000000;border:1px solid rgba(255,255,255,.3)'
);
baseCss = baseCss.replace(
  /box-shadow:0 6px 28px rgba\(59,130,246,\.45\)/g,
  'box-shadow:0 6px 24px rgba(255,255,255,.15)'
);
baseCss = baseCss.replace(
  /box-shadow:0 10px 36px rgba\(59,130,246,\.65\)/g,
  'box-shadow:0 8px 30px rgba(255,255,255,.25)'
);
baseCss = baseCss.replace(
  /background:linear-gradient\(135deg,#3b82f6,#1d4ed8\);color:#fff;border:1px solid rgba\(255,255,255,\.18\)/g,
  'background:#ffffff;color:#000000;border:1px solid rgba(255,255,255,.3)'
);
baseCss = baseCss.replace(
  /box-shadow:0 4px 18px rgba\(59,130,246,\.38\)/g,
  'box-shadow:0 4px 18px rgba(255,255,255,.12)'
);
baseCss = baseCss.replace(
  /box-shadow:0 7px 26px rgba\(59,130,246,\.6\)/g,
  'box-shadow:0 6px 24px rgba(255,255,255,.2)'
);

// Replace nav active blue gradient with monochrome glass highlight
baseCss = baseCss.replace(
  /\.ni\.active\{background:linear-gradient\(135deg,rgba\(59,130,246,\.2\),rgba\(239,68,68,\.12\)\);color:#fff;border-color:var\(--border-b\);box-shadow:0 4px 18px rgba\(59,130,246,\.2\)\}/g,
  '.ni.active{background:rgba(255,255,255,.08);color:#fff;border-color:rgba(255,255,255,.25);box-shadow:0 4px 18px rgba(0,0,0,.4)}'
);
baseCss = baseCss.replace(/\.ni\.active svg\{stroke:#60a5fa\}/g, '.ni.active svg{stroke:#ffffff}');

// Brand icon: remove blue border and blue glow
baseCss = baseCss.replace(
  /\.brand-icon\{width:44px;height:44px;border-radius:14px;background:linear-gradient\(135deg,#182040,#0b0e1b\);border:1px solid var\(--border-b\);box-shadow:0 0 20px rgba\(59,130,246,\.3\);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;transition:all \.3s\}/g,
  '.brand-icon{width:44px;height:44px;border-radius:14px;background:transparent;border:none !important;box-shadow:none !important;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;transition:all .3s}'
);
baseCss = baseCss.replace(
  /\.brand:hover \.brand-icon\{transform:scale\(1\.05\) rotate\(-3deg\);border-color:var\(--red\);box-shadow:0 0 26px rgba\(239,68,68,\.5\)\}/g,
  '.brand:hover .brand-icon{transform:scale(1.05);}'
);

// Hero h1 grad text: clean white
baseCss = baseCss.replace(
  /\.hero-h1 \.grad\{background:linear-gradient\(90deg,#60a5fa,#f87171,#fbbf24\);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradShift 4s infinite alternate\}/g,
  '.hero-h1 .grad{color:#ffffff;-webkit-text-fill-color:#ffffff;background:none;}'
);

// Remove blue from hero tag
baseCss = baseCss.replace(
  /\.hero-tag\{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1\.5px;color:var\(--blue\);background:rgba\(59,130,246,\.12\);border:1px solid var\(--border-b\);padding:6px 16px;border-radius:var\(--r-full\)\}/g,
  '.hero-tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#ffffff;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.18);padding:6px 16px;border-radius:var(--r-full)}'
);

// Replace old splash CSS inside baseCss with the new img1.png full-screen splash + high quality
const oldSplashPart = baseCss.match(/\/\* ── SPLASH ── \*\/[\s\S]*?\/\* ── APP LAYOUT ── \*\//);
const newSplashCss = `/* ── SPLASH (TELA DE CARREGAMENTO) ── */
#splash {
  position: fixed; inset: 0;
  background: url('/assets/img1.png') center center / cover no-repeat, #030407;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 60px;
  cursor: default;
  transition: opacity .7s ease;
}
#splash.out { opacity: 0; pointer-events: none; }
.splash-progress-wrap {
  width: min(440px, 85vw);
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 14px 20px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}
.splash-prog-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.75);
  font-family: 'JetBrains Mono', monospace;
}
.splash-prog-track {
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  overflow: hidden;
}
.splash-prog-fill {
  height: 100%;
  width: 0%;
  background: #ffffff;
  box-shadow: 0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(255,255,255,0.5);
  border-radius: 10px;
  transition: width 0.28s ease;
}
`;

if (oldSplashPart) {
  baseCss = baseCss.replace(oldSplashPart[0], newSplashCss + '\n/* ── APP LAYOUT ── */');
}

// 3. Add Custom Showcase, Logo, and Host Banner CSS
const additionalStyles = `
/* ── BRAND LOGO IMG ── */
.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(255,255,255,0.25));
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
}

/* ── HERO SHOWCASE ── */
.hero-showcase {
  width: 100%;
  max-width: 960px;
  margin: 36px auto 0;
  display: flex;
  justify-content: center;
}
.showcase-card {
  width: 100%;
  background: #090b10;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
  position: relative;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.showcase-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.95);
}
.showcase-img {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: high-quality;
  filter: contrast(1.06) brightness(1.02);
  transition: transform 0.5s ease;
}
.showcase-card:hover .showcase-img {
  transform: scale(1.02);
}
.showcase-glass-bar {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  background: rgba(7, 9, 14, 0.85);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.sg-left { display: flex; align-items: center; gap: 12px; }
.live-pulse-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 10px #ef4444;
  animation: pulse 2s infinite;
}
.sg-title { font-size: 13.5px; font-weight: 800; color: #ffffff; }
.sg-sub { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 2px; }
.sg-right { display: flex; align-items: center; gap: 10px; }

/* ── HOST CODE BANNER ── */
.host-code-banner {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--r-md);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.hcb-status { display: flex; align-items: center; gap: 10px; }
.hcb-text { font-size: 12.5px; color: var(--text-s); }
.hcb-code { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 800; color: #ffffff; }
.hcb-btn {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 8px 16px;
  border-radius: var(--r-full);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all .2s;
}
.hcb-btn:hover { background: #e0e0e0; }
.btn-gen {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.25);
  color: #ffffff;
  padding: 8px 14px;
  border-radius: var(--r-full);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.btn-gen:hover { background: rgba(255,255,255,0.08); }
`;

const completeCss = baseCss + '\n' + additionalStyles;

// 4. Update index.html style block
let targetHtml = fs.readFileSync('public/index.html', 'utf8');
const curStyleStart = targetHtml.indexOf('<style>');
const curStyleEnd = targetHtml.indexOf('</style>');

if (curStyleStart === -1 || curStyleEnd === -1) {
  console.error('Could not find style tag in index.html');
  process.exit(1);
}

targetHtml = targetHtml.substring(0, curStyleStart + 7) + '\n' + completeCss + '\n' + targetHtml.substring(curStyleEnd);

// Also verify splash div in HTML
const curSplashMatch = targetHtml.match(/<div id="splash"[\s\S]*?<\/div>\s*<\/div>/);
console.log('Current splash in HTML:', curSplashMatch ? curSplashMatch[0] : 'not found');

fs.writeFileSync('public/index.html', targetHtml, 'utf8');
console.log('SUCCESS! Updated public/index.html. New size:', fs.statSync('public/index.html').size);
