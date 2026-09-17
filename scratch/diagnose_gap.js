const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9462',
  'http://localhost:3000'
]);

function connect(retries = 10) {
  http.get('http://127.0.0.1:9462/json', (res) => {
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
                const v = document.getElementById('view-settings');
                const content = document.querySelector('.content');
                const main = document.querySelector('.main');
                const topbar = document.querySelector('.topbar');
                const prevSibling = v.previousElementSibling;

                const prevs = [];
                let p = v.previousElementSibling;
                while (p) {
                  prevs.push({ tag: p.tagName, id: p.id, cls: p.className, display: window.getComputedStyle(p).display, h: p.offsetHeight });
                  p = p.previousElementSibling;
                }

                return {
                  contentStyle: {
                    padding: window.getComputedStyle(content).padding,
                    margin: window.getComputedStyle(content).margin,
                    display: window.getComputedStyle(content).display,
                    justifyContent: window.getComputedStyle(content).justifyContent
                  },
                  viewSettingsStyle: {
                    padding: window.getComputedStyle(v).padding,
                    margin: window.getComputedStyle(v).margin,
                    top: v.getBoundingClientRect().top
                  },
                  topbarBottom: topbar.getBoundingClientRect().bottom,
                  previousSiblings: prevs
                };
              })()`,
              returnByValue: true
            }
          }));
        }, 3200);
      });

      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.id === 1) {
          console.log('Diagnosis:', JSON.stringify(m.result.result.value, null, 2));
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
