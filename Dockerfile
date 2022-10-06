FROM node:16-alpine

WORKDIR /usr/src/ecomweb

RUN npm install -g firebase-tools

COPY functions/package*.json ./

RUN npm install --force

CMD ["firebase serve --only functions"]
