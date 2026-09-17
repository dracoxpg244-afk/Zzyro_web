const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const contentIdx = html.indexOf('<div class="content">');
console.log('contentIdx at char:', contentIdx);

// Count tags starting from contentIdx
let pos = contentIdx;
let depth = 0;
const tagRegex = /<\/?([a-zA-Z0-9\-]+)[^>]*>/g;
tagRegex.lastIndex = contentIdx;

let m;
while ((m = tagRegex.exec(html)) !== null) {
  const fullTag = m[0];
  const tagName = m[1].toLowerCase();
  const isClosing = fullTag.startsWith('</');
  const isSelfClosing = fullTag.endsWith('/>') || ['img', 'input', 'br', 'hr', 'meta', 'link'].includes(tagName);

  if (isSelfClosing) continue;

  if (isClosing) {
    depth--;
    if (depth === 0) {
      console.log('content closed at index:', m.index, 'line:', html.substring(0, m.index).split('\n').length);
      console.log('surrounding code:\n', html.substring(m.index - 100, m.index + 100));
      break;
    }
  } else {
    depth++;
  }
}
