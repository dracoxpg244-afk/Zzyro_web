const fs = require('fs');

const html = fs.readFileSync('public/index.html', 'utf8');

console.log('HTML size:', html.length);
console.log('Head tag starts at:', html.indexOf('<head>'));
console.log('Head tag ends at:', html.indexOf('</head>'));
console.log('Body tag starts at:', html.indexOf('<body'));
console.log('Script tag starts at:', html.indexOf('<script>'));
console.log('Script tag ends at:', html.lastIndexOf('</script>'));

// Let's verify what views exist
const viewMatches = html.match(/id="view-[^"]+"/g);
console.log('Views found:', viewMatches);

// Let's verify what modals exist
const modalMatches = html.match(/class="modal[^"]*"/g);
console.log('Modals found:', modalMatches);
