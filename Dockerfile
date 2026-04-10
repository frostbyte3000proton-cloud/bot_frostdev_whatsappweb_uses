FROM node:20-slim

# Instalar dependências do sistema para o Chromium
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    chromium \
    && rm -rf /var/lib/apt/lists/*

# Definir variáveis para o Puppeteer usar o Chromium do sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências do Node
RUN npm install

# Copiar o resto do código
COPY . .

# Expor a porta
EXPOSE 10000

# Comando para iniciar o bot
CMD ["node", "bot.js"]
