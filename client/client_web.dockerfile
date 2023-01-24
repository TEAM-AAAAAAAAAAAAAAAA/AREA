FROM node:14-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

CMD ["npm", "run", "dev"]
