const puppeteer = (() => {
  try { return require('puppeteer'); } catch(e) { return null; }
})();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// We can use Microsoft Edge with remote debugging port to scroll down and capture
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outPath = path.resolve(__dirname, 'scroll_bottom_shot.png');

const http = require('http');

async function testWithCDP() {
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);

  // Wait 3.5s for edge to start and page to finish splash
  await new Promise(r => setTimeout(r, 3800));

  // Connect to CDP
  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(data);
        const page = list.find(p => p.type === 'page');
        if (!page) {
          console.log('No page found');
          edgeProc.kill();
          return;
        }
        const wsUrl = page.webSocketDebuggerUrl;
        const WebSocket = require('ws');
        const ws = new WebSocket(wsUrl);
        ws.on('open', () => {
          // Send Runtime.evaluate to scroll to bottom
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: { expression: 'window.scrollTo(0, document.body.scrollHeight);' }
          }));
        });
        ws.on('message', (msg) => {
          const resp = JSON.parse(msg);
          if (resp.id === 1) {
            // Wait 500ms and capture screenshot
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 2,
                method: 'Page.captureScreenshot',
                params: { format: 'png' }
              }));
            }, 500);
          } else if (resp.id === 2) {
            const buf = Buffer.from(resp.result.data, 'base64');
            fs.writeFileSync(outPath, buf);
            console.log('Scroll bottom screenshot saved! Size:', buf.length);
            ws.close();
            edgeProc.kill();
            process.exit(0);
          }
        });
      } catch (err) {
        console.error('CDP error:', err);
        edgeProc.kill();
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('Failed to connect to CDP:', err);
    edgeProc.kill();
    process.exit(1);
  });
}

testWithCDP();
