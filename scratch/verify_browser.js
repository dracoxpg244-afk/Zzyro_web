const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9451',
  '--window-size=1280,850',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9451/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const page = tabs.find(t => t.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let cmdId = 1;
      function send(method, params = {}) {
        const id = cmdId++;
        ws.send(JSON.stringify({ id, method, params }));
        return id;
      }

      ws.on('open', () => {
        // 1. At 600ms, click on the center of the screen
        setTimeout(() => {
          send('Input.dispatchMouseEvent', {
            type: 'mousePressed',
            x: 640,
            y: 400,
            button: 'left',
            clickCount: 1
          });
          send('Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            x: 640,
            y: 400,
            button: 'left',
            clickCount: 1
          });
          console.log('Dispatched click on splash at 600ms');

          // Check if splash is still visible
          setTimeout(() => {
            send('Runtime.evaluate', {
              expression: `(() => {
                const s = document.getElementById('splash');
                return {
                  splashExists: !!s,
                  splashClasses: s ? s.className : '',
                  hasOut: s ? s.classList.contains('out') : false
                };
              })()`,
              returnByValue: true
            });
          }, 150);

          // Capture screenshot of loading logo
          setTimeout(() => {
            send('Page.captureScreenshot', { format: 'png' });
          }, 400);

          // After 3.5s (after splash finishes), capture screenshot of app and sidebar
          setTimeout(() => {
            send('Page.captureScreenshot', { format: 'png' });
          }, 3600);
        }, 600);
      });

      let shotCount = 0;
      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.result && m.result.result && m.result.result.value) {
          console.log('Splash status after click:', m.result.result.value);
        } else if (m.result && m.result.data) {
          shotCount++;
          if (shotCount === 1) {
            fs.writeFileSync('scratch/splash_after_click.png', Buffer.from(m.result.data, 'base64'));
            console.log('Saved scratch/splash_after_click.png');
          } else if (shotCount === 2) {
            fs.writeFileSync('scratch/sidebar_new_features.png', Buffer.from(m.result.data, 'base64'));
            console.log('Saved scratch/sidebar_new_features.png');
            ws.close();
            edgeProc.kill();
          }
        }
      });
    });
  }).on('error', () => {
    if (retries > 0) setTimeout(() => connect(retries - 1), 500);
    else edgeProc.kill();
  });
}
setTimeout(connect, 1000);
