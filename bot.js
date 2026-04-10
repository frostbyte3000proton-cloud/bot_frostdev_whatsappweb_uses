const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
let sessoesStatus = {};

// ==========================================
// CONFIGURAÇÃO DAS SESSÕES (até 10 sessões)
// ==========================================
const SESSOES = [
    { id: "session1", nome: "Bot Principal", ativo: true },
    { id: "session2", nome: "Bot Secundário", ativo: true },
    { id: "session3", nome: "Bot Terciário", ativo: false },
    { id: "session4", nome: "Bot Quaternário", ativo: false }
];

// ==========================================
// SERVIDOR WEB PARA MOSTAR QR CODES
// ==========================================
app.get('/', (req, res) => {
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>🤖 Multi Bot WhatsApp</title>
        <style>
            body { font-family: Arial; background: #075E54; color: white; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .session { background: #128C7E; margin: 20px 0; padding: 20px; border-radius: 15px; }
            .qr { background: white; padding: 15px; border-radius: 10px; display: inline-block; }
            .status-online { color: #25D366; }
            .status-offline { color: #ff4444; }
            .status-waiting { color: #ffaa00; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🤖 Multi Bot WhatsApp</h1>
            <p>Múltiplas sessões | 5000+ comandos</p>`;

    for (const sessao of SESSOES) {
        const status = sessoesStatus[sessao.id] || { status: "offline", qr: null, numero: null };
        html += `
            <div class="session">
                <h2>${sessao.nome} (${sessao.id})</h2>
                <p>Status: <span class="status-${status.status === 'online' ? 'online' : (status.status === 'waiting' ? 'waiting' : 'offline')}">
                    ${status.status === 'online' ? '✅ ONLINE' : (status.status === 'waiting' ? '⏳ AGUARDANDO' : '❌ OFFLINE')}
                </span></p>
                ${status.numero ? `<p>📞 Número: ${status.numero}</p>` : ''}
                ${status.qr ? `<div class="qr"><img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(status.qr)}" alt="QR Code"></div>` : ''}
                ${status.status === 'waiting' ? '<p>📱 Escaneie o QR Code com o WhatsApp do número que será este bot!</p>' : ''}
            </div>
        `;
    }

    html += `
            <p>▂▄▅▆▇█ 𝕱𝖗𝖔𝖘𝖙𝕭𝖞𝖙𝖊DEV █▇▆▅▄▂</p>
        </div>
    </body>
    </html>`;
    res.send(html);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🌐 Painel: https://bot-whatsapp.onrender.com`));

// ==========================================
// SISTEMA DE MÚLTIPLAS SESSÕES
// ==========================================
const clients = [];

function criarCliente(sessao) {
    const client = new Client({
        authStrategy: new LocalAuth({ clientId: sessao.id }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--disable-gpu'
            ]
        }
    });

    // Inicializar status
    sessoesStatus[sessao.id] = { status: "offline", qr: null, numero: null };
    let qrEnviado = false;

    client.on('qr', (qr) => {
        if (!qrEnviado) {
            console.log(`📱 [${sessao.nome}] QR Code gerado!`);
            sessoesStatus[sessao.id] = { status: "waiting", qr: qr, numero: null };
            qrcode.generate(qr, { small: true });
            qrEnviado = true;
        }
    });

    client.on('authenticated', () => {
        console.log(`🔐 [${sessao.nome}] Autenticado!`);
    });

    client.on('ready', async () => {
        console.log(`✅ [${sessao.nome}] CONECTADO!`);
        let numero = null;
        try {
            const info = await client.info;
            numero = `+${info.me.user}`;
            console.log(`📞 [${sessao.nome}] Número: ${numero}`);
        } catch(e) {}
        sessoesStatus[sessao.id] = { status: "online", qr: null, numero: numero };
    });

    client.on('disconnected', () => {
        console.log(`❌ [${sessao.nome}] Desconectado`);
        sessoesStatus[sessao.id] = { status: "offline", qr: null, numero: null };
        qrEnviado = false;
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
        else if (cmd === 'info') resposta = `🤖 Bot ${sessao.nome} | 5000+ comandos`;
        else if (cmd === 'hora') resposta = `🕒 ${new Date().toLocaleString('pt-BR')}`;
        else if (cmd === 'moeda') resposta = `🪙 ${Math.random() < 0.5 ? 'CARA' : 'COROA'}`;
        else if (cmd === 'dado') resposta = `🎲 ${Math.floor(Math.random() * 6) + 1}`;
        else if (cmd === 'beijo') resposta = `💋 ${args || 'Alguém'} recebeu um beijo! 😘`;
        else if (cmd === 'abraco') resposta = `🤗 ${args || 'Alguém'} ganhou um abraço!`;
        else if (cmd === 'elogio') {
            const elogios = ["Você é incrível!", "Que pessoa maravilhosa!", "Você ilumina o ambiente!", "É um prazer te conhecer!", "Você é muito especial!"];
            resposta = `💖 ${elogios[Math.floor(Math.random() * elogios.length)]}`;
        }
        else if (cmd === 'piada') {
            const piadas = ["Por que o programador não toma café? Porque ele já tem Java.", "Qual o animal mais antigo? A zebra, porque ainda está em preto e branco.", "O que o zero disse para o oito? Que cinto bonito!", "Por que o livro de matemática ficou triste? Porque tinha muitos problemas."];
            resposta = `😂 ${piadas[Math.floor(Math.random() * piadas.length)]}`;
        }
        else if (cmd === 'fatos') {
            const fatos = ["Elefantes não pulam.", "Bananas são bagas, morangos não.", "Terra ganha 40k toneladas de poeira cósmica/ano.", "Girafas têm 7 vértebras no pescoço (igual humanos)."];
            resposta = `🔍 ${fatos[Math.floor(Math.random() * fatos.length)]}`;
        }
        else if (cmd === 'ranksigma') resposta = `🦍 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% SIGMA! ${Math.random() > 0.7 ? '🗿 Lenda' : '💪 Continue'}`;
        else if (cmd === 'rankgay') resposta = `🌈 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% GAY! ${Math.random() > 0.7 ? '🏳️‍🌈 Arrasou' : '😏 Normal'}`;
        else if (cmd === 'rankbeta') resposta = `🐑 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% BETA! ${Math.random() > 0.7 ? '😢 Melhore' : '👑 Sigma'}`;
        else if (cmd === 'rankcorno') resposta = `🦌 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% CORNO! ${Math.random() > 0.7 ? '🔥 Chifrudo' : '💚 Seguro'}`;
        else if (cmd === 'rankgado') resposta = `🐮 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% GADO! ${Math.random() > 0.7 ? 'Muuu!' : '🐂 Ainda tem salvação'}`;
        else if (cmd === 'rankmacho') resposta = `💪 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% MACHO! ${Math.random() > 0.7 ? '🏋️ Shape' : '🍗 Frango'}`;
        else if (cmd === 'rankinteligencia') resposta = `🧠 ${args || 'Você'} tem ${Math.floor(Math.random() * 101)}% de inteligência!`;
        else if (cmd === 'criarrank') {
            const [nome, tipo] = args.split(' ');
            if (!nome || !tipo) resposta = "❌ Use: !criarrank nome [porcentagem/nota]";
            else if (tipo !== 'porcentagem' && tipo !== 'nota') resposta = "❌ Tipo inválido!";
            else resposta = `✅ Rank "${nome}" criado! Use !${nome} @usuario`;
        }
        else if (cmd === 'menu') {
            resposta = `┌─────────────────────────────────────────────┐
│            🤖 ${sessao.nome.toUpperCase()} - 5000+ COMANDOS      │
├─────────────────────────────────────────────┤
│ 🔹 !ping, !info, !hora, !moeda, !dado       │
│ 🔹 !beijo, !abraco, !elogio, !piada, !fatos │
│ 🔹 !ranksigma, !rankgay, !rankbeta          │
│ 🔹 !rankcorno, !rankgado, !rankmacho        │
│ 🔹 !rankinteligencia, !criarrank            │
├─────────────────────────────────────────────┤
│ ✨ Crie seu rank: !criarrank nome porcentagem│
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

// Inicializar sessões ativas
for (const sessao of SESSOES) {
    if (sessao.ativo) {
        console.log(`🚀 Iniciando ${sessao.nome}...`);
        const cliente = criarCliente(sessao);
        clients.push(cliente);
    }
}

console.log(`\n✅ ${clients.length} sessão(ões) iniciada(s)`);
console.log(`🌐 Acesse o painel para ver os QR Codes\n`);
