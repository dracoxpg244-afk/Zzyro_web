const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + path.resolve(__dirname, '../public/index.html').replace(/\\/g, '/');

async function checkConsole() {
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9226',
    fileUrl
  ]);

  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9226/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(data);
        const page = list.find(p => p.type === 'page');
        if (!page) { edgeProc.kill(); return; }
        const WebSocket = require('ws');
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        ws.on('open', () => {
          ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
          ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        });
        ws.on('message', (msg) => {
          const m = JSON.parse(msg);
          if (m.method === 'Runtime.exceptionThrown') {
            console.error('EXCEPTION:', JSON.stringify(m.params.exceptionDetails));
          } else if (m.method === 'Console.messageAdded') {
            console.log('CONSOLE:', m.params.message.level, m.params.message.text);
          }
        });

        setTimeout(() => {
          console.log('Finished checking console (5s passed).');
          ws.close();
          edgeProc.kill();
          process.exit(0);
        }, 5000);
      } catch (e) {
        console.error(e);
        edgeProc.kill();
        process.exit(1);
      }
    });
  });
}

checkConsole();
