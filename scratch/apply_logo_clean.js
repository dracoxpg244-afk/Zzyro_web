const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Replace brand HTML in sidebar
const oldBrandHtml = `    <div class="brand" onclick="switchView('home')" title="Zyro Live Stream">
      <div class="brand-badge-z">
        <img src="assets/icon_z.png" alt="Zyro" class="brand-icon-img"/>
      </div>
      <div>
        <div class="brand-name">Zyro</div>
        <div class="brand-sub">Live Stream</div>
      </div>
    </div>`;

const newBrandHtml = `    <div class="brand" onclick="switchView('home')" title="Zyro Live Stream">
      <img src="assets/logo_cropped.png" alt="Zyro" class="brand-logo-zyro"/>
    </div>`;

if (html.includes(oldBrandHtml)) {
  html = html.replace(oldBrandHtml, newBrandHtml);
  console.log('Replaced brand HTML with clean Zyro logo');
} else {
  console.log('Searching pattern for brand HTML...');
  html = html.replace(/<div class="brand" onclick="switchView\('home'\)"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/m, newBrandHtml);
}

// 2. Update splash logo to also use logo_cropped.png
html = html.replace('src="assets/logo.png" alt="Zyro Logo" class="splash-flying-logo"', 'src="assets/logo_cropped.png" alt="Zyro Logo" class="splash-flying-logo"');

// 3. Update CSS for .brand-logo-zyro and remove .brand-badge-z
const oldBrandCss = `/* ── BRAND BADGE Z ELEGANTE ── */
.brand-badge-z {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 14px rgba(37, 99, 235, 0.4);
  flex-shrink: 0;
  overflow: hidden;
  transition: all .25s ease;
}
.brand-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}
.brand:hover .brand-badge-z {
  transform: scale(1.08) rotate(-2deg);
  box-shadow: 0 0 22px rgba(59, 130, 246, 0.7);
}`;

const newBrandCss = `/* ── LOGO OFICIAL ZYRO NA SIDEBAR (SEM BORDA / 100% CLEAN) ── */
.brand {
  display: flex;
  align-items: center;
  padding: 8px 10px 22px;
  cursor: pointer;
  user-select: none;
  border: none !important;
  outline: none !important;
  background: transparent !important;
}
.brand-logo-zyro {
  height: 32px;
  width: auto;
  max-width: 155px;
  object-fit: contain;
  display: block;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.3));
  transition: transform .25s cubic-bezier(0.16, 1, 0.3, 1), filter .25s ease;
}
.brand:hover .brand-logo-zyro {
  transform: scale(1.05);
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.85)) drop-shadow(0 0 4px #ffffff);
}
body.theme-light .brand-logo-zyro {
  filter: invert(1) brightness(0.15) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.12));
}
body.theme-light .brand:hover .brand-logo-zyro {
  filter: invert(1) brightness(0.05) drop-shadow(0 4px 14px rgba(37, 99, 235, 0.45));
}`;

if (html.includes(oldBrandCss)) {
  html = html.replace(oldBrandCss, newBrandCss);
  console.log('Replaced brand CSS with brand-logo-zyro CSS');
} else {
  console.warn('Could not match oldBrandCss directly');
}

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Updated public/index.html successfully!');
