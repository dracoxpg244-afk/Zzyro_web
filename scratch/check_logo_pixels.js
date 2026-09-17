const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9455',
  'http://localhost:3000'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9455/json', res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
      ws.on('open', () => {
        ws.send(JSON.stringify({
          id: 1,
          method: 'Runtime.evaluate',
          params: {
            expression: `new Promise((resolve) => {
              const img = new Image();
              img.src = 'assets/logo_cropped.png';
              img.onload = () => {
                const c = document.createElement('canvas');
                c.width = img.width;
                c.height = img.height;
                const ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const d = ctx.getImageData(0, 0, c.width, c.height).data;
                
                // Check right side of the image (around the 'o')
                const rightRegion = [];
                for(let y = 0; y < c.height; y++) {
                  for(let x = Math.floor(c.width * 0.7); x < c.width; x++) {
                    const idx = (y * c.width + x) * 4;
                    const r = d[idx], g = d[idx+1], b = d[idx+2], a = d[idx+3];
                    if (a > 0 && (r < 60 && g < 60 && b < 60)) {
                      rightRegion.push({ x, y, r, g, b, a });
                    }
                  }
                }

                // Also check DOM elements in #splash
                const stage = document.querySelector('.splash-stage');
                const wrap = document.querySelector('.splash-logo-wrap');
                const sheen = document.querySelector('.splash-logo-sheen');
                const shock = document.querySelector('.splash-shockwave');

                resolve({
                  imgWidth: img.width,
                  imgHeight: img.height,
                  darkPixelsOnRight: rightRegion.length,
                  rightSample: rightRegion.slice(0, 5),
                  sheenStyle: sheen ? window.getComputedStyle(sheen).mixBlendMode : null,
                  wrapBox: wrap ? wrap.getBoundingClientRect() : null
                });
              };
            })`,
            awaitPromise: true,
            returnByValue: true
          }
        }));
      });
      ws.on('message', m => {
        const res = JSON.parse(m);
        console.log('Result:', res.result ? res.result.result.value : res);
        ws.close();
        edgeProc.kill();
        process.exit(0);
      });
    });
  });
}, 1200);
