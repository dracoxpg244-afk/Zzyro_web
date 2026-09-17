const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9445',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9445/json', (res) => {
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
            expression: `new Promise((resolve) => {
              const img = new Image();
              img.src = 'assets/logo_clean.png';
              img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
                for (let y = 0; y < canvas.height; y++) {
                  for (let x = 0; x < canvas.width; x++) {
                    const alpha = imgData[(y * canvas.width + x) * 4 + 3];
                    if (alpha > 15) {
                      if (x < minX) minX = x;
                      if (x > maxX) maxX = x;
                      if (y < minY) minY = y;
                      if (y > maxY) maxY = y;
                    }
                  }
                }
                // Also create a tightly cropped version
                const cropC = document.createElement('canvas');
                cropC.width = maxX - minX + 2;
                cropC.height = maxY - minY + 2;
                const cCtx = cropC.getContext('2d');
                cCtx.drawImage(canvas, minX, minY, cropC.width, cropC.height, 0, 0, cropC.width, cropC.height);
                const cropDataUrl = cropC.toDataURL('image/png');

                resolve({
                  origW: img.width,
                  origH: img.height,
                  minX,
                  maxX,
                  minY,
                  maxY,
                  cropW: cropC.width,
                  cropH: cropC.height,
                  dataUrl: cropDataUrl
                });
              };
            })`,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      });
      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.id === 1) {
          const val = (m.result && m.result.result) ? m.result.result.value : m.result;
          console.log('Bounds:', {
            origW: val.origW,
            origH: val.origH,
            minX: val.minX,
            maxX: val.maxX,
            minY: val.minY,
            maxY: val.maxY,
            cropW: val.cropW,
            cropH: val.cropH
          });

          // Save the tightly cropped logo
          if (val.dataUrl) {
            const base64 = val.dataUrl.replace(/^data:image\/png;base64,/, '');
            fs.writeFileSync('public/assets/logo_cropped.png', Buffer.from(base64, 'base64'));
            console.log('Saved tightly cropped logo to public/assets/logo_cropped.png!');
          }

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
