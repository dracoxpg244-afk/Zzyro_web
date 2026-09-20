const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPath = path.resolve(__dirname, 'main_shot.png');

// We can open page with remote debugging or evaluate script
// Or we can just set #splash display:none via a small query param or test page
// Or Edge can take screenshot after virtual time!
// --virtual-time-budget=3500 advances time by 3.5 seconds!
const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--virtual-time-budget=4000',
  `--screenshot=${outPath}`,
  '--window-size=1440,900',
  'http://localhost:3000'
];

const p = spawn(edge, args);
p.on('close', (code) => {
  console.log('Done with code:', code);
  if (fs.existsSync(outPath)) {
    console.log('main_shot size:', fs.statSync(outPath).size);
  } else {
    console.log('File not created');
  }
});
