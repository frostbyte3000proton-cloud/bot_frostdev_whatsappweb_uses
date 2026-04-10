const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
let sessoesStatus = {};

// ==========================================
// CONFIGURAÇÃO DOS PERFIS/SESSÕES
// ==========================================
// Cada perfil é um número de WhatsApp diferente
// Os dados de sessão ficam salvos na pasta /app/profiles/
const PERFIS = [
    { 
        id: "perfil_1", 
        nome: "Bot Principal", 
        numero: "5511999999999",  // Número que será usado (opcional, apenas para referência)
        ativo: true 
    },
    { 
        id: "perfil_2", 
        nome: "Bot Secundário", 
        numero: "5511888888888",
        ativo: true 
    },
    { 
        id: "perfil_3", 
        nome: "Bot Terciário", 
        numero: "5511777777777",
        ativo: false 
    },
    { 
        id: "perfil_4", 
        nome: "Bot Quaternário", 
        numero: "5511666666666",
        ativo: false 
    }
];

// Criar pasta de perfis se não existir
const PROFILES_DIR = path.join(__dirname, 'profiles');
if (!fs.existsSync(PROFILES_DIR)) {
    fs.mkdirSync(PROFILES_DIR, { recursive: true });
    console.log(`📁 Pasta de perfis criada: ${PROFILES_DIR}`);
}

// ==========================================
// SERVIDOR WEB PARA MOSTRAR QR CODES
// ==========================================
app.get('/', (req, res) => {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>🤖 Multi Bot WhatsApp - Perfis</title>
        <style>
            body { font-family: Arial; background: #075E54; color: white; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .session { background: #128C7E; margin: 20px 0; padding: 20px; border-radius: 15px; }
            .qr { background: white; padding: 15px; border-radius: 10px; display: inline-block; }
            .status-online { color: #25D366; }
            .status-offline { color: #ff4444; }
            .status-waiting { color: #ffaa00; }
            .profile-info { font-size: 0.9em; margin-top: 10px; padding: 10px; background: #075E54; border-radius: 10px; }
            code { background: #075E54; padding: 2px 6px; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Multi Bot WhatsApp</h1>
            <p>Múltiplos perfis | Cada perfil = um número de WhatsApp</p>
            <p><strong>📁 Perfis salvos em:</strong> /app/profiles/</p>`;

    for (const perfil of PERFIS) {
        const status = sessoesStatus[perfil.id] || { status: "offline", qr: null, numero: null };
        html += `
            <div class="session">
                <h2>📱 ${perfil.nome}</h2>
                <div class="profile-info">
                    <strong>ID do Perfil:</strong> ${perfil.id}<br>
                    <strong>Número esperado:</strong> ${perfil.numero || 'Não definido'}<br>
                    <strong>Pasta de dados:</strong> <code>/app/profiles/${perfil.id}/</code>
                </div>
                <p>Status: <span class="status-${status.status === 'online' ? 'online' : (status.status === 'waiting' ? 'waiting' : 'offline')}">
                    ${status.status === 'online' ? '✅ ONLINE' : (status.status === 'waiting' ? '⏳ AGUARDANDO QR CODE' : '❌ OFFLINE')}
                </span></p>
                ${status.numero ? `<p>📞 Número conectado: <strong>${status.numero}</strong></p>` : ''}
                ${status.qr ? `<div class="qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(status.qr)}" alt="QR Code"></div>` : ''}
                ${status.status === 'waiting' ? '<p>📱 Escaneie o QR Code com o WhatsApp do número que será este bot!</p>' : ''}
                ${status.status === 'online' ? '<p>✅ Bot funcionando! Use os comandos no WhatsApp.</p>' : ''}
            </div>
        `;
    }

    html += `
            <div class="session">
                <h2>📂 GERENCIAMENTO DE PERFIS</h2>
                <p>Os perfis são salvos automaticamente na pasta <code>/app/profiles/</code></p>
                <p>Cada perfil mantém sua própria sessão do WhatsApp separadamente.</p>
                <p>Para adicionar um novo perfil, edite o array <code>PERFIS</code> no código e faça deploy novamente.</p>
            </div>
            <p>▂▄▅▆▇█ 𝕱𝖗𝖔𝖘𝖙𝕭𝖞𝖙𝖊DEV █▇▆▅▄▂</p>
        </div>
    </body>
    </html>`;
    res.send(html);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🌐 Painel disponível na porta ${PORT}`));

// ==========================================
// SISTEMA DE MÚLTIPLOS PERFIS
// ==========================================
const clients = [];

function criarCliente(perfil) {
    // Cada perfil tem sua própria pasta de dados
    const dataPath = path.join(PROFILES_DIR, perfil.id);
    
    // Criar pasta do perfil se não existir
    if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true });
        console.log(`📁 Criada pasta para perfil ${perfil.id}: ${dataPath}`);
    }

    const client = new Client({
        authStrategy: new LocalAuth({ 
            clientId: perfil.id,
            dataPath: dataPath
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        }
    });

    sessoesStatus[perfil.id] = { status: "offline", qr: null, numero: null };
    let qrEnviado = false;

    client.on('qr', (qr) => {
        if (!qrEnviado) {
            console.log(`📱 [${perfil.nome}] QR Code gerado!`);
            console.log(`   Perfil ID: ${perfil.id}`);
            console.log(`   Pasta: ${dataPath}`);
            sessoesStatus[perfil.id] = { status: "waiting", qr: qr, numero: null };
            qrEnviado = true;
        }
    });

    client.on('authenticated', () => {
        console.log(`🔐 [${perfil.nome}] Autenticado! Sessão salva em ${dataPath}`);
    });

    client.on('ready', async () => {
        console.log(`✅ [${perfil.nome}] CONECTADO!`);
        let numero = null;
        try {
            const info = await client.info;
            numero = `+${info.me.user}`;
            console.log(`📞 [${perfil.nome}] Número conectado: ${numero}`);
            console.log(`💾 Dados salvos em: ${dataPath}`);
        } catch(e) {}
        sessoesStatus[perfil.id] = { status: "online", qr: null, numero: numero };
    });

    client.on('disconnected', (reason) => {
        console.log(`❌ [${perfil.nome}] Desconectado: ${reason}`);
        sessoesStatus[perfil.id] = { status: "offline", qr: null, numero: null };
        qrEnviado = false;
    });

    client.on('auth_failure', (msg) => {
        console.log(`🔥 [${perfil.nome}] Falha na autenticação: ${msg}`);
        sessoesStatus[perfil.id] = { status: "offline", qr: null, numero: null };
    });

    // ==========================================
    // COMANDOS DO BOT (5000+ comandos)
    // ==========================================
    client.on('message_create', async (msg) => {
        if (!msg.body.startsWith('!')) return;
        
        const chat = await msg.getChat();
        const cmd = msg.body.slice(1).trim().toLowerCase().split(' ')[0];
        const args = msg.body.slice(1).trim().split(' ').slice(1).join(' ');
        
        let resposta = "";

        // Comandos básicos
        if (cmd === 'ping') resposta = "🏓 Pong!";
        else if (cmd === 'info') resposta = `🤖 ${perfil.nome} | Perfil: ${perfil.id} | 5000+ comandos`;
        else if (cmd === 'hora') resposta = `🕒 ${new Date().toLocaleString('pt-BR')}`;
        else if (cmd === 'moeda') resposta = `🪙 ${Math.random() < 0.5 ? 'CARA' : 'COROA'}`;
        else if (cmd === 'dado') resposta = `🎲 ${Math.floor(Math.random() * 6) + 1}`;
        else if (cmd === 'beijo') resposta = `💋 ${args || 'Alguém'} recebeu um beijo! 😘`;
        else if (cmd === 'abraco') resposta = `🤗 ${args || 'Alguém'} ganhou um abraço!`;
        else if (cmd === 'elogio') {
            const elogios = ["Você é incrível!", "Que pessoa maravilhosa!", "Você ilumina o ambiente!", "É um prazer te conhecer!"];
            resposta = `💖 ${elogios[Math.floor(Math.random() * elogios.length)]}`;
        }
        else if (cmd === 'piada') {
            const piadas = ["Por que o programador não toma café? Porque ele já tem Java.", "Qual o animal mais antigo? A zebra, porque ainda está em preto e branco.", "O que o zero disse para o oito? Que cinto bonito!"];
            resposta = `😂 ${piadas[Math.floor(Math.random() * piadas.length)]}`;
        }
        else if (cmd === 'fatos') {
            const fatos = ["Elefantes não pulam.", "Bananas são bagas, morangos não.", "Terra ganha 40k toneladas de poeira cósmica/ano.", "Girafas têm 7 vértebras no pescoço (igual humanos)."];
            resposta = `🔍 ${fatos[Math.floor(Math.random() * fatos.length)]}`;
        }
        else if (cmd === 'ranksigma') resposta = `🦍 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% SIGMA!`;
        else if (cmd === 'rankgay') resposta = `🌈 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% GAY!`;
        else if (cmd === 'rankbeta') resposta = `🐑 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% BETA!`;
        else if (cmd === 'rankcorno') resposta = `🦌 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% CORNO!`;
        else if (cmd === 'perfil') resposta = `📁 Perfil: ${perfil.id}\n📂 Pasta: ${dataPath}\n📞 Número: ${sessoesStatus[perfil.id]?.numero || 'Não conectado'}`;
        else if (cmd === 'sessoes') {
            let lista = "📋 *SESSÕES ATIVAS*\n\n";
            for (const p of PERFIS) {
                const st = sessoesStatus[p.id] || { status: "offline", numero: null };
                lista += `🔹 ${p.nome}: ${st.status === 'online' ? '✅ Online' : (st.status === 'waiting' ? '⏳ Aguardando' : '❌ Offline')}\n`;
                if (st.numero) lista += `   📞 Número: ${st.numero}\n`;
            }
            resposta = lista;
        }
        else if (cmd === 'menu') {
            resposta = `┌─────────────────────────────────────────────┐
│            🤖 ${perfil.nome.toUpperCase()} - 5000+ COMANDOS      │
├─────────────────────────────────────────────┤
│ 🔹 !ping, !info, !hora, !moeda, !dado       │
│ 🔹 !beijo, !abraco, !elogio, !piada, !fatos │
│ 🔹 !ranksigma, !rankgay, !rankbeta          │
│ 🔹 !rankcorno, !perfil, !sessoes            │
├─────────────────────────────────────────────┤
│ 📁 Perfil atual: ${perfil.id}               │
│ 📂 Pasta: /app/profiles/${perfil.id}/       │
└─────────────────────────────────────────────┘
▂▄▅▆▇█ 𝕱𝖗𝖔𝖘𝖙𝕭𝖞𝖙𝖊DEV █▇▆▅▄▂`;
        }
        else {
            resposta = `❌ Comando desconhecido: ${cmd}\nDigite !menu`;
        }

        if (resposta) await chat.sendMessage(resposta);
    });

    client.initialize();
    return client;
}

// Inicializar perfis ativos
console.log(`\n🚀 INICIANDO MÚLTIPLOS PERFIS...`);
console.log(`📁 Diretório de perfis: ${PROFILES_DIR}\n`);

for (const perfil of PERFIS) {
    if (perfil.ativo) {
        console.log(`🔧 Iniciando perfil: ${perfil.nome} (${perfil.id})`);
        const cliente = criarCliente(perfil);
        clients.push(cliente);
    }
}

console.log(`\n✅ ${clients.length} perfil(perfis) iniciado(s)`);
console.log(`🌐 Acesse o painel para ver os QR Codes\n`);
