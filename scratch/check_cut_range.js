const fs = require('fs');
const s = fs.readFileSync('public/index.html', 'utf8');

const badIdx = s.indexOf('}charset="UTF-8"/>');
const resumeIdx = s.indexOf('let driftTimer = null;');

console.log('badIdx:', badIdx);
console.log('resumeIdx:', resumeIdx);
console.log('Characters to cut:', resumeIdx - (badIdx + 1));
