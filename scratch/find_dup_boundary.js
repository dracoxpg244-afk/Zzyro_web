const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const badIdx = s.indexOf('}charset="UTF-8"/>');
console.log('Bad idx:', badIdx);

// Look ahead to see where the duplicate block ends
const after = s.substring(badIdx + 1, badIdx + 10000);
console.log('First 400 chars of duplicate block:\n', after.substring(0, 400));

// Let's find where the JS resumes (e.g. function or code that should follow applyOptimalSenderParams)
// Let's see what was after applyOptimalSenderParams originally
