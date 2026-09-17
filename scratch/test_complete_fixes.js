const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const edge = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targetUrl = 'http://localhost:3000';

async function runTest() {
  const edgeProc = spawn(edge, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9425',
    '--window-size=1600,960',
    targetUrl
  ]);

  function connectToEdge(retries = 12) {
    http.get('http://127.0.0.1:9425/json', (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', async () => {
        try {
          const tabs = JSON.parse(raw);
          const page = tabs.find(t => t.type === 'page');
          if (!page) {
            console.error('No page tab found!');
            edgeProc.kill();
            return;
          }

          const ws = new WebSocket(page.webSocketDebuggerUrl);

          ws.on('open', () => {
            ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));

            // Evaluate after splash dismissal
            setTimeout(() => {
              ws.send(JSON.stringify({
                id: 10,
                method: 'Runtime.evaluate',
                params: {
                  expression: `(() => {
                    const splash = document.getElementById('splash');
                    const splashVisible = splash ? (splash.style.display !== 'none' && !splash.classList.contains('out')) : false;
                    const brandImg = document.querySelector('.brand-badge-z img');
                    const tipBanner = document.querySelector('.anti-black-tip');
                    const pipBtn = document.getElementById('pip-btn');
                    const snapBtn = document.getElementById('snap-btn');
                    const theaterBtn = document.getElementById('theater-btn');
                    return {
                      splashPresent: !!splash,
                      splashVisible,
                      brandImgSrc: brandImg ? brandImg.getAttribute('src') : null,
                      tipBannerPresent: !!tipBanner,
                      tipBannerText: tipBanner ? tipBanner.textContent.slice(0, 50) : null,
                      pipBtnPresent: !!pipBtn,
                      snapBtnPresent: !!snapBtn,
                      theaterBtnPresent: !!theaterBtn
                    };
                  })()`,
                  returnByValue: true
                }
              }));
            }, 3600);
          });

          ws.on('message', (msgStr) => {
            const m = JSON.parse(msgStr);
            if (m.method === 'Console.messageAdded') {
              console.log('[Browser Console]', m.params.message.level, m.params.message.text);
            }
            if (m.id === 10) {
              console.log('UI Verification Result:', JSON.stringify(m.result.value, null, 2));

              // Switch to broadcast view
              ws.send(JSON.stringify({
                id: 20,
                method: 'Runtime.evaluate',
                params: { expression: "switchView('broadcast');" }
              }));
            }
            if (m.id === 20) {
              setTimeout(() => {
                ws.send(JSON.stringify({
                  id: 30,
                  method: 'Page.captureScreenshot',
                  params: { format: 'png' }
                }));
              }, 700);
            }
            if (m.id === 30) {
              const buf = Buffer.from(m.result.data, 'base64');
              const dest = path.resolve(__dirname, 'broadcast_anti_black_verified.png');
              fs.writeFileSync(dest, buf);
              console.log('Saved broadcast screenshot to:', dest);

              const artifactPath = 'C:/Users/everton/.gemini/antigravity-ide/brain/ef0ffabd-6fdd-4386-802d-44628a6112b3/broadcast_anti_black_verified.png';
              fs.copyFileSync(dest, artifactPath);
              console.log('Copied to brain artifact:', artifactPath);

              ws.close();
              edgeProc.kill();
              process.exit(0);
            }
          });
        } catch(e) {
          console.error('Error in test:', e);
          edgeProc.kill();
        }
      });
    }).on('error', () => {
      if (retries > 0) setTimeout(() => connectToEdge(retries - 1), 600);
      else {
        console.error('Failed to connect to Edge debugger');
        edgeProc.kill();
      }
    });
  }

  setTimeout(connectToEdge, 1000);
}

runTest();
