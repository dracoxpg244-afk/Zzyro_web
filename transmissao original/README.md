# StreamShare Discord Edition 🎮📺

Sistema completo de transmissão de tela em alta definição e chamadas em tempo real via **WebRTC** com interface inspirada no **Discord**.

---

## ✨ O Que Há de Novo nesta Versão:

1. **🎨 Interface Inspirada no Discord**:
   - Sidebar de servidores com ícones redondos e transição animada.
   - Logo exclusiva animada com efeito de transmissão de áudio/vídeo e neon pulse.
   - Categorias de canais (Voz/Transmissão e Texto).
   - Rodapé com perfil do usuário, indicador visual de microfone ativo (anel verde de fala) e botão de ensurdecer (deafen).
   - Palco de apresentação com grid de participantes e visualização de streams.

2. **☁️ Correção Definitiva para Render.com**:
   - Resolução do problema de "loop e tela carregando sem erro".
   - Endpoint de saúde `/healthz` configurado para deploys no Render.
   - Tratamento seguro de URLs com query parameters (`?server=...`).
   - Keep-alive heartbeat a cada 25 segundos no WebSocket (impede timeout de conexões no proxy do Render).
   - Watchdog de conexão no WebRTC com múltiplos servidores STUN do Google e Cloudflare.

3. **🎛️ Controles Avançados do Player**:
   - **🖥️ Trocar Janela de Transmissão**: Alterne qual tela ou aplicativo você está transmitindo com 1 clique, sem precisar encerrar a chamada ou desconectar os espectadores (`RTCRtpSender.replaceTrack`).
   - **🔍 Zoom Interativo**: Controle deslizante de 100% até 300% com recurso de arrastar (pan) quando ampliado e botão de redefinir.
   - **🔊 Controle Real de Volume**: Slider de volume com suporte de ganho até 150% e botão de mudo rápido.
   - **⛶ Modo Tela Cheia**: Otimizado com barra flutuante de controles que se oculta automaticamente após 3 segundos de inatividade do mouse.

4. **🏰 Servidores e Salas Públicas & Privadas**:
   - Crie novos servidores com nome personalizado, ícone/emoji e opção de senha.
   - Crie canais de voz ou texto públicos ou restritos por cargo.
   - Link de convite com 1 clique para compartilhar com amigos.

5. **👑 Sistema de Cargos e Permissões**:
   - Cargos personalizáveis com cores (Dono 👑, Moderador 🛡️, VIP ⭐, Membro 👥).
   - Permissões configuráveis:
     - Mutar participantes na call.
     - Encerrar transmissão de tela de outros participantes.
     - Acessar canais e salas privadas.
     - Criar e gerenciar canais e cargos.

---

## 🚀 Como Rodar Localmente

```bash
npm install
npm start
```

- Acesse no navegador: **http://localhost:3000**
- Seus amigos na mesma rede local acessam: **http://SEU-IP:3000**

---

## ☁️ Como Subir no Render.com (Gratuito)

1. Suba o projeto para seu repositório no **GitHub**:
   ```bash
   git add .
   git commit -m "StreamShare Discord Edition"
   git push origin main
   ```
2. Acesse seu painel no [Render.com](https://render.com) e crie um novo **Web Service**.
3. Selecione o repositório e confirme as configurações:
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Health Check Path:** `/healthz`
   - **Plan:** `Free`
4. Clique em **Deploy**! O Render iniciará o serviço e verificará a saúde da rota `/healthz` automaticamente.

---

## 🔒 Segurança

- Proteção total contra Path Traversal no servidor HTTP.
- Prevenção contra ataques Cross-Site Scripting (XSS) no chat e nomes de usuário com renderização segura no DOM.
- Validação no servidor de permissões para ações moderativas.
