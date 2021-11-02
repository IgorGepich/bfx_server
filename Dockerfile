FROM node:lts-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install -g npm@8.1.2
RUN npm install

COPY . .
EXPOSE 3005

CMD [ "node", "server.js" ]