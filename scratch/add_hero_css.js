const fs = require('fs');
const path = require('path');

// The backup is an older design with completely different CSS variables (:root variables are different too)
// The current index.html has a newer design with classes like hero-h1, hero-tag, etc.
// These classes are used in the HTML but not defined in the CSS (they were lost when the style block was replaced).
// We need to add proper CSS definitions for them.

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// Add comprehensive hero CSS to the existing <style> block
const heroStyles = `
/* ─── HERO SECTION ─────────────────────────────── */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 56px 24px 28px;
  max-width: 860px;
  margin: 0 auto;
  width: 100%;
}
.hero-tag-wrap { margin-bottom: 20px; }
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 18px;
  border-radius: 9999px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.18);
  font-size: 11.5px;
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}
.hero-tag svg { color: rgba(255,255,255,.7); }
.hero-h1 {
  font-size: clamp(2.4rem, 5.5vw, 4rem);
  font-weight: 900;
  letter-spacing: -2px;
  line-height: 1.08;
  margin-bottom: 20px;
  color: #ffffff;
  text-align: center;
}
.hero-h1 .line1 { display: block; color: #ffffff; }
.hero-sub {
  font-size: 16px;
  color: rgba(255,255,255,.6);
  line-height: 1.65;
  max-width: 560px;
  margin: 0 auto 28px;
}
.hero-btns {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 32px;
}
.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  border-radius: 9999px;
  background: #ffffff;
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all .2s;
  font-family: inherit;
}
.btn-hero-primary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255,255,255,.2);
}
.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  border-radius: 9999px;
  background: transparent;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,.3);
  cursor: pointer;
  transition: all .2s;
  font-family: inherit;
}
.btn-hero-secondary:hover {
  background: rgba(255,255,255,.1);
  border-color: rgba(255,255,255,.6);
  transform: translateY(-2px);
}
.hero-features {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}
.hf {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: rgba(255,255,255,.55);
  font-weight: 600;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.1);
  padding: 6px 14px;
  border-radius: 9999px;
  transition: all .2s;
}
.hf:hover {
  background: rgba(255,255,255,.08);
  color: rgba(255,255,255,.9);
  border-color: rgba(255,255,255,.22);
}
.hf svg { color: rgba(255,255,255,.5); }
/* ─── SCROLL HINT ─── */
.scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
  color: rgba(255,255,255,.3);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  animation: bounce 2s ease infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
`;

// Insert before </style>
html = html.replace('</style>', heroStyles + '\n</style>');

// Also fix the btn-hero styles that are on inline style attributes (remove them since we now have CSS)
html = html.replace(
  / style="background:#ffffff;color:#000000;border:none;"/g,
  ''
);
html = html.replace(
  / style="background:transparent;border:1px solid rgba\(255,255,255,\.3\);color:#ffffff;"/g,
  ''
);
// Fix hero-badge inline styles
html = html.replace(
  / style="border-color:rgba\(255,255,255,\.25\);color:#fff;background:rgba\(255,255,255,\.06\);"/g,
  ''
);

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Hero CSS added! File size:', fs.statSync(targetPath).size);
