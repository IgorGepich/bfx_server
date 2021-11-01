FROM node:lts-gallium
RUN mkdir -p /Users/igorsutulov/app
WORKDIR /Users/igorsutulov/app

COPY package*.json /Users/igorsutulov/app
RUN npm install

COPY . .
EXPOSE 3000

CMD [ "node", "server.js" ]