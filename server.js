const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const os = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const PUBLIC_DIR = path.resolve(__dirname, 'public');

// ─── Logger Limpo para Produção ───────────────────────────────────────────────
const log = {
  info: (...a) => console.log('[INFO]', ...a),
  warn: (...a) => console.warn('[WARN]', ...a),
  error: (...a) => console.error('[ERROR]', ...a),
  debug: (...a) => { if (!IS_PROD) console.log('[DEBUG]', ...a); }
};

// ─── Tipos MIME ───────────────────────────────────────────────────────────────
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.gif':  'image/gif',
};

// ─── Funções Criptográficas Auxiliares ────────────────────────────────────────
function hashPassword(plainPassword) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(plainPassword), salt, 64).toString('hex');
  return { hash, salt };
}

function verifyPassword(candidatePassword, storedHash, storedSalt) {
  if (!storedHash || !storedSalt || !candidatePassword) return false;
  try {
    const candidateHash = crypto.scryptSync(String(candidatePassword), storedSalt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

// ─── Gerador de Código Limpo (sem nomes de jogos) ─────────────────────────────
function generateCleanRoomId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  let prefix = '';
  for (let i = 0; i < 3; i++) prefix += chars.charAt(Math.floor(Math.random() * chars.length));
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
}

// ─── Servidor HTTP Seguro ─────────────────────────────────────────────────────
const httpServer = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(self), microphone=(self), display-capture=(self)');
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' data: blob: https://fonts.googleapis.com https://fonts.gstatic.com; connect-src 'self' ws: wss:; img-src 'self' data: blob: https:; media-src 'self' data: blob:;");

  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    res.writeHead(400);
    return res.end('URL inválida');
  }

  let pathname = parsedUrl.pathname;

  // ── Endpoints de saúde (Render.com health check) ─────────────────────────
  if (pathname === '/healthz' || pathname === '/ping' || pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime(),
      connections: wss.clients.size,
      time: new Date().toISOString()
    }));
  }

  // ── Prevenção de Path Traversal ───────────────────────────────────────────
  const safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safePath === '/' ? 'index.html' : safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Acesso proibido');
  }

  fs.stat(filePath, (err, stats) => {
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
        'Cache-Control': ext === '.html' ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400',
      });
      res.end(data);
    });
  });
});

// ─── WebSocket Signaling ──────────────────────────────────────────────────────
const wss = new WebSocketServer({
  server: httpServer,
  maxPayload: 128 * 1024 * 1024, // 128 MB — SDP e candidatos ICE grandes
  perMessageDeflate: false        // Sem compressão: menor latência no signaling
});

// rooms: Map<roomId, RoomObject>
const rooms = new Map();

// Proteção Anti-Força Bruta: IP → { count, blockedUntil }
const loginAttempts = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of loginAttempts.entries()) {
    if (data.blockedUntil < now && data.count === 0) loginAttempts.delete(ip);
    else if (data.blockedUntil > 0 && data.blockedUntil < now) {
      loginAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function getRealClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || '127.0.0.1';
}

function broadcast(ws, data) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcastAll(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) client.send(payload);
  });
}

function getPublicRoomsList() {
  const list = [];
  for (const [id, room] of rooms.entries()) {
    if (!room.host || room.isPrivate || !room.isPublic) continue;
    list.push({
      id,
      title: room.title || `Sala de ${room.hostName || 'Host'}`,
      category: room.category || 'Sem Categoria',
      quality: room.quality || '1080p 60fps',
      hostName: room.hostName || 'Host',
      viewersCount: room.viewers.size,
      hasHost: true,
      hasScreenShare: !!room.hasScreenShare,
      allowVoice: room.allowVoice !== false,
      isPrivate: false,
      createdAt: room.createdAt || Date.now()
    });
  }
  return list;
}

function getStats() {
  let totalStreams = 0;
  let totalViewers = 0;
  for (const room of rooms.values()) {
    if (room.hasScreenShare) totalStreams++;
    totalViewers += room.viewers.size;
  }
  return {
    totalStreams, // REAL: apenas transmissões de tela ativas
    totalRooms: rooms.size, // REAL: total de salas/calls ativas
    totalViewers,
    onlineUsers: wss.clients.size, // REAL: contagem exata de conexões WebSocket
    uptimeSeconds: Math.floor(process.uptime()),
    uptimeFormatted: formatUptime(process.uptime())
  };
}

function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}min`;
}

// ─── Extrair lista de participantes de uma sala (Estilo Discord) ──────────────
function getRoomParticipants(room) {
  const list = [];
  if (room.host && room.host.isAuthenticated) {
    list.push({
      id: 'host',
      name: room.hostName || 'Dono',
      tag: room.hostTag || '#0001',
      avatar: room.hostAvatar || null,
      role: 'Dono',
      isSpeaking: !!room.hostIsSpeaking,
      isMuted: !!room.hostIsMuted,
      isDeafened: !!room.hostIsDeafened,
      isSharingScreen: !!room.hasScreenShare
    });
  }
  for (const [vId, vWs] of room.viewers.entries()) {
    if (vWs && vWs.isAuthenticated) {
      list.push({
        id: vId,
        name: vWs.viewerName || `Player-${vId.substring(0, 4)}`,
        tag: vWs.viewerTag || '#0000',
        avatar: vWs.viewerAvatar || null,
        role: vWs.userRole || 'Membro',
        isSpeaking: !!vWs.isSpeaking,
        isMuted: !!vWs.isMuted,
        isDeafened: !!vWs.isDeafened,
        isSharingScreen: !!vWs.isSharingScreen
      });
    }
  }
  return list;
}

function broadcastRoomParticipants(room) {
  if (!room) return;
  const participants = getRoomParticipants(room);
  const payload = {
    type: 'room-participants',
    roomId: room.id,
    allowVoice: room.allowVoice !== false,
    hasScreenShare: !!room.hasScreenShare,
    screenSharerName: room.screenSharerName || null,
    participants
  };
  if (room.host) broadcast(room.host, payload);
  room.viewers.forEach(v => { if (v.isAuthenticated) broadcast(v, payload); });
}

// ─── Chat Global da Comunidade (RAM apenas, 100% real) ───────────────────────
const communityMessages = [];

// ─── Heartbeat Keep-Alive: 20s ───────────────────────────────────────────────
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 20000);

wss.on('close', () => clearInterval(heartbeatInterval));

wss.on('connection', (ws, req) => {
  ws.isAlive = true;
  ws.clientIp = getRealClientIp(req);
  ws.on('pong', () => { ws.isAlive = true; });

  ws.role = null;
  ws.roomId = null;
  ws.viewerId = null;
  ws.userRole = 'Membro';
  ws.isMuted = false;
  ws.isSpeaking = false;
  ws.isDeafened = false;
  ws.isSharingScreen = false;
  ws.isAuthenticated = false;

  // Enviar dados reais ao conectar
  broadcast(ws, { type: 'public-rooms-list', rooms: getPublicRoomsList() });
  broadcast(ws, { type: 'community-chat-history', messages: communityMessages });
  broadcast(ws, { type: 'stats', stats: getStats() });

  // Notificar todos sobre o novo usuário online
  broadcastAll({ type: 'stats', stats: getStats() });

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      // ── Lista de Salas Públicas ────────────────────────────────────────────
      case 'get-public-rooms': {
        broadcast(ws, { type: 'public-rooms-list', rooms: getPublicRoomsList() });
        break;
      }

      // ── Estatísticas ──────────────────────────────────────────────────────
      case 'get-stats': {
        broadcast(ws, { type: 'stats', stats: getStats() });
        break;
      }

      // ── Latência (ping/pong) ──────────────────────────────────────────────
      case 'client-ping': {
        broadcast(ws, { type: 'client-pong', timestamp: msg.timestamp });
        break;
      }

      // ── Chat Global da Comunidade (100% real) ─────────────────────────────
      case 'community-chat': {
        if (ws.isMuted) {
          broadcast(ws, { type: 'error', message: 'Você está temporariamente silenciado.' });
          return;
        }

        const text = String(msg.text || '').trim().slice(0, 500);

        let fileAttachment = null;
        if (msg.file && typeof msg.file === 'object') {
          const rawName = String(msg.file.name || 'arquivo').slice(0, 100);
          const safeName = path.basename(rawName).replace(/[^\w.\-_ ]/g, '_');
          const fileType = String(msg.file.type || 'application/octet-stream').slice(0, 50);
          const fileSize = parseInt(msg.file.size, 10) || 0;
          const fileData = typeof msg.file.data === 'string' ? msg.file.data : null;

          if (fileSize > 8 * 1024 * 1024) {
            broadcast(ws, { type: 'error', message: 'Arquivo acima do limite de 8 MB.' });
            return;
          }

          if (fileData && fileData.startsWith('data:')) {
            fileAttachment = {
              name: safeName,
              type: fileType,
              size: fileSize,
              isImage: fileType.startsWith('image/'),
              data: fileData
            };
          }
        }

        if (!text && !fileAttachment) return;

        const senderName = (msg.name || ws.hostName || ws.viewerName || 'Player').trim().slice(0, 24);
        const chatMsg = {
          id: String(Date.now() + Math.random().toString(36).substr(2, 4)),
          name: senderName,
          role: ws.userRole || msg.role || 'Membro',
          avatar: msg.avatar || ws.hostAvatar || ws.viewerAvatar || null,
          text,
          file: fileAttachment,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        communityMessages.push(chatMsg);
        if (communityMessages.length > 50) communityMessages.shift();

        broadcastAll({ type: 'community-chat', message: chatMsg });
        break;
      }

      // ── Host cria sala ou call de voz ─────────────────────────────────────
      case 'host-create': {
        let roomId = String(msg.roomId || '').toUpperCase().trim().replace(/[^A-Z0-9\-]/g, '');
        if (!roomId || roomId.length < 4) {
          do {
            roomId = generateCleanRoomId();
          } while (rooms.has(roomId));
        } else if (rooms.has(roomId)) {
          const existing = rooms.get(roomId);
          if (existing && existing.host !== ws) {
            roomId = `${roomId}-${Math.floor(1000 + Math.random() * 9000)}`;
          }
        }

        const isPrivate = !!msg.isPrivate;
        const isPublic = !!msg.isPublic;
        const allowVoice = msg.allowVoice !== false; // Padrão: true (false se 'Apenas Ouvintes')
        const hasScreenShare = !!msg.hasScreenShare; // Se iniciou compartilhando tela ou apenas call de voz

        let passwordHash = null;
        let salt = null;

        if (isPrivate && msg.password) {
          const cleanPass = String(msg.password).trim();
          if (cleanPass.length > 0) {
            const hashed = hashPassword(cleanPass);
            passwordHash = hashed.hash;
            salt = hashed.salt;
          }
        }

        const title = String(msg.title || `Call de ${msg.name || 'Player'}`).trim().slice(0, 80);
        const category = msg.category && msg.category.trim() !== '' && msg.category !== 'Sem Categoria'
          ? String(msg.category).trim().slice(0, 40) : 'Sem Categoria';
        const quality = String(msg.quality || '1080p 60fps').trim().slice(0, 25);

        const hostName = (msg.name || 'Dono').trim().slice(0, 24);
        const hostTag = (msg.tag || '#0001').trim().slice(0, 10);
        const hostAvatar = msg.avatar ? String(msg.avatar).slice(0, 50000) : null;

        const newRoom = {
          id: roomId,
          host: ws,
          hostName,
          hostTag,
          hostAvatar,
          hostIsSpeaking: false,
          hostIsMuted: false,
          hostIsDeafened: false,
          title,
          category,
          quality,
          viewers: new Map(),
          isPrivate,
          isPublic,
          allowVoice,
          hasScreenShare,
          screenSharerName: hasScreenShare ? hostName : null,
          passwordHash,
          salt,
          createdAt: Date.now()
        };

        rooms.set(roomId, newRoom);

        ws.role = 'host';
        ws.userRole = 'Dono';
        ws.roomId = roomId;
        ws.hostName = hostName;
        ws.hostTag = hostTag;
        ws.hostAvatar = hostAvatar;
        ws.isSharingScreen = hasScreenShare;
        ws.isAuthenticated = true;

        broadcast(ws, {
          type: 'room-created',
          roomId,
          title,
          category,
          quality,
          isPrivate,
          userRole: 'Dono',
          allowVoice,
          hasScreenShare
        });

        broadcastRoomParticipants(newRoom);
        broadcastAll({ type: 'public-rooms-list', rooms: getPublicRoomsList() });
        broadcastAll({ type: 'stats', stats: getStats() });
        break;
      }

      // ── Viewer / Participante entra na sala/call ───────────────────────────
      case 'viewer-join': {
        const targetRoomId = String(msg.roomId || '').toUpperCase().trim();
        const clientIp = ws.clientIp;

        const attempts = loginAttempts.get(clientIp) || { count: 0, blockedUntil: 0 };
        if (attempts.blockedUntil > Date.now()) {
          const remainingSec = Math.ceil((attempts.blockedUntil - Date.now()) / 1000);
          broadcast(ws, { type: 'error', message: `Muitas tentativas incorretas. Aguarde ${remainingSec}s.` });
          return;
        }

        const room = rooms.get(targetRoomId);
        if (!room) {
          broadcast(ws, { type: 'error', message: 'Sala não encontrada. Verifique o código.' });
          return;
        }

        if (room.isPrivate && room.passwordHash && room.salt) {
          const candidatePass = String(msg.password || '').trim();
          const isValid = verifyPassword(candidatePass, room.passwordHash, room.salt);

          if (!isValid) {
            attempts.count += 1;
            if (attempts.count >= 5) {
              attempts.blockedUntil = Date.now() + 60000;
              loginAttempts.set(clientIp, attempts);
              broadcast(ws, { type: 'error', message: 'Limite de tentativas atingido. Bloqueado por 1 minuto.' });
              return;
            }
            loginAttempts.set(clientIp, attempts);
            broadcast(ws, { type: 'error', message: `Senha incorreta (${attempts.count}/5 tentativas).` });
            return;
          } else {
            loginAttempts.delete(clientIp);
          }
        }

        const viewerId = Math.random().toString(36).substring(2, 10);
        ws.role = 'viewer';
        ws.roomId = targetRoomId;
        ws.viewerId = viewerId;
        ws.viewerName = (msg.name || `Player-${viewerId.substring(0, 4)}`).trim().slice(0, 24);
        ws.viewerTag = (msg.tag || '#0000').trim().slice(0, 10);
        ws.viewerAvatar = msg.avatar ? String(msg.avatar).slice(0, 50000) : null;
        ws.userRole = 'Membro';
        ws.isMuted = room.allowVoice === false;
        ws.isSpeaking = false;
        ws.isDeafened = false;
        ws.isSharingScreen = false;
        ws.isAuthenticated = true;

        room.viewers.set(viewerId, ws);

        broadcast(ws, {
          type: 'joined',
          roomId: targetRoomId,
          viewerId,
          userRole: ws.userRole,
          hostPresent: !!room.host,
          hostName: room.hostName,
          title: room.title,
          category: room.category,
          quality: room.quality,
          allowVoice: room.allowVoice !== false,
          hasScreenShare: !!room.hasScreenShare
        });

        if (room.host) {
          broadcast(room.host, {
            type: 'viewer-joined',
            viewerId,
            name: ws.viewerName,
            userRole: ws.userRole,
            count: room.viewers.size
          });
        }

        broadcastRoomParticipants(room);
        broadcastAll({ type: 'public-rooms-list', rooms: getPublicRoomsList() });
        broadcastAll({ type: 'stats', stats: getStats() });
        break;
      }

      // ── Dono Alterna Permissão de Voz da Sala (Apenas Ouvintes <-> Liberado)
      case 'host-toggle-voice': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || ws.role !== 'host') return;

        room.allowVoice = !!msg.allowVoice;
        broadcastRoomParticipants(room);

        // Se silenciou todos, muta todos os espectadores
        if (!room.allowVoice) {
          room.viewers.forEach(v => { v.isMuted = true; v.isSpeaking = false; });
          broadcastRoomParticipants(room);
        }
        break;
      }

      // ── Alternar Compartilhamento de Tela Dinamicamente ─────────────────────
      case 'set-screen-share': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;

        const active = !!msg.active;
        room.hasScreenShare = active;
        ws.isSharingScreen = active;
        room.screenSharerName = active ? (ws.role === 'host' ? room.hostName : ws.viewerName) : null;

        broadcastRoomParticipants(room);
        broadcastAll({ type: 'public-rooms-list', rooms: getPublicRoomsList() });
        broadcastAll({ type: 'stats', stats: getStats() });
        break;
      }

      // ── Sinalização WebRTC ────────────────────────────────────────────────
      case 'offer': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || ws.role !== 'host') return;
        const targetViewer = room.viewers.get(msg.targetId);
        if (targetViewer && targetViewer.isAuthenticated) {
          broadcast(targetViewer, { type: 'offer', sdp: msg.sdp, fromId: 'host' });
        }
        break;
      }

      case 'request-offer': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || !room.host) return;
        broadcast(room.host, {
          type: 'viewer-joined',
          viewerId: ws.viewerId,
          name: ws.viewerName,
          userRole: ws.userRole,
          count: room.viewers.size
        });
        break;
      }

      case 'answer': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || !room.host) return;
        broadcast(room.host, { type: 'answer', sdp: msg.sdp, fromId: ws.viewerId });
        break;
      }

      case 'candidate': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;
        if (ws.role === 'host') {
          const targetViewer = room.viewers.get(msg.targetId);
          if (targetViewer && targetViewer.isAuthenticated) {
            broadcast(targetViewer, { type: 'candidate', candidate: msg.candidate, fromId: 'host' });
          }
        } else {
          if (room.host && room.host.isAuthenticated) {
            broadcast(room.host, { type: 'candidate', candidate: msg.candidate, fromId: ws.viewerId });
          }
        }
        break;
      }

      case 'request-keyframe': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || !room.host) return;
        broadcast(room.host, { type: 'request-keyframe', viewerId: ws.viewerId });
        break;
      }

      // ── Voz Bidirecional ──────────────────────────────────────────────────
      case 'viewer-voice-offer': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || !room.host) return;
        broadcast(room.host, { type: 'viewer-voice-offer', sdp: msg.sdp, fromId: ws.viewerId, name: ws.viewerName });
        break;
      }

      case 'host-voice-answer': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || ws.role !== 'host') return;
        const targetViewer = room.viewers.get(msg.targetId);
        if (targetViewer && targetViewer.isAuthenticated) {
          broadcast(targetViewer, { type: 'host-voice-answer', sdp: msg.sdp });
        }
        break;
      }

      case 'voice-status': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;

        ws.isSpeaking = !!msg.isSpeaking;
        if (typeof msg.isMuted === 'boolean') ws.isMuted = msg.isMuted;
        if (typeof msg.isDeafened === 'boolean') ws.isDeafened = msg.isDeafened;

        if (ws.role === 'host') {
          room.hostIsSpeaking = ws.isSpeaking;
          room.hostIsMuted = ws.isMuted;
          room.hostIsDeafened = ws.isDeafened;
          if (msg.avatar) room.hostAvatar = msg.avatar;
        } else {
          if (msg.avatar) ws.viewerAvatar = msg.avatar;
        }

        broadcastRoomParticipants(room);
        break;
      }

      case 'switch-window': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || ws.role !== 'host') return;
        room.viewers.forEach(v => {
          if (v.isAuthenticated) broadcast(v, { type: 'stream-switched' });
        });
        break;
      }

      // ── Chat Interno da Sala ───────────────────────────────────────────────
      case 'chat': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;

        const text = String(msg.text || '').trim().slice(0, 500);

        let fileAttachment = null;
        if (msg.file && typeof msg.file === 'object') {
          const rawName = String(msg.file.name || 'arquivo').slice(0, 100);
          const safeName = path.basename(rawName).replace(/[^\w.\-_ ]/g, '_');
          const fileType = String(msg.file.type || 'application/octet-stream').slice(0, 50);
          const fileSize = parseInt(msg.file.size, 10) || 0;
          const fileData = typeof msg.file.data === 'string' ? msg.file.data : null;

          if (fileSize <= 8 * 1024 * 1024 && fileData && fileData.startsWith('data:')) {
            fileAttachment = {
              name: safeName,
              type: fileType,
              size: fileSize,
              isImage: fileType.startsWith('image/'),
              data: fileData
            };
          }
        }

        if (!text && !fileAttachment) return;

        const senderName = ws.role === 'host' ? (ws.hostName || 'Dono') : (ws.viewerName || 'Player');
        const chatMsg = {
          type: 'chat',
          name: senderName,
          role: ws.userRole || 'Membro',
          avatar: ws.role === 'host' ? room.hostAvatar : ws.viewerAvatar,
          text,
          file: fileAttachment,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        if (room.host) broadcast(room.host, chatMsg);
        room.viewers.forEach(v => { if (v.isAuthenticated) broadcast(v, chatMsg); });
        break;
      }

      // ── Encerrar Transmissão / Call ───────────────────────────────────────
      case 'end-stream': {
        if (!ws.isAuthenticated || !ws.roomId) return;
        const room = rooms.get(ws.roomId);
        if (!room || ws.role !== 'host') return;
        room.viewers.forEach(v => broadcast(v, { type: 'stream-ended' }));
        rooms.delete(ws.roomId);
        broadcastAll({ type: 'public-rooms-list', rooms: getPublicRoomsList() });
        broadcastAll({ type: 'stats', stats: getStats() });
        break;
      }
    }
  });

  ws.on('close', () => {
    if (!ws.roomId) {
      broadcastAll({ type: 'stats', stats: getStats() });
      return;
    }
    const room = rooms.get(ws.roomId);
    if (!room) {
      broadcastAll({ type: 'stats', stats: getStats() });
      return;
    }

    if (ws.role === 'host') {
      room.viewers.forEach(v => broadcast(v, { type: 'stream-ended' }));
      rooms.delete(ws.roomId);
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
      broadcastRoomParticipants(room);
    }

    broadcastAll({ type: 'public-rooms-list', rooms: getPublicRoomsList() });
    broadcastAll({ type: 'stats', stats: getStats() });
  });

  ws.on('error', (err) => {
    log.debug('WebSocket error:', err.message);
  });
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
function gracefulShutdown(signal) {
  log.info(`${signal} recebido — encerrando servidor graciosamente...`);
  broadcastAll({ type: 'server-shutdown', message: 'Servidor reiniciando. Reconecte em instantes.' });

  httpServer.close(() => {
    log.info('Servidor HTTP encerrado.');
    clearInterval(heartbeatInterval);
    wss.close(() => {
      log.info('WebSocket Server encerrado. Saindo.');
      process.exit(0);
    });
  });

  setTimeout(() => {
    log.warn('Encerramento forçado após timeout.');
    process.exit(1);
  }, 8000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT',  () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  log.error('Exceção não capturada:', err.message);
  if (!IS_PROD) console.error(err.stack);
});
process.on('unhandledRejection', (reason) => {
  log.error('Promise rejeitada:', reason);
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

  log.info(`Zyro Stream v2.0 rodando em http://localhost:${PORT}`);
  if (!IS_PROD) {
    log.info(`Rede local: http://${localIP}:${PORT}`);
    log.info(`Health check: http://localhost:${PORT}/healthz`);
  }
});
