const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9461',
  '--window-size=1280,800',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9461/json', (res) => {
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
                switchView('settings');
                const h1 = document.querySelector('#view-settings h1');
                const topbar = document.querySelector('.topbar');
                const sb = document.querySelector('.sb');
                return {
                  topbarRect: topbar ? topbar.getBoundingClientRect() : null,
                  h1Rect: h1 ? h1.getBoundingClientRect() : null,
                  sbRect: sb ? sb.getBoundingClientRect() : null
                };
              })()`,
              returnByValue: true
            }
          }));
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 2,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 500);
        }, 3200);
      });

      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.id === 1) {
          console.log('Positions on settings page:', JSON.stringify(m.result.result.value, null, 2));
        } else if (m.id === 2) {
          fs.writeFileSync('scratch/settings_view_test.png', Buffer.from(m.result.data, 'base64'));
          console.log('Saved scratch/settings_view_test.png');
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
