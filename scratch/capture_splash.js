const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9448',
  '--window-size=1280,800',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9448/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const page = tabs.find(t => t.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.on('open', () => {
        // Wait 1.2s into the splash animation and capture screenshot
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        }, 1200);
      });
      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.id === 1) {
          fs.writeFileSync('scratch/splash_capture.png', Buffer.from(m.result.data, 'base64'));
          console.log('Saved scratch/splash_capture.png');
          ws.close();
          edgeProc.kill();
        }
      });
    });
  }).on('error', () => {
    if (retries > 0) setTimeout(() => connect(retries - 1), 500);
    else edgeProc.kill();
  });
}
setTimeout(connect, 1000);
