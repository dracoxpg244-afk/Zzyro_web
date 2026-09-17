const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// Change .reveal to be visible by default, with subtle animation
html = html.replace(
  /\.reveal\{opacity:0;transform:translateY\(32px\);transition:opacity \.6s ease,transform \.6s ease\}/g,
  '.reveal{opacity:1;transform:none;transition:opacity .6s ease,transform .6s ease}'
);
html = html.replace(
  /\.reveal-l\{opacity:0;transform:translateX\(-40px\);transition:opacity \.6s ease,transform \.6s ease\}/g,
  '.reveal-l{opacity:1;transform:none;transition:opacity .6s ease,transform .6s ease}'
);
html = html.replace(
  /\.reveal-r\{opacity:0;transform:translateX\(40px\);transition:opacity \.6s ease,transform \.6s ease\}/g,
  '.reveal-r{opacity:1;transform:none;transition:opacity .6s ease,transform .6s ease}'
);

fs.writeFileSync('public/index.html', html, 'utf8');
console.log('Fixed reveal styles to ensure elements are always visible!');
