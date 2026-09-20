const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPath = path.resolve(__dirname, 'showcase_shot.png');

// Capture with a larger viewport height so we see the full showcase card and cards below it
const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--virtual-time-budget=4000',
  `--screenshot=${outPath}`,
  '--window-size=1440,1600',
  'http://localhost:3000'
];

const p = spawn(edge, args);
p.on('close', (code) => {
  console.log('Done with code:', code);
  if (fs.existsSync(outPath)) {
    console.log('showcase_shot size:', fs.statSync(outPath).size);
  }
});
