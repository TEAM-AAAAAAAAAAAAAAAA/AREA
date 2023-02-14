FROM node:14-alpine@sha256:e389e6411b9951c74289fd51834f59b2b45655ba7aecd3df96e62d1741f4f902

COPY . /app

WORKDIR /app

RUN yarn install && yarn cache clean

CMD [ "yarn", "start" ]
