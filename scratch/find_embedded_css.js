const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// Find the big inline style block that contains hero-h1, hero-tag, etc.
// It's clearly NOT in the <style> in <head>. It's somewhere else -- embedded CSS in script or inline.
// Let me search within the body HTML more specifically
// Look for any embedded <style> between </head> and <script>
const bodyStart = html.indexOf('<body>');
const scriptStart = html.indexOf('<script>');
const bodyHTML = html.substring(bodyStart, scriptStart);

const styleTagReg = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let m;
while ((m = styleTagReg.exec(bodyHTML)) !== null) {
  console.log('Found style in body, length:', m[1].length);
  const hIdx = m[1].indexOf('hero');
  console.log('hero at:', hIdx);
  if (hIdx !== -1) {
    console.log(m[1].substring(0, 500));
  }
}

// Maybe the hero CSS is just not defined at all -- it relies on external file?
// Let's grep for hero-h1 in any .css file
if (fs.existsSync('public/style.css')) {
  console.log('style.css exists!');
} else {
  console.log('No style.css found');
}

// Check if there's more CSS style blocks
const allStyleMatches = [...html.matchAll(/<style[^>]*>/g)];
console.log('\nAll <style> openings at indices:', allStyleMatches.map(m => m.index));

// Now let me check if hero CSS is written dynamically in JS
const js = html.substring(scriptStart);
const heroTagIdx = js.indexOf('hero-tag');
console.log('\nhero-tag in JS:', heroTagIdx);
if (heroTagIdx !== -1) {
  console.log(js.substring(heroTagIdx - 200, heroTagIdx + 500));
}
