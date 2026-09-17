// ── TASK: Apply all contrast fixes and cleanup to index.html ──
const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');
const origLen = html.length;

let fixes = 0;

// ── FIX 1: .toggle-name color: #fff → color: var(--text) ──
if (html.includes('.toggle-name{font-size:12.5px;font-weight:700;color:#fff}')) {
  html = html.replace(
    '.toggle-name{font-size:12.5px;font-weight:700;color:#fff}',
    '.toggle-name{font-size:12.5px;font-weight:700;color:var(--text)}'
  );
  fixes++; console.log('✓ Fix 1: .toggle-name color: #fff → var(--text)');
} else {
  console.warn('⚠ Fix 1: .toggle-name pattern not found, trying alternate...');
  // try alternate spacing
  html = html.replace(
    /\.toggle-name\s*\{([^}]*?)color\s*:\s*#fff([^}]*?)\}/,
    (m, pre, post) => `.toggle-name{${pre}color:var(--text)${post}}`
  );
  fixes++;
}

// ── FIX 2: .evt-title color: #fff → color: var(--text) ──
if (html.includes('.evt-title{font-size:15px;font-weight:800;color:#fff}')) {
  html = html.replace(
    '.evt-title{font-size:15px;font-weight:800;color:#fff}',
    '.evt-title{font-size:15px;font-weight:800;color:var(--text)}'
  );
  fixes++; console.log('✓ Fix 2: .evt-title color: #fff → var(--text)');
} else {
  console.warn('⚠ Fix 2: .evt-title pattern not found, trying regex...');
  html = html.replace(
    /\.evt-title\{([^}]*?)color\s*:\s*#fff([^}]*?)\}/,
    (m, pre, post) => `.evt-title{${pre}color:var(--text)${post}}`
  );
  fixes++;
}

// ── FIX 3: .modal-title color: #fff → color: var(--text) ──
if (html.includes('.modal-title{font-size:17px;font-weight:800;color:#fff}')) {
  html = html.replace(
    '.modal-title{font-size:17px;font-weight:800;color:#fff}',
    '.modal-title{font-size:17px;font-weight:800;color:var(--text)}'
  );
  fixes++; console.log('✓ Fix 3: .modal-title color: #fff → var(--text)');
} else {
  console.warn('⚠ Fix 3: .modal-title pattern not found, trying regex...');
  html = html.replace(
    /\.modal-title\{([^}]*?)color\s*:\s*#fff([^}]*?)\}/,
    (m, pre, post) => `.modal-title{${pre}color:var(--text)${post}}`
  );
  fixes++;
}

// ── FIX 4: select.form-in option color: #fff → var(--text) ──
html = html.replace(
  /select\.form-in option\{background:var\(--bg-base\);color:#fff\}/,
  'select.form-in option{background:var(--bg-base);color:var(--text)}'
);
fixes++; console.log('✓ Fix 4: select.form-in option color: #fff → var(--text)');

// ── FIX 5: Inline h1 color:#fff for "Salas Privadas" ──
html = html.replace(
  '<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">Salas Privadas com Senha</h1>',
  '<h1 class="view-h1">Salas Privadas com Senha</h1>'
);
fixes++; console.log('✓ Fix 5: Salas Privadas h1 inline color removed');

// ── FIX 6: Inline h1 color:#fff for "Meu Perfil" ──
html = html.replace(
  '<h1 style="font-size:22px;font-weight:900;color:#fff;margin-bottom:4px;">Meu Perfil &amp; Personalização</h1>',
  '<h1 class="view-h1">Meu Perfil &amp; Personalização</h1>'
);
fixes++; console.log('✓ Fix 6: Meu Perfil h1 inline color removed');

// ── FIX 7: Remove duplicate .toasts block (the minimal one after the premium one) ──
// The duplicate minimal toast CSS at line ~1052-1057
const dupToastPattern = '\n.toasts{position:fixed;bottom:24px;right:24px;display:flex;flex-direction:column;gap:10px;z-index:9999;pointer-events:none}\n.toast{background:var(--bg-elev);border:1px solid var(--border-s);color:#fff;padding:12px 18px;border-radius:var(--r-md);font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:0 8px 30px rgba(0,0,0,.7);pointer-events:auto;animation:tSlide .3s ease}\n@keyframes tSlide{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}\n.toast.ok{border-left:4px solid var(--green)}\n.toast.err{border-left:4px solid var(--red)}\n.toast.inf{border-left:4px solid var(--blue)}';

if (html.includes(dupToastPattern)) {
  html = html.replace(dupToastPattern, '');
  fixes++; console.log('✓ Fix 7: Removed duplicate .toasts/.toast CSS block');
} else {
  console.warn('⚠ Fix 7: Duplicate toast pattern not found exactly, trying partial...');
  // Remove the bottom:24px toasts (duplicate, the top:24px one is better)
  html = html.replace(
    /\.toasts\{position:fixed;bottom:24px;[^}]+\}\n\.toast\{background:var\(--bg-elev\)[^}]+\}\n@keyframes tSlide\{[^}]+\}\n\.toast\.ok\{[^}]+\}\n\.toast\.err\{[^}]+\}\n\.toast\.inf\{[^}]+\}/,
    ''
  );
  fixes++; console.log('✓ Fix 7: Removed duplicate .toasts/.toast CSS block (regex)');
}

// ── FIX 8: Add missing light theme overrides for new fixes ──
const lightThemeExtra = `
/* ── LIGHT THEME: Contraste para toggle-name, evt-title, modal-title ── */
body.theme-light .toggle-name {
  color: #0f172a !important;
}
body.theme-light .evt-title {
  color: #0f172a !important;
}
body.theme-light .modal-title {
  color: #0f172a !important;
}
body.theme-light .modal-x {
  color: #64748b !important;
}
body.theme-light .modal-x:hover {
  color: #0f172a !important;
}
body.theme-light select.form-in option {
  background: #ffffff !important;
  color: #0f172a !important;
}
body.theme-light .qp {
  color: #475569 !important;
}
body.theme-light .qp:hover {
  color: #0f172a !important;
}
`;

// Insert after existing body.theme-light .sw-btn:hover block
if (html.includes('body.theme-light .sw-btn:hover {')) {
  html = html.replace(
    'body.theme-light .sw-btn:hover {\n  background: #2563eb !important;\n  color: #ffffff !important;\n  border-color: #2563eb !important;\n}',
    'body.theme-light .sw-btn:hover {\n  background: #2563eb !important;\n  color: #ffffff !important;\n  border-color: #2563eb !important;\n}' + lightThemeExtra
  );
  fixes++; console.log('✓ Fix 8: Added light theme overrides for toggle-name/evt-title/modal-title');
} else {
  // Fallback: insert before first </style>
  html = html.replace('</style>', lightThemeExtra + '\n</style>');
  fixes++; console.log('✓ Fix 8: Added light theme overrides (fallback position)');
}

// ── FIX 9: Update .toasts position to top:24px (already correct in premium block) ──
// Make sure premium toast CSS takes precedence - move it after the duplicate removal

// Verify final state
console.log(`\n✅ Applied ${fixes} fixes.`);
console.log(`   Before: ${origLen} bytes`);
console.log(`   After:  ${html.length} bytes`);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('   Saved public/index.html');
