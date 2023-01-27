FROM node:14-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json /app/

RUN yarn install

COPY . /app

CMD [ "npm", "run" ]
