const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + path.resolve(__dirname, '../public/index.html').replace(/\\/g, '/');

async function captureShot(name, delayMs, evalScript) {
  const outPath = path.resolve(__dirname, name);
  const port = 9340 + Math.floor(Math.random() * 40);
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    '--window-size=1600,920',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, delayMs));

  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:${port}/json`, (res) => {
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
            if (evalScript) {
              ws.send(JSON.stringify({
                id: 1,
                method: 'Runtime.evaluate',
                params: { expression: evalScript }
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
              console.log(`Captured ${name} (${buf.length} bytes)`);
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

async function run() {
  console.log('Capturing splash at 1.2s...');
  await captureShot('verify_splash.png', 1200);

  console.log('Capturing home page (dark) after splash removed at 3.6s...');
  await captureShot('verify_home_dark.png', 3600);

  console.log('Capturing home page (light) at 3.6s...');
  await captureShot('verify_home_light.png', 3600, "setTheme('light');");

  console.log('Capturing footer at bottom...');
  await captureShot('verify_footer.png', 3600, "window.scrollTo(0, document.body.scrollHeight);");

  console.log('All verification captures finished successfully!');
  process.exit(0);
}

run();
