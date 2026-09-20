const { spawn } = require('child_process');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const args = [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--disable-gpu',
  'http://localhost:3000/'
];

const p = spawn(edge, args);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9223/json');
    const tabs = await res.json();
    const pageTab = tabs.find(t => t.url.includes('3000'));
    if (!pageTab) {
      console.log('Page tab not found among:', tabs.map(t => t.url));
      p.kill();
      process.exit(1);
    }
    console.log('Found page tab:', pageTab.url);

    const WebSocket = require('ws');
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    ws.on('open', () => {
      console.log('Connected to Zyro page via CDP');
      ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Log.enable' }));

      // Check state at 500ms
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: {
            expression: `JSON.stringify({
              splash: document.getElementById('splash') ? {
                display: document.getElementById('splash').style.display,
                classList: Array.from(document.getElementById('splash').classList),
                pct: document.getElementById('splash-pct') ? document.getElementById('splash-pct').textContent : 'no pct'
              } : null,
              introDone: typeof introDone !== 'undefined' ? introDone : 'undefined',
              activeViews: Array.from(document.querySelectorAll('.view.active')).map(v => v.id)
            })`
          }
        }));
      }, 500);

      // Check state at 3000ms
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 5,
          method: 'Runtime.evaluate',
          params: {
            expression: `JSON.stringify({
              splash: document.getElementById('splash') ? {
                display: document.getElementById('splash').style.display,
                classList: Array.from(document.getElementById('splash').classList),
                pct: document.getElementById('splash-pct') ? document.getElementById('splash-pct').textContent : 'no pct'
              } : null,
              introDone: typeof introDone !== 'undefined' ? introDone : 'undefined',
              activeViews: Array.from(document.querySelectorAll('.view.active')).map(v => v.id)
            })`
          }
        }));
      }, 3000);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      } else if (msg.method === 'Runtime.exceptionThrown') {
        console.log('EXCEPTION:', JSON.stringify(msg.params.exceptionDetails));
      }
      if (msg.id === 4 || msg.id === 5) {
        console.log('EVAL RESULT ' + msg.id + ':', msg.result.result.value);
        if (msg.id === 5) {
          p.kill();
          process.exit(0);
        }
      }
    });
  } catch(e) {
    console.error('Error:', e);
    p.kill();
    process.exit(1);
  }
}, 1500);
