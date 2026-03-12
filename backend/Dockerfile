FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/uploads

RUN chown -R node:node /app/uploads

USER node

EXPOSE 3000

CMD ["node", "src/index.js"]