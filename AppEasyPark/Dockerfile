# ==========================================
# ETAPA 1: BUILD (Compilação do Expo Web)
# ==========================================
FROM node:24-alpine AS build

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de configuração de dependências primeiro (otimiza o cache do Docker)
COPY package.json package-lock.json ./

# Instala as dependências de forma limpa
RUN npm install

# Copia o restante do código fonte do projeto
COPY . .

# Comando moderno do Expo SDK 50+ para gerar o build Web (Gera a pasta /dist)
RUN npx expo export --platform web

# ==========================================
# ETAPA 2: PRODUÇÃO (Servidor Web Nginx)
# ==========================================
FROM nginx:stable-alpine

# Limpa a pasta padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos compilados da Etapa 1 (pasta dist) para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 para acesso externo
EXPOSE 80

# Inicia o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]