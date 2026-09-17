const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

console.log('Total characters:', s.length);
console.log('Has logo in assets:', fs.existsSync('public/assets/logo.png'));
console.log('Logo size in assets:', fs.existsSync('public/assets/logo.png') ? fs.statSync('public/assets/logo.png').size : 0);

// Let's check the views in index.html
const views = ['view-home', 'view-broadcast', 'view-private', 'view-events', 'view-profile', 'view-settings', 'view-viewer'];
views.forEach(v => {
  const pos = s.indexOf(`id="${v}"`);
  console.log(`View ${v}: pos = ${pos}`);
});
