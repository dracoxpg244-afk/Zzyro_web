const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'index.html');
const s = fs.readFileSync(targetPath, 'utf8');

// The first part ends at pos 140557 (right after the new setQ closing bracket)
const cutoff = 140557;
const part1 = s.substring(0, cutoff);

// The tail starts at function togglePass in the second half
const tpIdx = s.indexOf('function togglePass', 279911);
const tail = s.substring(tpIdx);

const cleanHtml = part1 + '\n\n' + tail;
fs.writeFileSync(targetPath, cleanHtml, 'utf8');
console.log('Clean HTML assembled! Size:', cleanHtml.length);
