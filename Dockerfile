FROM node:21.6.0

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY webpack.config.js ./

RUN npm install
RUN npm install -g typescript

COPY . .

RUN tsc
RUN npm run build

ENV PORT=3000

EXPOSE 8080

CMD ["node", "build/Server/index.js"]