const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPath = path.resolve(__dirname, 'broadcast_shot.png');

// We can navigate and then click or evaluate switchView('broadcast')
// In headless Edge, we can pass a URL or execute via console
// Or we can just test http://localhost:3000/#broadcast or similar if handled, or let Edge render
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
    console.log('broadcast_shot size:', fs.statSync(outPath).size);
  }
});
