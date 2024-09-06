FROM node:18

WORKDIR /usr/src/app

COPY package-lock.json package.json ./

RUN npm install

COPY . .

# Build the application
RUN npm run build

CMD ["npm", "run", "dev"]
