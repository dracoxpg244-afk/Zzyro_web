const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');

const regex = /<style[^>]*>/gi;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('Found <style> at index', m.index);
  const end = html.indexOf('</style>', m.index);
  console.log('Length of this style block:', end - m.index);
}
