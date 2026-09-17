const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9461',
  '--window-size=1400,900',
  'http://localhost:3000'
]);

function connect(retries = 12) {
  http.get('http://127.0.0.1:9461/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const page = tabs.find(t => t.type === 'page');
      if (!page) return setTimeout(() => connect(retries - 1), 400);
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let msgId = 0;

      ws.on('open', () => {
        // Wait for splash then switch to broadcast
        setTimeout(() => {
          msgId++;
          ws.send(JSON.stringify({
            id: msgId,
            method: 'Runtime.evaluate',
            params: {
              expression: `switchView('broadcast');`,
              returnByValue: true
            }
          }));

          // Take screenshot after switching
          setTimeout(() => {
            msgId++;
            ws.send(JSON.stringify({
              id: msgId,
              method: 'Page.captureScreenshot',
              params: { format: 'png', quality: 90 }
            }));
          }, 800);
        }, 3500);
      });

      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.result && m.result.data) {
          const buf = Buffer.from(m.result.data, 'base64');
          fs.writeFileSync('scratch/broadcast_centered.png', buf);
          console.log('Screenshot saved: scratch/broadcast_centered.png');
          ws.close();
          edgeProc.kill();
        }
      });
    });
  }).on('error', () => {
    if (retries > 0) setTimeout(() => connect(retries - 1), 500);
    else { console.log('Edge connect failed'); edgeProc.kill(); }
  });
}
setTimeout(connect, 1000);
