const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9447',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9447/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const page = tabs.find(t => t.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.on('open', () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `(async () => {
              const checkImg = (src) => new Promise(res => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                  const c = document.createElement('canvas');
                  c.width = img.width;
                  c.height = img.height;
                  const ctx = c.getContext('2d');
                  ctx.drawImage(img, 0, 0);
                  const data = ctx.getImageData(0, 0, c.width, c.height).data;
                  let nonZero = 0;
                  let darkNonZero = 0;
                  // check right side near 'o'
                  for (let y = 0; y < c.height; y++) {
                    for (let x = Math.floor(c.width * 0.7); x < c.width; x++) {
                      const idx = (y * c.width + x) * 4;
                      const a = data[idx + 3];
                      if (a > 0) {
                        nonZero++;
                        if (data[idx] < 80 && data[idx+1] < 80 && data[idx+2] < 80) darkNonZero++;
                      }
                    }
                  }
                  res({ src, w: img.width, h: img.height, nonZero, darkNonZero });
                };
              });
              return await Promise.all([
                checkImg('assets/logo.png'),
                checkImg('assets/logo_clean.png'),
                checkImg('assets/logo_cropped.png')
              ]);
            })()`,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      });
      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.id === 1) {
          console.log('Result:', JSON.stringify(m.result.result.value, null, 2));
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
