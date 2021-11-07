FROM node:lts-alpine3.13
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/
RUN npm install

COPY . .
EXPOSE 3005

CMD [ "node", "server.js" ]