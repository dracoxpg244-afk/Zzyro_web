const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9450',
  '--window-size=1280,800',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9450/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const page = tabs.find(t => t.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      ws.on('open', () => {
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 1,
            method: 'Runtime.evaluate',
            params: {
              expression: `(() => {
                const logo = document.getElementById('splash-logo');
                const sheen = document.getElementById('splash-sheen');
                const wrap = document.getElementById('splash-logo-wrap');
                return {
                  logoBox: logo ? { w: logo.offsetWidth, h: logo.offsetHeight, rect: logo.getBoundingClientRect() } : null,
                  sheenBox: sheen ? { w: sheen.offsetWidth, h: sheen.offsetHeight, opacity: window.getComputedStyle(sheen).opacity, display: window.getComputedStyle(sheen).display, mixBlend: window.getComputedStyle(sheen).mixBlendMode, bg: window.getComputedStyle(sheen).backgroundImage } : null,
                  wrapBox: wrap ? { filter: window.getComputedStyle(wrap).filter } : null
                };
              })()`,
              returnByValue: true
            }
          }));
        }, 900);
      });
      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.id === 1) {
          console.log('DOM Info:', JSON.stringify(m.result.result.value, null, 2));
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
