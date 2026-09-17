const fs = require('fs');
const path = require('path');

const targetPath = path.resolve(__dirname, '../public/index.html');
let html = fs.readFileSync(targetPath, 'utf8');

const navStyles = `
/* ── BRAND & NAVIGATION ── */
.brand {
  display: flex;
  align-items: center;
  gap: 11px;
  cursor: pointer;
  user-select: none;
  padding: 4px 6px;
  text-decoration: none;
}
.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  transition: all .3s;
}
.brand:hover .brand-icon { transform: scale(1.05); }
.brand-name {
  font-size: 17px;
  font-weight: 900;
  color: var(--text);
  letter-spacing: -0.4px;
}
.brand-sub {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--text-m);
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;
  flex: 1;
}
.ni {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--r-md);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-s);
  cursor: pointer;
  transition: all .2s;
  user-select: none;
  border: 1px solid transparent;
}
.ni svg {
  width: 18px !important;
  height: 18px !important;
  max-width: 18px !important;
  max-height: 18px !important;
  flex-shrink: 0;
  stroke-width: 2;
  transition: transform .2s;
}
.ni:hover {
  background: var(--bg-hover);
  color: var(--text);
  border-color: var(--border);
}
.ni:hover svg {
  transform: scale(1.12);
}
.ni.active {
  background: rgba(37, 99, 235, 0.14) !important;
  color: #ffffff !important;
  border-color: rgba(37, 99, 235, 0.45) !important;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.3) !important;
}
.ni.active svg {
  stroke: #3b82f6 !important;
}
.sb-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}
.online-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  font-size: 11.5px;
  color: var(--text-s);
}
.odot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
`;

html = html.replace('.main {', navStyles + '\n.main {');

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Restored brand & navigation styles successfully!');
