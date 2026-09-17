# 🚀 Guia Completo: Como Subir / Atualizar o Zyro no Render.com

Este guia ensina exatamente o que fazer para atualizar seu sistema existente no **Render.com** com todas as melhorias de qualidade, layout corrigido, barra lateral fixa e direitos reservados.

---

## 📋 Resumo das Otimizações Feitas para o Render

1. **Pronto para a Nuvem Render**:
   - `render.yaml` ajustado com `rootDir: .` para funcionar diretamente na raiz do repositório.
   - Endpoint de verificação de integridade `/healthz` respondendo `200 OK` instantaneamente para o Render não derrubar a aplicação.
   - Servidor configurado para escutar dinamicamente em `process.env.PORT` e host `0.0.0.0`.
   - **Keep-Alive Inteligente**: Pings WebSocket automáticos a cada 25 segundos para impedir que o proxy do Render encerre conexões ociosas.
   - `.gitignore` criado para evitar o envio de pastas pesadas (`node_modules/`, backups e arquivos de teste).

2. **Qualidade Máxima de Vídeo e Áudio**:
   - Presets **Ultra HD 4K (60 FPS - 18 Mbps)**, **Quad HD 2K (14 Mbps)**, **Full HD 1080p Ultra (10 Mbps)** e **Modo Gamer Fluido**.
   - Codec **H.264 acelerado por Hardware (GPU)** priorizado.
   - Áudio Opus estéreo a **320 kbps** com 48 kHz e pacotes de 10ms para zero atraso de voz.
   - Remoção de travas de resolução que limitavam telas de alta definição.

3. **Correção da Barra Lateral & Layout**:
   - A barra lateral de opções da esquerda agora possui fixação permanente (`position: fixed`). Ao rolar a página para baixo, ela nunca mais sobe ou some da tela.

4. **Direitos Reservados & Rodapé Oficial**:
   - Rodapé moderno e completo com indicação oficial de copyright (`© 2026 Zyro Stream Technologies. Todos os direitos reservados.`), badges de segurança e status do servidor.

---

## 🛠️ Passo a Passo: Atualizando o Sistema no Render

### Opção 1: Se você já tem o repositório conectado no GitHub (Recomendado)

Se o seu serviço no Render está conectado a um repositório no seu GitHub, basta enviar os arquivos atualizados:

1. Abra o terminal na pasta do projeto:
   ```bash
   git add .
   git commit -m "Zyro v2.5: Barra lateral fixa, direitos reservados, WebRTC 4K e otimizações Render"
   git push origin main
   ```
   *(Substitua `main` por `master` caso sua branch principal seja master)*

2. O **Render detectará o novo commit automaticamente** (autoDeploy: true) e iniciará o build.
3. Aguarde cerca de 1 a 2 minutos até que o status mude para **"Live" (Verde)**.

---

### Opção 2: Se você quer forçar a atualização ou reimplantar manualmente no painel do Render

1. Acesse seu painel no [Render Dashboard](https://dashboard.render.com).
2. Clique no seu serviço Web existente (ex: `streamshare-discord` ou `zyro-stream`).
3. No canto superior direito, clique no botão azul **"Manual Deploy"**.
4. Selecione a opção **"Clear build cache & deploy"** (isso garante que qualquer arquivo antigo seja limpo e as novas dependências instaladas do zero).
5. Acompanhe os logs na aba **"Logs"**:
   - Você verá:
     ```text
     ==> Running build command 'npm install'...
     ==> Starting service with 'node server.js'...
     🛡️ ZYRO SEGURO - TRANSMISSÃO HD P2P & VOZ 🎙️
     Render.com: /healthz ativo e roteamento de sala 100%
     ==> Your service is live 🎉
     ```

---

### Opção 3: Se você ainda não conectou o Git ou deseja criar um novo serviço do zero

1. Inicialize o Git na pasta caso ainda não o tenha feito:
   ```bash
   git init
   git add .
   git commit -m "Primeiro commit Zyro Pro"
   ```
2. Crie um novo repositório no seu GitHub (pode ser público ou privado) e faça o push:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```
3. No painel do **Render**:
   - Clique em **"New +"** -> **"Web Service"**.
   - Conecte sua conta do GitHub e selecione o repositório.
   - Em **Runtime**, selecione **Node**.
   - Em **Build Command**, coloque: `npm install`
   - Em **Start Command**, coloque: `node server.js`
   - Em **Health Check Path**, digite: `/healthz`
   - Escolha o plano **Free**.
   - Clique em **"Deploy Web Service"**.

---

## 🔒 Dicas de Segurança e Funcionamento na Nuvem

- **HTTPS / WSS Automático**: O Render gera automaticamente certificado SSL gratuito (`https://seu-app.onrender.com`). O sistema detecta isso sozinho e conecta os WebSockets de sinalização diretamente via `wss://`.
- **Compartilhamento de Tela**: Navegadores modernos (Chrome, Edge, Opera, Firefox) exigem conexão segura HTTPS para liberar a captura de tela (`getDisplayMedia`). Com o link HTTPS do Render, a captura funciona perfeitamente sem bloqueios de segurança!
- **Zero Firewall / Port Forwarding**: A transmissão P2P utiliza servidores STUN do Google e Cloudflare já configurados no sistema, atravessando roteadores e redes móveis sem precisar abrir portas.
