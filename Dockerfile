# Imagem base Node.js
FROM node:16-slim

# Instalar dependências do sistema necessárias para o Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Criar diretório de trabalho
WORKDIR /usr/src/app

# Copiar arquivos do projeto
COPY package*.json ./
RUN npm install
COPY . .

# Expor a porta da aplicação (caso necessário)
EXPOSE 3000

# Comando para rodar o script
CMD ["node", "index.js"]
