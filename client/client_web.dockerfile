FROM node:14-alpine

RUN mkdir /var/www/app

WORKDIR /var/www/app

COPY package.json package-lock.json ./

RUN yarn install

COPY . /app

#CMD ["npm", "run", "dev"]
