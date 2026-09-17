const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + path.resolve(__dirname, '../public/index.html').replace(/\\/g, '/');

async function testFooter() {
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9399',
    '--window-size=1600,920',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 4500));

  http.get('http://127.0.0.1:9399/json', (res) => {
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
            params: { expression: "window.scrollTo(0, document.body.scrollHeight || 10000); document.documentElement.scrollTop = 10000;" }
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
            }, 400);
          } else if (resp.id === 2) {
            const buf = Buffer.from(resp.result.data, 'base64');
            const out = path.resolve(__dirname, 'shot_real_footer.png');
            fs.writeFileSync(out, buf);
            console.log('Saved shot_real_footer.png!');
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

testFooter();
