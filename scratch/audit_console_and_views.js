const { spawn } = require('child_process');
const http = require('http');
const WebSocket = require('ws');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const edgeProc = spawn(edge, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9460',
  '--window-size=1400,900',
  'http://localhost:3000'
]);

const consoleMessages = [];
const pageErrors = [];

function connect(retries = 15) {
  http.get('http://127.0.0.1:9460/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', () => {
      const tabs = JSON.parse(raw);
      const page = tabs.find(t => t.type === 'page');
      if (!page) return setTimeout(() => connect(retries - 1), 300);
      const ws = new WebSocket(page.webSocketDebuggerUrl);

      ws.on('open', () => {
        ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Log.enable' }));

        // Wait for splash intro to dismiss
        setTimeout(() => {
          ws.send(JSON.stringify({
            id: 10,
            method: 'Runtime.evaluate',
            params: {
              expression: `(async () => {
                const results = [];
                const views = ['home', 'broadcast', 'private', 'profile', 'settings', 'viewer'];
                for (const v of views) {
                  try {
                    switchView(v);
                    const el = document.getElementById('view-' + v);
                    const isVisible = el && window.getComputedStyle(el).display !== 'none';
                    results.push({ view: v, visible: isVisible });
                  } catch(e) {
                    results.push({ view: v, error: e.message });
                  }
                }

                // Test Toast system
                try {
                  toast('Curto!', 'ok');
                  toast('Mensagem média de status da transmissão conectada.', 'inf');
                  toast('Atenção: Esta é uma notificação muito longa para testar se a duração dinâmica no canto inferior direito fica tempo suficiente na tela sem sobrepor nenhum elemento.', 'warn');
                } catch(e) {
                  results.push({ toastError: e.message });
                }

                // Test Sidebar Tools
                const sbCard = document.getElementById('sb-voice-card');
                const printBtn = document.querySelector('.sb-tool-btn');
                const userCard = document.querySelector('.sb-user-card');

                results.push({
                  hasVoiceCard: !!sbCard,
                  hasPrintBtn: !!printBtn,
                  hasUserCard: !!userCard,
                  toastsCount: document.querySelectorAll('.toast').length
                });

                return results;
              })()`,
              awaitPromise: true,
              returnByValue: true
            }
          }));
        }, 3500);
      });

      ws.on('message', (msg) => {
        const m = JSON.parse(msg);
        if (m.method === 'Console.messageAdded') {
          consoleMessages.push(m.params.message);
        }
        if (m.method === 'Runtime.consoleAPICalled') {
          consoleMessages.push({ type: m.params.type, text: m.params.args.map(a => a.value || a.description).join(' ') });
        }
        if (m.method === 'Runtime.exceptionThrown') {
          pageErrors.push(m.params.exceptionDetails);
        }

        if (m.id === 10) {
          console.log('\n=== TEST EVALUATION RESULTS ===');
          console.log(JSON.stringify(m.result.result.value, null, 2));

          console.log('\n=== PAGE ERRORS / EXCEPTIONS ===');
          console.log(pageErrors.length ? JSON.stringify(pageErrors, null, 2) : 'NONE! Clean 0 errors.');

          console.log('\n=== CONSOLE LOGS & WARNINGS ===');
          consoleMessages.forEach(c => console.log(`[${c.type || c.level}] ${c.text}`));

          setTimeout(() => {
            ws.close();
            edgeProc.kill();
          }, 1000);
        }
      });
    });
  }).on('error', () => {
    if (retries > 0) setTimeout(() => connect(retries - 1), 500);
    else {
      console.log('Failed to connect to Edge');
      edgeProc.kill();
    }
  });
}
setTimeout(connect, 1000);
