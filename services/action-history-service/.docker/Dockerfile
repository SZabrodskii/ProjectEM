FROM node:20

WORKDIR /opt/app

COPY package-lock.json package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start"]
