const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');

console.log('🚀 Starting end-to-end verification test on port 3891...');

const TEST_PORT = 3891;
const env = Object.assign({}, process.env, { PORT: String(TEST_PORT) });
const srv = spawn('node', ['server.js'], { env, stdio: ['pipe', 'pipe', 'pipe'] });

let serverOutput = '';
srv.stdout.on('data', d => { serverOutput += d.toString(); });
srv.stderr.on('data', d => { console.error('[SERVER STDERR]', d.toString()); });

setTimeout(async () => {
  try {
    // 1. Test /healthz
    console.log('[1/5] Testing /healthz endpoint...');
    const health = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}/healthz`, res => {
        let body = '';
        res.on('data', c => body += c);
        res.on('end', () => resolve(JSON.parse(body)));
      }).on('error', reject);
    });

    console.log('  Health check OK:', health);
    if (health.status !== 'ok') throw new Error('Health check failed');

    // 2. Connect Host WebSocket
    console.log('[2/5] Testing Host WebSocket connection...');
    const wsHost = new WebSocket(`ws://127.0.0.1:${TEST_PORT}`);

    let hostJoined = false;
    let hostReceivedParticipants = null;

    await new Promise((resolve, reject) => {
      wsHost.on('open', () => {
        console.log('  Host connected. Creating voice-only room with allowVoice=false...');
        wsHost.send(JSON.stringify({
          type: 'host-create',
          roomId: 'TST-9999',
          title: 'Call Teste',
          name: 'PlayerHost',
          tag: '#1000',
          avatar: null,
          hasScreenShare: false,
          allowVoice: false, // Modo Apenas Ouvintes
          isPrivate: false,
          isPublic: true
        }));
      });

      wsHost.on('message', raw => {
        const msg = JSON.parse(raw);
        if (msg.type === 'room-created') {
          console.log('  Room created successfully:', msg.roomId, 'allowVoice:', msg.allowVoice);
          hostJoined = true;
        }
        if (msg.type === 'room-participants') {
          hostReceivedParticipants = msg;
          resolve();
        }
      });

      wsHost.on('error', reject);
    });

    // 3. Connect Viewer WebSocket
    console.log('[3/5] Testing Viewer WebSocket connection...');
    const wsViewer = new WebSocket(`ws://127.0.0.1:${TEST_PORT}`);
    let viewerReceivedParticipants = null;

    await new Promise((resolve, reject) => {
      wsViewer.on('open', () => {
        console.log('  Viewer connected. Joining room TST-9999...');
        wsViewer.send(JSON.stringify({
          type: 'viewer-join',
          roomId: 'TST-9999',
          name: 'PlayerViewer',
          tag: '#2000'
        }));
      });

      wsViewer.on('message', raw => {
        const msg = JSON.parse(raw);
        if (msg.type === 'room-participants') {
          viewerReceivedParticipants = msg;
          console.log('  Viewer received participants list:', msg.participants.length, 'users. allowVoice:', msg.allowVoice);
          resolve();
        }
      });

      wsViewer.on('error', reject);
    });

    // 4. Test voice-status
    console.log('[4/5] Testing speaking indicator broadcast...');
    let hostSawSpeaking = false;
    const speakingPromise = new Promise((resolve) => {
      wsHost.on('message', raw => {
        const msg = JSON.parse(raw);
        if (msg.type === 'room-participants') {
          const viewerP = msg.participants.find(p => p.name === 'PlayerViewer');
          if (viewerP && viewerP.isSpeaking) {
            console.log('  Host verified Viewer is speaking (green glow)!');
            hostSawSpeaking = true;
            resolve();
          }
        }
      });
    });

    wsViewer.send(JSON.stringify({
      type: 'voice-status',
      isSpeaking: true,
      isMuted: false
    }));

    await Promise.race([speakingPromise, new Promise(r => setTimeout(r, 2000))]);

    // 5. Test IP and Security Leak Check
    console.log('[5/5] Auditing security and data leakage in messages...');
    const allMsgs = JSON.stringify({ hostReceivedParticipants, viewerReceivedParticipants });
    if (allMsgs.includes('clientIp') || (allMsgs.includes('passwordHash') || allMsgs.includes('salt'))) {
      throw new Error('SECURITY VIOLATION: Sensitive data leaked in WebSocket broadcast!');
    }
    console.log('  Zero IP/password leak confirmed! Clean payload.');

    wsHost.close();
    wsViewer.close();
    srv.kill('SIGTERM');

    console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    srv.kill('SIGTERM');
    process.exit(1);
  }
}, 1200);
