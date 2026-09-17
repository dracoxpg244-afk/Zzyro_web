const fs = require('fs');
const path = require('path');

const backupPath = path.join('backup_original', 'backup_original_funcionando', 'public', 'index.html');
const backup = fs.readFileSync(backupPath, 'utf8');

const styleStart = backup.indexOf('<style>') + 7;
const styleEnd = backup.indexOf('</style>');
const css = backup.substring(styleStart, styleEnd);

// Extract ALL hero-related CSS from backup and write it to a file
let heroCSS = '';
const lines = css.split('\n');
let insideBlock = false;
let braceDepth = 0;
let heroCSSLines = [];

// Simple approach: extract everything from .hero to end of last hero block
const heroStart = css.indexOf('.hero-badge');
// Find all CSS rules related to hero
// .hero, .hero-badge, .hero-h1, .hero-section, .hero-tag, .hero-sub, .hero-btns, .hero-features, .btn-hero
const heroClasses = ['.hero-badge', '.hero-h1', '.hero-section', '.hero-tag', '.hero-tag svg', '.hero-sub', '.hero-btns', '.btn-hero-primary', '.btn-hero-secondary', '.hero-features', '.hf', '.hero '];
// Extract all matching blocks from CSS
let extractedRules = new Set();

const ruleReg = /([^{]+)\{([^}]*)\}/g;
let m;
while ((m = ruleReg.exec(css)) !== null) {
  const selector = m[1].trim();
  const rule = m[0];
  if (heroClasses.some(h => selector.includes(h) || selector.startsWith(h))) {
    extractedRules.add(rule);
  }
}

console.log('=== EXTRACTED HERO CSS FROM BACKUP ===');
console.log([...extractedRules].join('\n'));
