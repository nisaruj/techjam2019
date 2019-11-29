FROM node:12.13-buster

WORKDIR /usr/src/app
COPY ./src/package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
CMD [ "node", "./src/bin/www" ]