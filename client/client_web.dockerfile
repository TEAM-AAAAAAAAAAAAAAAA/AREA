FROM node:14-alpine

RUN mkdir /app

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

COPY . /app

CMD [ "yarn", "start" ]
