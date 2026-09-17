const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// The CSS must be embedded inside the HTML between </head> and <script>
// Let's search for the big CSS block in between
// "hero-h1" is at position 327797 in the file. 
// Style block ends at 7207, script starts at 370910
// So it's in the HTML markup between 7216 and 370910

const bodyContent = html.substring(7216, 370910);

// Find hero-h1 in body content
const heroH1 = bodyContent.indexOf('hero-h1');
console.log('hero-h1 in body content:', heroH1);
if (heroH1 !== -1) {
  console.log(bodyContent.substring(heroH1 - 200, heroH1 + 500));
}

// Search for .hero inside any inline style tags
const styleTagReg = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let m;
let styleCount = 0;
while ((m = styleTagReg.exec(html)) !== null) {
  styleCount++;
  if (m[1].includes('hero')) {
    console.log('\nFound hero styles in style block #', styleCount);
    const hIdx = m[1].indexOf('hero');
    console.log(m[1].substring(Math.max(0, hIdx - 100), hIdx + 1000));
  }
}
console.log('Total style blocks:', styleCount);
