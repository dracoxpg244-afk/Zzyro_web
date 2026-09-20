const { spawn } = require('child_process');
const http = require('http');

// Start Edge with remote debugging port 9222
const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const args = [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  'http://localhost:3000'
];

const p = spawn(edge, args);

setTimeout(async () => {
  try {
    // Connect to CDP
    const res = await fetch('http://127.0.0.1:9222/json');
    const tabs = await res.json();
    console.log('Tabs:', tabs);

    const WebSocket = require('ws');
    const wsUrl = tabs[0].webSocketDebuggerUrl;
    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log('Connected to CDP');
      ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Log.enable' }));
      
      // Check DOM after 1 second
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 4,
          method: 'Runtime.evaluate',
          params: {
            expression: `JSON.stringify({
              splashDisplay: document.getElementById('splash') ? document.getElementById('splash').style.display : 'no splash',
              splashClasses: document.getElementById('splash') ? document.getElementById('splash').className : 'no splash',
              introDone: typeof introDone !== 'undefined' ? introDone : 'undefined',
              activeViews: Array.from(document.querySelectorAll('.view.active')).map(v => v.id),
              errors: window.__errors || []
            })`
          }
        }));
      }, 1500);

      // Check DOM after 3.5 seconds
      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 5,
          method: 'Runtime.evaluate',
          params: {
            expression: `JSON.stringify({
              splashDisplay: document.getElementById('splash') ? document.getElementById('splash').style.display : 'no splash',
              splashClasses: document.getElementById('splash') ? document.getElementById('splash').className : 'no splash',
              introDone: typeof introDone !== 'undefined' ? introDone : 'undefined',
              activeViews: Array.from(document.querySelectorAll('.view.active')).map(v => v.id)
            })`
          }
        }));
      }, 3500);
    });

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      if (msg.method === 'Runtime.consoleAPICalled' || msg.method === 'Runtime.exceptionThrown') {
        console.log('BROWSER EVENT:', JSON.stringify(msg));
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
    console.error('Error connecting to CDP:', e);
    p.kill();
    process.exit(1);
  }
}, 1500);
