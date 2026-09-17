const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const scriptPos = s.indexOf('<script>');
console.log('Script tag starts at:', scriptPos);
console.log('Last 1000 chars before <script>:\n', s.substring(scriptPos - 1000, scriptPos));
