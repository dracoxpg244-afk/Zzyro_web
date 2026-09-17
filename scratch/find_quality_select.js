const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const pos = s.indexOf('id="h-quality"');
if (pos !== -1) {
  console.log(s.substring(pos - 100, pos + 500));
} else {
  console.log('h-quality not found directly');
  // let's search for quality select
  const m = s.match(/<select[^>]*quality[^>]*>[\s\S]*?<\/select>/i);
  console.log('Select match:', m ? m[0] : 'none');
}
