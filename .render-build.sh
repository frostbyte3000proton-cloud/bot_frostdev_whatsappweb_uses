#!/bin/bash

# Instalar dependências do sistema para o Chromium
apt-get update
apt-get install -y wget gnupg ca-certificates chromium

# Definir variáveis para o Puppeteer
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Instalar dependências do Node
npm install
