FROM node:18.13.0
WORKDIR /task-2-tooling
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "server.js"]