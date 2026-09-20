const fs = require('fs');
const path = require('path');
const targetPath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(targetPath, 'utf8');

// The hero CSS classes are in the big inline script/style block within the script tag
// Let's search for hero-h1 in the script block
const scriptStart = html.indexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');

// Also search between </style> and </head> 
const styleEnd = html.indexOf('</style>');
const headEnd = html.indexOf('</head>');

console.log('style ends at:', styleEnd);
console.log('head ends at:', headEnd);
console.log('Script starts at:', scriptStart);

// Check between styleEnd and scriptStart for any extra styles
const between = html.substring(styleEnd + 8, scriptStart);
console.log('Between style and script:', between.length, 'chars');
console.log(between.substring(0, 500));

// Search for hero-h1 in the main CSS block
const mainCSS = html.substring(738, styleEnd);
const heroH1Idx = mainCSS.indexOf('hero-h1');
console.log('\nhero-h1 in mainCSS:', heroH1Idx);

// Search in script block
const scriptContent = html.substring(scriptStart, scriptEnd);
const heroH1InScript = scriptContent.indexOf('hero-h1');
console.log('hero-h1 in script:', heroH1InScript !== -1);

// The styles must be inline in the large script.
// Let's find .hero-h1 in script
if (heroH1InScript !== -1) {
  console.log(scriptContent.substring(heroH1InScript - 50, heroH1InScript + 500));
}
