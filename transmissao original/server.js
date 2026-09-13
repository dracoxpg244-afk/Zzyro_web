const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const os = require('os');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, 'public');

// ─── Tipos MIME ──────────────────────────────────────────────────────────────
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
};

// ─── Servidor HTTP (Compatível com Render.com e Query Params) ────────────────
const httpServer = http.createServer((req, res) => {
  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    res.writeHead(400);
    return res.end('URL inválida');
  }

  let pathname = parsedUrl.pathname;

  // Endpoint de Saúde para o Render.com
  if (pathname === '/healthz' || pathname === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), time: new Date().toISOString() }));
  }

  // Prevenção de Path Traversal
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath === '/' ? 'index.html' : safePath);

  // Garante que o arquivo permanece dentro da pasta public/
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Acesso proibido');
  }

  fs.stat(filePath, (err, stats) => {
    // Se o arquivo não existir (ou for rota direta com ?sala=...), serve index.html
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'text/plain; charset=utf-8';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Arquivo não encontrado');
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
      });
      res.end(data);
    });
  });
});

// ─── WebSocket Signaling Server ──────────────────────────────────────────────
const wss = new WebSocketServer({ server: httpServer });

// rooms: Map<roomId, { host: ws, hostName: string, viewers: Map<viewerId, ws>, isPrivate: bool, password: string|null, createdAt: number }>
const rooms = new Map();

function broadcast(ws, data) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function getPublicRoomsList() {
  const list = [];
  for (const [id, room] of rooms.entries()) {
    list.push({
      id,
      hostName: room.hostName || 'Host',
      viewersCount: room.viewers.size,
      hasHost: !!room.host,
      isPrivate: !!room.isPrivate
    });
  }
  return list;
}

// Keep-Alive Heartbeat a cada 25 segundos para manter a conexão ativa no Render
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 25000);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', () => { ws.isAlive = true; });

  ws.role = null;
  ws.roomId = null;
  ws.viewerId = null;
  ws.userRole = 'Membro'; // 'Dono', 'Moderador', 'VIP', 'Membro'
  ws.isMuted = false;

  // Envia lista de salas públicas disponíveis
  broadcast(ws, { type: 'public-rooms-list', rooms: getPublicRoomsList() });

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      // ── Solicitar Lista de Salas Públicas ───────────────────────────────────
      case 'get-public-rooms': {
        broadcast(ws, { type: 'public-rooms-list', rooms: getPublicRoomsList() });
        break;
      }

      // ── Host cria sala ──────────────────────────────────────────────────────
      case 'host-create': {
        const roomId = (msg.roomId || Math.random().toString(36).substring(2, 8)).toUpperCase().trim();
        if (rooms.has(roomId)) {
          broadcast(ws, { type: 'error', message: 'Esta sala já existe. Escolha outro código.' });
          return;
        }

        const isPrivate = !!msg.isPrivate;
        const password = isPrivate ? String(msg.password || '').trim() : null;

        rooms.set(roomId, {
          host: ws,
          hostName: msg.name || 'Dono',
          viewers: new Map(),
          isPrivate,
          password,
          createdAt: Date.now()
        });

        ws.role = 'host';
        ws.userRole = 'Dono';
        ws.roomId = roomId;
        ws.hostName = msg.name || 'Dono';

        broadcast(ws, {
          type: 'room-created',
          roomId,
          isPrivate,
          userRole: 'Dono'
        });

        console.log(`[Host] Sala criada: ${roomId} (${isPrivate ? 'Privada' : 'Pública'}) por ${ws.hostName}`);
        break;
      }

      // ── Viewer entra na sala ────────────────────────────────────────────────
      case 'viewer-join': {
        const room = rooms.get(msg.roomId);
        if (!room) {
          broadcast(ws, { type: 'error', message: 'Sala não encontrada. Verifique o código digitado.' });
          return;
        }

        // Verificação de senha para sala privada
        if (room.isPrivate && room.password) {
          if (msg.password !== room.password) {
            broadcast(ws, { type: 'error', message: 'Senha incorreta para esta sala privada.' });
            return;
          }
        }

        const viewerId = Math.random().toString(36).substring(2, 10);
        ws.role = 'viewer';
        ws.roomId = msg.roomId;
        ws.viewerId = viewerId;
        ws.viewerName = (msg.name || `Espectador-${viewerId.substring(0, 4)}`).trim().slice(0, 24);
        ws.userRole = 'Membro'; // Começa como Membro padrão

        room.viewers.set(viewerId, ws);

        // Notifica o espectador
        broadcast(ws, {
          type: 'joined',
          roomId: msg.roomId,
          viewerId,
          userRole: ws.userRole,
          hostPresent: !!room.host,
          hostName: room.hostName
        });

        // Notifica o host
        if (room.host) {
          broadcast(room.host, {
            type: 'viewer-joined',
            viewerId,
            name: ws.viewerName,
            userRole: ws.userRole,
            count: room.viewers.size
          });
        }

        console.log(`[Viewer] ${ws.viewerName} (${ws.userRole}) entrou na sala ${msg.roomId}`);
        break;
      }

      // ── Sinalização WebRTC (Offer / Answer / Candidate) ─────────────────────
      case 'offer': {
        const room = rooms.get(ws.roomId);
        if (!room) return;
        const targetViewer = room.viewers.get(msg.targetId);
        if (targetViewer) {
          broadcast(targetViewer, { type: 'offer', sdp: msg.sdp, fromId: 'host' });
        }
        break;
      }

      case 'answer': {
        const room = rooms.get(ws.roomId);
        if (!room || !room.host) return;
        broadcast(room.host, { type: 'answer', sdp: msg.sdp, fromId: ws.viewerId });
        break;
      }

      case 'candidate': {
        const room = rooms.get(ws.roomId);
        if (!room) return;
        if (ws.role === 'host') {
          const targetViewer = room.viewers.get(msg.targetId);
          if (targetViewer) {
            broadcast(targetViewer, { type: 'candidate', candidate: msg.candidate, fromId: 'host' });
          }
        } else {
          if (room.host) {
            broadcast(room.host, { type: 'candidate', candidate: msg.candidate, fromId: ws.viewerId });
          }
        }
        break;
      }

      // ── Trocar Janela de Transmissão ────────────────────────────────────────
      case 'switch-window': {
        const room = rooms.get(ws.roomId);
        if (!room || ws.role !== 'host') return;
        room.viewers.forEach(v => broadcast(v, { type: 'stream-switched' }));
        break;
      }

      // ── Sistema de Cargos / Moderação (Discord Style) ───────────────────────
      case 'set-role': {
        const room = rooms.get(ws.roomId);
        if (!room || ws.userRole !== 'Dono') return;

        const targetViewer = room.viewers.get(msg.targetViewerId);
        if (targetViewer) {
          targetViewer.userRole = msg.role; // 'Moderador', 'VIP', 'Membro'
          broadcast(targetViewer, { type: 'role-updated', role: targetViewer.userRole });
          
          // Notifica todos na sala sobre o novo cargo
          const notify = {
            type: 'chat',
            name: '⚡ Sistema',
            role: 'Sistema',
            text: `${targetViewer.viewerName} agora é ${targetViewer.userRole}!`,
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          };
          if (room.host) broadcast(room.host, notify);
          room.viewers.forEach(v => broadcast(v, notify));
        }
        break;
      }

      // Mutar usuário
      case 'mute-user': {
        const room = rooms.get(ws.roomId);
        if (!room) return;
        if (ws.userRole !== 'Dono' && ws.userRole !== 'Moderador') {
          broadcast(ws, { type: 'error', message: 'Sem permissão de moderação.' });
          return;
        }

        const targetViewer = room.viewers.get(msg.targetViewerId);
        if (targetViewer) {
          targetViewer.isMuted = true;
          broadcast(targetViewer, { type: 'you-are-muted', by: ws.role === 'host' ? ws.hostName : ws.viewerName });
        }
        break;
      }

      // Expulsar usuário
      case 'kick-user': {
        const room = rooms.get(ws.roomId);
        if (!room) return;
        if (ws.userRole !== 'Dono' && ws.userRole !== 'Moderador') return;

        const targetViewer = room.viewers.get(msg.targetViewerId);
        if (targetViewer) {
          broadcast(targetViewer, { type: 'you-are-kicked', message: 'Você foi removido da sala por um moderador.' });
          room.viewers.delete(msg.targetViewerId);
          if (room.host) {
            broadcast(room.host, { type: 'viewer-left', viewerId: msg.targetViewerId, count: room.viewers.size });
          }
        }
        break;
      }

      // ── Chat ao Vivo com Cargos ─────────────────────────────────────────────
      case 'chat': {
        const room = rooms.get(ws.roomId);
        if (!room) return;

        if (ws.isMuted) {
          broadcast(ws, { type: 'error', message: 'Você está mutado e não pode enviar mensagens.' });
          return;
        }

        const text = String(msg.text || '').trim().slice(0, 300);
        if (!text) return;

        const senderName = ws.role === 'host' ? (ws.hostName || 'Dono') : (ws.viewerName || 'Espectador');
        const chatMsg = {
          type: 'chat',
          name: senderName,
          role: ws.userRole || 'Membro',
          text,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        if (room.host) broadcast(room.host, chatMsg);
        room.viewers.forEach(v => broadcast(v, chatMsg));
        break;
      }

      // ── Encerrar Transmissão ────────────────────────────────────────────────
      case 'end-stream': {
        const room = rooms.get(ws.roomId);
        if (!room || ws.role !== 'host') return;
        room.viewers.forEach(v => broadcast(v, { type: 'stream-ended' }));
        rooms.delete(ws.roomId);
        console.log(`[Host] Sala ${ws.roomId} encerrada pelo host.`);
        break;
      }
    }
  });

  ws.on('close', () => {
    if (!ws.roomId) return;
    const room = rooms.get(ws.roomId);
    if (!room) return;

    if (ws.role === 'host') {
      room.viewers.forEach(v => broadcast(v, { type: 'stream-ended' }));
      rooms.delete(ws.roomId);
      console.log(`[Host] Sala ${ws.roomId} desconectada.`);
    } else if (ws.role === 'viewer') {
      room.viewers.delete(ws.viewerId);
      if (room.host) {
        broadcast(room.host, {
          type: 'viewer-left',
          viewerId: ws.viewerId,
          name: ws.viewerName,
          count: room.viewers.size
        });
      }
      console.log(`[Viewer] ${ws.viewerName} saiu da sala ${ws.roomId}`);
    }
  });
});

// ─── Inicialização ────────────────────────────────────────────────────────────
httpServer.listen(PORT, '0.0.0.0', () => {
  const interfaces = os.networkInterfaces();
  let localIP = 'localhost';
  for (const iface of Object.values(interfaces)) {
    for (const alias of iface) {
      if (alias.family === 'IPv4' && !alias.internal) {
        localIP = alias.address;
        break;
      }
    }
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║        🎬 STREAMSHARE - TRANSMISSÃO HD P2P 🎮            ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log(`║  Local:      http://localhost:${PORT}                        ║`);
  console.log(`║  Rede Local: http://${localIP}:${PORT}                   ║`);
  console.log('║  Render.com: /healthz ativo e roteamento de sala 100%    ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
});
