const { execFile } = require('child_process');
const path = require('path');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPath = path.resolve(__dirname, 'splash_shot.png');

const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  `--screenshot=${outPath}`,
  '--window-size=1280,800',
  'http://localhost:3000'
];

execFile(edge, args, (err, stdout, stderr) => {
  console.log('err:', err);
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
  const fs = require('fs');
  console.log('exists:', fs.existsSync(outPath));
  if (fs.existsSync(outPath)) {
    console.log('size:', fs.statSync(outPath).size);
  }
});
