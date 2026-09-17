# StreamShare – Plataforma Aconchegante de Transmissão HD, Voz & Comunidade Segura 🎬🎙️✨

Sistema completo de transmissão de tela, comunicação por voz bidirecional (falar e escutar), compartilhamento seguro de fotos e arquivos e salas protegidas por senha contra invasores, via **WebRTC P2P** e **WebSocket**.

Desenvolvido com uma **paleta de cores neutras e acolhedoras** para proporcionar uma experiência confortável a todas as pessoas (homens, mulheres, gamers e criadores de conteúdo), com **privacidade total e zero roubo de dados**.

## 🔒 Segurança Máxima & Privacidade Total (Zero Roubo de Dados)

- **Zero Telemetria e Zero Rastreamento**: A aplicação não coleta, armazena nem envia dados pessoais, cookies de rastreamento ou dados analíticos para ninguém. Toda transmissão de tela, áudio e arquivos é direta **P2P (Peer-to-Peer)** com criptografia nativa WebRTC (DTLS/SRTP).
- **Proteção de Salas por Senha Contra Invasores**:
  - Salas privadas exigem senha para liberar o streaming e o áudio.
  - O fluxo de vídeo/áudio **só é entregue** após o servidor validar a senha.
- **Defesa Anti-Força Bruta (Anti-Brute Force)**:
  - Limite de 5 tentativas de senha incorreta por conexão/IP.
  - Após 5 erros, a conexão é bloqueada temporariamente por 30 segundos para impedir robôs e invasores.
- **Headers de Segurança HTTP Ativos**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN` (anti-clickjacking)
  - `Referrer-Policy: no-referrer`
  - Content Security Policy (CSP) restrito
  - Sanitização rigorosa contra XSS e injeção de scripts no DOM.

---

## 🎙️ Comunicação de Voz Bidirecional (Falar, Conversar e Escutar)

- **Microfone do Host**: Transmita sua voz junto com a tela do computador.
- **Microfone dos Espectadores**: Participantes na sala podem clicar no botão de microfone flutuante para **falar e conversar na sala ao vivo**.
- **Indicador Visual de Fala**: Anel verde luminoso ao redor do avatar quando o usuário estiver falando (monitorado por medidor de amplitude Web Audio API).
- **Ensurdecer (Deafen)**: Botão para silenciar o áudio de todos na sala com um clique quando quiser apenas assistir ou focar.

---

## 📷 Envio Seguro de Fotos e Arquivos no Chat

- **Fotos**: Envie capturas de tela, fotos e imagens (PNG, JPG, WEBP, GIF) diretamente no chat da sala ou no chat da comunidade.
  - Miniatura segura na conversa.
  - Clique na foto para abrir em tela cheia no visualizador modal.
- **Arquivos & Documentos**: Envie arquivos de até 10 MB com botão de download seguro.
- **Proteção**: Sanitização automática de nomes de arquivo e validação de tamanho para proteção contra DoS.

---

## 🎮 Categorias Opcionais & Jogos (DayZ, CS 2, GTA RP, etc.)

- **Categoria 100% Opcional**: Você pode transmitir sem nenhuma categoria selecionada ("Sem Categoria / Opcional").
- **Opções Prontas**:
  - 🌲 **DayZ**
  - 💣 **Counter-Strike 2 (CS 2)**
  - 🚗 **GTA RP**
  - 🎯 **Valorant**
  - ☕ **Just Chatting / Conversa**
  - 💻 **Tecnologia & Dev**
  - ✨ **Outros**

---

## 👤 Personalização Total do Perfil

- **Foto de Perfil**: Faça upload de qualquer foto para o seu avatar.
- **Tag Personalizada**: Defina sua tag (ex: `#8321`).
- **Status de Presença**: Online (Verde), Ausente (Amarelo), Ocupado (Vermelho) ou Invisível.
- **Biografia & Preferências**: Salvos no navegador sem necessidade de cadastro.

---

## ☁️ Como Subir a Nova Versão no GitHub e no Render.com

### 1. No GitHub:
1. Acesse o seu repositório no [GitHub](https://github.com).
2. Clique em **Add file** ➔ **Upload files**.
3. Arraste e solte os arquivos atualizados:
   - `server.js`
   - O arquivo `index.html` (dentro da pasta `public/`)
   - `README.md`
4. Digite a mensagem de commit (ex: `StreamShare seguro com voz, fotos e categorias opcionais`).
5. Clique em **Commit changes**.

### 2. No Render.com:
- O Render possui deploy automático ativado (`autoDeploy: true`).
- **Em 1 a 2 minutos após o commit no GitHub, o Render atualizará seu site sozinho!**
- Para verificar ou forçar manualmente, acesse o painel do [Render.com](https://dashboard.render.com), entre no seu serviço e clique em **Manual Deploy** ➔ **Deploy latest commit**.

