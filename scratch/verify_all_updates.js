const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + path.resolve(__dirname, '../public/index.html').replace(/\\/g, '/');

async function captureShot(name, delayMs, evalScript) {
  const outPath = path.resolve(__dirname, name);
  const port = 9330 + Math.floor(Math.random() * 50);
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
  console.log('Capturing splash screen...');
  await captureShot('shot_splash_fivem.png', 1400);

  console.log('Capturing home view (Dark Mode)...');
  await captureShot('shot_home_dark.png', 4800);

  console.log('Capturing home view (Light Mode)...');
  await captureShot('shot_home_light.png', 4800, "setTheme('light');");

  console.log('Capturing broadcast view (Easy Watch Banner)...');
  await captureShot('shot_broadcast_easy.png', 4800, "switchView('broadcast');");

  console.log('Capturing slim footer...');
  await captureShot('shot_footer_slim.png', 4800, "window.scrollTo(0, document.body.scrollHeight);");

  console.log('All verification captures completed!');
  process.exit(0);
}

run();
