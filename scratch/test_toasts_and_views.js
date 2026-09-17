const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9463',
  '--window-size=1280,800',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9463/json', (res) => {
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
        setTimeout(() => {
          // 1. Trigger toast notifications and capture screenshot
          send('Runtime.evaluate', {
            expression: `(() => {
              toast('Efeitos sonoros ativados!', 'ok');
              setTimeout(() => {
                toast('Dica: Use a tecla F11 para entrar no modo tela cheia e ter uma imersão completa.', 'inf');
              }, 150);
            })()`
          });

          setTimeout(() => {
            send('Page.captureScreenshot', { format: 'png' });
          }, 600);

          // 2. Switch to profile and capture
          setTimeout(() => {
            send('Runtime.evaluate', { expression: `switchView('profile');` });
            setTimeout(() => {
              send('Page.captureScreenshot', { format: 'png' });
            }, 300);
          }, 2400);

          // 3. Switch to broadcast and capture
          setTimeout(() => {
            send('Runtime.evaluate', { expression: `switchView('broadcast');` });
            setTimeout(() => {
              send('Page.captureScreenshot', { format: 'png' });
            }, 300);
          }, 3600);
        }, 3200);
      });

      let count = 0;
      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.result && m.result.data) {
          count++;
          if (count === 1) {
            fs.writeFileSync('scratch/toast_luxury_test.png', Buffer.from(m.result.data, 'base64'));
            console.log('Saved scratch/toast_luxury_test.png');
          } else if (count === 2) {
            fs.writeFileSync('scratch/profile_view_fixed.png', Buffer.from(m.result.data, 'base64'));
            console.log('Saved scratch/profile_view_fixed.png');
          } else if (count === 3) {
            fs.writeFileSync('scratch/broadcast_view_fixed.png', Buffer.from(m.result.data, 'base64'));
            console.log('Saved scratch/broadcast_view_fixed.png');
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
