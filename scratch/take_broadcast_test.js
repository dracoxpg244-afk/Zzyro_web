const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPath = path.resolve(__dirname, 'broadcast_hud_shot_updated.png');

async function testBroadcastView() {
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  await new Promise(r => setTimeout(r, 3500));

  http.get('http://127.0.0.1:9223/json', (res) => {
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
            method: 'Runtime.evaluate',
            params: { expression: "switchView('broadcast');" }
          }));
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
            }, 600);
          } else if (resp.id === 2) {
            const buf = Buffer.from(resp.result.data, 'base64');
            fs.writeFileSync(outPath, buf);
            console.log('Broadcast screenshot saved! Size:', buf.length);
            ws.close();
            edgeProc.kill();
            process.exit(0);
          }
        });
      } catch (e) {
        edgeProc.kill();
        process.exit(1);
      }
    });
  }).on('error', () => { edgeProc.kill(); process.exit(1); });
}

testBroadcastView();
