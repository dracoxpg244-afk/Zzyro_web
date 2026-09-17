const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// The CSS for hero-h1, hero-tag, etc. must be in the original big minified CSS
// Let's check what's at the very start of the <style> block (it's minified)
const styleStart = html.indexOf('<style>') + 7;
const styleEnd = html.indexOf('</style>');
const css = html.substring(styleStart, styleEnd);

// Search for hero
const heroInCss = css.indexOf('hero');
console.log('hero in CSS:', heroInCss !== -1 ? 'YES at ' + heroInCss : 'NO');
// print first 100 chars of css
console.log('CSS starts with:', css.substring(0, 200));
console.log('\nCSS length:', css.length);

// Check full css for any hero mentions
const allHero = [];
let idx = css.indexOf('hero');
while (idx !== -1) {
  allHero.push(idx);
  idx = css.indexOf('hero', idx + 1);
}
console.log('All hero indices in CSS:', allHero);

// Ah wait, the single <style> tag has 5808 chars. But original file was large.
// The hero css must have been in the original large style block that was replaced.
// Let's check if there is still more CSS at line level  
// Let's look at the raw file around the big base64 logo area
const b64Idx = html.indexOf('data:image/png;base64,');
console.log('\nb64 start:', b64Idx);
// Where did the original big style block end?
// The original <style> ends at 7207. But b64 is at ~7216 + some chars.
// We need to figure out where the big original CSS was.
// Let's look at what the actual style element contains fully.
const fullStyle = css;
console.log('\nFull style (last 500 chars of style):');
console.log(fullStyle.substring(fullStyle.length - 500));
