const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// The hero CSS classes (hero-h1, hero-badge, etc.) are in the LARGE script block (the main script)
// Let's search the big script (370910 onwards) for inline CSS

const scriptStart = html.indexOf('<script>');
const scriptContent = html.substring(scriptStart);

// It must be using document.createElement('style') or document.head.insertAdjacentHTML
const styleInjection = scriptContent.indexOf('hero-h1');
console.log('hero-h1 in script:', styleInjection);

// Try to find a dynamic style tag creation
const createStyle = scriptContent.indexOf('createElement');
console.log('createElement in script:', createStyle);
if (createStyle !== -1) {
  console.log(scriptContent.substring(createStyle, createStyle + 2000));
}

const heroInScript = scriptContent.indexOf('.hero-h1');
console.log('\n.hero-h1 in script:', heroInScript);
