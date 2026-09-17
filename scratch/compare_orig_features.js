const fs = require('fs');

const orig = fs.readFileSync('backup_original/backup_original_funcionando/public/index.html', 'utf8');

// Let's inspect sections of orig
console.log('Orig total chars:', orig.length);
console.log('Orig has splash:', orig.includes('id="splash"'));
console.log('Orig has hero-section:', orig.includes('class="hero-section"'));
console.log('Orig has view-home:', orig.includes('id="view-home"'));
console.log('Orig has optimizeSDP:', orig.includes('optimizeSDP'));
console.log('Orig has applyOptimalSenderParams:', orig.includes('applyOptimalSenderParams'));
