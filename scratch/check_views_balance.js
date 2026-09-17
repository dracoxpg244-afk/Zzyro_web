const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const bStart = html.indexOf('<section class="view" id="view-broadcast">');
const bEnd = html.indexOf('</section>', bStart);
const bHtml = html.substring(bStart, bEnd);

const openDivs = (bHtml.match(/<div\b/g) || []).length;
const closeDivs = (bHtml.match(/<\/div>/g) || []).length;
console.log('view-broadcast: openDivs:', openDivs, 'closeDivs:', closeDivs);

// Check all views:
['view-home', 'view-broadcast', 'view-private', 'view-profile', 'view-settings', 'view-viewer'].forEach(vId => {
  const s = html.indexOf(`id="${vId}"`);
  if (s === -1) { console.log(vId, 'not found'); return; }
  const e = html.indexOf('</section>', s);
  const sub = html.substring(s, e);
  const o = (sub.match(/<div\b/g) || []).length;
  const c = (sub.match(/<\/div>/g) || []).length;
  console.log(vId, 'open:', o, 'close:', c, 'diff (open - close):', o - c);
});
