const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + path.resolve(__dirname, '../public/index.html').replace(/\\/g, '/');

async function capture() {
  const outPath = path.resolve(__dirname, 'current_page_rendered.png');
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9225',
    '--window-size=1600,900',
    fileUrl
  ]);

  // wait for splash screen to complete (splash is ~3s)
  await new Promise(r => setTimeout(r, 4500));

  http.get('http://127.0.0.1:9225/json', (res) => {
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
            console.log(`Successfully saved screenshot: ${outPath} (${buf.length} bytes)`);
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
  }).on('error', (e) => {
    console.error('HTTP get error:', e);
    edgeProc.kill();
    process.exit(1);
  });
}

capture();
