const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + path.resolve(__dirname, '../public/index.html').replace(/\\/g, '/');

async function testFullyDismissed() {
  const outPath = path.resolve(__dirname, 'after_splash_dismissed.png');
  const outPathLight = path.resolve(__dirname, 'after_splash_light.png');

  // Spawn and wait 4.8s (splash finishes at ~3.6s and removes itself)
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9388',
    '--window-size=1600,920',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 4800));

  http.get('http://127.0.0.1:9388/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(data);
        const page = list.find(p => p.type === 'page');
        if (!page) { edgeProc.kill(); return; }
        const WebSocket = require('ws');
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        ws.on('open', () => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Page.captureScreenshot',
            params: { format: 'png' }
          }));
        });
        ws.on('message', (msg) => {
          const resp = JSON.parse(msg);
          if (resp.id === 1) {
            const buf = Buffer.from(resp.result.data, 'base64');
            fs.writeFileSync(outPath, buf);
            console.log('Saved after_splash_dismissed.png!');

            // Now test light theme
            ws.send(JSON.stringify({
              id: 2,
              method: 'Runtime.evaluate',
              params: { expression: "setTheme('light');" }
            }));
          } else if (resp.id === 2) {
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 3,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 300);
          } else if (resp.id === 3) {
            const buf = Buffer.from(resp.result.data, 'base64');
            fs.writeFileSync(outPathLight, buf);
            console.log('Saved after_splash_light.png!');
            ws.close();
            edgeProc.kill();
            process.exit(0);
          }
        });
      } catch (e) {
        console.error(e);
        edgeProc.kill();
        process.exit(1);
      }
    });
  });
}

testFullyDismissed();
