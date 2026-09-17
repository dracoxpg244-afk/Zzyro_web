const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9450',
  '--window-size=1600,960',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9450/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const page = tabs.find(t => t.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);

      ws.on('open', () => {
        setTimeout(() => {
          // Set light theme and navigate to broadcast view
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `(() => {
                setTheme('light');
                switchView('broadcast');
                return true;
              })()`
            }
          }));
        }, 3400);
      });

      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.id === 1) {
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 700);
        }
        if (m.id === 2) {
          const buf = Buffer.from(m.result.data, 'base64');
          fs.writeFileSync('scratch/broadcast_light_fixed.png', buf);
          fs.copyFileSync('scratch/broadcast_light_fixed.png', 'C:/Users/everton/.gemini/antigravity-ide/brain/ef0ffabd-6fdd-4386-802d-44628a6112b3/broadcast_light_fixed.png');
          console.log('Saved broadcast_light_fixed.png');

          // Now capture Home view in light theme
          ws.send(JSON.stringify({
            id: 3,
            method: 'Runtime.evaluate',
            params: { expression: "switchView('home');" }
          }));
        }
        if (m.id === 3) {
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 4,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 700);
        }
        if (m.id === 4) {
          const buf = Buffer.from(m.result.data, 'base64');
          fs.writeFileSync('scratch/home_light_fixed.png', buf);
          fs.copyFileSync('scratch/home_light_fixed.png', 'C:/Users/everton/.gemini/antigravity-ide/brain/ef0ffabd-6fdd-4386-802d-44628a6112b3/home_light_fixed.png');
          console.log('Saved home_light_fixed.png');

          ws.close();
          edgeProc.kill();
        }
      });
    });
  }).on('error', () => {
    if (retries > 0) setTimeout(() => connect(retries - 1), 600);
    else edgeProc.kill();
  });
}
setTimeout(connect, 1000);
