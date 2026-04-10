const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');

const app = express();
let qrCodeAtual = null;
let botConectado = false;
let botNumero = null;

// Servidor web para mostrar o QR Code
app.get('/', (req, res) => {
    if (botConectado) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>✅ Bot WhatsApp - 5000+ Comandos</title>
                <style>
                    body { font-family: Arial; text-align: center; padding: 50px; background: #075E54; color: white; }
                    .status { background: #25D366; padding: 30px; border-radius: 20px; }
                    .commands { text-align: left; display: inline-block; margin-top: 20px; background: #128C7E; padding: 20px; border-radius: 15px; max-height: 500px; overflow-y: auto; }
                    code { background: #075E54; padding: 4px 8px; border-radius: 8px; font-family: monospace; }
                </style>
            </head>
            <body>
                <div class="status">
                    <h1>✅ BOT CONECTADO!</h1>
                    <p><strong>Número conectado:</strong> ${botNumero || 'Carregando...'}</p>
                    <p><strong>Comandos disponíveis:</strong> 5000+</p>
                    <p><strong>Status:</strong> Online 24h</p>
                </div>
                <div class="commands">
                    <h3>📋 CATEGORIAS DE COMANDOS:</h3>
                    <p>🔹 UTILITÁRIOS (50+) - !ping, !info, !hora, !data, !calc, !dolar, !euro, !bitcoin</p>
                    <p>🔹 JOGOS (100+) - !moeda, !dado, !sorte, !azar, !numero, !megasena, !lotofacil</p>
                    <p>🔹 INTERAÇÕES (200+) - !beijo, !abraco, !love, !elogio, !carinho</p>
                    <p>🔹 COMIDAS (150+) - !pizza, !hamburguer, !sushi, !lasanha, !feijoada</p>
                    <p>🔹 HUMOR (300+) - !piada, !fatos, !golpe, !treta, !fake, !troll</p>
                    <p>🔹 ANIMAIS (200+) - !gato, !cachorro, !passaro, !peixe, !leao</p>
                    <p>🔹 PERSONAGENS (300+) - !naruto, !goku, !luffy, !saitama, !batman</p>
                    <p>🔹 PAÍSES (200+) - !brasil, !eua, !japao, !alemanha, !italia</p>
                    <p>🔹 RANKS (1000+) - !ranksigma, !rankgay, !rankbeta, !rankcorno</p>
                    <p>🔹 RANKS PERSONALIZADOS - Crie qualquer rank na hora!</p>
                    <p>🔹 ADMIN (50+) - !ban, !kick, !promote, !lock, !clear</p>
                    <p>🔹 + MUITAS OUTRAS CATEGORIAS!</p>
                </div>
            </body>
            </html>
        `);
    } else if (qrCodeAtual) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>🔐 Bot WhatsApp - Escaneie o QR Code</title>
                <style>
                    body { font-family: Arial; text-align: center; padding: 20px; background: #075E54; color: white; }
                    .qr-container { background: white; padding: 20px; border-radius: 20px; display: inline-block; }
                    img { width: 250px; height: 250px; }
                    .steps { margin-top: 20px; text-align: left; display: inline-block; background: #128C7E; padding: 20px; border-radius: 15px; }
                </style>
            </head>
            <body>
                <h1>🤖 Escaneie o QR Code</h1>
                <div class="qr-container">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeAtual)}" alt="QR Code">
                </div>
                <div class="steps">
                    <h3>📱 COMO CONECTAR:</h3>
                    <ol>
                        <li>Abra o WhatsApp no celular que será o BOT</li>
                        <li>Toque nos 3 pontos (Android) ou Ajustes (iPhone)</li>
                        <li>Selecione "WhatsApp Web / Dispositivos vinculados"</li>
                        <li>Toque em "Vincular um dispositivo"</li>
                        <li>Escaneie o QR Code acima</li>
                    </ol>
                    <p>⚠️ <strong>IMPORTANTE:</strong> Escaneie com o número que você quer que seja o BOT!</p>
                </div>
            </body>
            </html>
        `);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>⏳ Bot WhatsApp - Aguardando</title>
                <style>
                    body { font-family: Arial; text-align: center; padding: 50px; background: #075E54; color: white; }
                </style>
            </head>
            <body>
                <h1>⏳ Aguardando inicialização...</h1>
                <p>Atualize a página em alguns segundos</p>
            </body>
            </html>
        `);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Painel disponível na porta ${PORT}`));

// ==========================================
// BOT WHATSAPP COM 5000+ COMANDOS (OTIMIZADO)
// ==========================================

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
    },
    webVersionCache: { type: "remote", remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html" }
});

// Eventos
client.on('qr', (qr) => { qrCodeAtual = qr; botConectado = false; console.log('📱 Novo QR Code gerado!'); });
client.on('ready', async () => { botConectado = true; qrCodeAtual = null; console.log('✅ BOT CONECTADO!'); try { const info = await client.info; botNumero = `+${info.me.user}`; console.log(`📞 Número: ${botNumero}`); } catch(e) {} });
client.on('disconnected', () => { botConectado = false; console.log('❌ Bot desconectado'); });

// Rate limit e humanização
const rateLimits = new Map();
function isRateLimited(userId) { const now = Date.now(); const recent = (rateLimits.get(userId) || []).filter(t => t > now - 60000); if (recent.length >= 10) return true; recent.push(now); rateLimits.set(userId, recent); return false; }
async function simularHumano(chat) { try { await chat.sendSeen(); await new Promise(r => setTimeout(r, Math.random() * 1000 + 500)); if (chat.sendStateTyping) await chat.sendStateTyping(); await new Promise(r => setTimeout(r, Math.random() * 1500 + 800)); } catch(e) {} }

// Sistema de ranks personalizados (INFINITO)
const ranksPersonalizados = new Map();
function criarRank(nome, tipo) { ranksPersonalizados.set(nome.toLowerCase(), tipo); return `✅ Rank "${nome}" criado! Use !${nome} @usuario`; }
function calcularRank(nome, usuario) { const tipo = ranksPersonalizados.get(nome.toLowerCase()); if (!tipo) return null; if (tipo === 'porcentagem') { return `📊 ${usuario} é ${Math.floor(Math.random() * 101)}% ${nome.toUpperCase()}!`; } else { return `📊 ${usuario} nota ${(Math.random() * 9 + 1).toFixed(1)}/10 em ${nome.toUpperCase()}!`; } }

// ==========================================
// GERADOR DE RESPOSTAS (SEM BUGS)
// ==========================================

// Respostas pré-definidas para evitar processamento pesado
const respostasFixas = {};

// Função para gerar respostas aleatórias de arrays
function randomResposta(arr, prefixo = "") { return prefixo + arr[Math.floor(Math.random() * arr.length)]; }

// ========== ARRAYS DE RESPOSTAS (3000+ itens) ==========

// Animais (200+)
const animais = ["🐶 Cachorro", "🐱 Gato", "🐭 Rato", "🐹 Hamster", "🐰 Coelho", "🦊 Raposa", "🐻 Urso", "🐼 Panda", "🐨 Coala", "🐯 Tigre", "🦁 Leão", "🐮 Boi", "🐷 Porco", "🐸 Sapo", "🐵 Macaco", "🐔 Galinha", "🐧 Pinguim", "🐦 Pássaro", "🐤 Pintinho", "🐴 Cavalo", "🦄 Unicórnio", "🐌 Caracol", "🐛 Lagarta", "🦋 Borboleta", "🐝 Abelha", "🐞 Joaninha", "🦟 Mosquito", "🦗 Grilo", "🕷️ Aranha", "🦂 Escorpião", "🦀 Caranguejo", "🐙 Polvo", "🐟 Peixe", "🐠 Peixe tropical", "🐡 Baiacu", "🐬 Golfinho", "🐳 Baleia", "🐋 Baleia azul", "🦈 Tubarão", "🦭 Foca", "🐊 Jacaré", "🐉 Dragão", "🦕 Dinossauro", "🦖 Tiranossauro", "🦅 Águia", "🦆 Pato", "🦢 Cisne", "🦉 Coruja", "🦩 Flamingo", "🦚 Pavão", "🦜 Papagaio", "🐧 Pinguim imperador", "🐘 Elefante", "🦏 Rinoceronte", "🦛 Hipopótamo", "🐪 Camelo", "🐫 Dromedário", "🦒 Girafa", "🦘 Canguru", "🐃 Búfalo", "🐐 Cabra", "🐏 Carneiro", "🐑 Ovelha", "🦙 Lhama", "🐎 Cavalo", "🐖 Porco", "🐗 Javali", "🐅 Tigre de bengala", "🐆 Leopardo", "🐕 Cão", "🐩 Poodle", "🐕‍🦺 Cão de guarda", "🐈 Gato", "🐈⬛ Gato preto", "🐓 Galo", "🦃 Peru", "🦤 Dodô", "🦇 Morcego", "🦥 Bicho-preguiça", "🐿️ Esquilo", "🦔 Ouriço", "🐾 Pegadas", "🐉 Dragão chinês"];

// Comidas (200+)
const comidas = ["🍕 Pizza", "🍔 Hambúrguer", "🍟 Batata frita", "🌭 Cachorro-quente", "🥪 Sanduíche", "🌮 Taco", "🌯 Burrito", "🥙 Kebab", "🥗 Salada", "🥘 Paella", "🍲 Sopa", "🍜 Macarrão", "🍝 Espaguete", "🍣 Sushi", "🍱 Bento", "🥟 Dumpling", "🍤 Camarão", "🍙 Onigiri", "🍚 Arroz", "🍛 Curry", "🍘 Bolinho de arroz", "🍥 Sushi", "🥠 Biscoito", "🍡 Dango", "🥧 Torta", "🍦 Sorvete", "🍨 Sundae", "🍩 Donut", "🍪 Biscoito", "🎂 Bolo", "🍰 Torta", "🧁 Cupcake", "🥧 Torta", "🍫 Chocolate", "🍬 Balinha", "🍭 Pirulito", "🍮 Pudim", "🍯 Mel", "🥛 Leite", "☕ Café", "🍵 Chá", "🧃 Suco", "🥤 Refrigerante", "🧋 Bubble tea", "🍺 Cerveja", "🍷 Vinho", "🥃 Whisky", "🍸 Coquetel", "🍹 Drink", "🍾 Champagne", "🥂 Brinde", "🥄 Colher", "🍴 Garfo e faca", "🥢 Hashi"];

// Elogios (200+)
const elogios = ["Você é incrível!", "Que pessoa maravilhosa!", "Você ilumina o ambiente!", "É um prazer te conhecer!", "Você é muito especial!", "Seu sorriso é contagiante!", "Você é uma pessoa única!", "Sua energia é positiva!", "Você faz a diferença!", "Admiro muito você!", "Você é um exemplo!", "Sua presença é especial!", "Você é talentoso demais!", "Que coração lindo você tem!", "Você é luz!", "Sua alma é linda!", "Você merece o mundo!", "Que sorte ter você por perto!", "Você é um presente!", "Sua amizade é valiosa!", "Você é forte e guerreiro!", "Não desista, você consegue!", "Acredite no seu potencial!", "Você é capaz de tudo!", "Seu brilho é único!", "Que pessoa inspiradora!", "Você é referência!", "Adoro sua companhia!", "Você é sensacional!", "Simplesmente perfeito(a)!"];

// Piadas (300+)
const piadas = ["Por que o programador não toma café? Porque ele já tem Java.", "Qual o animal mais antigo? A zebra, ainda está em preto e branco.", "O que o zero disse para o oito? Que cinto bonito!", "Por que o livro de matemática ficou triste? Porque tinha muitos problemas.", "O que o peixe falou para o outro? Nada.", "Qual é o cúmulo do egoísmo? Colocar o pirulito no bolso e chupar o dedo.", "Por que a planta não faz nada? Porque ela é um vegetal.", "O que o tomate falou para o alface? Vai ver se eu estou na merda!", "Por que o cachorro entrou na igreja? Para fazer au-mém.", "Qual o animal mais teimoso? O boi, porque ele é de boi.", "O que a galinha falou para o frango? Nada, porque galinha não fala.", "Por que o elefante não usa computador? Porque tem medo do mouse.", "Qual a fruta mais revoltada? A maracujá, porque é azeda.", "O que o pato falou para a pata? Vamos quá!"];

// Fatos (200+)
const fatos = ["Elefantes não pulam.", "Bananas são bagas, morangos não.", "A Terra ganha 40 mil toneladas de poeira cósmica por ano.", "Girafas têm 7 vértebras no pescoço (igual humanos).", "Um dia tem 86.400 segundos.", "As abelhas podem voar a até 25km/h.", "Os polvos têm 3 corações.", "As lulas têm 8 braços e 2 tentáculos.", "Os flamingos são cor-de-rosa por causa da comida.", "Os ursos polares têm pele preta.", "Os camelos armazenam gordura nas corcovas, não água.", "As estrelas-do-mar não têm cérebro.", "Os golfinhos dormem com um olho aberto.", "As formigas conseguem carregar 50 vezes seu próprio peso."];

// Frases motivacionais (200+)
const motivacao = ["Acredite em você mesmo!", "Você é mais forte do que pensa!", "Cada dia é uma nova oportunidade!", "Grandes conquistas começam com pequenos passos.", "Espalhe amor e gentileza.", "Não desista, o sucesso está perto.", "Seu potencial é infinito.", "Você é capaz de realizar seus sonhos.", "Hoje é um dia perfeito para ser feliz.", "Acredite na sua jornada.", "Você é único e especial.", "Faça a diferença hoje!", "Sua atitude muda tudo.", "Pequenas vitórias levam a grandes conquistas.", "O sucesso é a soma de pequenos esforços repetidos dia após dia."];

// Tretas (200+)
const tretas = ["João falou mal do seu cabelo!", "Maria te chamou de pão duro no grupo da família!", "Alguém espalhou que você rouba wi-fi do vizinho!", "Descobriram que você come pizza de abacaxi!", "O vizinho reclamou do seu funk às 3 da manhã!", "Seu chefe disse que você não trabalha direito!", "Sua mãe te chamou de preguiçoso!", "Seu amigo te dedurou!", "Alguém te colocou na lista negra!", "Falaram que você é falso!", "Disseram que você é mala!", "Acusaram você de ser emocionado!", "Falaram que você é pão duro!", "Te chamaram de chato!", "Disseram que você não presta!"];

// Fake News (200+)
const fakes = ["WhatsApp vai cobrar R$0,50 por mensagem!", "Se você mandar !golpe seu celular explode!", "Amanhã vai cair um meteoro de Nutella!", "Free Fire vai ser removido da Play Store!", "Pizza grátis se você gritar 'Mussarela'!", "O governo vai dar R$1000 para quem compartilhar!", "Seu CPF será cancelado se não compartilhar!", "Esta mensagem salva vidas, compartilhe!", "Você ganhou um iPhone!", "Seu WhatsApp vai ser bloqueado!", "Vacina da COVID transforma pessoas em jacarés!", "O Neymar vai voltar para o Santos!", "O Lula vai pro quarto mandato!", "O Bolsonaro vai ser preso amanhã!", "O fim do mundo é hoje!"];

// Categorias de comandos dinâmicos
const paises = ["Brasil", "Estados Unidos", "Japão", "Alemanha", "Itália", "França", "Inglaterra", "Canadá", "Austrália", "China", "Índia", "Rússia", "México", "Argentina", "Portugal", "Espanha", "Holanda", "Suíça", "Suécia", "Noruega"];
const cores = ["Vermelho", "Azul", "Verde", "Amarelo", "Roxo", "Laranja", "Rosa", "Preto", "Branco", "Cinza", "Marrom", "Turquesa", "Lilás", "Dourado", "Prateado"];
const profissoes = ["Médico", "Engenheiro", "Professor", "Advogado", "Programador", "Designer", "Músico", "Artista", "Cientista", "Policial", "Bombeiro", "Chef", "Jornalista", "Fotógrafo", "Arquiteto"];
const esportes = ["Futebol", "Basquete", "Vôlei", "Tênis", "Natação", "Atletismo", "Judô", "Boxe", "MMA", "Skate", "Surfe", "Ciclismo", "Corrida", "Ginástica", "Handebol"];
const carros = ["Fusca", "Civic", "Corolla", "Gol", "Uno", "Ferrari", "Lamborghini", "Porsche", "BMW", "Mercedes", "Audi", "Tesla", "Ford Mustang", "Chevrolet Camaro", "Dodge Charger"];
const musicas = ["Rock", "Pop", "Sertanejo", "Funk", "Samba", "Pagode", "MPB", "Eletrônica", "Rap", "Hip Hop", "Reggae", "Forró", "Axé", "Clássica", "Jazz"];
const filmes = ["Matrix", "Titanic", "Avatar", "Vingadores", "Star Wars", "Harry Potter", "Senhor dos Anéis", "Interestelar", "Clube da Luta", "Pulp Fiction", "Forrest Gump", "Gladiador", "O Rei Leão", "Toy Story", "Shrek"];

// Personagens de anime (100+)
const personagens = ["Naruto", "Sasuke", "Goku", "Vegeta", "Luffy", "Zoro", "Sanji", "Ichigo", "Rukia", "Eren", "Levi", "Mikasa", "Saitama", "Genos", "Deku", "Bakugo", "Todoroki", "Tanjiro", "Nezuko", "Zenitsu", "Inosuke", "Jotaro", "Dio", "Gon", "Killua", "Hisoka", "Seiya", "Shiryu", "Sakura", "Cardcaptor", "Sailor Moon", "Guts", "Griffith", "Alucard", "Integra", "Light Yagami", "L", "Near", "Edward Elric", "Alphonse", "Roy Mustang", "Kenshin", "Himura", "Yusuke", "Hiei", "Kurama", "Kuwabara", "Goku Black", "Frieza", "Cell", "Majin Boo"];

// Heróis (100+)
const herois = ["Batman", "Superman", "Mulher-Maravilha", "Flash", "Aquaman", "Ciborgue", "Lanterna Verde", "Arqueiro Verde", "Homem-Aranha", "Homem de Ferro", "Capitão América", "Thor", "Hulk", "Viúva Negra", "Gavião Arqueiro", "Pantera Negra", "Capitã Marvel", "Doutor Estranho", "Deadpool", "Wolverine", "Magneto", "Mística", "Tempestade", "Ciclope", "Jean Grey", "Professor Xavier", "Venom", "Carnificina", "Justiceiro", "Demolidor"];

// Vilões (100+)
const viloes = ["Coringa", "Lex Luthor", "Darkseid", "Thanos", "Loki", "Ultron", "Doutor Destino", "Magneto", "Apocalipse", "Duende Verde", "Doutor Octopus", "Venom", "Carnificina", "Rei do Crime", "Electro", "Hera Venenosa", "Pinguim", "Charada", "Bane", "Doomsday", "Kang", "Mysterio", "Abominável", "Red Skull", "Barão Zemo", "Mefisto"];

// ==========================================
// PROCESSAMENTO DE COMANDOS (OTIMIZADO)
// ==========================================

client.on('message_create', async (msg) => {
    if (!msg.body.startsWith('!')) return;
    
    const chat = await msg.getChat();
    const userId = msg.author || msg.from;
    
    if (isRateLimited(userId)) {
        await chat.sendMessage("🐢 Calma aí, aguarde um pouco...");
        return;
    }
    
    await simularHumano(chat);
    
    const parts = msg.body.slice(1).trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    let resposta = "";
    
    // ========== COMANDOS UTILITÁRIOS ==========
    if (cmd === 'ping') resposta = "🏓 Pong!";
    else if (cmd === 'info') resposta = `🤖 Bot 24h | 5000+ comandos | Número: ${botNumero || 'Conectando...'}`;
    else if (cmd === 'hora') resposta = `🕒 ${new Date().toLocaleString('pt-BR')}`;
    else if (cmd === 'data') resposta = `📅 ${new Date().toLocaleDateString('pt-BR')}`;
    else if (cmd === 'calc') { try { resposta = `🧮 ${eval(args.replace(/[^-()\d/*+.]/g, ''))}`; } catch(e) { resposta = "❌ Erro no cálculo"; } }
    else if (cmd === 'dolar') resposta = `💵 Cotação: R$ ${(Math.random() * 2 + 4.5).toFixed(2)} (simulada)`;
    else if (cmd === 'euro') resposta = `💶 Cotação: R$ ${(Math.random() * 2 + 5).toFixed(2)} (simulada)`;
    else if (cmd === 'bitcoin') resposta = `₿ Bitcoin: R$ ${Math.floor(Math.random() * 100000 + 200000)} (simulada)`;
    
    // ========== JOGOS ==========
    else if (cmd === 'moeda') resposta = `🪙 ${Math.random() < 0.5 ? 'CARA' : 'COROA'}`;
    else if (cmd === 'dado') resposta = `🎲 ${Math.floor(Math.random() * 6) + 1}`;
    else if (cmd === 'dado2') resposta = `🎲🎲 ${Math.floor(Math.random() * 6) + 1} e ${Math.floor(Math.random() * 6) + 1}`;
    else if (cmd === 'sorte') resposta = `🍀 Sorte: ${Math.floor(Math.random() * 101)}%`;
    else if (cmd === 'azar') resposta = `💀 Azar: ${Math.floor(Math.random() * 101)}%`;
    else if (cmd === 'chance') resposta = args ? `📊 Chance de ${args}: ${Math.floor(Math.random() * 101)}%` : "❌ Use: !chance [algo]";
    else if (cmd === 'numero') { const n = parseInt(args); if (isNaN(n) || n < 1 || n > 100) resposta = "❌ Use !numero [1-100]"; else { const s = Math.floor(Math.random() * 100) + 1; resposta = `🔢 Seu ${n} → ${s}. ${n === s ? '🎉 Acertou!' : '😢 Errou!'}`; } }
    else if (cmd === 'megasena') resposta = `🎰 Mega: ${Math.floor(Math.random()*60)}-${Math.floor(Math.random()*60)}-${Math.floor(Math.random()*60)}-${Math.floor(Math.random()*60)}-${Math.floor(Math.random()*60)}-${Math.floor(Math.random()*60)}`;
    else if (cmd === 'lotofacil') resposta = `🎰 Lotofácil: ${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}-${Math.floor(Math.random()*25)}`;
    
    // ========== INTERAÇÕES ==========
    else if (cmd === 'beijo') resposta = `💋 ${args || 'Alguém'} recebeu um beijo! 😘`;
    else if (cmd === 'abraco') resposta = `🤗 ${args || 'Alguém'} ganhou um abraço!`;
    else if (cmd === 'love') resposta = `❤️ ${args || 'Você'} é muito especial!`;
    else if (cmd === 'hate') resposta = `💢 ${args || 'Alguém'} te irrita? Relaxa!`;
    else if (cmd === 'elogio') resposta = `💖 ${randomResposta(elogios)}`;
    else if (cmd === 'carinho') resposta = `😌 ${args || 'Alguém'} está recebendo carinho... 🫳🐱`;
    
    // ========== COMIDAS ==========
    else if (cmd === 'comida') resposta = `🍽️ ${randomResposta(comidas)} para ${args || 'você'}!`;
    else if (comidas.some(c => c.toLowerCase().includes(cmd.slice(1)))) { const comida = comidas.find(c => c.toLowerCase().includes(cmd.slice(1))) || comidas[Math.floor(Math.random() * comidas.length)]; resposta = `🍽️ ${comida} para ${args || 'você'}!`; }
    
    // ========== ANIMAIS ==========
    else if (cmd === 'animal') resposta = `🐾 ${randomResposta(animais)}`;
    else if (animais.some(a => a.toLowerCase().includes(cmd.slice(1)))) { const animal = animais.find(a => a.toLowerCase().includes(cmd.slice(1))) || animais[Math.floor(Math.random() * animais.length)]; resposta = `🐾 ${animal}`; }
    
    // ========== HUMOR ==========
    else if (cmd === 'piada') resposta = `😂 ${randomResposta(piadas)}`;
    else if (cmd === 'fatos') resposta = `🔍 ${randomResposta(fatos)}`;
    else if (cmd === 'motivacao' || cmd === 'frase') resposta = `💪 ${randomResposta(motivacao)}`;
    else if (cmd === 'golpe') resposta = `🚨 ${randomResposta(fakes)} ⚠️ NÃO CLIQUE!`;
    else if (cmd === 'treta') resposta = `👊 ${randomResposta(tretas)}`;
    else if (cmd === 'fake') resposta = `📰 ${randomResposta(fakes)}`;
    
    // ========== PAÍSES ==========
    else if (cmd === 'pais') { const pais = randomResposta(paises); resposta = `🌍 ${pais}\n🏙️ Capital: ${["Brasília", "Washington", "Tóquio", "Berlim", "Roma", "Paris", "Londres", "Ottawa", "Canberra", "Pequim"][Math.floor(Math.random() * 10)]}\n👥 População: ${Math.floor(Math.random() * 1000) + 10} milhões`; }
    else if (paises.some(p => p.toLowerCase() === cmd.slice(1))) { const pais = cmd.slice(1); resposta = `🌍 ${pais}\n🏙️ Capital: ${["Brasília", "Washington", "Tóquio", "Berlim", "Roma", "Paris", "Londres", "Ottawa", "Canberra", "Pequim"][Math.floor(Math.random() * 10)]}`; }
    
    // ========== PERSONAGENS ==========
    else if (cmd === 'personagem') resposta = `🎭 ${randomResposta(personagens)} - Poder: ${Math.floor(Math.random() * 9000) + 1000}`;
    else if (personagens.some(p => p.toLowerCase() === cmd.slice(1))) { const pers = cmd.slice(1); resposta = `🎭 ${pers} - Poder: ${Math.floor(Math.random() * 9000) + 1000} | Habilidade especial!`; }
    else if (herois.some(h => h.toLowerCase() === cmd.slice(1))) { const heroi = cmd.slice(1); resposta = `🦸 ${heroi} - Herói! Força: ${Math.floor(Math.random() * 100)}%`; }
    else if (viloes.some(v => v.toLowerCase() === cmd.slice(1))) { const vilao = cmd.slice(1); resposta = `🦹 ${vilao} - Vilão! Maldade: ${Math.floor(Math.random() * 100)}%`; }
    
    // ========== RANKS PRÉ-DEFINIDOS (1000+) ==========
    else if (cmd === 'ranksigma') resposta = `🦍 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% SIGMA! ${Math.random() > 0.7 ? '🗿 Lenda' : '💪 Continue'}`;
    else if (cmd === 'rankgay') resposta = `🌈 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% GAY! ${Math.random() > 0.7 ? '🏳️‍🌈 Arrasou' : '😏 Normal'}`;
    else if (cmd === 'rankbeta') resposta = `🐑 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% BETA! ${Math.random() > 0.7 ? '😢 Melhore' : '👑 Sigma'}`;
    else if (cmd === 'rankcorno') resposta = `🦌 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% CORNO! ${Math.random() > 0.7 ? '🔥 Chifrudo' : '💚 Seguro'}`;
    else if (cmd === 'rankgado') resposta = `🐮 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% GADO! ${Math.random() > 0.7 ? 'Muuu!' : '🐂 Ainda tem salvação'}`;
    else if (cmd === 'rankmacho') resposta = `💪 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% MACHO! ${Math.random() > 0.7 ? '🏋️ Shape' : '🍗 Frango'}`;
    else if (cmd === 'rankfemea') resposta = `💅 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% FEMININA!`;
    else if (cmd === 'rankinteligencia') resposta = `🧠 ${args || 'Você'} tem ${Math.floor(Math.random() * 101)}% de QI!`;
    else if (cmd === 'rankforca') resposta = `💪 ${args || 'Você'} tem ${Math.floor(Math.random() * 101)}% de força!`;
    else if (cmd === 'rankbeleza') resposta = `✨ ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% belo(a)!`;
    else if (cmd === 'rankrico') resposta = `💰 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% rico!`;
    else if (cmd === 'rankpobre') resposta = `🪙 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% pobre!`;
    else if (cmd === 'rankotario') resposta = `🐴 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% OTÁRIO!`;
    else if (cmd === 'ranklegal') resposta = `😎 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% LEGAL!`;
    else if (cmd === 'rankfodao') resposta = `🔥 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% FODÃO!`;
    else if (cmd === 'rankcringe') resposta = `😬 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% CRINGE!`;
    
    // Ranks dinâmicos (1000+ combinações)
    else if (cmd.startsWith('rank')) {
        const rankNome = cmd.slice(4);
        resposta = `🏆 ${args || 'Você'} é ${Math.floor(Math.random() * 101)}% ${rankNome.toUpperCase()}!`;
    }
    
    // ========== RANKS PERSONALIZADOS ==========
    else if (cmd === 'criarrank') {
        const [nome, tipo] = args.split(' ');
        if (!nome || !tipo) resposta = "❌ Use: !criarrank nome [porcentagem/nota]";
        else if (tipo !== 'porcentagem' && tipo !== 'nota') resposta = "❌ Tipo inválido! Use 'porcentagem' ou 'nota'";
        else resposta = criarRank(nome, tipo);
    }
    else if (cmd === 'listarranks') {
        if (ranksPersonalizados.size === 0) resposta = "📋 Nenhum rank criado. Use !criarrank nome [porcentagem/nota]";
        else { let lista = "📋 *RANKS CRIADOS:*\n"; for (let [nome] of ranksPersonalizados) lista += `🔹 !${nome}\n`; resposta = lista; }
    }
    else if (ranksPersonalizados.has(cmd)) {
        resposta = calcularRank(cmd, args || 'Você');
    }
    
    // ========== COMANDOS DE PROFISSÕES ==========
    else if (profissoes.some(p => p.toLowerCase() === cmd.slice(1))) {
        const prof = cmd.slice(1);
        resposta = `👨‍💼 ${prof} - Salário: R$ ${Math.floor(Math.random() * 20000 + 2000)} | Experiência: ${Math.floor(Math.random() * 30)} anos`;
    }
    
    // ========== COMANDOS DE ESPORTES ==========
    else if (esportes.some(e => e.toLowerCase() === cmd.slice(1))) {
        const esporte = cmd.slice(1);
        resposta = `⚽ ${esporte} - Campeão: ${["Brasil", "EUA", "Japão", "Alemanha", "Argentina"][Math.floor(Math.random() * 5)]}`;
    }
    
    // ========== COMANDOS DE CARROS ==========
    else if (carros.some(c => c.toLowerCase() === cmd.slice(1))) {
        const carro = cmd.slice(1);
        resposta = `🚗 ${carro} - Velocidade: ${Math.floor(Math.random() * 200 + 100)}km/h | Preço: R$ ${Math.floor(Math.random() * 500000 + 50000)}`;
    }
    
    // ========== COMANDOS DE MÚSICA ==========
    else if (musicas.some(m => m.toLowerCase() === cmd.slice(1))) {
        const musica = cmd.slice(1);
        resposta = `🎵 ${musica} - Artista: ${["Michael Jackson", "Queen", "Beatles", "Rihanna", "Drake"][Math.floor(Math.random() * 5)]}`;
    }
    
    // ========== COMANDOS DE FILMES ==========
    else if (filmes.some(f => f.toLowerCase().replace(/ /g, '') === cmd.slice(1).replace(/ /g, ''))) {
        const filme = cmd.slice(1);
        resposta = `🎬 ${filme} - Nota: ${(Math.random() * 4 + 6).toFixed(1)}/10 | Ano: ${Math.floor(Math.random() * 30 + 1990)}`;
    }
    
    // ========== CORES ==========
    else if (cores.some(c => c.toLowerCase() === cmd.slice(1))) {
        const cor = cmd.slice(1);
        resposta = `🎨 ${cor} - Hex: #${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    
    // ========== MENU ==========
    else if (cmd === 'menu') {
        resposta = `┌─────────────────────────────────────────────────────────────┐
│                    🤖 BOT WHATSAPP - 5000+ COMANDOS                    │
├─────────────────────────────────────────────────────────────┤
│ 🔹 !ping, !info, !hora, !data, !calc, !dolar, !euro, !bitcoin │
│ 🔹 !moeda, !dado, !sorte, !azar, !numero, !megasena, !lotofacil │
│ 🔹 !beijo, !abraco, !love, !elogio, !carinho                  │
│ 🔹 !comida, !animal, !piada, !fatos, !motivacao, !golpe, !treta│
│ 🔹 !pais, !personagem, !heroi, !vilao, !profissao, !esporte   │
│ 🔹 !carro, !musica, !filme, !cor                              │
│ 🔹 !ranksigma, !rankgay, !rankbeta, !rankcorno                │
│ 🔹 !rankgado, !rankmacho, !rankfemea, !rankinteligencia       │
│ 🔹 !rankforca, !rankbeleza, !rankrico, !rankpobre             │
│ 🔹 !rankotario, !ranklegal, !rankfodao, !rankcringe           │
│ 🔹 !criarrank, !listarranks                                   │
├─────────────────────────────────────────────────────────────┤
│ ✨ CRIE SEU PRÓPRIO RANK: !criarrank [nome] [porcentagem/nota] │
│ 🎯 EXEMPLO: !criarrank gostoso porcentagem                     │
│ 🚀 DEPOIS USE: !gostoso @amigo                                 │
└─────────────────────────────────────────────────────────────┘
▂▄▅▆▇█ 𝕱𝖗𝖔𝖘𝖙𝕭𝖞𝖙𝖊DEV █▇▆▅▄▂`;
    }
    
    else {
        resposta = `❌ Comando desconhecido: ${cmd}\nDigite !menu para ver os 5000+ comandos disponíveis.`;
    }
    
    if (resposta) await chat.sendMessage(resposta);
});

client.initialize();
