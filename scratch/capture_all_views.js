const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function captureView(viewName, outFileName) {
  const outPath = path.resolve(__dirname, outFileName);
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 3600));

  return new Promise((resolve) => {
    http.get('http://127.0.0.1:9224/json', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', async () => {
        try {
          const list = JSON.parse(data);
          const page = list.find(p => p.type === 'page');
          if (!page) { edgeProc.kill(); return resolve(false); }
          const WebSocket = require('ws');
          const ws = new WebSocket(page.webSocketDebuggerUrl);
          ws.on('open', () => {
            if (viewName !== 'home') {
              ws.send(JSON.stringify({
                id: 1,
                method: 'Runtime.evaluate',
                params: { expression: `switchView('${viewName}');` }
              }));
            } else {
              ws.send(JSON.stringify({
                id: 2,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }
          });
          ws.on('message', (msg) => {
            const resp = JSON.parse(msg);
            if (resp.id === 1) {
              setTimeout(() => {
                ws.send(JSON.stringify({
                  id: 2,
                  method: 'Page.captureScreenshot',
                  params: { format: 'png' }
                }));
              }, 400);
            } else if (resp.id === 2) {
              const buf = Buffer.from(resp.result.data, 'base64');
              fs.writeFileSync(outPath, buf);
              console.log(`Saved ${outFileName}! Size: ${buf.length}`);
              ws.close();
              edgeProc.kill();
              resolve(true);
            }
          });
        } catch (e) {
          edgeProc.kill();
          resolve(false);
        }
      });
    }).on('error', () => { edgeProc.kill(); resolve(false); });
  });
}

async function runAll() {
  await captureView('home', 'view_home_v2.png');
  await captureView('broadcast', 'view_broadcast_v2.png');
  await captureView('settings', 'view_settings_v2.png');
  console.log('All views captured successfully!');
  process.exit(0);
}

runAll();
