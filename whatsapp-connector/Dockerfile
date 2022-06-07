FROM node:latest

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm install pm2 -g

EXPOSE 8081

ENTRYPOINT npm run start